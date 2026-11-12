import "dotenv/config";
import { z } from "zod";

const originSchema = z.string().url().transform(
  (value) => new URL(value).origin
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),

  CLIENT_URL: originSchema,
  ADMIN_URL: originSchema,
  FRONTEND_URL: originSchema,

  SESSION_SECRET: z.string().min(32),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
