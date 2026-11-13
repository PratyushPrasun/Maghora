import type { Request, Response } from "express";

import {
  createProduct as createProductService,
  listProducts as listProductsService,
  getProductBySlug as getProductBySlugService,
  updateProduct as updateProductService,
  updateProductStatus as updateProductStatusService,
  deleteProduct as deleteProductService,
} from "./product.service.js";

import {
  uploadProductImages,
  deleteCloudinaryImages,
} from "../../services/cloudinary.service.js";

import {
  productQuerySchema,
} from "./product.validation.js";

const getFiles = (req: Request): Express.Multer.File[] => {
  return (req.files as Express.Multer.File[] | undefined) ?? [];
};

// Create product.
export const createProduct = async (
  req: Request,
  res: Response
) => {
  const uploadedImages = await uploadProductImages(
    getFiles(req)
  );

  try {
    const product = await createProductService(
      req.body,
      uploadedImages
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    await deleteCloudinaryImages(
      uploadedImages.map((image) => image.publicId)
    ).catch((cleanupError) => {
      console.error("Cloudinary cleanup failed:", cleanupError);
    });

    throw error;
  }
};

// Public product listing.
export const getProducts = async (
  req: Request,
  res: Response
) => {
  const parsed = productQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid product filters",
      errors: parsed.error.issues,
    });
  }

  const result = await listProductsService(
    parsed.data,
    false
  );

  return res.status(200).json({
    success: true,
    data: result,
  });
};

// Admin product listing, including inactive products.
export const getAdminProducts = async (
  req: Request,
  res: Response
) => {
  const parsed = productQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid product filters",
      errors: parsed.error.issues,
    });
  }

  const result = await listProductsService(
    parsed.data,
    true
  );

  return res.status(200).json({
    success: true,
    data: result,
  });
};

// Public product details.
export const getProductBySlug = async (
  req: Request,
  res: Response
) => {
  const slug = req.params.slug;

  if (typeof slug !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid product slug",
    });
  }

  const product = await getProductBySlugService(slug);

  return res.status(200).json({
    success: true,
    data: { product },
  });
};

// Update product.
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const uploadedImages = await uploadProductImages(
    getFiles(req)
  );

  try {
    const result = await updateProductService(
      id,
      req.body,
      uploadedImages
    );

    // Database update has succeeded. Old images are no longer
    // referenced, so delete them from Cloudinary.
    await deleteCloudinaryImages(
      result.removedImagePublicIds
    ).catch((error) => {
      console.error("Old product image cleanup failed:", error);
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: result.product },
    });
  } catch (error) {
    // Do not delete images that have already been saved in MongoDB.
    await deleteCloudinaryImages(
      uploadedImages.map((image) => image.publicId)
    ).catch((cleanupError) => {
      console.error("New image cleanup failed:", cleanupError);
    });

    throw error;
  }
};

// Activate/deactivate product.
export const updateProductStatus = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const product = await updateProductStatusService(
    id,
    req.body.isActive
  );

  return res.status(200).json({
    success: true,
    message: "Product status updated successfully",
    data: { product },
  });
};

// Soft-delete product.
export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  await deleteProductService(id);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};