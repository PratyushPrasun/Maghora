import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

import {
  listAllOrders,
  getRecentOrders,
  getOrderStats,
  getOrderById,
  updateOrderStatus,
} from "./order.admin-controller.js";

const router = Router();

// All admin order routes require admin or super_admin authentication.
router.use(authenticate);
router.use(authorize("admin", "super_admin"));

// Dashboard endpoints
router.get("/recent", getRecentOrders);
router.get("/stats", getOrderStats);

// Order management
router.get("/", listAllOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/status", updateOrderStatus);

export default router;
