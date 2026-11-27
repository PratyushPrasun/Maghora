import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose, { Types } from "mongoose";

import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";
import Product from "../products/product.model.js";
import User from "../users/user.model.js";
import Invoice, {
  type IInvoice,
  type InvoicePaymentStatus,
} from "./invoice.model.js";
import InvoiceCounter from "./invoice-counter.model.js";
import InvoiceSettings, {
  type IInvoiceSettings,
} from "./invoice-settings.model.js";
import {
  amountInWordsINR,
  calculateInvoiceFinancials,
  getIndianFinancialYear,
  resolveStateCode,
} from "./gst.utils.js";
import { generateInvoicePdfBuffer } from "./invoice-pdf.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INVOICE_STORAGE_ROOT = path.resolve(__dirname, "../../storage/invoices");

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}

function normalizePaymentMethodLabel(
  provider?: string | null,
  method?: string | null
): string {
  const m = (method || "").trim().toLowerCase();
  if (m === "upi") return "UPI";
  if (m === "card") return "Card";
  if (m === "netbanking") return "Net Banking";
  if (m === "wallet") return "Wallet";
  if (m === "cod" || provider === "cod") return "COD";
  return "Razorpay";
}

function mapOrderToInvoicePaymentStatus(
  orderPaymentStatus: string,
  paymentProvider: string,
  refundedPaise: number,
  grandTotalPaise: number
): InvoicePaymentStatus {
  if (orderPaymentStatus === "refunded") {
    return refundedPaise > 0 && refundedPaise < grandTotalPaise
      ? "Partially Refunded"
      : "Refunded";
  }
  if (orderPaymentStatus === "paid") return "Paid";
  if (paymentProvider === "cod") return "COD";
  return "Pending";
}

function addressesAreEqual(a: any, b: any): boolean {
  if (!a || !b) return true;
  const norm = (v?: string) => (v || "").trim().toLowerCase();
  return (
    norm(a.recipientName) === norm(b.recipientName) &&
    norm(a.phone) === norm(b.phone) &&
    norm(a.addressLine1) === norm(b.addressLine1) &&
    norm(a.addressLine2) === norm(b.addressLine2) &&
    norm(a.city) === norm(b.city) &&
    norm(a.state) === norm(b.state) &&
    norm(a.postalCode) === norm(b.postalCode)
  );
}

/**
 * Removes internal filesystem storage references before returning to API callers.
 */
export function sanitizeInvoiceForResponse(invoice: IInvoice | Record<string, any>) {
  const obj =
    typeof (invoice as any).toObject === "function"
      ? (invoice as any).toObject()
      : { ...invoice };
  delete obj.pdfStorageReference;
  return obj;
}

export async function getOrCreateInvoiceSettings(): Promise<IInvoiceSettings> {
  let settings = await InvoiceSettings.findOne({ key: "default" });
  if (settings) return settings;

  try {
    settings = await InvoiceSettings.create({
      key: "default",
      brandName: process.env.INVOICE_BRAND_NAME || "MAGHORA",
      tagline: process.env.INVOICE_TAGLINE || "Ancient roots Modern Taste",
      legalName: process.env.INVOICE_LEGAL_NAME || "SARA FOODS ENTERPRISES",
      gstin: process.env.INVOICE_GSTIN || "10EKYPA9495M1ZB",
      isGstRegistered: process.env.INVOICE_IS_GST_REGISTERED !== "false",
      businessAddress: {
        addressLine1: process.env.INVOICE_ADDRESS_LINE1 || "",
        addressLine2: process.env.INVOICE_ADDRESS_LINE2 || "",
        city: process.env.INVOICE_CITY || "",
        state: process.env.INVOICE_STATE || "Bihar",
        stateCode: process.env.INVOICE_STATE_CODE || "10",
        postalCode: process.env.INVOICE_PINCODE || "",
        country: "India",
      },
      contactNumber: process.env.INVOICE_CONTACT_NUMBER || "+91 88939 32380",
      supportEmail: process.env.INVOICE_SUPPORT_EMAIL || "maghora0408@gmail.com",
      website: process.env.INVOICE_WEBSITE || "https://maghora.in",
      returnPolicyUrl:
        process.env.INVOICE_RETURN_POLICY_URL || "https://maghora.in/terms",
      invoicePrefix: process.env.INVOICE_PREFIX || "MAG",
      defaultHsnCode: process.env.INVOICE_DEFAULT_HSN || "1904",
      defaultGstRate: Number(process.env.INVOICE_DEFAULT_GST_RATE ?? 5),
      shippingGstRate: Number(process.env.INVOICE_SHIPPING_GST_RATE ?? 5),
      pricesIncludeGst: process.env.INVOICE_PRICES_INCLUDE_GST !== "false",
      footerNote: "Thank you for choosing Maghora!",
      footerTagline: "Ancient roots Modern Taste",
    });
    return settings;
  } catch (error: any) {
    if (error?.code === 11000) {
      const existing = await InvoiceSettings.findOne({ key: "default" });
      if (existing) return existing;
    }
    throw error;
  }
}

