import { z } from "zod";

export const updateInvoiceSettingsSchema = z
  .object({
    brandName: z.string().trim().min(2).max(80).optional(),
    tagline: z.string().trim().min(2).max(120).optional(),
    legalName: z.string().trim().min(2).max(120).optional(),
    gstin: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid Indian GSTIN format (15 characters)"
      )
      .optional(),
    isGstRegistered: z.boolean().optional(),
    businessAddress: z
      .object({
        addressLine1: z.string().trim().max(200).optional(),
        addressLine2: z.string().trim().max(200).optional(),
        city: z.string().trim().max(80).optional(),
        state: z.string().trim().max(80).optional(),
        stateCode: z
          .string()
          .trim()
          .regex(/^$|^\d{2}$/, "State code must be 2 digits")
          .optional(),
        postalCode: z
          .string()
          .trim()
          .regex(/^$|^\d{6}$/, "PIN code must be 6 digits")
          .optional(),
        country: z.string().trim().max(60).optional(),
      })
      .optional(),
    contactNumber: z.string().trim().max(30).optional(),
    supportEmail: z.string().trim().email("Invalid support email").optional(),
    website: z.string().trim().url("Invalid website URL").optional(),
    returnPolicyUrl: z
      .string()
      .trim()
      .url("Invalid return policy URL")
      .optional(),
    invoicePrefix: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9]{2,10}$/, "Prefix must be 2-10 alphanumeric characters")
      .optional(),
    defaultHsnCode: z.string().trim().min(2).max(20).optional(),
    defaultGstRate: z.number().min(0).max(28).optional(),
    shippingGstRate: z.number().min(0).max(28).optional(),
    pricesIncludeGst: z.boolean().optional(),
    footerNote: z.string().trim().max(200).optional(),
    footerTagline: z.string().trim().max(200).optional(),
    termsAndConditions: z.string().trim().max(1000).optional(),
  })
  .strict();

export const adminInvoiceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(15),
  search: z.string().trim().max(100).optional(),
  paymentStatus: z.string().trim().optional(),
  invoiceType: z.string().trim().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
});

export const createAdjustmentNoteSchema = z
  .object({
    noteType: z.enum(["credit_note", "debit_note"]),
    amountPaise: z.number().int().positive("Amount must be greater than 0"),
    reason: z.string().trim().min(5, "Reason is required").max(500),
  })
  .strict();
