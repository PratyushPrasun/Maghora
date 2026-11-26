"use client";

import { ICart, ICartItem, IProduct, IProductVariant } from "@/types/api";
import { cartService } from "@/services/cart.service";
import { apiClient, ApiClientError } from "@/lib/api-client";

const GUEST_CART_STORAGE_KEY = "maghora_guest_cart";
const MAX_ITEM_QUANTITY = 20;

function getStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

function notifyCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("guest_cart_updated"));
  }
}

const EMPTY_CART: ICart = {
  items: [],
  itemCount: 0,
  subtotalPaise: 0,
  hasUnavailableItems: false,
};

function sanitizeGuestItems(rawItems: unknown[]): ICartItem[] {
  const byVariant = new Map<string, ICartItem>();

  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Partial<ICartItem>;

    if (
      typeof item.productId !== "string" ||
      !item.productId.trim() ||
      typeof item.variantId !== "string" ||
      !item.variantId.trim()
    ) {
      continue;
    }

    const rawQty = Number(item.quantity);
    if (!Number.isFinite(rawQty) || rawQty < 1) continue;
    const quantity = Math.min(Math.floor(rawQty), MAX_ITEM_QUANTITY);

    const pricePaise = Number(item.pricePaise) || 0;
    const mrpPaise = Number(item.mrpPaise) || pricePaise;

    const existing = byVariant.get(item.variantId);
    const mergedQuantity = existing
      ? Math.min(existing.quantity + quantity, MAX_ITEM_QUANTITY)
      : quantity;

    byVariant.set(item.variantId, {
      cartItemId: `guest_${item.variantId}`,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName || "Makhana Flavour",
      productSlug: item.productSlug ?? null,
      weightGrams: item.weightGrams ?? null,
      pricePaise,
      mrpPaise,
      quantity: mergedQuantity,
      available: item.available !== false,
      currentStock:
        typeof item.currentStock === "number" ? item.currentStock : MAX_ITEM_QUANTITY,
      lineTotalPaise: pricePaise * mergedQuantity,
    });
  }

  return Array.from(byVariant.values());
}

export function getGuestCart(): ICart {
  const storage = getStorage();
  if (!storage) {
    return { ...EMPTY_CART };
  }

  try {
    const raw = storage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_CART };
    }

    const parsed = JSON.parse(raw) as Partial<ICart>;
    const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
    const items = sanitizeGuestItems(rawItems);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalPaise = items.reduce(
      (sum, item) => sum + (item.available ? item.lineTotalPaise : 0),
      0
    );
    const hasUnavailableItems = items.some((item) => item.available === false);

    return {
      items,
      itemCount,
      subtotalPaise,
      hasUnavailableItems,
    };
  } catch {
    return { ...EMPTY_CART };
  }
}

export function saveGuestCart(cart: ICart): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
    notifyCartUpdate();
  } catch (err) {
    console.error("[Maghora] Failed to save guest cart", err);
  }
}

export function clearGuestCart(): ICart {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(GUEST_CART_STORAGE_KEY);
      notifyCartUpdate();
    } catch (err) {
      console.error("[Maghora] Failed to clear guest cart", err);
    }
  }

  return { ...EMPTY_CART };
}

