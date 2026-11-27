import crypto from "node:crypto";
import mongoose, { Types } from "mongoose";

import razorpay from "../../config/razorpay.js";
import { env } from "../../config/env.js";

import Order from "../orders/order.model.js";
import Product from "../products/product.model.js";
import Payment from "./payment.model.js";
import {
  generateInvoiceForOrder,
  syncInvoiceRefundStatus,
} from "../invoices/invoice.service.js";

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}

function safeCompareHex(a: string, b: string): boolean {
  if (
    !/^[a-fA-F0-9]+$/.test(a) ||
    !/^[a-fA-F0-9]+$/.test(b)
  ) {
    return false;
  }

  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  return (
    left.length === right.length &&
    crypto.timingSafeEqual(left, right)
  );
}

function verifyCheckoutSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
) {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return safeCompareHex(expected, signature);
}

function assertReservationIsActive(order: any) {
  if (
    order.paymentStatus !== "pending" ||
    order.inventoryStatus !== "reserved"
  ) {
    throw httpError(
      "This order is no longer awaiting payment",
      409
    );
  }

  if (order.reservationExpiresAt.getTime() <= Date.now()) {
    throw httpError(
      "Your inventory reservation has expired. Please place a new order.",
      409
    );
  }
}

/**
 * Creates one Razorpay Order per Maghora Order.
 * The database creation lease prevents concurrent requests from
 * creating multiple Razorpay Orders for the same checkout.
 */
export async function createRazorpayOrder(
  userId: string,
  orderId: string
) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw httpError("Invalid order ID", 400);
  }

  const order = await Order.findOne({
    _id: orderId,
    userId,
  });

  if (!order) {
    throw httpError("Order not found", 404);
  }

  assertReservationIsActive(order);

  if (order.totalPaise < 100) {
    throw httpError("Minimum order amount is 100 paise", 400);
  }

  let payment = await Payment.findOne({
    orderId: order._id,
  });

  if (payment?.razorpayOrderId) {
    const syncedOrder = await Order.updateOne(
      {
        _id: order._id,
        userId,
        paymentStatus: "pending",
        inventoryStatus: "reserved",
        reservationExpiresAt: { $gt: new Date() },
        $or: [
          { paymentOrderId: null },
          { paymentOrderId: payment.razorpayOrderId },
        ],
      },
      {
        $set: {
          paymentOrderId: payment.razorpayOrderId,
        },
      }
    );

    if (syncedOrder.matchedCount !== 1) {
      throw httpError(
        "Order reservation is no longer active",
        409
      );
    }

    return {
      keyId: env.RAZORPAY_KEY_ID,
      razorpayOrderId: payment.razorpayOrderId,
      amount: payment.amountPaise,
      currency: payment.currency,
      orderId: order._id,
      orderNumber: order.orderNumber,
      expiresAt: order.reservationExpiresAt,
    };
  }

  const now = new Date();
  const leaseExpiry = new Date(now.getTime() + 30_000);

  if (!payment) {
    try {
      payment = await Payment.create({
        orderId: order._id,
        userId: new Types.ObjectId(userId),
        amountPaise: order.totalPaise,
        currency: "INR",
        status: "creating",
        creationLeaseExpiresAt: leaseExpiry,
      });
    } catch (error: any) {
      if (error?.code !== 11000) throw error;

      payment = await Payment.findOne({
        orderId: order._id,
      });

      if (!payment) throw error;
    }
  } else {
    // A previous request may have crashed during Razorpay creation.
    const canClaim =
      payment.status === "creation_failed" ||
      (
        payment.status === "creating" &&
        payment.creationLeaseExpiresAt &&
        payment.creationLeaseExpiresAt.getTime() <= now.getTime()
      );

    if (!canClaim) {
      throw httpError(
        "Payment order creation is already in progress. Please retry shortly.",
        409
      );
    }

    const claimed = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        razorpayOrderId: null,
        $or: [
          { status: "creation_failed" },
          {
            status: "creating",
            creationLeaseExpiresAt: { $lte: now },
          },
        ],
      },
      {
        $set: {
          status: "creating",
          creationLeaseExpiresAt: leaseExpiry,
        },
      },
      { new: true }
    );

    if (!claimed) {
      throw httpError(
        "Payment order creation is already in progress",
        409
      );
    }

    payment = claimed;
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId,
      },
    });

    // Persist the provider order ID in both records.
    const savedPayment = await Payment.findOneAndUpdate(
      {
        _id: payment._id,
        status: "creating",
        razorpayOrderId: null,
      },
      {
        $set: {
          razorpayOrderId: razorpayOrder.id,
          status: "created",
          creationLeaseExpiresAt: null,
        },
      },
      { new: true }
    );

    if (!savedPayment) {
      throw httpError(
        "Could not save the payment order. Contact support before retrying.",
        500
      );
    }

    const updatedOrder = await Order.updateOne(
      {
        _id: order._id,
        userId,
        paymentStatus: "pending",
        inventoryStatus: "reserved",
        reservationExpiresAt: { $gt: new Date() },
        $or: [
          { paymentOrderId: null },
          { paymentOrderId: razorpayOrder.id },
        ],
      },
      {
        $set: {
          paymentOrderId: razorpayOrder.id,
        },
      }
    );

    if (updatedOrder.modifiedCount !== 1) {
      // Do not let the customer begin checkout if the reservation
      // expired while the provider order was being created.
      throw httpError(
        "The order reservation expired. Please contact support if you have already started payment.",
        409
      );
    }

    return {
      keyId: env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalPaise,
      currency: "INR",
      orderId: order._id,
      orderNumber: order.orderNumber,
      expiresAt: order.reservationExpiresAt,
    };
  } catch (error) {
    await Payment.updateOne(
      {
        _id: payment._id,
        status: "creating",
        razorpayOrderId: null,
      },
      {
        $set: {
          status: "creation_failed",
          creationLeaseExpiresAt: null,
        },
      }
    );

    throw error;
  }
}

