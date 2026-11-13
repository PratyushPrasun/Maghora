import { z } from "zod";

const variantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "SKU can contain only letters, numbers, hyphens and underscores"
    )
    .transform((value) => value.toUpperCase()),

  weightGrams: z.number().int().positive(),

  pricePaise: z.number().int().positive(),

  mrpPaise: z.number().int().positive(),

  stock: z.number().int().min(0),

  isActive: z.boolean().default(true),
}).refine(
  (variant) => variant.mrpPaise >= variant.pricePaise,
  {
    message: "MRP cannot be lower than selling price",
    path: ["mrpPaise"],
  }
);

const variantsSchema = z
  .array(variantSchema)
  .min(1)
  .max(20)
  .refine(
    (variants) =>
      new Set(variants.map((variant) => variant.sku)).size ===
      variants.length,
    {
      message: "Variant SKUs must be unique within a product",
    }
  );

const seoSchema = z.object({
  title: z.string().trim().max(70).default(""),
  description: z.string().trim().max(170).default(""),
}).default({
  title: "",
  description: "",
});

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),

  description: z.string().trim().min(10).max(5000),

  shortDescription: z.string().trim().max(250).default(""),

  category: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid category ID"
  ),

  variants: variantsSchema,

  isFeatured: z.boolean().default(false),

  seo: seoSchema,
}).strict();

export const updateProductSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),

  description: z.string().trim().min(10).max(5000).optional(),

  shortDescription: z.string().trim().max(250).optional(),

  category: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid category ID"
  ).optional(),

  variants: variantsSchema.optional(),

  isFeatured: z.boolean().optional(),

  seo: z.object({
    title: z.string().trim().max(70).optional(),
    description: z.string().trim().max(170).optional(),
  }).optional(),

  removeImagePublicIds: z.array(
    z.string().min(1)
  ).max(8).optional(),
})
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" }
  );

export const updateProductStatusSchema = z.object({
  isActive: z.boolean(),
}).strict();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(12),

  search: z.string().trim().max(100).optional(),

  category: z.string().trim().optional(),

  minPrice: z.coerce.number().int().min(0).optional(),

  maxPrice: z.coerce.number().int().min(0).optional(),

  sort: z.enum([
    "newest",
    "oldest",
    "name_asc",
    "name_desc",
  ]).default("newest"),
}).refine(
  (data) =>
    data.minPrice === undefined ||
    data.maxPrice === undefined ||
    data.minPrice <= data.maxPrice,
  {
    message: "Minimum price cannot exceed maximum price",
    path: ["minPrice"],
  }
);