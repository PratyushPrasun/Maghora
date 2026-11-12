
import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Phone number is required")
  .max(20, "Invalid phone number");

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(128, "Password is too long");

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),

  phone: phoneSchema,

  email: z.string().trim().email().max(254),

  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),

  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32),

  password: passwordSchema,

  confirmPassword: passwordSchema,
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);


export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),

  password: passwordSchema,

  confirmPassword: passwordSchema,
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
).refine(
  (data) => data.currentPassword !== data.password,
  {
    message: "New password must be different from the current password",
    path: ["password"],
  }
);
