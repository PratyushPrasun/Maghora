import mongoose from "mongoose";

import Product from "./product.model.js";
import Category from "../categories/category.model.js";

import type {
  UploadedImage,
} from "../../services/cloudinary.service.js";

import {
  getCachedData,
  invalidateCatalogueCache,
} from "../../services/catalogue-cache.service.js";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

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

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
};

const validateCategory = async (categoryId: string) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw badRequest("Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
    isDeleted: false,
  });

  if (!category) {
    throw badRequest("Selected category is unavailable");
  }

  return category;
};

const buildProductSlug = (name: string): string => {
  const slug = createSlug(name);

  if (!slug) {
    throw badRequest("Product name cannot create a valid slug");
  }

  return slug;
};

// --------------------------------------------------
// CREATE PRODUCT
// --------------------------------------------------

export interface CreateProductInput {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;

  variants: {
    sku: string;
    weightGrams: number;
    pricePaise: number;
    mrpPaise: number;
    stockOnHand: number;
    isActive: boolean;
  }[];

  isFeatured?: boolean;

  seo?: {
    title?: string;
    description?: string;
  };
}

export const createProduct = async (
  data: CreateProductInput,
  uploadedImages: UploadedImage[]
) => {
  await validateCategory(data.category);

  const slug = buildProductSlug(data.name);

  try {
    const product = await Product.create({
      name: data.name,
      slug,
      description: data.description,
      shortDescription: data.shortDescription ?? "",
      category: data.category,

      images: uploadedImages.map((image, index) => ({
        ...image,
        alt: data.name,
        isPrimary: index === 0,
        sortOrder: index,
      })),

      variants: data.variants.map((variant) => ({
        sku: variant.sku,
        weightGrams: variant.weightGrams,
        pricePaise: variant.pricePaise,
        mrpPaise: variant.mrpPaise,
        isActive: variant.isActive,

        // Initial physical inventory.
        stockOnHand: variant.stockOnHand ?? 0,

        // Reserved stock is never supplied during product creation.
        reservedStock: 0,
      })),

      isFeatured: data.isFeatured ?? false,

      seo: {
        title: data.seo?.title ?? "",
        description: data.seo?.description ?? "",
      },
    });

    await invalidateCatalogueCache("products");

    return product;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflict(
        "Product slug or variant SKU already exists"
      );
    }

    throw error;
  }
};

// --------------------------------------------------
// LIST PRODUCTS
// --------------------------------------------------

export interface ProductListOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "newest" | "oldest" | "name_asc" | "name_desc";
}

