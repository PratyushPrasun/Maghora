import type { Request, Response, NextFunction } from "express";

import Order from "./order.model.js";
import { createOrder } from "./order.service.js";

function getUserId(req: Request) {
  if (!req.currentUser) {
    throw new Error("Authenticated user not found");
  }

  return req.currentUser._id.toString();
}

export async function placeOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await createOrder(getUserId(req), req.body);

    res.status(201).json({
      success: true,
      message: "Order created. Complete payment within 10 minutes.",
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalPaise: order.totalPaise,
        reservationExpiresAt: order.reservationExpiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await Order.find({
      userId: getUserId(req),
    })
      .sort({ createdAt: -1 })
      .select(
        "orderNumber items subtotalPaise shippingPaise totalPaise status paymentStatus createdAt"
      );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orderId = req.params.orderId;

    if (typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: getUserId(req),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