/**
 * Commits reserved inventory only when payment is captured
 * and the reservation is still active.
 */
async function processCapturedPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  method?: string | null;
}) {
  if (data.currency !== "INR" || !Number.isSafeInteger(data.amount)) {
    throw httpError("Invalid payment amount or currency", 400);
  }

  const paymentRecord = await Payment.findOne({
    razorpayOrderId: data.razorpayOrderId,
  });

  if (!paymentRecord) {
    throw httpError("Payment record not found", 404);
  }

  if (paymentRecord.amountPaise !== data.amount) {
    await Payment.updateOne(
      { _id: paymentRecord._id },
      { $set: { status: "review_required" } }
    );

    throw httpError(
      "Payment amount does not match the order amount",
      409
    );
  }

  const session = await mongoose.startSession();
  let shouldRefund = false;
  let shouldGenerateInvoice = false;

  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findById(
        paymentRecord._id
      ).session(session);

      const order = await Order.findById(
        paymentRecord.orderId
      ).session(session);

      if (!payment || !order) {
        throw httpError("Payment or order not found", 404);
      }

      // Duplicate webhook or verify request.
      if (
        order.paymentStatus === "paid" &&
        order.paymentId === data.razorpayPaymentId
      ) {
        shouldGenerateInvoice = true;
        return;
      }

      // Another captured payment for an already-paid order
      // must not deduct stock a second time.
      // Another captured payment for an already-paid order.
      // Preserve the original successful payment ID.
      if (order.paymentStatus === "paid") {
        payment.status = "review_required";

        payment.lastFailure = {
          reason: "Additional captured payment for an already-paid order",
          razorpayPaymentId: data.razorpayPaymentId,
          occurredAt: new Date(),
        };

        await payment.save({ session });

        shouldRefund = true;
        return;
      }

      const reservationActive =
        order.inventoryStatus === "reserved" &&
        order.paymentStatus === "pending" &&
        order.reservationExpiresAt.getTime() > Date.now();

      if (!reservationActive) {
        // If the expiry worker has not released the reservation yet,
        // release it now inside this transaction.
        if (order.inventoryStatus === "reserved") {
          for (const item of order.items) {
            const released = await Product.updateOne(
              {
                _id: item.productId,
                variants: {
                  $elemMatch: {
                    _id: item.variantId,
                    reservedStock: { $gte: item.quantity },
                  },
                },
              },
              {
                $inc: {
                  "variants.$.reservedStock": -item.quantity,
                },
              },
              { session }
            );

            if (released.modifiedCount !== 1) {
              throw new Error(
                `Could not release expired inventory for ${order.orderNumber}`
              );
            }
          }
        }

        order.inventoryStatus = "released";
        order.paymentStatus = "refund_pending";
        order.status = "cancelled";
        payment.status = "refund_pending";
        payment.razorpayPaymentId = data.razorpayPaymentId;
        payment.refundAmountPaise = data.amount;
        payment.refundStatus = "manual_review";

        await order.save({ session });
        await payment.save({ session });

        shouldRefund = true;
        return;
      }

      // Claim the order transition before committing inventory.
      const claimedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          paymentStatus: "pending",
          inventoryStatus: "reserved",
          reservationExpiresAt: { $gt: new Date() },
          paymentOrderId: data.razorpayOrderId,
        },
        {
          $set: {
            paymentStatus: "paid",
            inventoryStatus: "committed",
            status: "confirmed",
            paymentId: data.razorpayPaymentId,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!claimedOrder) {
        throw httpError(
          "Order state changed while confirming payment",
          409
        );
      }

      for (const item of order.items) {
        const committed = await Product.updateOne(
          {
            _id: item.productId,
            variants: {
              $elemMatch: {
                _id: item.variantId,
                stockOnHand: { $gte: item.quantity },
                reservedStock: { $gte: item.quantity },
              },
            },
          },
          {
            $inc: {
              "variants.$.stockOnHand": -item.quantity,
              "variants.$.reservedStock": -item.quantity,
            },
          },
          { session }
        );

        if (committed.modifiedCount !== 1) {
          throw new Error(
            `Inventory commitment failed for ${order.orderNumber}`
          );
        }
      }

      payment.status = "captured";
      payment.razorpayPaymentId = data.razorpayPaymentId;
      await payment.save({ session });
      shouldGenerateInvoice = true;
    });
  } finally {
    await session.endSession();
  }

  if (shouldGenerateInvoice && !shouldRefund) {
    try {
      await generateInvoiceForOrder(paymentRecord.orderId.toString(), {
        paymentMethod: data.method || "Razorpay",
        paymentReference: data.razorpayPaymentId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpayOrderId: data.razorpayOrderId,
      });
    } catch (invoiceError) {
      console.error(
        `[Invoice] Failed to generate invoice for order=${paymentRecord.orderId.toString()}:`,
        invoiceError
      );
    }
  }

  if (shouldRefund) {
    await requestLatePaymentRefund(
      paymentRecord._id.toString(),
      data.razorpayPaymentId,
      data.amount
    );
  }
}

