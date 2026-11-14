import crypto from "node:crypto";
import mongoose, { Types } from "mongoose";

import CartItem from "../cart/cart-item.model.js";
import Product from "../products/product.model.js";
import Order from "./order.model.js";
import Address from "../addresses/address.model.js";

const RESERVATION_DURATION_MS = 10 * 60 * 1000;

// Temporary development shipping policy.
// Replace this with a real server-side shipping calculation
// before accepting live payments.
function calculateShippingPaise(_subtotalPaise: number) {
    return 0;
}

function createError(message: string, statusCode: number) {
    return Object.assign(new Error(message), { statusCode });
}

type CreateOrderInput = {
    idempotencyKey: string;
    addressId: string;
    customerNotes: string;
};

export async function createOrder(
    userId: string,
    data: CreateOrderInput
) {
    // A retry with the same key returns the original order.
    const existingOrder = await Order.findOne({
        userId,
        idempotencyKey: data.idempotencyKey,
    });

    if (existingOrder) {
        return existingOrder;
    }

    const session = await mongoose.startSession();

    let createdOrder: any = null;

    try {
        await session.withTransaction(async () => {
            const address = await Address.findOne({
                _id: data.addressId,
                userId,
            }).session(session);

            if (!address) {
                throw createError(
                    "Selected delivery address not found",
                    404
                );
            }
            const cartItems = await CartItem.find({ userId }).session(session);

            if (cartItems.length === 0) {
                throw createError("Your cart is empty", 400);
            }

            const orderItems = [];
            let subtotalPaise = 0;

            for (const cartItem of cartItems) {
                // Read the latest product state inside the transaction.
                const product = await Product.findOne({
                    _id: cartItem.productId,
                    isActive: true,
                    isDeleted: false,
                }).session(session);

                if (!product) {
                    throw createError(
                        "A product in your cart is no longer available",
                        409
                    );
                }

                const variant = product.variants.find(
                    (item) =>
                        item._id.toString() === cartItem.variantId.toString()
                );

                if (!variant || !variant.isActive) {
                    throw createError(
                        `${product.name} has an unavailable variant`,
                        409
                    );
                }

                const availableStock =
                    variant.stockOnHand - variant.reservedStock;

                if (cartItem.quantity > availableStock) {
                    throw createError(
                        `Only ${availableStock} units of ${product.name} are available`,
                        409
                    );
                }

                // Conditional update prevents another checkout from
                // reserving the same available units concurrently.
                const reservationResult = await Product.updateOne(
                    {
                        _id: product._id,
                        isActive: true,
                        isDeleted: false,
                        variants: {
                            $elemMatch: {
                                _id: variant._id,
                                isActive: true,
                                stockOnHand: variant.stockOnHand,
                                reservedStock: variant.reservedStock,
                            },
                        },
                    },
                    {
                        $inc: {
                            "variants.$.reservedStock": cartItem.quantity,
                        },
                    },
                    { session }
                );

                if (reservationResult.modifiedCount !== 1) {
                    throw createError(
                        "Inventory changed while placing your order. Please retry.",
                        409
                    );
                }

                const lineTotalPaise =
                    variant.pricePaise * cartItem.quantity;

                subtotalPaise += lineTotalPaise;

                if (!Number.isSafeInteger(lineTotalPaise)) {
                    throw createError("Invalid product amount", 400);
                }

                const primaryImage = product.images.find(
                    (image) => image.isPrimary
                ) ?? product.images[0];

                orderItems.push({
                    productId: product._id,
                    variantId: variant._id,
                    productName: product.name,
                    sku: variant.sku,
                    weightGrams: variant.weightGrams,
                    imageUrl: primaryImage?.url ?? null,
                    pricePaise: variant.pricePaise,
                    mrpPaise: variant.mrpPaise,
                    quantity: cartItem.quantity,
                    lineTotalPaise,
                });
            }

            if (!Number.isSafeInteger(subtotalPaise)) {
                throw createError("Invalid order amount", 400);
            }

            const shippingPaise = calculateShippingPaise(subtotalPaise);
            const totalPaise = subtotalPaise + shippingPaise;

            if (!Number.isSafeInteger(totalPaise) || totalPaise <= 0) {
                throw createError("Invalid order total", 400);
            }

            const now = new Date();

            const orderNumber =
                `MG${Date.now()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

            const [order] = await Order.create(
                [
                    {
                        orderNumber,
                        idempotencyKey: data.idempotencyKey,
                        userId: new Types.ObjectId(userId),
                        items: orderItems,
                        shippingAddress: {
                            recipientName: address.recipientName,
                            phone: address.phone,
                            addressLine1: address.addressLine1,
                            addressLine2: address.addressLine2,
                            landmark: address.landmark,
                            city: address.city,
                            state: address.state,
                            postalCode: address.postalCode,
                            country: address.country,
                        },
                        customerNotes: data.customerNotes,
                        subtotalPaise,
                        shippingPaise,
                        totalPaise,
                        status: "pending_payment",
                        paymentStatus: "pending",
                        inventoryStatus: "reserved",
                        reservationExpiresAt: new Date(
                            now.getTime() + RESERVATION_DURATION_MS
                        ),
                    },
                ],
                { session }
            );

            // Clear the cart only if the order transaction commits.
            await CartItem.deleteMany({ userId }).session(session);

            createdOrder = order;
        });

        return createdOrder;
    } catch (error: any) {
        // Handles concurrent retries with the same idempotency key.
        if (error?.code === 11000) {
            const existing = await Order.findOne({
                userId,
                idempotencyKey: data.idempotencyKey,
            });

            if (existing) return existing;
        }

        throw error;
    } finally {
        await session.endSession();
    }
}