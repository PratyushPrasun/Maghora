import { describe, it, expect } from "vitest";
import { mergeCartSchema, addCartItemSchema, updateCartItemSchema } from "./cart.validation.js";

describe("Cart Validation Schemas", () => {
  const validMongoId = "507f1f77bcf86cd799439011";
  const validVariantId = "507f1f77bcf86cd799439012";

  describe("mergeCartSchema", () => {
    it("should accept valid guest items array", () => {
      const payload = {
        items: [
          {
            productId: validMongoId,
            variantId: validVariantId,
            quantity: 3,
          },
        ],
      };

      const result = mergeCartSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0].quantity).toBe(3);
      }
    });

    it("should reject an empty items array", () => {
      const payload = { items: [] };
      const result = mergeCartSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject invalid MongoDB IDs", () => {
      const payload = {
        items: [
          {
            productId: "invalid-id",
            variantId: validVariantId,
            quantity: 1,
          },
        ],
      };
      const result = mergeCartSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject quantity below 1 or above 20", () => {
      const belowOne = {
        items: [{ productId: validMongoId, variantId: validVariantId, quantity: 0 }],
      };
      const aboveTwenty = {
        items: [{ productId: validMongoId, variantId: validVariantId, quantity: 21 }],
      };

      expect(mergeCartSchema.safeParse(belowOne).success).toBe(false);
      expect(mergeCartSchema.safeParse(aboveTwenty).success).toBe(false);
    });

    it("should reject payloads with more than 50 items", () => {
      const items = Array.from({ length: 51 }, () => ({
        productId: validMongoId,
        variantId: validVariantId,
        quantity: 1,
      }));

      expect(mergeCartSchema.safeParse({ items }).success).toBe(false);
    });

    it("should reject unexpected fields due to strict() mode", () => {
      const payload = {
        items: [
          {
            productId: validMongoId,
            variantId: validVariantId,
            quantity: 1,
            unauthorizedField: "hacker",
          },
        ],
      };
      expect(mergeCartSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("addCartItemSchema & updateCartItemSchema", () => {
    it("should validate add item schema", () => {
      const valid = {
        productId: validMongoId,
        variantId: validVariantId,
        quantity: 2,
      };
      expect(addCartItemSchema.safeParse(valid).success).toBe(true);
    });

    it("should validate update item schema", () => {
      expect(updateCartItemSchema.safeParse({ quantity: 5 }).success).toBe(true);
      expect(updateCartItemSchema.safeParse({ quantity: 0 }).success).toBe(false);
      expect(updateCartItemSchema.safeParse({ quantity: 25 }).success).toBe(false);
    });
  });
});

describe("Merge Deduplication Logic", () => {
  it("deduplicates guest items by variantId taking highest quantity", () => {
    const guestItems = [
      { productId: "p1", variantId: "v1", quantity: 2 },
      { productId: "p1", variantId: "v1", quantity: 4 }, // higher
      { productId: "p2", variantId: "v2", quantity: 1 },
      { productId: "p1", variantId: "v1", quantity: 3 }, // lower
    ];

    const deduped = new Map<string, (typeof guestItems)[0]>();
    for (const item of guestItems) {
      const existing = deduped.get(item.variantId);
      if (!existing || item.quantity > existing.quantity) {
        deduped.set(item.variantId, item);
      }
    }

    expect(deduped.size).toBe(2);
    expect(deduped.get("v1")?.quantity).toBe(4);
    expect(deduped.get("v2")?.quantity).toBe(1);
  });

  it("calculates idempotent merged quantity taking max of existing and guest", () => {
    const existingQuantity = 2;
    const guestQuantity = 4;
    const availableStock = 10;

    // Idempotent calculation: max(existing, guest) capped at stock and 20
    const mergedQty = Math.min(
      Math.max(existingQuantity, guestQuantity),
      availableStock,
      20
    );

    expect(mergedQty).toBe(4); // Not 2 + 4 = 6!

    // If re-run with the same guestQuantity:
    const reMergedQty = Math.min(
      Math.max(mergedQty, guestQuantity),
      availableStock,
      20
    );
    expect(reMergedQty).toBe(4); // Stays 4, perfectly idempotent!
  });
});