export async function updateInvoiceSettings(
  payload: Record<string, any>,
  adminUserId: string
): Promise<IInvoiceSettings> {
  const settings = await getOrCreateInvoiceSettings();

  if (payload.businessAddress) {
    settings.businessAddress = {
      ...settings.businessAddress,
      ...payload.businessAddress,
    };
    if (
      payload.businessAddress.state &&
      !payload.businessAddress.stateCode
    ) {
      const resolved = resolveStateCode(
        payload.businessAddress.state,
        payload.gstin || settings.gstin
      );
      if (resolved) {
        settings.businessAddress.stateCode = resolved;
      }
    }
  }

  const scalarFields = [
    "brandName",
    "tagline",
    "legalName",
    "gstin",
    "isGstRegistered",
    "contactNumber",
    "supportEmail",
    "website",
    "returnPolicyUrl",
    "invoicePrefix",
    "defaultHsnCode",
    "defaultGstRate",
    "shippingGstRate",
    "pricesIncludeGst",
    "footerNote",
    "footerTagline",
    "termsAndConditions",
  ] as const;

  for (const field of scalarFields) {
    if (payload[field] !== undefined) {
      (settings as any)[field] = payload[field];
    }
  }

  settings.updatedBy = new Types.ObjectId(adminUserId);
  await settings.save();
  return settings;
}

/**
 * Atomically allocates the next sequential invoice number for a financial year.
 * Format: <PREFIX>/<FY>/<0001> (e.g. MAG/26-27/0001).
 */
export async function allocateNextInvoiceNumber(
  prefix: string,
  financialYear: string
): Promise<string> {
  const cleanPrefix = (prefix || "MAG").trim().toUpperCase();
  const counterId = `${cleanPrefix}:${financialYear}`;

  const counter = await InvoiceCounter.findOneAndUpdate(
    { _id: counterId },
    {
      $inc: { seq: 1 },
      $setOnInsert: {
        prefix: cleanPrefix,
        financialYear,
      },
    },
    { upsert: true, new: true }
  );

  const padded = String(counter.seq).padStart(4, "0");
  return `${cleanPrefix}/${financialYear}/${padded}`;
}

async function storePdfSafely(
  invoiceNumber: string,
  financialYear: string,
  buffer: Buffer
): Promise<string | null> {
  try {
    const safeName = invoiceNumber.replace(/[^A-Za-z0-9_-]/g, "-");
    const relPath = path.join(financialYear, `${safeName}.pdf`);
    const absPath = path.join(INVOICE_STORAGE_ROOT, relPath);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, buffer);
    return relPath;
  } catch (error) {
    console.error("[Invoice] Failed to persist PDF to disk:", error);
    return null;
  }
}

