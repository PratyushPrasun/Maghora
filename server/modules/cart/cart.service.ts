import { Types } from "mongoose";

import CartItem from "./cart-item.model.js";
import Product from "../products/product.model.js";

type CartInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

function createError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}

async function getAvailableVariant(
  productId: string,
  variantId: string
) {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
    isDeleted: false,
  });

  if (!product) {
    throw createError("Product is unavailable", 404);
  }

  const variant = product.variants.find(
    (item) => item._id?.toString() === variantId
  );

  if (!variant || !variant.isActive) {
    throw createError("Product variant is unavailable", 404);
  }

  return { product, variant };
}

export async function getCart(userId: string) {
  const cartItems = await CartItem.find({ userId }).sort({
    createdAt: -1,
  });

  const productIds = [
    ...new Set(cartItems.map((item) => item.productId.toString())),
  ];

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  let subtotalPaise = 0;
  let hasUnavailableItems = false;

  const items = cartItems.map((cartItem) => {
    const product = productMap.get(cartItem.productId.toString());

    const variant = product?.variants.find(
      (item) => item._id?.toString() === cartItem.variantId.toString()
    );

    const available = Boolean(
      product &&
      product.isActive &&
      !product.isDeleted &&
      variant &&
      variant.isActive &&
      variant.stockOnHand - variant.reservedStock >= cartItem.quantity
    );

    if (!available) {
      hasUnavailableItems = true;
    }

    const pricePaise = variant?.pricePaise ?? 0;
    const mrpPaise = variant?.mrpPaise ?? 0;

    const lineTotalPaise = available
      ? pricePaise * cartItem.quantity
      : 0;

    subtotalPaise += lineTotalPaise;

    return {
      cartItemId: cartItem._id.toString(),
      productId: cartItem.productId.toString(),
      variantId: cartItem.variantId.toString(),

      productName: product?.name ?? "Unavailable product",
      productSlug: product?.slug ?? null,

      weightGrams: variant?.weightGrams ?? null,
      pricePaise,
      mrpPaise,

      quantity: cartItem.quantity,
      available,
      currentStock: variant
  ? variant.stockOnHand - variant.reservedStock
  : 0,
      lineTotalPaise,
    };
  });

  return {
    items,
    itemCount: items.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    subtotalPaise,
    hasUnavailableItems,
  };
}

export async function addCartItem(
  userId: string,
  data: CartInput
) {
  const { variant } = await getAvailableVariant(
    data.productId,
    data.variantId
  );

  if (data.quantity > variant.stockOnHand - variant.reservedStock) {
    throw createError(
      `Only ${variant.stockOnHand - variant.reservedStock} units are currently available`,
      409
    );
  }

  const existing = await CartItem.findOne({
    userId,
    variantId: data.variantId,
  });

  if (existing) {
    const newQuantity = existing.quantity + data.quantity;

    if (newQuantity > variant.stockOnHand - variant.reservedStock || newQuantity > 20) {
      throw createError(
        `Maximum available quantity is ${Math.min(variant.stockOnHand - variant.reservedStock, 20)}`,
        409
      );
    }

    existing.quantity = newQuantity;
    existing.productId = new Types.ObjectId(data.productId);

    await existing.save();

    return getCart(userId);
  }

  try {
    await CartItem.create({
      userId,
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
    });
  } catch (error: any) {
    // Another concurrent request may have created the same line.
    if (error?.code === 11000) {
      throw createError(
        "Cart item was updated by another request. Please retry.",
        409
      );
    }

    throw error;
  }

  return getCart(userId);
}

export async function updateCartItem(
  userId: string,
  cartItemId: string,
  quantity: number
) {
  const cartItem = await CartItem.findOne({
    _id: cartItemId,
    userId,
  });

  if (!cartItem) {
    throw createError("Cart item not found", 404);
  }

  const { variant } = await getAvailableVariant(
    cartItem.productId.toString(),
    cartItem.variantId.toString()
  );

  if (quantity > variant.stockOnHand - variant.reservedStock) {
    throw createError(
      `Only ${variant.stockOnHand - variant.reservedStock} units are currently available`,
      409
    );
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return getCart(userId);
}

export async function removeCartItem(
  userId: string,
  cartItemId: string
) {
  const result = await CartItem.deleteOne({
    _id: cartItemId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw createError("Cart item not found", 404);
  }

  return getCart(userId);
}

export async function clearCart(userId: string) {
  await CartItem.deleteMany({ userId });

  return {
    message: "Cart cleared successfully",
  };
}

/**
 * Merge guest cart items into the authenticated user's cart.
 *
 * This operation is **idempotent**: for each guest item, if the variant
 * already exists in the user's cart we take the *maximum* of the two
 * quantities (guest vs server) instead of blindly adding.  Re-running
 * the same merge therefore never inflates quantities.
 *
 * Invalid / unavailable products are silently skipped so a single bad
 * item cannot block the whole merge.
 */
export async function mergeGuestCart(
  userId: string,
  guestItems: CartInput[]
) {
  // De-duplicate guest items by variantId (take highest quantity)
  const deduped = new Map<string, CartInput>();
  for (const item of guestItems) {
    const existing = deduped.get(item.variantId);
    if (!existing || item.quantity > existing.quantity) {
      deduped.set(item.variantId, item);
    }
  }

  const errors: Array<{ variantId: string; reason: string }> = [];

  for (const [, guestItem] of deduped) {
    try {
      // Validate product + variant availability
      const { variant } = await getAvailableVariant(
        guestItem.productId,
        guestItem.variantId
      );

      const availableStock = variant.stockOnHand - variant.reservedStock;
      const cappedQty = Math.min(guestItem.quantity, availableStock, 20);

      if (cappedQty < 1) {
        errors.push({
          variantId: guestItem.variantId,
          reason: "Out of stock",
        });
        continue;
      }

      const existing = await CartItem.findOne({
        userId,
        variantId: guestItem.variantId,
      });

      if (existing) {
        // Idempotent merge: take the higher quantity (don't add)
        const mergedQty = Math.min(
          Math.max(existing.quantity, cappedQty),
          availableStock,
          20
        );
        if (mergedQty !== existing.quantity) {
          existing.quantity = mergedQty;
          existing.productId = new Types.ObjectId(guestItem.productId);
          await existing.save();
        }
      } else {
        try {
          await CartItem.create({
            userId,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            quantity: cappedQty,
          });
        } catch (err: any) {
          // Duplicate key – another concurrent merge already created it
          if (err?.code === 11000) {
            const concurrent = await CartItem.findOne({
              userId,
              variantId: guestItem.variantId,
            });
            if (concurrent) {
              const mergedQty = Math.min(
                Math.max(concurrent.quantity, cappedQty),
                availableStock,
                20
              );
              if (mergedQty !== concurrent.quantity) {
                concurrent.quantity = mergedQty;
                await concurrent.save();
              }
            }
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      errors.push({
        variantId: guestItem.variantId,
        reason: err?.message || "Unknown error",
      });
    }
  }

  const cart = await getCart(userId);

  return { cart, errors };
}