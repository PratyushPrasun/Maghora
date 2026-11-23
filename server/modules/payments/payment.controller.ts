import type { Request, Response } from "express";

import {
  createRazorpayOrder,
  verifyCheckoutPayment,
  getPaymentStatus,
  createStandardRazorpayOrder,
  verifyStandardPaymentSignature,
} from "./payment.service.js";

import {
  orderIdParamSchema,
  verifyPaymentSchema,
} from "./payment.validation.js";

function badRequest(message: string) {
  return Object.assign(new Error(message), { statusCode: 400 });
}

function getUserId(req: Request): string {
  const userId = req.currentUser?._id?.toString();

  if (!userId) {
    throw Object.assign(new Error("Authentication required"), {
      statusCode: 401,
    });
  }

  return userId;
}

export async function createPaymentController(
  req: Request,
  res: Response
) {
  const parsedOrderId = orderIdParamSchema.safeParse(req.params.orderId);

  if (!parsedOrderId.success) {
    throw badRequest("Invalid order ID");
  }

  const result = await createRazorpayOrder(
    getUserId(req),
    parsedOrderId.data
  );

  res.status(200).json({
    success: true,
    message: "Payment order created",
    data: result,
  });
}

export async function verifyPaymentController(
  req: Request,
  res: Response
) {
  const parsed = verifyPaymentSchema.safeParse(req.body);

  if (!parsed.success) {
    throw badRequest(
      parsed.error.issues[0]?.message ?? "Invalid payment details"
    );
  }

  const result = await verifyCheckoutPayment(
    getUserId(req),
    parsed.data
  );

  res.status(200).json({
    success: true,
    message: "Payment verification completed",
    data: result,
  });
}

export async function getPaymentStatusController(
  req: Request,
  res: Response
) {
  const parsedOrderId = orderIdParamSchema.safeParse(req.params.orderId);

  if (!parsedOrderId.success) {
    throw badRequest("Invalid order ID");
  }

  const result = await getPaymentStatus(
    getUserId(req),
    parsedOrderId.data
  );

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function createStandardOrderController(
  req: Request,
  res: Response
) {
  const { amount, currency, receipt, notes } = req.body || {};

  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return res.status(400).json({
      success: false,
      message: "Amount is required and must be a valid number",
    });
  }

  const amountPaise = Math.round(Number(amount));
  if (amountPaise < 100) {
    return res.status(400).json({
      success: false,
      message: "Minimum amount is 100 paise",
    });
  }

  try {
    const result = await createStandardRazorpayOrder({
      amount: amountPaise,
      currency: currency || "INR",
      receipt,
      notes,
    });

    return res.status(200).json({
      success: true,
      order_id: result.order_id,
      amount: result.amount,
      currency: result.currency,
      key_id: result.key_id,
      data: result,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
}

export async function verifyStandardPaymentController(
  req: Request,
  res: Response
) {
  const body = req.body || {};
  const orderId = body.razorpay_order_id || body.order_id;
  const paymentId = body.razorpay_payment_id || body.payment_id;
  const signature = body.razorpay_signature || body.signature;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required payment verification fields (order_id, payment_id, signature)",
    });
  }

  try {
    verifyStandardPaymentSignature({
      order_id: orderId,
      payment_id: paymentId,
      signature: signature,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order_id: orderId,
      payment_id: paymentId,
    });
  } catch (error: any) {
    const status = error.statusCode || 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
}
