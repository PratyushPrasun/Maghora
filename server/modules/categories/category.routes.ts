import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getAdminCategories,
  updateCategoryStatus,
} from "./category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
} from "./category.validation.js";

import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Public category listing.
router.get("/", getCategories);

// Public category details.
router.get("/:slug", getCategoryBySlug);

// Admin and Super Admin only.
router.post(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  validate(createCategorySchema),
  createCategory
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  deleteCategory
);

router.get(
  "/manage",
  authenticate,
  authorize("admin", "super_admin"),
  getAdminCategories
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "super_admin"),
  validate(updateCategoryStatusSchema),
  updateCategoryStatus
);
export default router;