export async function getInvoicePdfBuffer(invoice: IInvoice): Promise<Buffer> {
  if (invoice.pdfStorageReference) {
    const absPath = path.resolve(
      INVOICE_STORAGE_ROOT,
      invoice.pdfStorageReference
    );
    if (absPath.startsWith(INVOICE_STORAGE_ROOT)) {
      try {
        return await fs.readFile(absPath);
      } catch {
        // File missing on disk; regenerate deterministically from snapshot.
      }
    }
  }

  const buffer = await generateInvoicePdfBuffer(invoice);
  const relPath = await storePdfSafely(
    invoice.invoiceNumber,
    invoice.financialYear,
    buffer
  );
  if (relPath && relPath !== invoice.pdfStorageReference) {
    await Invoice.updateOne(
      { _id: invoice._id },
      { $set: { pdfStorageReference: relPath } }
    );
  }
  return buffer;
}

/**
 * Generates an immutable invoice snapshot for a confirmed/paid/COD order.
 * Idempotent and concurrency-safe: never creates duplicate invoices for the same order.
 */
export async function generateInvoiceForOrder(
  orderId: string,
  options?: {
    paymentMethod?: string | null;
    paymentReference?: string | null;
    razorpayPaymentId?: string | null;
    razorpayOrderId?: string | null;
  }
): Promise<IInvoice> {
  if (!mongoose.isValidObjectId(orderId)) {
    throw httpError("Invalid order ID", 400);
  }

  const existing = await Invoice.findOne({
    orderId: new Types.ObjectId(orderId),
    documentType: "invoice",
  });
  if (existing) {
    return existing;
  }

  const order = await Order.findById(orderId).lean();
  if (!order) {
    throw httpError("Order not found", 404);
  }

  const isCodOrder = order.paymentProvider === "cod";
  const isEligiblePaid = order.paymentStatus === "paid";
  const isEligibleCod =
    isCodOrder &&
    ["confirmed", "processing", "shipped", "delivered"].includes(order.status);

  if (!isEligiblePaid && !isEligibleCod) {
    throw httpError(
      "Invoice can only be generated for confirmed paid or COD orders",
      409
    );
  }

  const [customer, payment, settings] = await Promise.all([
    User.findById(order.userId).select("name email phone").lean(),
    Payment.findOne({ orderId: order._id }).lean(),
    getOrCreateInvoiceSettings(),
  ]);

  if (!customer) {
    throw httpError("Order customer not found", 404);
  }

  // Fallback lookup for legacy orders missing HSN/GST snapshots on order items.
  const productIdsNeedingLookup = order.items
    .filter((item) => !item.hsnCode || item.gstRate === undefined)
    .map((item) => item.productId);

  const productTaxMap = new Map<
    string,
    { hsnCode?: string; gstRate?: number; unit?: string; flavour?: string }
  >();
  if (productIdsNeedingLookup.length > 0) {
    const products = await Product.find({
      _id: { $in: productIdsNeedingLookup },
    })
      .select("hsnCode gstRate unit flavour")
      .lean();
    for (const p of products) {
      productTaxMap.set(p._id.toString(), {
        hsnCode: p.hsnCode,
        gstRate: p.gstRate,
        unit: p.unit,
        flavour: p.flavour,
      });
    }
  }

  const shippingAddr = order.shippingAddress;
  const billingAddr = order.billingAddress || shippingAddr;
  const sameBillingAndShipping = addressesAreEqual(billingAddr, shippingAddr);

  const financials = calculateInvoiceFinancials({
    items: order.items.map((item) => {
      const fallback = productTaxMap.get(item.productId.toString());
      return {
        productId: item.productId.toString(),
        variantId: item.variantId.toString(),
        productName: item.productName,
        flavour: item.flavour || fallback?.flavour || "",
        sku: item.sku,
        hsnCode: item.hsnCode || fallback?.hsnCode || settings.defaultHsnCode,
        weightGrams: item.weightGrams,
        quantity: item.quantity,
        unit: item.unit || fallback?.unit || "Packet",
        mrpPaise: item.mrpPaise,
        unitPricePaise: item.pricePaise,
        lineTotalPaise: item.lineTotalPaise,
        gstRate:
          item.gstRate !== undefined && item.gstRate !== null
            ? item.gstRate
            : fallback?.gstRate,
      };
    }),
    couponDiscountPaise: order.couponDiscountPaise || 0,
    shippingChargesPaise: order.shippingPaise || 0,
    otherChargesPaise: order.otherChargesPaise || 0,
    isGstRegistered: settings.isGstRegistered,
    sellerState: settings.businessAddress.state || "Bihar",
    sellerStateCode: settings.businessAddress.stateCode || "10",
    sellerGstin: settings.gstin,
    customerState: shippingAddr.state,
    customerGstin: order.customerGstin || "",
    defaultHsnCode: settings.defaultHsnCode,
    defaultGstRate: settings.defaultGstRate,
    shippingGstRate: settings.shippingGstRate,
    pricesIncludeGst: settings.pricesIncludeGst,
  });

  const issuedAt = new Date();
  const financialYear = getIndianFinancialYear(issuedAt);

  // Re-check right before counter allocation to minimize wasted sequence numbers.
  const doubleCheck = await Invoice.findOne({
    orderId: order._id,
    documentType: "invoice",
  });
  if (doubleCheck) {
    return doubleCheck;
  }

  const invoiceNumber = await allocateNextInvoiceNumber(
    settings.invoicePrefix,
    financialYear
  );

  const razorpayPaymentId =
    options?.razorpayPaymentId ||
    order.paymentId ||
    payment?.razorpayPaymentId ||
    null;
  const razorpayOrderId =
    options?.razorpayOrderId ||
    order.paymentOrderId ||
    payment?.razorpayOrderId ||
    null;
  const paymentMethod = normalizePaymentMethodLabel(
    order.paymentProvider,
    options?.paymentMethod || order.paymentMethod
  );
  const paymentReference =
    options?.paymentReference || razorpayPaymentId || razorpayOrderId || null;

  const amountPaidPaise =
    order.paymentStatus === "paid" ? financials.grandTotalPaise : 0;
  const balanceDuePaise = Math.max(
    0,
    financials.grandTotalPaise - amountPaidPaise
  );

  const invoicePaymentStatus = mapOrderToInvoicePaymentStatus(
    order.paymentStatus,
    order.paymentProvider || "razorpay",
    payment?.refundAmountPaise || 0,
    financials.grandTotalPaise
  );

  try {
    const created = await Invoice.create({
      invoiceNumber,
      documentType: "invoice",
      parentInvoiceId: null,
      financialYear,
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      customerId: order.userId,
      sellerDetailsSnapshot: {
        brandName: settings.brandName,
        tagline: settings.tagline,
        legalName: settings.legalName,
        gstin: settings.gstin,
        isGstRegistered: settings.isGstRegistered,
        addressLine1: settings.businessAddress.addressLine1,
        addressLine2: settings.businessAddress.addressLine2,
        city: settings.businessAddress.city,
        state: settings.businessAddress.state,
        stateCode: financials.sellerStateCode,
        postalCode: settings.businessAddress.postalCode,
        country: settings.businessAddress.country || "India",
        contactNumber: settings.contactNumber,
        supportEmail: settings.supportEmail,
        website: settings.website,
        returnPolicyUrl: settings.returnPolicyUrl,
      },
      customerSnapshot: {
        fullName: customer.name,
        email: customer.email,
        mobile: customer.phone,
        customerGstin: order.customerGstin || "",
      },
      billingAddress: {
        recipientName: billingAddr.recipientName,
        phone: billingAddr.phone,
        addressLine1: billingAddr.addressLine1,
        addressLine2: billingAddr.addressLine2 || "",
        landmark: billingAddr.landmark || "",
        city: billingAddr.city,
        state: billingAddr.state,
        stateCode: resolveStateCode(billingAddr.state, order.customerGstin),
        postalCode: billingAddr.postalCode,
        country: billingAddr.country || "India",
      },
      shippingAddress: {
        recipientName: shippingAddr.recipientName,
        phone: shippingAddr.phone,
        addressLine1: shippingAddr.addressLine1,
        addressLine2: shippingAddr.addressLine2 || "",
        landmark: shippingAddr.landmark || "",
        city: shippingAddr.city,
        state: shippingAddr.state,
        stateCode: financials.customerStateCode,
        postalCode: shippingAddr.postalCode,
        country: shippingAddr.country || "India",
      },
      sameBillingAndShipping,
      placeOfSupply: {
        state: shippingAddr.state,
        stateCode: financials.customerStateCode,
        isInterstate: financials.isInterstate,
      },
      items: financials.items.map((item) => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
        variantId: new Types.ObjectId(item.variantId),
      })),
      subtotalPaise: financials.subtotalPaise,
      productDiscountPaise: financials.productDiscountPaise,
      couponCode: order.couponCode || null,
      couponDiscountPaise: financials.couponDiscountPaise,
      discountsPaise: financials.discountsPaise,
      shippingChargesPaise: financials.shippingChargesPaise,
      shippingTaxablePaise: financials.shippingTaxablePaise,
      shippingGstRate: financials.shippingGstRate,
      shippingGstPaise: financials.shippingGstPaise,
      otherChargesPaise: financials.otherChargesPaise,
      taxableAmountPaise: financials.taxableAmountPaise,
      taxBreakdown: financials.taxBreakdown,
      grandTotalPaise: financials.grandTotalPaise,
      amountPaidPaise,
      balanceDuePaise,
      refundedAmountPaise: 0,
      amountInWords: financials.amountInWords,
      paymentMethod,
      paymentReference,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: invoicePaymentStatus,
      invoiceType: financials.invoiceType,
      footerNote: settings.footerNote,
      footerTagline: settings.footerTagline,
      termsAndConditions: settings.termsAndConditions,
      pdfStorageReference: null,
      issuedAt,
    });

    const pdfBuffer = await generateInvoicePdfBuffer(created);
    const relPath = await storePdfSafely(
      created.invoiceNumber,
      created.financialYear,
      pdfBuffer
    );
    if (relPath) {
      created.pdfStorageReference = relPath;
      await Invoice.updateOne(
        { _id: created._id },
        { $set: { pdfStorageReference: relPath } }
      );
    }

    return created;
  } catch (error: any) {
    if (error?.code === 11000) {
      const winner = await Invoice.findOne({
        orderId: order._id,
        documentType: "invoice",
      });
      if (winner) return winner;
    }
    throw error;
  }
}

