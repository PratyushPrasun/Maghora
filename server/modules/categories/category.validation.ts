import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),

  description: z.string().trim().max(500).default(""),
}).strict();

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),

  description: z.string().trim().max(500).optional(),
})
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" }
  );

  export const updateCategoryStatusSchema = z.object({
  isActive: z.boolean(),
}).strict();