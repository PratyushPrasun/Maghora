import mongoose, { Schema, Types } from "mongoose";

export type PaymentStatus =
  | "creating"
  | "created"
  | "authorized"
  | "captured"
  | "refund_pending"
  | "refunded"
  | "review_required"
  | "creation_failed";

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    amountPaise: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    status: {
      type: String,
      enum: [
        "creating",
        "created",
        "authorized",
        "captured",
        "refund_pending",
        "refunded",
        "review_required",
        "creation_failed",
      ],
      default: "creating",
    },

    creationLeaseExpiresAt: {
      type: Date,
      default: null,
    },

    checkoutSignatureVerifiedAt: {
      type: Date,
      default: null,
    },

    lastFailure: {
      type: Schema.Types.Mixed,
      default: null,
    },

    refundId: {
      type: String,
      default: null,
    },

    refundStatus: {
      type: String,
      enum: [
        "none",
        "requested",
        "processed",
        "failed",
        "manual_review",
      ],
      default: "none",
    },

    refundAmountPaise: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

// Webhook event idempotency and audit record.
const paymentWebhookEventSchema = new Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },

    event: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "processed", "failed"],
      default: "processing",
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const PaymentWebhookEvent = mongoose.model(
  "PaymentWebhookEvent",
  paymentWebhookEventSchema
);

paymentSchema.index(
  { razorpayOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayOrderId: { $type: "string" },
    },
  }
);

paymentSchema.index(
  { razorpayPaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayPaymentId: { $type: "string" },
    },
  }
);