
import { Router } from "express";

import {
  createAdmin,
  getAdmins,
  updateAdmin,
  updateAdminStatus,
  getAdminAuditLogs,
} from "./admin.controller.js";

import {
  createAdminSchema,
  updateAdminSchema,
  updateAdminStatusSchema,
} from "./admin.validation.js";

import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";


const router = Router();

// Every admin-management route requires a fully authenticated Super Admin.
router.use(
  authenticate,
  authorize("super_admin")
);

// Create administrator.
router.post(
  "/",
  validate(createAdminSchema),
  createAdmin
);

// List administrators.
router.get("/", getAdmins);

// Read administrator audit history.
router.get("/audit-logs", getAdminAuditLogs);

// Activate/deactivate administrator.
router.patch(
  "/:id/status",
  validate(updateAdminStatusSchema),
  updateAdminStatus
);

// Update administrator details.
router.patch(
  "/:id",
  validate(updateAdminSchema),
  updateAdmin
);

export default router;
