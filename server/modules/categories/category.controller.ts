import type { Request, Response } from "express";

import {
  createCategory as createCategoryService,
  listCategories as listCategoriesService,
  getCategoryBySlug as getCategoryBySlugService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  updateCategoryStatus as updateCategoryStatusService,
} from "./category.service.js";


export const createCategory = async (
  req: Request,
  res: Response
) => {
  const category = await createCategoryService(req.body);

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: { category },
  });
};

export const getCategories = async (
  req: Request,
  res: Response
) => {
  const includeInactive =
    req.currentUser?.role === "admin" ||
    req.currentUser?.role === "super_admin";

  const categories = await listCategoriesService(
    includeInactive
  );

  return res.status(200).json({
    success: true,
    data: { categories },
  });
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response
) => {
  const slug = req.params.slug;

  if (typeof slug !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid category slug",
    });
  }

  const category = await getCategoryBySlugService(slug);

  return res.status(200).json({
    success: true,
    data: { category },
  });
};

export const updateCategory = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  const category = await updateCategoryService(
    id,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: { category },
  });
};

export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  await deleteCategoryService(id);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};

export const getAdminCategories = async (
  _req: Request,
  res: Response
) => {
  const categories = await listCategoriesService(true);

  return res.status(200).json({
    success: true,
    data: { categories },
  });
};

export const updateCategoryStatus = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  const category = await updateCategoryStatusService(
    id,
    req.body.isActive
  );

  return res.status(200).json({
    success: true,
    message: "Category status updated successfully",
    data: { category },
  });
};