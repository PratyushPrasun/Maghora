import type { Request, Response, NextFunction } from "express";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.service.js";

function getUserId(req: Request): string {
  if (!req.currentUser) {
    throw new Error("Authenticated user not found");
  }

  return req.currentUser._id.toString();
}

export async function getMyCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart = await getCart(getUserId(req));
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function addItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cart = await addCartItem(getUserId(req), req.body);

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cartItemId = req.params.itemId;

    if (typeof cartItemId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await updateCartItem(
      getUserId(req),
      cartItemId,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cartItemId = req.params.itemId;

    if (typeof cartItemId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await removeCartItem(
      getUserId(req),
      cartItemId
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function clearMyCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await clearCart(getUserId(req));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}