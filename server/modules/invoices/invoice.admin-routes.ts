import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  createInvoiceAdjustmentNoteAdmin,
  downloadInvoicePdfAdmin,
  generateInvoiceForOrderAdmin,
  getInvoiceByIdAdmin,
  getInvoiceSettingsAdmin,
  getInvoiceStatsAdmin,
  listInvoicesAdmin,
  updateInvoiceSettingsAdmin,
} from "./invoice.admin-controller.js";

const router = Router();

router.use(authenticate);
router.use(authorize("admin", "super_admin"));

router.get("/stats", getInvoiceStatsAdmin);
router.get("/settings", getInvoiceSettingsAdmin);
router.put("/settings", updateInvoiceSettingsAdmin);

router.get("/", listInvoicesAdmin);
router.post("/generate/:orderId", generateInvoiceForOrderAdmin);
router.post("/:invoiceId/notes", createInvoiceAdjustmentNoteAdmin);
router.get("/:invoiceId", getInvoiceByIdAdmin);
router.get("/:invoiceId/download", downloadInvoicePdfAdmin);

export default router;
