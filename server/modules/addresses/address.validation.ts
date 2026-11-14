import { z } from "zod";

const addressFields = {
  label: z.enum(["home", "office", "other"]),

  customLabel: z.string().trim().max(50).default(""),

  recipientName: z.string().trim().min(2).max(100),

  phone: z.string().trim().regex(
    /^\+?[0-9]{10,15}$/,
    "Enter a valid phone number"
  ),

  addressLine1: z.string().trim().min(5).max(200),

  addressLine2: z.string().trim().max(200).default(""),

  landmark: z.string().trim().max(100).default(""),

  city: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  postalCode: z.string().regex(
    /^[0-9]{6}$/,
    "Enter a valid 6-digit Indian PIN code"
  ),

  country: z.literal("India").default("India"),

  isDefault: z.boolean().default(false),
};

export const createAddressSchema = z.object(
  addressFields
).strict().superRefine((data, ctx) => {
  if (data.label === "other" && !data.customLabel.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["customLabel"],
      message: "Please provide a custom address label",
    });
  }

  if (data.label !== "other" && data.customLabel) {
    ctx.addIssue({
      code: "custom",
      path: ["customLabel"],
      message: "Custom label is only allowed for Other addresses",
    });
  }
});

export const updateAddressSchema = z.object({
  ...addressFields,
}).partial().strict().superRefine((data, ctx) => {
  if (data.label === "other" && !data.customLabel?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["customLabel"],
      message: "Please provide a custom address label",
    });
  }
});

export const defaultAddressSchema = z.object({
  isDefault: z.boolean(),
}).strict();