import { Router } from "express";

import {
  createPaymentController,
  verifyPaymentController,
  getPaymentStatusController,
} from "./payment.controller.js";

import {
  razorpayWebhookController,
} from "./payment.webhook.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Public endpoint, but protected by Razorpay's HMAC signature.
router.post("/webhook", razorpayWebhookController);

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