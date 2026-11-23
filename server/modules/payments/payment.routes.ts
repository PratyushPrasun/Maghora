import { Router } from "express";

import {
  createPaymentController,
  verifyPaymentController,
  getPaymentStatusController,
  createStandardOrderController,
  verifyStandardPaymentController,
} from "./payment.controller.js";

import {
  razorpayWebhookController,
} from "./payment.webhook.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Public webhook endpoint, protected by Razorpay's HMAC signature.
router.post("/webhook", razorpayWebhookController);

// Standard Razorpay Checkout endpoints
router.post("/create-order", createStandardOrderController);
router.post("/verify-payment", verifyStandardPaymentController);

// All remaining payment endpoints require customer authentication.
router.use(authenticate);
router.use(authorize("customer"));

router.post(
  "/create/:orderId",
  createPaymentController
);

router.post(
  "/verify",
  verifyPaymentController
);

router.get(
  "/:orderId",
  getPaymentStatusController
);

export default router;