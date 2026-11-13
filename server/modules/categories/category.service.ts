import mongoose from "mongoose";

import Category from "./category.model.js";
import Product from "../products/product.model.js";

import {
  getCachedData,
  invalidateCatalogueCache,
} from "../../services/catalogue-cache.service.js";

const createSlug = (value: string): string => {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const badRequest = (message: string) =>
  Object.assign(new Error(message), { statusCode: 400 });

const notFound = (message: string) =>
  Object.assign(new Error(message), { statusCode: 404 });

const conflict = (message: string) =>
  Object.assign(new Error(message), { statusCode: 409 });

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  const slug = createSlug(data.name);

  if (!slug) {
    throw badRequest("Category name cannot create a valid slug");
  }

  const existing = await Category.findOne({ slug });

  if (existing) {
    throw conflict("A category with this name already exists");
  }

  const category = await Category.create({
    name: data.name,
    slug,
    description: data.description ?? "",
  });

  await invalidateCatalogueCache("categories");
  await invalidateCatalogueCache("products");

  return category;
};

export const listCategories = async (
  includeInactive = false
) => {
  return getCachedData(
    "categories",
    { includeInactive },
    async () => {
      const filter = includeInactive
        ? { isDeleted: false }
        : { isDeleted: false, isActive: true };

      return Category.find(filter)
        .select("name slug description isActive createdAt")
        .sort({ name: 1 })
        .lean();
    }
  );
};

export const getCategoryBySlug = async (
  slug: string
) => {
  return getCachedData(
    "categories",
    { slug },
    async () => {
      const category = await Category.findOne({
        slug,
        isActive: true,
        isDeleted: false,
      })
        .select("name slug description isActive")
        .lean();

      if (!category) {
        throw notFound("Category not found");
      }

      return category;
    }
  );
};

export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
  }
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest("Invalid category ID");
  }

  const category = await Category.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!category) {
    throw notFound("Category not found");
  }

  if (data.name !== undefined) {
    const slug = createSlug(data.name);

    if (!slug) {
      throw badRequest("Category name cannot create a valid slug");
    }

    const duplicate = await Category.findOne({
      _id: { $ne: category._id },
      slug,
      isDeleted: false,
    });

    if (duplicate) {
      throw conflict("A category with this name already exists");
    }

    category.name = data.name;
    category.slug = slug;
  }

  if (data.description !== undefined) {
    category.description = data.description;
  }

  await category.save();

  await invalidateCatalogueCache("categories");
  await invalidateCatalogueCache("products");

  return category;
};

export const deleteCategory = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest("Invalid category ID");
  }

  const category = await Category.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!category) {
    throw notFound("Category not found");
  }

  const associatedProducts = await Product.exists({
    category: category._id,
    isDeleted: false,
  });

  if (associatedProducts) {
    throw conflict(
      "Cannot delete a category that has associated products. Move or delete those products first."
    );
  }

  category.isDeleted = true;
  category.isActive = false;

  await category.save();

  await invalidateCatalogueCache("categories");
  await invalidateCatalogueCache("products");

  return category;
};

export const updateCategoryStatus = async (
  id: string,
  isActive: boolean
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest("Invalid category ID");
  }

  const category = await Category.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!category) {
    throw notFound("Category not found");
  }

  if (!isActive) {
    const associatedProducts = await Product.exists({
      category: category._id,
      isDeleted: false,
      isActive: true,
    });

    if (associatedProducts) {
      throw conflict(
        "Deactivate or move the active products before deactivating this category"
      );
    }
  }

  category.isActive = isActive;

  await category.save();

  await invalidateCatalogueCache("categories");
  await invalidateCatalogueCache("products");

  return category;
};