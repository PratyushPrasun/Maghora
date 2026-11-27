import mongoose, { Schema, type Document } from "mongoose";

export interface IInvoiceSettings extends Document {
  key: string;
  brandName: string;
  tagline: string;
  legalName: string;
  gstin: string;
  isGstRegistered: boolean;
  businessAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  contactNumber: string;
  supportEmail: string;
  website: string;
  returnPolicyUrl: string;
  invoicePrefix: string;
  defaultHsnCode: string;
  defaultGstRate: number;
  shippingGstRate: number;
  pricesIncludeGst: boolean;
  footerNote: string;
  footerTagline: string;
  termsAndConditions: string;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSettingsSchema = new Schema<IInvoiceSettings>(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
      immutable: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
      default: "MAGHORA",
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
      default: "Ancient roots Modern Taste",
    },
    legalName: {
      type: String,
      required: true,
      trim: true,
      default: "SARA FOODS ENTERPRISES",
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: "10EKYPA9495M1ZB",
    },
    isGstRegistered: {
      type: Boolean,
      default: true,
    },
    businessAddress: {
      addressLine1: { type: String, trim: true, default: "" },
      addressLine2: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "Bihar" },
      stateCode: { type: String, trim: true, default: "10" },
      postalCode: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "India" },
    },
    contactNumber: {
      type: String,
      trim: true,
      default: "+91 88939 32380",
    },
    supportEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "maghora0408@gmail.com",
    },
    website: {
      type: String,
      trim: true,
      default: "https://maghora.in",
    },
    returnPolicyUrl: {
      type: String,
      trim: true,
      default: "https://maghora.in/terms",
    },
    invoicePrefix: {
      type: String,
      trim: true,
      uppercase: true,
      default: "MAG",
      minlength: 2,
      maxlength: 10,
    },
    defaultHsnCode: {
      type: String,
      trim: true,
      default: "1904",
    },
    defaultGstRate: {
      type: Number,
      min: 0,
      max: 28,
      default: 5,
    },
    shippingGstRate: {
      type: Number,
      min: 0,
      max: 28,
      default: 5,
    },
    pricesIncludeGst: {
      type: Boolean,
      default: true,
    },
    footerNote: {
      type: String,
      trim: true,
      default: "Thank you for choosing Maghora!",
    },
    footerTagline: {
      type: String,
      trim: true,
      default: "Ancient roots Modern Taste",
    },
    termsAndConditions: {
      type: String,
      trim: true,
      default:
        "All disputes subject to Bihar jurisdiction. Perishable food items are eligible for replacement/refund only for damaged or defective deliveries reported within 48 hours.",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const InvoiceSettings = mongoose.model<IInvoiceSettings>(
  "InvoiceSettings",
  invoiceSettingsSchema
);

export default InvoiceSettings;
