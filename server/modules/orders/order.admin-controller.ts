import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Order from "./order.model.js";
import User from "../users/user.model.js";

/**
 * GET /api/admin/orders
 * List all orders with pagination, search, and filters.
 * Populates userId to include customer name, email, phone.
 */
export async function listAllOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    // Status filter
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    // Payment status filter
    if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
      filter.paymentStatus = req.query.paymentStatus;
    }

    // Search by order number
    if (req.query.search && typeof req.query.search === "string") {
      const search = req.query.search.trim();
      if (search) {
        filter.orderNumber = { $regex: search, $options: "i" };
      }
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate as string);
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/orders/recent
 * Returns the latest N orders for the dashboard.
 */
export async function getRecentOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));

    const orders = await Order.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/orders/stats
 * Dashboard summary statistics.
 */
export async function getOrderStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [
      totalOrders,
      statusCounts,
      revenuePipeline,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenuePaise: { $sum: "$totalPaise" },
            orderCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusMap: Record<string, number> = {};
    for (const s of statusCounts) {
      statusMap[s._id] = s.count;
    }

    const revenue = revenuePipeline[0] || {
      totalRevenuePaise: 0,
      orderCount: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        statusBreakdown: statusMap,
        totalRevenuePaise: revenue.totalRevenuePaise,
        paidOrderCount: revenue.orderCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/orders/:orderId
 * Get a single order by ID with full details (admin view).
 */
export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId)
      .populate("userId", "name email phone createdAt")
      .lean();

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

/**
 * PATCH /api/admin/orders/:orderId/status
 * Update order fulfilment status.
 */
export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const validStatuses = [
      "pending_payment",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    )
      .populate("userId", "name email phone")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