/**
 * Syncs refund status onto the primary invoice and issues a Credit Note
 * when a Razorpay refund is processed (instead of mutating historical totals).
 */
export async function syncInvoiceRefundStatus(
  orderId: string,
  refundAmountPaise: number,
  refundId?: string | null
): Promise<void> {
  const invoice = await Invoice.findOne({
    orderId: new Types.ObjectId(orderId),
    documentType: "invoice",
  });
  if (!invoice) return;

  const totalRefunded = Math.min(
    invoice.grandTotalPaise,
    Math.max(invoice.refundedAmountPaise || 0, refundAmountPaise || invoice.grandTotalPaise)
  );
  const isFullRefund = totalRefunded >= invoice.grandTotalPaise;

  await Invoice.updateOne(
    { _id: invoice._id },
    {
      $set: {
        refundedAmountPaise: totalRefunded,
        paymentStatus: isFullRefund ? "Refunded" : "Partially Refunded",
      },
    }
  );

  // Create an automated Credit Note if none exists for this refund reference.
  if (refundId) {
    const existingNote = await Invoice.findOne({
      parentInvoiceId: invoice._id,
      documentType: "credit_note",
      paymentReference: refundId,
    });
    if (existingNote) return;
  }

  await createAdjustmentNote(
    invoice._id.toString(),
    {
      noteType: "credit_note",
      amountPaise: totalRefunded,
      reason: refundId
        ? `Refund processed (${refundId})`
        : "Order payment refunded",
      paymentReference: refundId || null,
    }
  );
}

