import mongoose, { Schema, Types } from "mongoose";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refund_pending"
  | "refunded";

export type InventoryStatus =
  | "reserved"
  | "committed"
  | "released";

export interface IOrderItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  productName: string;
  flavour?: string;
  sku: string;
  hsnCode?: string;
  gstRate?: number;
  unit?: string;
  weightGrams: number;
  imageUrl: string | null;
  pricePaise: number;
  mrpPaise: number;
  quantity: number;
  lineTotalPaise: number;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    flavour: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      required: true,
    },
    hsnCode: {
      type: String,
      default: "",
    },
    gstRate: {
      type: Number,
      default: undefined,
    },
    unit: {
      type: String,
      default: "Packet",
    },
    weightGrams: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    pricePaise: {
      type: Number,
      required: true,
    },
    mrpPaise: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    lineTotalPaise: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    idempotencyKey: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    subtotalPaise: {
      type: Number,
      required: true,
    },

    shippingPaise: {
      type: Number,
      required: true,
      default: 0,
    },

    couponCode: {
      type: String,
      default: null,
    },

    couponDiscountPaise: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherChargesPaise: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPaise: {
      type: Number,
      required: true,
    },

    billingAddress: {
      type: shippingAddressSchema,
      default: null,
    },

    customerGstin: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending_payment",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "expired",
        "refund_pending",
        "refunded",
      ],
      default: "pending",
    },

    inventoryStatus: {
      type: String,
      enum: ["reserved", "committed", "released"],
      default: "reserved",
    },

    reservationExpiresAt: {
      type: Date,
      required: true,
    },

    paymentProvider: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    paymentOrderId: {
      type: String,
      default: null,
    },

    paymentId: {
      type: String,
      default: null,
    },

    trackingNumber: {
      type: String,
      default: null,
    },

    customerNotes: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

orderSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true }
);

orderSchema.index({
  paymentStatus: 1,
  inventoryStatus: 1,
  reservationExpiresAt: 1,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;

