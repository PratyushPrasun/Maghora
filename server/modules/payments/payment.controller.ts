import type { Request, Response } from "express";

import {
  createRazorpayOrder,
  verifyCheckoutPayment,
  getPaymentStatus,
} from "./payment.service.js";

import {
  orderIdParamSchema,
  verifyPaymentSchema,
} from "./payment.validation.js";

function badRequest(message: string) {
  return Object.assign(new Error(message), { statusCode: 400 });
}

function getUserId(req: Request): string {
  const userId = req.currentUser?.id;

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