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
    (item) => item._id.toString() === variantId
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
      (item) => item._id.toString() === cartItem.variantId.toString()
    );

    const available = Boolean(
      product &&
      product.isActive &&
      !product.isDeleted &&
      variant &&
      variant.isActive &&
      variant.stock >= cartItem.quantity
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
      currentStock: variant?.stock ?? 0,
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

  if (data.quantity > variant.stock) {
    throw createError(
      `Only ${variant.stock} units are currently available`,
      409
    );
  }

  const existing = await CartItem.findOne({
    userId,
    variantId: data.variantId,
  });

  if (existing) {
    const newQuantity = existing.quantity + data.quantity;

    if (newQuantity > variant.stock || newQuantity > 20) {
      throw createError(
        `Maximum available quantity is ${Math.min(variant.stock, 20)}`,
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

  if (quantity > variant.stock) {
    throw createError(
      `Only ${variant.stock} units are currently available`,
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