/**
 * Issues a Credit Note or Debit Note against an already-issued invoice.
 * Preserves legal immutability of the original invoice.
 */
export async function createAdjustmentNote(
  parentInvoiceId: string,
  data: {
    noteType: "credit_note" | "debit_note";
    amountPaise: number;
    reason: string;
    paymentReference?: string | null;
  }
): Promise<IInvoice> {
  if (!mongoose.isValidObjectId(parentInvoiceId)) {
    throw httpError("Invalid invoice ID", 400);
  }

  const parent = await Invoice.findById(parentInvoiceId).lean();
  if (!parent) {
    throw httpError("Parent invoice not found", 404);
  }
  if (parent.documentType !== "invoice") {
    throw httpError("Adjustment notes can only be issued against a primary invoice", 400);
  }

  const settings = await getOrCreateInvoiceSettings();
  const issuedAt = new Date();
  const financialYear = getIndianFinancialYear(issuedAt);
  const prefix =
    data.noteType === "credit_note"
      ? `${settings.invoicePrefix}CN`
      : `${settings.invoicePrefix}DN`;
  const noteNumber = await allocateNextInvoiceNumber(prefix, financialYear);

  const amountPaise = Math.min(data.amountPaise, parent.grandTotalPaise);
  const ratio = parent.grandTotalPaise > 0 ? amountPaise / parent.grandTotalPaise : 0;
  const taxableAmountPaise = Math.round(parent.taxableAmountPaise * ratio);
  const totalGstPaise = amountPaise - taxableAmountPaise;
  const cgstPaise = parent.placeOfSupply.isInterstate
    ? 0
    : Math.round(totalGstPaise / 2);
  const sgstPaise = parent.placeOfSupply.isInterstate
    ? 0
    : totalGstPaise - cgstPaise;
  const igstPaise = parent.placeOfSupply.isInterstate ? totalGstPaise : 0;

  const note = await Invoice.create({
    invoiceNumber: noteNumber,
    documentType: data.noteType,
    parentInvoiceId: parent._id,
    adjustmentReason: data.reason,
    financialYear,
    orderId: parent.orderId,
    orderNumber: parent.orderNumber,
    orderDate: parent.orderDate,
    customerId: parent.customerId,
    sellerDetailsSnapshot: parent.sellerDetailsSnapshot,
    customerSnapshot: parent.customerSnapshot,
    billingAddress: parent.billingAddress,
    shippingAddress: parent.shippingAddress,
    sameBillingAndShipping: parent.sameBillingAndShipping,
    placeOfSupply: parent.placeOfSupply,
    items: [
      {
        sNo: 1,
        productId: parent.items[0].productId,
        variantId: parent.items[0].variantId,
        productName: `${data.noteType === "credit_note" ? "Credit Note" : "Debit Note"} for ${parent.invoiceNumber}: ${data.reason}`,
        flavour: "",
        sku: parent.items[0].sku,
        hsnCode: parent.items[0].hsnCode,
        weightGrams: parent.items[0].weightGrams,
        quantity: 1,
        unit: "Note",
        mrpPaise: amountPaise,
        unitPricePaise: amountPaise,
        discountPaise: 0,
        taxableValuePaise: taxableAmountPaise,
        gstRate: parent.items[0].gstRate,
        cgstPaise,
        sgstPaise,
        igstPaise,
        gstAmountPaise: totalGstPaise,
        totalPaise: amountPaise,
      },
    ],
    subtotalPaise: amountPaise,
    productDiscountPaise: 0,
    couponCode: null,
    couponDiscountPaise: 0,
    discountsPaise: 0,
    shippingChargesPaise: 0,
    shippingTaxablePaise: 0,
    shippingGstRate: 0,
    shippingGstPaise: 0,
    otherChargesPaise: 0,
    taxableAmountPaise,
    taxBreakdown: {
      cgstPaise,
      sgstPaise,
      igstPaise,
      totalGstPaise,
    },
    grandTotalPaise: amountPaise,
    amountPaidPaise: amountPaise,
    balanceDuePaise: 0,
    refundedAmountPaise: data.noteType === "credit_note" ? amountPaise : 0,
    amountInWords: amountInWordsINR(amountPaise),
    paymentMethod: parent.paymentMethod,
    paymentReference: data.paymentReference || parent.paymentReference,
    razorpayOrderId: parent.razorpayOrderId,
    razorpayPaymentId: parent.razorpayPaymentId,
    paymentStatus: data.noteType === "credit_note" ? "Refunded" : "Paid",
    invoiceType: data.noteType === "credit_note" ? "Credit Note" : "Debit Note",
    footerNote: parent.footerNote,
    footerTagline: parent.footerTagline,
    termsAndConditions: parent.termsAndConditions,
    pdfStorageReference: null,
    issuedAt,
  });

  return note;
}