/**
 * Request a refund for a captured payment whose inventory reservation
 * is no longer available. We claim the refund request in MongoDB first.
 *
 * If the provider request times out, do not blindly retry it:
 * reconcile the refund in the Razorpay Dashboard to avoid duplicate refunds.
 */
async function requestLatePaymentRefund(
  paymentId: string,
  razorpayPaymentId: string,
  amountPaise: number
) {
  const claimed = await Payment.findOneAndUpdate(
    {
      _id: paymentId,
      refundStatus: "none",
    },
    {
      $set: {
        refundStatus: "requested",
        status: "refund_pending",
        razorpayPaymentId,
        refundAmountPaise: amountPaise,
      },
    },
    { new: true }
  );

  if (!claimed) return;

  try {
    const refund = await razorpay.payments.refund(
      razorpayPaymentId,
      {
        amount: amountPaise,
        notes: {
          reason: "Order reservation expired before payment confirmation",
          orderId: claimed.orderId.toString(),
        },
      }
    );

    await Payment.updateOne(
      { _id: claimed._id },
      {
        $set: {
          refundId: refund.id,
          refundStatus:
            refund.status === "processed" ? "processed" : "requested",
          status:
            refund.status === "processed"
              ? "refunded"
              : "refund_pending",
        },
      }
    );

    if (refund.status === "processed") {
      await Order.updateOne(
        { _id: claimed.orderId, paymentStatus: "refund_pending" },
        { $set: { paymentStatus: "refunded" } }
      );
    }
  } catch (error) {
    console.error(
      "Late-payment refund request needs manual reconciliation:",
      error
    );

    await Payment.updateOne(
      { _id: claimed._id },
      { $set: { refundStatus: "manual_review" } }
    );
  }
}

