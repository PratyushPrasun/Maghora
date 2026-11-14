import mongoose from "mongoose";

import Order from "./order.model.js";
import Product from "../products/product.model.js";

export async function expireOrderReservation(orderId: string) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Only one process can transition this reservation.
      const order = await Order.findOneAndUpdate(
        {
          _id: orderId,
          paymentStatus: "pending",
          inventoryStatus: "reserved",
          reservationExpiresAt: { $lte: new Date() },
        },
        {
          $set: {
            paymentStatus: "expired",
            inventoryStatus: "released",
            status: "cancelled",
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!order) return;

      for (const item of order.items) {
        const result = await Product.updateOne(
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

        if (result.modifiedCount !== 1) {
          // Abort the transaction. Never silently lose inventory.
          throw new Error(
            `Could not release inventory for order ${order.orderNumber}`
          );
        }
      }
    });
  } finally {
    await session.endSession();
  }
}

export async function expirePendingReservations() {
  const expiredOrders = await Order.find({
    paymentStatus: "pending",
    inventoryStatus: "reserved",
    reservationExpiresAt: { $lte: new Date() },
  })
    .select("_id")
    .limit(100)
    .lean();

  for (const order of expiredOrders) {
    try {
      await expireOrderReservation(order._id.toString());
    } catch (error) {
      console.error(
        `Reservation expiry failed for order ${order._id}:`,
        error
      );
    }
  }
}