export const listProducts = async (
  options: ProductListOptions,
  includeInactive = false
) => {
  const fetchProducts = async () => {
    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (!includeInactive) {
      filter.isActive = true;
    }

    if (options.search) {
      const escapedSearch = options.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    if (options.category) {
      const category = await Category.findOne({
        slug: options.category,
        isDeleted: false,
        ...(includeInactive ? {} : { isActive: true }),
      }).select("_id");

      if (!category) {
        return {
          products: [],
          pagination: {
            total: 0,
            page: options.page,
            limit: options.limit,
            totalPages: 0,
          },
        };
      }

      filter.category = category._id;
    }

    if (
      options.minPrice !== undefined ||
      options.maxPrice !== undefined
    ) {
      const priceFilter: Record<string, number> = {};

      if (options.minPrice !== undefined) {
        priceFilter.$gte = options.minPrice;
      }

      if (options.maxPrice !== undefined) {
        priceFilter.$lte = options.maxPrice;
      }

      filter.variants = {
        $elemMatch: {
          ...(includeInactive ? {} : { isActive: true }),
          pricePaise: priceFilter,
        },
      };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    } as const;

    const skip = (options.page - 1) * options.limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(
          "name slug shortDescription category images variants isFeatured createdAt"
        )
        .populate("category", "name slug")
        .sort(sortMap[options.sort])
        .skip(skip)
        .limit(options.limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    return {
      products: products.map(toPublicProduct),

      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  };

  // Admin listings are not cached.
  if (includeInactive) {
    return fetchProducts();
  }

  return getCachedData(
    "products",
    options,
    fetchProducts
  );
};

// --------------------------------------------------
// GET PRODUCT BY SLUG
// --------------------------------------------------

export const getProductBySlug = async (slug: string) => {
  return getCachedData(
    "products",
    { productSlug: slug },
    async () => {
      const product = await Product.findOne({
        slug,
        isActive: true,
        isDeleted: false,
      })
        .populate("category", "name slug")
        .lean();

      if (!product) {
        throw notFound("Product not found");
      }

      return toPublicProduct(product);
    }
  );
};

// --------------------------------------------------
// UPDATE PRODUCT
// --------------------------------------------------

export interface UpdateProductInput {
  name?: string;
  description?: string;
  shortDescription?: string;
  category?: string;

  variants?: {
    variantId?: string;
    sku: string;
    weightGrams: number;
    pricePaise: number;
    mrpPaise: number;
    isActive: boolean;
  }[];

  isFeatured?: boolean;

  seo?: {
    title?: string;
    description?: string;
  };

  removeImagePublicIds?: string[];
}

export const updateProduct = async (
  id: string,
  data: UpdateProductInput,
  uploadedImages: UploadedImage[]
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest("Invalid product ID");
  }

  const product = await Product.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!product) {
    throw notFound("Product not found");
  }

  // ----------------------------------------------
  // CATEGORY
  // ----------------------------------------------

  if (data.category !== undefined) {
    await validateCategory(data.category);

    product.category = new mongoose.Types.ObjectId(
      data.category
    );
  }

  // ----------------------------------------------
  // BASIC PRODUCT DETAILS
  // ----------------------------------------------

  if (data.name !== undefined) {
    product.name = data.name;
    product.slug = buildProductSlug(data.name);
  }

  if (data.description !== undefined) {
    product.description = data.description;
  }

  if (data.shortDescription !== undefined) {
    product.shortDescription = data.shortDescription;
  }

  if (data.isFeatured !== undefined) {
    product.isFeatured = data.isFeatured;
  }

  if (data.seo !== undefined) {
    product.seo = {
      title: data.seo.title ?? product.seo.title,
      description:
        data.seo.description ?? product.seo.description,
    };
  }

  // ----------------------------------------------
  // VARIANT UPDATES
  // ----------------------------------------------

  if (data.variants !== undefined) {
    const existingVariantsById = new Map(
      product.variants.map((variant) => [
        variant._id.toString(),
        variant,
      ])
    );

    const existingVariantsBySku = new Map(
      product.variants.map((variant) => [
        variant.sku,
        variant,
      ])
    );

    const usedVariantIds = new Set<string>();
    const usedSkus = new Set<string>();

    const updatedVariants = data.variants.map((variant) => {
      if (usedSkus.has(variant.sku)) {
        throw badRequest(
          "Duplicate SKU in product variants"
        );
      }

      usedSkus.add(variant.sku);

      let existingVariant;

      // Prefer variantId when editing an existing variant.
      if (variant.variantId !== undefined) {
        if (!mongoose.isValidObjectId(variant.variantId)) {
          throw badRequest("Invalid variant ID");
        }

        existingVariant = existingVariantsById.get(
          variant.variantId
        );

        if (!existingVariant) {
          throw badRequest(
            "Variant does not belong to this product"
          );
        }
      } else {
        // Fallback when the SKU has not changed.
        existingVariant = existingVariantsBySku.get(
          variant.sku
        );
      }

      if (existingVariant) {
        const existingId = existingVariant._id.toString();

        if (usedVariantIds.has(existingId)) {
          throw badRequest(
            "Duplicate variant reference"
          );
        }

        usedVariantIds.add(existingId);

        return {
          _id: existingVariant._id,

          sku: variant.sku,
          weightGrams: variant.weightGrams,
          pricePaise: variant.pricePaise,
          mrpPaise: variant.mrpPaise,
          isActive: variant.isActive,

          // CRITICAL:
          // Preserve inventory from MongoDB.
          // Never accept inventory from product update input.

          stockOnHand: existingVariant.stockOnHand ?? 0,
          reservedStock: existingVariant.reservedStock ?? 0,
        };
      }

      // New variants always start with zero inventory.
      return {
        sku: variant.sku,
        weightGrams: variant.weightGrams,
        pricePaise: variant.pricePaise,
        mrpPaise: variant.mrpPaise,
        isActive: variant.isActive,

        stockOnHand: 0,
        reservedStock: 0,
      };
    });

    // --------------------------------------------
    // PREVENT REMOVING EXISTING VARIANTS
    // --------------------------------------------

    const removedVariants = product.variants.filter(
      (variant) =>
        !usedVariantIds.has(variant._id.toString())
    );

    if (removedVariants.length > 0) {
      throw conflict(
        "Existing variants cannot be removed. Deactivate variants instead to preserve cart and order references."
      );
    }

    product.set("variants", updatedVariants);
  }

  // ----------------------------------------------
  // IMAGE REMOVAL VALIDATION
  // ----------------------------------------------

  const requestedRemoveIds = new Set(
    data.removeImagePublicIds ?? []
  );

  const existingPublicIds = new Set(
    product.images.map((image) => image.publicId)
  );

  for (const publicId of requestedRemoveIds) {
    if (!existingPublicIds.has(publicId)) {
      throw badRequest(
        "One or more image IDs do not belong to this product"
      );
    }
  }

  const existingImages = product.images.filter(
    (image) => !requestedRemoveIds.has(image.publicId)
  );

  // ----------------------------------------------
  // ADD NEW IMAGES
  // ----------------------------------------------

  const newImages = uploadedImages.map((image) => ({
    ...image,
    alt: product.name,
    isPrimary: false,
    sortOrder: existingImages.length,
  }));

  const combinedImages = [
    ...existingImages,
    ...newImages,
  ];

  if (combinedImages.length > 8) {
    throw badRequest(
      "A product can have at most 8 images"
    );
  }

  if (
    requestedRemoveIds.size > 0 &&
    combinedImages.length === 0
  ) {
    throw badRequest(
      "A product must have at least one image"
    );
  }

  // ----------------------------------------------
  // ENSURE EXACTLY ONE PRIMARY IMAGE
  // ----------------------------------------------

  if (combinedImages.length > 0) {
    const existingPrimaryIndex = combinedImages.findIndex(
      (image) => image.isPrimary
    );

    const primaryIndex =
      existingPrimaryIndex >= 0
        ? existingPrimaryIndex
        : 0;

    combinedImages.forEach((image, index) => {
      image.isPrimary = index === primaryIndex;
      image.sortOrder = index;
    });
  }

  product.set("images", combinedImages);

  // ----------------------------------------------
  // SAVE PRODUCT
  // ----------------------------------------------

  try {
    await product.save();
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflict(
        "Product slug or variant SKU already exists"
      );
    }

    throw error;
  }

  await invalidateCatalogueCache("products");

  return {
    product,
    removedImagePublicIds: [...requestedRemoveIds],
  };
};

