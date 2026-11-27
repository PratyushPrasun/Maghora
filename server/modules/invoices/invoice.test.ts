import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Types } from "mongoose";

import {
  amountInWordsINR,
  calculateInvoiceFinancials,
  getIndianFinancialYear,
  resolveStateCode,
} from "./gst.utils.js";
import { generateInvoicePdfBuffer } from "./invoice-pdf.service.js";
import type { IInvoice } from "./invoice.model.js";

describe("Maghora Invoice & GST Engine", () => {
  it("resolves Indian financial year in IST across April 1 boundary", () => {
    // March 31, 2027 18:00 UTC = March 31, 2027 23:30 IST -> FY 26-27
    assert.equal(
      getIndianFinancialYear(new Date("2027-03-31T18:00:00.000Z")),
      "26-27"
    );
    // March 31, 2027 19:00 UTC = April 1, 2027 00:30 IST -> FY 27-28
    assert.equal(
      getIndianFinancialYear(new Date("2027-03-31T19:00:00.000Z")),
      "27-28"
    );
  });

  it("resolves Indian state codes and GSTIN prefix", () => {
    assert.equal(resolveStateCode("Bihar"), "10");
    assert.equal(resolveStateCode("Maharashtra"), "27");
    assert.equal(resolveStateCode("Unknown", "10EKYPA9495M1ZB"), "10");
  });

  it("calculates intra-state GST (CGST + SGST) with zero rounding drift", () => {
    const result = calculateInvoiceFinancials({
      items: [
        {
          productId: new Types.ObjectId().toString(),
          variantId: new Types.ObjectId().toString(),
          productName: "Tangy Tomato Makhana",
          flavour: "Tangy Tomato",
          sku: "MAG-TT-100",
          hsnCode: "1904",
          weightGrams: 100,
          quantity: 2,
          unit: "Packet",
          mrpPaise: 24900,
          unitPricePaise: 19900,
          lineTotalPaise: 39800,
          gstRate: 5,
        },
      ],
      couponDiscountPaise: 5000,
      shippingChargesPaise: 4000,
      isGstRegistered: true,
      sellerState: "Bihar",
      sellerStateCode: "10",
      sellerGstin: "10EKYPA9495M1ZB",
      customerState: "Bihar",
      defaultHsnCode: "1904",
      defaultGstRate: 5,
      shippingGstRate: 5,
      pricesIncludeGst: true,
    });

    assert.equal(result.invoiceType, "Tax Invoice");
    assert.equal(result.isInterstate, false);
    assert.equal(result.taxBreakdown.igstPaise, 0);
    assert.equal(
      result.taxBreakdown.cgstPaise + result.taxBreakdown.sgstPaise,
      result.taxBreakdown.totalGstPaise
    );
    // 39800 - 5000 + 4000 = 38800 paise
    assert.equal(result.grandTotalPaise, 38800);
    assert.equal(
      result.taxableAmountPaise + result.taxBreakdown.totalGstPaise,
      result.grandTotalPaise
    );
  });

  it("calculates interstate GST (IGST) with mixed GST rates", () => {
    const result = calculateInvoiceFinancials({
      items: [
        {
          productId: new Types.ObjectId().toString(),
          variantId: new Types.ObjectId().toString(),
          productName: "Peri Peri Makhana",
          sku: "MAG-PP-100",
          hsnCode: "1904",
          weightGrams: 100,
          quantity: 1,
          mrpPaise: 29900,
          unitPricePaise: 29900,
          lineTotalPaise: 29900,
          gstRate: 5,
        },
        {
          productId: new Types.ObjectId().toString(),
          variantId: new Types.ObjectId().toString(),
          productName: "Cheese Gift Box",
          sku: "MAG-GB-250",
          hsnCode: "2106",
          weightGrams: 250,
          quantity: 1,
          unit: "Box",
          mrpPaise: 59900,
          unitPricePaise: 49900,
          lineTotalPaise: 49900,
          gstRate: 12,
        },
      ],
      isGstRegistered: true,
      sellerState: "Bihar",
      sellerStateCode: "10",
      sellerGstin: "10EKYPA9495M1ZB",
      customerState: "Maharashtra",
      defaultHsnCode: "1904",
      defaultGstRate: 5,
      shippingGstRate: 5,
      pricesIncludeGst: true,
    });

    assert.equal(result.invoiceType, "Tax Invoice");
    assert.equal(result.isInterstate, true);
    assert.equal(result.taxBreakdown.cgstPaise, 0);
    assert.equal(result.taxBreakdown.sgstPaise, 0);
    assert.ok(result.taxBreakdown.igstPaise > 0);
    assert.equal(result.grandTotalPaise, 29900 + 49900);
    assert.equal(
      result.taxableAmountPaise + result.taxBreakdown.igstPaise,
      result.grandTotalPaise
    );
  });

  it("issues Bill of Supply with zero GST when seller is not GST registered", () => {
    const result = calculateInvoiceFinancials({
      items: [
        {
          productId: new Types.ObjectId().toString(),
          variantId: new Types.ObjectId().toString(),
          productName: "Pudina Makhana",
          sku: "MAG-PU-100",
          weightGrams: 100,
          quantity: 2,
          mrpPaise: 20000,
          unitPricePaise: 20000,
          lineTotalPaise: 40000,
          gstRate: 12,
        },
      ],
      isGstRegistered: false,
      sellerState: "Bihar",
      sellerStateCode: "10",
      sellerGstin: "",
      customerState: "Delhi",
      defaultHsnCode: "1904",
      defaultGstRate: 5,
      shippingGstRate: 5,
      pricesIncludeGst: true,
    });

    assert.equal(result.invoiceType, "Bill of Supply");
    assert.equal(result.taxBreakdown.totalGstPaise, 0);
    assert.equal(result.taxableAmountPaise, 40000);
    assert.equal(result.grandTotalPaise, 40000);
  });

  it("formats Indian currency words accurately", () => {
    assert.equal(amountInWordsINR(49900), "Rupees Four Hundred Ninety-Nine Only");
    assert.equal(
      amountInWordsINR(125050),
      "Rupees One Thousand Two Hundred Fifty and Fifty Paise Only"
    );
  });

  it("generates a valid multi-page A4 PDF buffer for large orders", async () => {
    const items = Array.from({ length: 30 }, (_, idx) => ({
      sNo: idx + 1,
      productId: new Types.ObjectId(),
      variantId: new Types.ObjectId(),
      productName: `Maghora Roasted Makhana Flavour ${idx + 1}`,
      flavour: "Himalayan Salt & Pepper",
      sku: `MAG-SKU-${idx + 1}`,
      hsnCode: "1904",
      weightGrams: 100,
      quantity: 2,
      unit: "Packet",
      mrpPaise: 24900,
      unitPricePaise: 19900,
      discountPaise: 10000,
      taxableValuePaise: 37905,
      gstRate: 5,
      cgstPaise: 948,
      sgstPaise: 947,
      igstPaise: 0,
      gstAmountPaise: 1895,
      totalPaise: 39800,
    }));

    const mockInvoice = {
      invoiceNumber: "MAG/26-27/0001",
      documentType: "invoice",
      parentInvoiceId: null,
      adjustmentReason: "",
      financialYear: "26-27",
      orderId: new Types.ObjectId(),
      orderNumber: "MG1732700000ABC123",
      orderDate: new Date("2026-11-27T10:00:00.000Z"),
      customerId: new Types.ObjectId(),
      sellerDetailsSnapshot: {
        brandName: "MAGHORA",
        tagline: "Ancient roots Modern Taste",
        legalName: "SARA FOODS ENTERPRISES",
        gstin: "10EKYPA9495M1ZB",
        isGstRegistered: true,
        addressLine1: "Mithila Food Park",
        addressLine2: "",
        city: "Darbhanga",
        state: "Bihar",
        stateCode: "10",
        postalCode: "846004",
        country: "India",
        contactNumber: "+91 88939 32380",
        supportEmail: "maghora0408@gmail.com",
        website: "https://maghora.in",
        returnPolicyUrl: "https://maghora.in/terms",
      },
      customerSnapshot: {
        fullName: "Aarav Kumar",
        email: "aarav@example.com",
        mobile: "+919876543210",
        customerGstin: "",
      },
      billingAddress: {
        recipientName: "Aarav Kumar",
        phone: "+919876543210",
        addressLine1: "123 Heritage Lane",
        addressLine2: "",
        landmark: "",
        city: "Patna",
        state: "Bihar",
        stateCode: "10",
        postalCode: "800001",
        country: "India",
      },
      shippingAddress: {
        recipientName: "Aarav Kumar",
        phone: "+919876543210",
        addressLine1: "123 Heritage Lane",
        addressLine2: "",
        landmark: "",
        city: "Patna",
        state: "Bihar",
        stateCode: "10",
        postalCode: "800001",
        country: "India",
      },
      sameBillingAndShipping: true,
      placeOfSupply: {
        state: "Bihar",
        stateCode: "10",
        isInterstate: false,
      },
      items,
      subtotalPaise: 1194000,
      productDiscountPaise: 300000,
      couponCode: null,
      couponDiscountPaise: 0,
      discountsPaise: 300000,
      shippingChargesPaise: 0,
      shippingTaxablePaise: 0,
      shippingGstRate: 5,
      shippingGstPaise: 0,
      otherChargesPaise: 0,
      taxableAmountPaise: 1137150,
      taxBreakdown: {
        cgstPaise: 28440,
        sgstPaise: 28410,
        igstPaise: 0,
        totalGstPaise: 56850,
      },
      grandTotalPaise: 1194000,
      amountPaidPaise: 1194000,
      balanceDuePaise: 0,
      refundedAmountPaise: 0,
      amountInWords: amountInWordsINR(1194000),
      paymentMethod: "UPI",
      paymentReference: "pay_Test123456",
      razorpayOrderId: "order_Test123456",
      razorpayPaymentId: "pay_Test123456",
      paymentStatus: "Paid",
      invoiceType: "Tax Invoice",
      footerNote: "Thank you for choosing Maghora!",
      footerTagline: "Ancient roots Modern Taste",
      termsAndConditions: "All disputes subject to Bihar jurisdiction.",
      pdfStorageReference: null,
      issuedAt: new Date("2026-11-27T10:05:00.000Z"),
    } as unknown as IInvoice;

    const pdf = await generateInvoicePdfBuffer(mockInvoice);
    assert.ok(Buffer.isBuffer(pdf));
    assert.ok(pdf.length > 5000);
    assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
  });
});
