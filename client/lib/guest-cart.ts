"use client";

import { ICart, ICartItem, IProduct, IProductVariant } from "@/types/api";
import { cartService } from "@/services/cart.service";
import { apiClient } from "@/lib/api-client";

const GUEST_CART_STORAGE_KEY = "maghora_guest_cart";

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
    const items: ICartItem[] = Array.isArray(parsed.items) ? parsed.items : [];

    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotalPaise = items.reduce(
      (sum, item) => sum + (item.lineTotalPaise || 0),
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
  const currentCart = getGuestCart();
  const existingIndex = currentCart.items.findIndex(
    (item) => item.variantId === payload.variantId
  );

  let product: IProduct | undefined = payload.product;
  let variant: IProductVariant | undefined = payload.variant;

  // Fallback: If product or variant were not passed directly, attempt to fetch product
  if (!product || !variant) {
    try {
      const response = await apiClient.get<any>("/products");
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

  const pricePaise = variant?.pricePaise ?? 0;
  const mrpPaise = variant?.mrpPaise ?? pricePaise;
  const weightGrams = variant?.weightGrams ?? null;
  const productName = product?.name ?? "Makhana Flavour";
  const productSlug = product?.slug ?? null;
  const currentStock = variant?.stockOnHand ?? 99;

  let newItems = [...currentCart.items];

  if (existingIndex > -1) {
    const existing = newItems[existingIndex];
    const newQty = Math.min(existing.quantity + payload.quantity, 20);
    newItems[existingIndex] = {
      ...existing,
      quantity: newQty,
      pricePaise,
      mrpPaise,
      lineTotalPaise: pricePaise * newQty,
    };
  } else {
    const newItem: ICartItem = {
      cartItemId: `guest_${payload.variantId}`,
      productId: payload.productId,
      variantId: payload.variantId,
      productName,
      productSlug,
      weightGrams,
      pricePaise,
      mrpPaise,
      quantity: payload.quantity,
      available: true,
      currentStock,
      lineTotalPaise: pricePaise * payload.quantity,
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
  const boundedQty = Math.max(1, Math.min(quantity, 20));

  const newItems = currentCart.items.map((item) => {
    if (item.cartItemId === itemId || item.variantId === itemId) {
      return {
        ...item,
        quantity: boundedQty,
        lineTotalPaise: item.pricePaise * boundedQty,
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
    hasUnavailableItems: false,
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
    hasUnavailableItems: false,
  };

  saveGuestCart(updatedCart);
  return updatedCart;
}

// ---------------------------------------------------------------------------
// Guest → Server merge (called once after login/register)
// ---------------------------------------------------------------------------

/** Guard to prevent concurrent or duplicate merge operations */
let _mergeInProgress = false;

/**
 * Merge the localStorage guest cart into the authenticated user's server
 * cart via the dedicated `/cart/merge` endpoint.
 *
 * Key properties:
 * - Idempotent: re-running the same merge does not inflate quantities.
 * - Atomic: guest cart is cleared only after the server confirms success.
 * - Guarded: concurrent calls are coalesced (only one runs at a time).
 *
 * Returns the confirmed server cart, or `null` when there was nothing to
 * merge or the merge was already in progress.
 */
export async function syncGuestCartToServer(): Promise<ICart | null> {
  if (_mergeInProgress) {
    console.log("[Maghora] Guest cart merge already in progress – skipping duplicate call");
    return null;
  }

  const guestCart = getGuestCart();
  if (!guestCart.items || guestCart.items.length === 0) {
    return null;
  }

  _mergeInProgress = true;

  try {
    console.log(
      `[Maghora] Merging ${guestCart.items.length} guest item(s) to server cart`
    );

    const mergedCart = await cartService.mergeGuestCart({
      items: guestCart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    // Only clear guest cart AFTER the server confirmed the merge
    clearGuestCart();

    console.log("[Maghora] Guest cart merge completed successfully");
    return mergedCart;
  } catch (err) {
    console.error("[Maghora] Guest cart merge failed – guest cart preserved", err);
    // Do NOT clear guest cart on failure so the user can retry
    return null;
  } finally {
    _mergeInProgress = false;
  }
}