// --------------------------------------------------
// ACTIVATE / DEACTIVATE PRODUCT
// --------------------------------------------------

export const updateProductStatus = async (
  id: string,
  isActive: boolean
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest("Invalid product ID");
  }

  const product = await Product.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!product) {
    throw notFound("Product not found");
  }

  // A product can only be activated under an active category.
  if (isActive) {
    await validateCategory(product.category.toString());
  }

  product.isActive = isActive;

  await product.save();

  await invalidateCatalogueCache("products");

  return product;
};

// --------------------------------------------------
// SOFT DELETE PRODUCT
// --------------------------------------------------

export const deleteProduct = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest("Invalid product ID");
  }

  const product = await Product.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!product) {
    throw notFound("Product not found");
  }

  product.isDeleted = true;
  product.isActive = false;

  await product.save();

  await invalidateCatalogueCache("products");

  return product;
};

// --------------------------------------------------
// PUBLIC PRODUCT TRANSFORMATION
// --------------------------------------------------

const toPublicProduct = (product: any) => ({
  ...product,

  // Never expose Cloudinary public IDs.
  images: (product.images ?? []).map((image: any) => ({
    url: image.url,
    alt: image.alt,
    isPrimary: image.isPrimary,
    sortOrder: image.sortOrder,
  })),

  // Never expose SKU, exact inventory or reserved stock.
  variants: (product.variants ?? [])
    .filter((variant: any) => variant.isActive)
    .map((variant: any) => ({
      _id: variant._id,
      weightGrams: variant.weightGrams,
      pricePaise: variant.pricePaise,
      mrpPaise: variant.mrpPaise,

      isAvailable:
        (variant.stockOnHand ?? 0) -
          (variant.reservedStock ?? 0) >
        0,
    })),
});
