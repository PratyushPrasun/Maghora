import mongoose, { Schema, Types } from "mongoose";

export type AddressLabel = "home" | "office" | "other";

export interface IAddress {
  userId: Types.ObjectId;
  label: AddressLabel;
  customLabel: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    label: {
      type: String,
      enum: ["home", "office", "other"],
      required: true,
    },

    customLabel: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    recipientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    addressLine2: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },

    landmark: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent two default addresses for the same customer.
addressSchema.index(
  { userId: 1, isDefault: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDefault: true,
    },
  }
);

addressSchema.index({ userId: 1, createdAt: -1 });

const Address = mongoose.model<IAddress>(
  "Address",
  addressSchema
);

export default Address;