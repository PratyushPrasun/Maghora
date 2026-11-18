import { Router } from "express";

import {
  createProduct,
  getProducts,
  getAdminProducts,
  getAdminProductById,
  getProductBySlug,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "./product.controller.js";

import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
} from "./product.validation.js";

import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

import {
  uploadProductImagesMiddleware,
} from "../../middlewares/upload.js";

import {
  parseMultipartData,
} from "../../middlewares/parseMultipartData.js";

const router = Router();

// Public product listing.
router.get("/", getProducts);

// Admin listing including inactive products.
// Keep this before /:slug.
router.get(
  "/manage",
  authenticate,
  authorize("admin", "super_admin"),
  getAdminProducts
);

// Admin single product details (including inactive).
router.get(
  "/manage/:id",
  authenticate,
  authorize("admin", "super_admin"),
  getAdminProductById
);

// Create product.
router.post(
  "/",
  authenticate,
  authorize("admin", "super_admin"),
  uploadProductImagesMiddleware,
  parseMultipartData,
  validate(createProductSchema),
  createProduct
);

// Update product status.
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "super_admin"),
  validate(updateProductStatusSchema),
  updateProductStatus
);

// Update product.
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  uploadProductImagesMiddleware,
  parseMultipartData,
  validate(updateProductSchema),
  updateProduct
);

// Soft-delete product.
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "super_admin"),
  deleteProduct
);

// Public product details.
router.get("/:slug", getProductBySlug);

export default router;