/**
 * Customer Checkout verification.
 * A valid signature proves the Checkout response belongs to our
 * Razorpay Order. The captured status is checked separately.
 */
export async function verifyCheckoutPayment(
  userId: string,
  data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) {
  const payment = await Payment.findOne({
    userId,
    razorpayOrderId: data.razorpay_order_id,
  });

  if (!payment) {
    throw httpError("Payment order not found", 404);
  }

  if (
    !verifyCheckoutSignature(
      payment.razorpayOrderId!,
      data.razorpay_payment_id,
      data.razorpay_signature
    )
  ) {
    throw httpError("Invalid payment signature", 400);
  }

  await Payment.updateOne(
    { _id: payment._id },
    { $set: { checkoutSignatureVerifiedAt: new Date() } }
  );

  const providerPayment: any = await razorpay.payments.fetch(
    data.razorpay_payment_id
  );

  if (
    providerPayment.order_id !== payment.razorpayOrderId ||
    providerPayment.amount !== payment.amountPaise ||
    providerPayment.currency !== payment.currency
  ) {
    await Payment.updateOne(
      { _id: payment._id },
      { $set: { status: "review_required" } }
    );

    throw httpError(
      "Payment details do not match this order",
      409
    );
  }

  if (providerPayment.status === "captured") {
    await processCapturedPayment({
      razorpayOrderId: providerPayment.order_id,
      razorpayPaymentId: providerPayment.id,
      amount: providerPayment.amount,
      currency: providerPayment.currency,
      method: providerPayment.method || null,
    });
  } else if (providerPayment.status === "authorized") {
    await Payment.updateOne(
      { _id: payment._id },
      { $set: { status: "authorized" } }
    );
  } else if (providerPayment.status === "failed") {
    await Payment.updateOne(
      { _id: payment._id },
      {
        $set: {
          lastFailure: {
            code: providerPayment.error_code,
            description: providerPayment.error_description,
          },
        },
      }
    );
  }

  return getPaymentStatus(userId, payment.orderId.toString());
}

export async function getPaymentStatus(
  userId: string,
  orderId: string
) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw httpError("Invalid order ID", 400);
  }

  const order = await Order.findOne({
    _id: orderId,
    userId,
  }).select(
    "orderNumber totalPaise paymentStatus inventoryStatus reservationExpiresAt"
  );

  if (!order) {
    throw httpError("Order not found", 404);
  }

  const payment = await Payment.findOne({
    orderId: order._id,
    userId,
  }).select(
    "razorpayOrderId status amountPaise currency refundId refundStatus refundAmountPaise lastFailure"
  );

  return {
    order: {
      id: order._id,
      orderNumber: order.orderNumber,
      amountPaise: order.totalPaise,
      paymentStatus: order.paymentStatus,
      inventoryStatus: order.inventoryStatus,
      reservationExpiresAt: order.reservationExpiresAt,
    },
    payment: payment
      ? {
        razorpayOrderId: payment.razorpayOrderId,
        status: payment.status,
        amountPaise: payment.amountPaise,
        currency: payment.currency,
        refundId: payment.refundId,
        refundStatus: payment.refundStatus,
        refundAmountPaise: payment.refundAmountPaise,
        lastFailure: payment.lastFailure,
      }
      : null,
  };
}

