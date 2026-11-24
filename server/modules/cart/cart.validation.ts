import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

export const addCartItemSchema = z.object({
  productId: objectIdSchema,
  variantId: objectIdSchema,
  quantity: z.number().int().min(1).max(20),
}).strict();

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(20),
}).strict();

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectIdSchema,
        variantId: objectIdSchema,
        quantity: z.number().int().min(1).max(20),
      }).strict()
    )
    .min(1)
    .max(50),
}).strict();