import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import User from "./user.model.js";
import Order from "../orders/order.model.js";
import Address from "../addresses/address.model.js";

/**
 * GET /api/admin/customers
 * Paginated customer list with order count and spending aggregation.
 * Supports search (name, email, phone), registration date range,
 * account status, order activity filter, and server-side sorting.
 */
export async function listCustomers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const matchStage: Record<string, any> = { role: "customer" };

    // Search by name, email, or phone
    if (req.query.search && typeof req.query.search === "string") {
      const search = req.query.search.trim();
      if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchStage.$or = [
          { name: { $regex: escaped, $options: "i" } },
          { email: { $regex: escaped, $options: "i" } },
          { phone: { $regex: escaped, $options: "i" } },
        ];
      }
    }

    // Filter by active status
    if (req.query.isActive === "true" || req.query.isActive === "false") {
      matchStage.isActive = req.query.isActive === "true";
    }

    // Filter by registration date range
    if (req.query.registeredAfter || req.query.registeredBefore) {
      matchStage.createdAt = {};
      if (req.query.registeredAfter && typeof req.query.registeredAfter === "string") {
        const after = new Date(req.query.registeredAfter);
        if (!isNaN(after.getTime())) {
          matchStage.createdAt.$gte = after;
        }
      }
      if (req.query.registeredBefore && typeof req.query.registeredBefore === "string") {
        const before = new Date(req.query.registeredBefore);
        if (!isNaN(before.getTime())) {
          before.setHours(23, 59, 59, 999);
          matchStage.createdAt.$lte = before;
        }
      }
      if (Object.keys(matchStage.createdAt).length === 0) {
        delete matchStage.createdAt;
      }
    }

    const orderActivity = req.query.orderActivity as string | undefined;
    const sortParam = req.query.sort as string | undefined;

    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortParam === "oldest") {
      sortStage = { createdAt: 1 };
    } else if (sortParam === "highest_spending") {
      sortStage = { totalSpentPaise: -1, createdAt: -1 };
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orderDocs",
          pipeline: [
            {
              $project: {
                totalPaise: 1,
                paymentStatus: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orderDocs" },
          totalSpentPaise: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$orderDocs",
                    as: "ord",
                    cond: { $eq: ["$$ord.paymentStatus", "paid"] },
                  },
                },
                as: "paidOrd",
                in: "$$paidOrd.totalPaise",
              },
            },
          },
          paidOrderCount: {
            $size: {
              $filter: {
                input: "$orderDocs",
                as: "ord",
                cond: { $eq: ["$$ord.paymentStatus", "paid"] },
              },
            },
          },
          lastOrderDate: { $max: "$orderDocs.createdAt" },
        },
      },
      {
        $project: {
          password: 0,
          authVersion: 0,
          orderDocs: 0,
          role: 0,
        },
      },
    ];

    if (orderActivity === "with_orders") {
      pipeline.push({ $match: { totalOrders: { $gt: 0 } } });
    } else if (orderActivity === "no_orders") {
      pipeline.push({ $match: { totalOrders: 0 } });
    }

    pipeline.push(
      { $sort: sortStage },
      {
        $facet: {
          customers: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      }
    );

    const [aggResult] = await User.aggregate(pipeline);
    const customers = aggResult?.customers || [];
    const total = aggResult?.totalCount?.[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        customers,
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
 * GET /api/admin/customers/:customerId
 * Complete customer profile with personal info, saved addresses, and purchase summary.
 */
export async function getCustomerDetail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const customerId = req.params.customerId as string;

    if (!mongoose.isValidObjectId(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customerOid = new mongoose.Types.ObjectId(customerId);

    const customer = await User.findOne({
      _id: customerOid,
      role: "customer",
    })
      .select("name phone email role isActive createdAt updatedAt")
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const addresses = await Address.find({ userId: customerOid })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    const purchaseSummary = await Order.aggregate([
      { $match: { userId: customerOid } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalPaidPaise: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "paid"] },
                "$totalPaise",
                0,
              ],
            },
          },
          paidOrderCount: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "paid"] },
                1,
                0,
              ],
            },
          },
          totalRefundedPaise: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "refunded"] },
                "$totalPaise",
                0,
              ],
            },
          },
          refundedOrderCount: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "refunded"] },
                1,
                0,
              ],
            },
          },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    const summary = purchaseSummary[0] || {
      totalOrders: 0,
      totalPaidPaise: 0,
      paidOrderCount: 0,
      totalRefundedPaise: 0,
      refundedOrderCount: 0,
      lastOrderDate: null,
    };

    const averageOrderValuePaise =
      summary.paidOrderCount > 0
        ? Math.round(summary.totalPaidPaise / summary.paidOrderCount)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        customer,
        addresses,
        purchaseSummary: {
          totalOrders: summary.totalOrders,
          paidOrderCount: summary.paidOrderCount,
          totalPaidPaise: summary.totalPaidPaise,
          totalRefundedPaise: summary.totalRefundedPaise,
          refundedOrderCount: summary.refundedOrderCount,
          averageOrderValuePaise,
          lastOrderDate: summary.lastOrderDate,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/customers/:customerId/orders
 * Paginated order history for a specific customer.
 */
export async function getCustomerOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const customerId = req.params.customerId as string;

    if (!mongoose.isValidObjectId(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      userId: new mongoose.Types.ObjectId(customerId),
    };

    const [orders, total] = await Promise.all([
      Order.find(filter)
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