export async function addGuestCartItem(payload: {
  productId: string;
  variantId: string;
  quantity: number;
  product?: IProduct;
  variant?: IProductVariant;
}): Promise<ICart> {
  if (!payload.productId || !payload.variantId) {
    throw new ApiClientError("Invalid product or variant selection", 400);
  }

  const addQty = Math.max(1, Math.min(Math.floor(payload.quantity || 1), MAX_ITEM_QUANTITY));
  const currentCart = getGuestCart();
  const existingIndex = currentCart.items.findIndex(
    (item) => item.variantId === payload.variantId
  );

  let product: IProduct | undefined = payload.product;
  let variant: IProductVariant | undefined = payload.variant;

  // Fallback: fetch product catalog details when caller did not pass full objects
  if (!product || !variant) {
    try {
      const response = await apiClient.get<any>("/products", {
        params: { limit: 100 },
      });
      const products: IProduct[] = response.data?.data?.products || [];
      const foundProduct = products.find((p) => p._id === payload.productId);
      if (foundProduct) {
        product = foundProduct;
        variant =
          product.variants?.find((v) => v._id === payload.variantId) ||
          product.variants?.[0];
      }
    } catch (e) {
      console.warn("[Maghora] Could not fetch product details for guest cart fallback", e);
    }
  }

  if (variant && (variant.isAvailable === false || variant.isActive === false)) {
    throw new ApiClientError("This product variant is currently out of stock", 409);
  }

  const pricePaise = variant?.pricePaise ?? 0;
  const mrpPaise = variant?.mrpPaise ?? pricePaise;
  const weightGrams = variant?.weightGrams ?? null;
  const productName = product?.name ?? "Makhana Flavour";
  const productSlug = product?.slug ?? null;
  const currentStock =
    typeof variant?.stockOnHand === "number"
      ? Math.max(0, variant.stockOnHand - (variant.reservedStock ?? 0))
      : MAX_ITEM_QUANTITY;

  if (currentStock < 1) {
    throw new ApiClientError("This product variant is currently out of stock", 409);
  }

  const maxAllowed = Math.min(currentStock, MAX_ITEM_QUANTITY);
  let newItems = [...currentCart.items];

  if (existingIndex > -1) {
    const existing = newItems[existingIndex];
    const newQty = Math.min(existing.quantity + addQty, maxAllowed);
    if (existing.quantity >= maxAllowed) {
      throw new ApiClientError(`Maximum available quantity is ${maxAllowed}`, 409);
    }
    newItems[existingIndex] = {
      ...existing,
      quantity: newQty,
      pricePaise,
      mrpPaise,
      currentStock: maxAllowed,
      available: true,
      lineTotalPaise: pricePaise * newQty,
    };
  } else {
    const initialQty = Math.min(addQty, maxAllowed);
    const newItem: ICartItem = {
      cartItemId: `guest_${payload.variantId}`,
      productId: payload.productId,
      variantId: payload.variantId,
      productName,
      productSlug,
      weightGrams,
      pricePaise,
      mrpPaise,
      quantity: initialQty,
      available: true,
      currentStock: maxAllowed,
      lineTotalPaise: pricePaise * initialQty,
    };
    newItems.unshift(newItem);
  }

  const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = newItems.reduce((sum, item) => sum + item.lineTotalPaise, 0);

  const updatedCart: ICart = {
    items: newItems,
    itemCount,
    subtotalPaise,
    hasUnavailableItems: false,
  };

  saveGuestCart(updatedCart);
  return updatedCart;
}

export function updateGuestCartItem(itemId: string, quantity: number): ICart {
  const currentCart = getGuestCart();
  const boundedQty = Math.max(1, Math.min(Math.floor(quantity), MAX_ITEM_QUANTITY));

  const newItems = currentCart.items.map((item) => {
    if (item.cartItemId === itemId || item.variantId === itemId) {
      const clamped = Math.min(boundedQty, Math.max(1, item.currentStock || MAX_ITEM_QUANTITY));
      return {
        ...item,
        quantity: clamped,
        lineTotalPaise: item.pricePaise * clamped,
      };
    }
    return item;
  });

  const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = newItems.reduce((sum, item) => sum + item.lineTotalPaise, 0);

  const updatedCart: ICart = {
    items: newItems,
    itemCount,
    subtotalPaise,
    hasUnavailableItems: newItems.some((item) => !item.available),
  };

  saveGuestCart(updatedCart);
  return updatedCart;
}

export function removeGuestCartItem(itemId: string): ICart {
  const currentCart = getGuestCart();
  const newItems = currentCart.items.filter(
    (item) => item.cartItemId !== itemId && item.variantId !== itemId
  );

  const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = newItems.reduce((sum, item) => sum + item.lineTotalPaise, 0);

  const updatedCart: ICart = {
    items: newItems,
    itemCount,
    subtotalPaise,
    hasUnavailableItems: newItems.some((item) => !item.available),
  };

  saveGuestCart(updatedCart);
  return updatedCart;
}

// ---------------------------------------------------------------------------
// Guest → Server merge (single-flight, idempotent, safe against failure)
// ---------------------------------------------------------------------------

let _activeMergePromise: Promise<ICart | null> | null = null;

/**
 * Merge the localStorage guest cart into the authenticated user's server
 * cart via the dedicated `/cart/merge` endpoint.
 *
 * Key properties:
 * - Single-flight: concurrent calls await the same in-flight promise.
 * - Idempotent: re-running the same merge does not inflate quantities.
 * - Atomic: guest cart is cleared ONLY after the server confirms success.
 * - Throws on failure so callers know whether auth (401) or network failed,
 *   while preserving the guest cart in localStorage.
 */
export async function syncGuestCartToServer(): Promise<ICart | null> {
  if (_activeMergePromise) {
    console.info("[Maghora] Guest cart merge already in progress — awaiting active merge");
    return _activeMergePromise;
  }

  const guestCart = getGuestCart();
  if (!guestCart.items || guestCart.items.length === 0) {
    return null;
  }

  _activeMergePromise = (async () => {
    try {
      console.info(
        `[Maghora] Guest cart merge started (${guestCart.items.length} item(s))`
      );

      const mergedCart = await cartService.mergeGuestCart({
        items: guestCart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      // Clear guest cart ONLY AFTER confirmed server persistence
      clearGuestCart();

      console.info("[Maghora] Guest cart merge completed");
      return mergedCart;
    } catch (err) {
      console.error("[Maghora] Guest cart merge failed — guest cart preserved", err);
      throw err;
    } finally {
      _activeMergePromise = null;
    }
  })();

  return _activeMergePromise;
}
