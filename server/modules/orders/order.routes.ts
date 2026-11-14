import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";

import { createOrderSchema } from "./order.validation.js";

import {
  placeOrder,
  getMyOrders,
  getMyOrderById,
} from "./order.controller.js";

const router = Router();

router.use(authenticate);
router.use(authorize("customer"));

router.post(
  "/",
  validate(createOrderSchema),
  placeOrder
);

router.get("/", getMyOrders);

router.get("/:orderId", getMyOrderById);

export default router;