/**
 * Called only after webhook signature verification.
 */
export async function processRazorpayWebhookEvent(event: any) {
  const entity = event?.payload?.payment?.entity;

  if (event.event === "payment.captured") {
    if (!entity?.order_id || !entity?.id) {
      throw httpError("Invalid captured-payment event", 400);
    }

    await processCapturedPayment({
      razorpayOrderId: entity.order_id,
      razorpayPaymentId: entity.id,
      amount: entity.amount,
      currency: entity.currency,
      method: entity.method || null,
    });

    return;
  }

  if (event.event === "payment.failed") {
    if (!entity?.order_id) return;

    await Payment.updateOne(
      { razorpayOrderId: entity.order_id },
      {
        $set: {
          lastFailure: {
            paymentId: entity.id,
            code: entity.error_code,
            description: entity.error_description,
            reason: entity.error_reason,
            occurredAt: new Date(),
          },
        },
      }
    );

    // Do not release stock here. The customer can retry while
    // the original 10-minute reservation is still active.
    return;
  }

  if (event.event === "refund.processed") {
    const refund = event?.payload?.refund?.entity;
    if (!refund?.payment_id) return;

    const payment = await Payment.findOneAndUpdate(
      {
        razorpayPaymentId: refund.payment_id,
      },
      {
        $set: {
          status: "refunded",
          refundStatus: "processed",
          refundId: refund.id,
        },
      },
      { new: true }
    );

    if (payment) {
      await Order.updateOne(
        {
          _id: payment.orderId,
          paymentStatus: "refund_pending",
        },
        { $set: { paymentStatus: "refunded" } }
      );

      await syncInvoiceRefundStatus(
        payment.orderId.toString(),
        refund.amount || payment.refundAmountPaise || payment.amountPaise,
        refund.id
      ).catch((err) => {
        console.error("[Invoice] Failed to sync refund status:", err);
      });
    }

    return;
  }

  if (event.event === "refund.failed") {
    const refund = event?.payload?.refund?.entity;
    if (!refund?.payment_id) return;

    await Payment.updateOne(
      { razorpayPaymentId: refund.payment_id },
      {
        $set: {
          refundStatus: "manual_review",
          status: "refund_pending",
        },
      }
    );
  }
}

/**
 * Standard Razorpay Order Creation (independent of full cart/reservation flow)
 */
export async function createStandardRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
  notes,
}: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    throw httpError("Amount is required and must be a valid number", 400);
  }

  const numericAmount = Math.round(Number(amount));
  if (numericAmount < 100) {
    throw httpError("Minimum amount is 100 paise", 400);
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: numericAmount,
      currency: currency || "INR",
      receipt:
        receipt ||
        `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: notes || {},
    });

    return {
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: env.RAZORPAY_KEY_ID,
    };
  } catch (error: any) {
    if (
      error?.statusCode === 401 ||
      (error?.error?.code === "BAD_REQUEST_ERROR" &&
        error?.error?.description?.toLowerCase().includes("auth"))
    ) {
      throw httpError("Razorpay authentication failed", 401);
    }
    const message =
      error?.error?.description ||
      error?.message ||
      "Failed to create Razorpay order";
    throw httpError(message, 500);
  }
}

/**
 * Standard Razorpay Signature Verification
 */
export function verifyStandardPaymentSignature({
  order_id,
  payment_id,
  signature,
}: {
  order_id: string;
  payment_id: string;
  signature: string;
}) {
  if (!order_id || !payment_id || !signature) {
    throw httpError(
      "Missing required fields: order_id, payment_id, and signature are required",
      400
    );
  }

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  const isValid = safeCompareHex(expected, signature);
  if (!isValid) {
    throw httpError("Invalid payment signature", 400);
  }

  return true;
}
