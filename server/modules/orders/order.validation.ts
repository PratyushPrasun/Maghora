import { z } from "zod";

export const createOrderSchema = z.object({
  idempotencyKey: z.string().uuid(),

  addressId: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid address ID"
  ),

  customerNotes: z.string().trim().max(500).default(""),
}).strict();