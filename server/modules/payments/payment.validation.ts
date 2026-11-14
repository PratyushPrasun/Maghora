import { z } from "zod";

export const verifyPaymentSchema = z
  .object({
    razorpay_order_id: z.string().min(1).max(100),
    razorpay_payment_id: z.string().min(1).max(100),
    razorpay_signature: z
      .string()
      .regex(/^[a-fA-F0-9]{64}$/),
  })
  .strict();

export const orderIdParamSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/);