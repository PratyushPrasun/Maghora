import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";

import {
  addCartItemSchema,
  updateCartItemSchema,
  mergeCartSchema,
} from "./cart.validation.js";

import {
  getMyCart,
  addItem,
  updateItem,
  removeItem,
  clearMyCart,
  mergeCart,
} from "./cart.controller.js";

const router = Router();

// All cart operations require login.
router.use(authenticate);

router.get("/", getMyCart);

router.post(
  "/items",
  validate(addCartItemSchema),
  addItem
);

router.post(
  "/merge",
  validate(mergeCartSchema),
  mergeCart
);

router.patch(
  "/items/:itemId",
  validate(updateCartItemSchema),
  updateItem
);

router.delete("/items/:itemId", removeItem);

router.delete("/", clearMyCart);

export default router;