import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

import {
  listCustomers,
  getCustomerDetail,
  getCustomerOrders,
} from "./user.admin-controller.js";

const router = Router();

// All customer management routes require admin or super_admin.
router.use(authenticate);
router.use(authorize("admin", "super_admin"));

router.get("/", listCustomers);
router.get("/:customerId", getCustomerDetail);
router.get("/:customerId/orders", getCustomerOrders);

export default router;
