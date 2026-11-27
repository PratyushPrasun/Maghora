import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import {
  downloadMyInvoicePdf,
  getMyInvoiceById,
  getMyInvoiceByOrder,
  getMyInvoices,
} from "./invoice.controller.js";

const router = Router();

router.use(authenticate);
router.use(authorize("customer", "admin", "super_admin"));

router.get("/my", getMyInvoices);
router.get("/order/:orderId", getMyInvoiceByOrder);
router.get("/:invoiceId", getMyInvoiceById);
router.get("/:invoiceId/download", downloadMyInvoicePdf);

export default router;
