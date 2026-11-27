import mongoose, { Schema, type Document, type Types } from "mongoose";

export type InvoiceDocumentType = "invoice" | "credit_note" | "debit_note";
export type InvoiceType =
  | "Tax Invoice"
  | "Bill of Supply"
  | "Credit Note"
  | "Debit Note";
export type InvoicePaymentStatus =
  | "Paid"
  | "Pending"
  | "Partially Paid"
  | "COD"
  | "Refunded"
  | "Partially Refunded";

export interface IInvoiceItem {
  sNo: number;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  productName: string;
  flavour: string;
  sku: string;
  hsnCode: string;
  weightGrams: number;
  quantity: number;
  unit: string;
  mrpPaise: number;
  unitPricePaise: number;
  discountPaise: number;
  taxableValuePaise: number;
  gstRate: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  gstAmountPaise: number;
  totalPaise: number;
}

export interface IInvoiceAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  documentType: InvoiceDocumentType;
  parentInvoiceId: Types.ObjectId | null;
  adjustmentReason: string;
  financialYear: string;
  orderId: Types.ObjectId;
  orderNumber: string;
  orderDate: Date;
  customerId: Types.ObjectId;
  sellerDetailsSnapshot: {
    brandName: string;
    tagline: string;
    legalName: string;
    gstin: string;
    isGstRegistered: boolean;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
    contactNumber: string;
    supportEmail: string;
    website: string;
    returnPolicyUrl: string;
  };
  customerSnapshot: {
    fullName: string;
    email: string;
    mobile: string;
    customerGstin: string;
  };
  billingAddress: IInvoiceAddress;
  shippingAddress: IInvoiceAddress;
  sameBillingAndShipping: boolean;
  placeOfSupply: {
    state: string;
    stateCode: string;
    isInterstate: boolean;
  };
  items: IInvoiceItem[];
  subtotalPaise: number;
  productDiscountPaise: number;
  couponCode: string | null;
  couponDiscountPaise: number;
  discountsPaise: number;
  shippingChargesPaise: number;
  shippingTaxablePaise: number;
  shippingGstRate: number;
  shippingGstPaise: number;
  otherChargesPaise: number;
  taxableAmountPaise: number;
  taxBreakdown: {
    cgstPaise: number;
    sgstPaise: number;
    igstPaise: number;
    totalGstPaise: number;
  };
  grandTotalPaise: number;
  amountPaidPaise: number;
  balanceDuePaise: number;
  refundedAmountPaise: number;
  amountInWords: string;
  paymentMethod: string;
  paymentReference: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentStatus: InvoicePaymentStatus;
  invoiceType: InvoiceType;
  footerNote: string;
  footerTagline: string;
  termsAndConditions: string;
  pdfStorageReference: string | null;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItem>(
  {
    sNo: { type: Number, required: true, min: 1 },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    productName: { type: String, required: true },
    flavour: { type: String, default: "" },
    sku: { type: String, required: true },
    hsnCode: { type: String, default: "" },
    weightGrams: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: "Packet" },
    mrpPaise: { type: Number, required: true, min: 0 },
    unitPricePaise: { type: Number, required: true, min: 0 },
    discountPaise: { type: Number, required: true, min: 0, default: 0 },
    taxableValuePaise: { type: Number, required: true, min: 0 },
    gstRate: { type: Number, required: true, min: 0, max: 28 },
    cgstPaise: { type: Number, required: true, min: 0, default: 0 },
    sgstPaise: { type: Number, required: true, min: 0, default: 0 },
    igstPaise: { type: Number, required: true, min: 0, default: 0 },
    gstAmountPaise: { type: Number, required: true, min: 0, default: 0 },
    totalPaise: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceAddressSchema = new Schema<IInvoiceAddress>(
  {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, default: "" },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },
    documentType: {
      type: String,
      enum: ["invoice", "credit_note", "debit_note"],
      default: "invoice",
      immutable: true,
    },
    parentInvoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
      immutable: true,
    },
    adjustmentReason: {
      type: String,
      default: "",
      immutable: true,
    },
    financialYear: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      immutable: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
    orderDate: {
      type: Date,
      required: true,
      immutable: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
    sellerDetailsSnapshot: {
      brandName: { type: String, required: true },
      tagline: { type: String, required: true },
      legalName: { type: String, required: true },
      gstin: { type: String, default: "" },
      isGstRegistered: { type: Boolean, required: true },
      addressLine1: { type: String, default: "" },
      addressLine2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      stateCode: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "India" },
      contactNumber: { type: String, default: "" },
      supportEmail: { type: String, default: "" },
      website: { type: String, default: "" },
      returnPolicyUrl: { type: String, default: "" },
    },
    customerSnapshot: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      customerGstin: { type: String, default: "" },
    },
    billingAddress: {
      type: invoiceAddressSchema,
      required: true,
    },
    shippingAddress: {
      type: invoiceAddressSchema,
      required: true,
    },
    sameBillingAndShipping: {
      type: Boolean,
      default: true,
    },
    placeOfSupply: {
      state: { type: String, required: true },
      stateCode: { type: String, default: "" },
      isInterstate: { type: Boolean, required: true },
    },
    items: {
      type: [invoiceItemSchema],
      required: true,
    },
    subtotalPaise: { type: Number, required: true, min: 0 },
    productDiscountPaise: { type: Number, required: true, min: 0, default: 0 },
    couponCode: { type: String, default: null },
    couponDiscountPaise: { type: Number, required: true, min: 0, default: 0 },
    discountsPaise: { type: Number, required: true, min: 0, default: 0 },
    shippingChargesPaise: { type: Number, required: true, min: 0, default: 0 },
    shippingTaxablePaise: { type: Number, required: true, min: 0, default: 0 },
    shippingGstRate: { type: Number, required: true, min: 0, default: 0 },
    shippingGstPaise: { type: Number, required: true, min: 0, default: 0 },
    otherChargesPaise: { type: Number, required: true, min: 0, default: 0 },
    taxableAmountPaise: { type: Number, required: true, min: 0 },
    taxBreakdown: {
      cgstPaise: { type: Number, required: true, min: 0, default: 0 },
      sgstPaise: { type: Number, required: true, min: 0, default: 0 },
      igstPaise: { type: Number, required: true, min: 0, default: 0 },
      totalGstPaise: { type: Number, required: true, min: 0, default: 0 },
    },
    grandTotalPaise: { type: Number, required: true, min: 0 },
    amountPaidPaise: { type: Number, required: true, min: 0, default: 0 },
    balanceDuePaise: { type: Number, required: true, min: 0, default: 0 },
    refundedAmountPaise: { type: Number, required: true, min: 0, default: 0 },
    amountInWords: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentReference: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: [
        "Paid",
        "Pending",
        "Partially Paid",
        "COD",
        "Refunded",
        "Partially Refunded",
      ],
      required: true,
      index: true,
    },
    invoiceType: {
      type: String,
      enum: ["Tax Invoice", "Bill of Supply", "Credit Note", "Debit Note"],
      required: true,
      index: true,
    },
    footerNote: { type: String, default: "Thank you for choosing Maghora!" },
    footerTagline: { type: String, default: "Ancient roots Modern Taste" },
    termsAndConditions: { type: String, default: "" },
    pdfStorageReference: { type: String, default: null },
    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate primary invoices for the same order under concurrency.
invoiceSchema.index(
  { orderId: 1, documentType: 1 },
  {
    unique: true,
    partialFilterExpression: { documentType: "invoice" },
  }
);

invoiceSchema.index({ customerId: 1, issuedAt: -1 });
invoiceSchema.index({ issuedAt: -1 });
invoiceSchema.index({
  "customerSnapshot.fullName": "text",
  "customerSnapshot.email": "text",
  "customerSnapshot.mobile": "text",
  invoiceNumber: "text",
  orderNumber: "text",
});

const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);

export default Invoice;
