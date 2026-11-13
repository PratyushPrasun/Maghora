import mongoose, {
  type Types,
} from "mongoose";

import Product from "./product.model.js";
import Category from "../categories/category.model.js";

import type {
  UploadedImage,
} from "../../services/cloudinary.service.js";

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

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
};

const validateCategory = async (
  categoryId: string
) => {
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

// Create product.
export const createProduct = async (
  data: {
    name: string;
    description: string;
    shortDescription?: string;
    category: string;
    variants: {
      sku: string;
      weightGrams: number;
      pricePaise: number;
      mrpPaise: number;
      stock: number;
      isActive: boolean;
    }[];
    isFeatured?: boolean;
    seo?: {
      title?: string;
      description?: string;
    };
  },
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

      variants: data.variants,

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

// List products.
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
        { name: { $regex: escapedSearch, $options: "i" } },
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

// Get product details.
export const getProductBySlug = async (
  slug: string
) => {
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

      // Hide inactive variants from public catalogue.
      product.variants = product.variants.filter(
        (variant) => variant.isActive
      );

      return toPublicProduct(product);
    }
  );
};

// Update product.
export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    shortDescription?: string;
    category?: string;
    variants?: {
      sku: string;
      weightGrams: number;
      pricePaise: number;
      mrpPaise: number;
      stock: number;
      isActive: boolean;
    }[];
    isFeatured?: boolean;
    seo?: {
      title?: string;
      description?: string;
    };
    removeImagePublicIds?: string[];
  },
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

  if (data.category !== undefined) {
    await validateCategory(data.category);
    product.category = new mongoose.Types.ObjectId(data.category);
  }

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

  if (data.variants !== undefined) {
    const existingIdsBySku = new Map(
      product.variants.map((variant) => [
        variant.sku,
        variant._id,
      ])
    );

    product.variants = data.variants.map((variant) => ({
      ...variant,
      ...(existingIdsBySku.has(variant.sku)
        ? { _id: existingIdsBySku.get(variant.sku) }
        : {}),
    })) as typeof product.variants;
  }

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

const removeIds = requestedRemoveIds;

  const existingImages = product.images.filter(
    (image) => !removeIds.has(image.publicId)
  );

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
    throw badRequest("A product can have at most 8 images");
  }

  if (
    removeIds.size > 0 &&
    combinedImages.length === 0
  ) {
    throw badRequest("A product must have at least one image");
  }

  // Ensure exactly one primary image when images exist.
  if (combinedImages.length > 0) {
    const hasPrimary = combinedImages.some(
      (image) => image.isPrimary
    );

    if (!hasPrimary) {
      combinedImages[0].isPrimary = true;
    }
  }

  combinedImages.forEach((image, index) => {
    image.sortOrder = index;
  });

  product.images = combinedImages as typeof product.images;

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
    removedImagePublicIds: [...removeIds],
  };
};

// Activate/deactivate product.
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

  product.isActive = isActive;

  await product.save();

  await invalidateCatalogueCache("products");

  return product;
};

// Soft-delete product.
export const deleteProduct = async (
  id: string
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

  product.isDeleted = true;
  product.isActive = false;

  await product.save();

  await invalidateCatalogueCache("products");

  return product;
};

const toPublicProduct = (product: any) => ({
  ...product,

  images: product.images.map((image: any) => ({
    url: image.url,
    alt: image.alt,
    isPrimary: image.isPrimary,
    sortOrder: image.sortOrder,
  })),

  variants: product.variants
    .filter((variant: any) => variant.isActive)
    .map((variant: any) => ({
      _id: variant._id,
      weightGrams: variant.weightGrams,
      pricePaise: variant.pricePaise,
      mrpPaise: variant.mrpPaise,
      isAvailable: variant.stock > 0,
    })),
});