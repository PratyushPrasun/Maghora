
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, "Password must contain at least 12 characters")
  .max(128);

export const createAdminSchema = z.object({
  name: z.string().trim().min(2).max(80),

  phone: z.string().trim().min(10).max(20),

  email: z.string().trim().email().max(254),

  password: passwordSchema,
});

export const updateAdminSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),

    phone: z.string().trim().min(10).max(20).optional(),

    email: z.string().trim().email().max(254).optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be provided",
    }
  );

export const updateAdminStatusSchema = z.object({
  isActive: z.boolean(),
});

export const adminListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});