export async function listCustomerInvoices(customerId: string) {
  const invoices = await Invoice.find({
    customerId: new Types.ObjectId(customerId),
  })
    .sort({ issuedAt: -1 })
    .select("-pdfStorageReference")
    .lean();

  return invoices;
}

export async function getCustomerInvoiceById(
  customerId: string,
  invoiceId: string
): Promise<IInvoice> {
  if (!mongoose.isValidObjectId(invoiceId)) {
    throw httpError("Invalid invoice ID", 400);
  }

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw httpError("Invoice not found", 404);
  }

  if (invoice.customerId.toString() !== customerId) {
    throw httpError("You do not have permission to access this invoice", 403);
  }

  return invoice;
}

export async function getCustomerInvoiceByOrderId(
  customerId: string,
  orderId: string
): Promise<IInvoice | null> {
  if (!mongoose.isValidObjectId(orderId)) {
    throw httpError("Invalid order ID", 400);
  }

  const order = await Order.findOne({
    _id: orderId,
    userId: new Types.ObjectId(customerId),
  }).select("_id");

  if (!order) {
    throw httpError("Order not found", 404);
  }

  const invoice = await Invoice.findOne({
    orderId: order._id,
    customerId: new Types.ObjectId(customerId),
    documentType: "invoice",
  });

  return invoice;
}

export async function listAdminInvoices(query: {
  page: number;
  limit: number;
  search?: string;
  paymentStatus?: string;
  invoiceType?: string;
  startDate?: string;
  endDate?: string;
}) {
  const skip = (query.page - 1) * query.limit;
  const filter: Record<string, any> = {};

  if (query.paymentStatus && query.paymentStatus !== "all") {
    filter.paymentStatus = query.paymentStatus;
  }
  if (query.invoiceType && query.invoiceType !== "all") {
    filter.invoiceType = query.invoiceType;
  }
  if (query.startDate || query.endDate) {
    filter.issuedAt = {};
    if (query.startDate) filter.issuedAt.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.issuedAt.$lte = end;
    }
  }
  if (query.search) {
    const regex = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { invoiceNumber: regex },
      { orderNumber: regex },
      { "customerSnapshot.fullName": regex },
      { "customerSnapshot.email": regex },
      { "customerSnapshot.mobile": regex },
    ];
  }

  const [invoices, total] = await Promise.all([
    Invoice.find(filter)
      .select("-pdfStorageReference")
      .sort({ issuedAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Invoice.countDocuments(filter),
  ]);

  return {
    invoices,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getAdminInvoiceById(invoiceId: string): Promise<IInvoice> {
  if (!mongoose.isValidObjectId(invoiceId)) {
    throw httpError("Invalid invoice ID", 400);
  }
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw httpError("Invoice not found", 404);
  }
  return invoice;
}

export async function getAdminInvoiceStats() {
  const currentFy = getIndianFinancialYear(new Date());

  const [summaryAgg, currentFyCount] = await Promise.all([
    Invoice.aggregate([
      { $match: { documentType: "invoice" } },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalInvoicedPaise: { $sum: "$grandTotalPaise" },
          totalPaidPaise: { $sum: "$amountPaidPaise" },
          totalPendingPaise: { $sum: "$balanceDuePaise" },
        },
      },
    ]),
    Invoice.countDocuments({
      documentType: "invoice",
      financialYear: currentFy,
    }),
  ]);

  const summary = summaryAgg[0] || {
    totalInvoices: 0,
    totalInvoicedPaise: 0,
    totalPaidPaise: 0,
    totalPendingPaise: 0,
  };

  return {
    totalInvoices: summary.totalInvoices,
    totalInvoicedPaise: summary.totalInvoicedPaise,
    paidAmountPaise: summary.totalPaidPaise,
    pendingAmountPaise: summary.totalPendingPaise,
    currentFinancialYear: currentFy,
    currentFinancialYearCount: currentFyCount,
  };
}
