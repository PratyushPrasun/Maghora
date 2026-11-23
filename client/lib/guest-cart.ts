"use client";

import { ICart, ICartItem, IProduct, IProductVariant } from "@/types/api";
import { AddCartItemPayload, cartService } from "@/services/cart.service";
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

export function getGuestCart(): ICart {
  const storage = getStorage();
  if (!storage) {
    return {
      items: [],
      itemCount: 0,
      subtotalPaise: 0,
      hasUnavailableItems: false,
    };
  }

  try {
    const raw = storage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) {
      return {
        items: [],
        itemCount: 0,
        subtotalPaise: 0,
        hasUnavailableItems: false,
      };
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
    return {
      items: [],
      itemCount: 0,
      subtotalPaise: 0,
      hasUnavailableItems: false,
    };
  }
}

export function saveGuestCart(cart: ICart): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
    notifyCartUpdate();
  } catch (err) {
    console.error("Failed to save guest cart", err);
  }
}

export function clearGuestCart(): ICart {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(GUEST_CART_STORAGE_KEY);
      notifyCartUpdate();
    } catch (err) {
      console.error("Failed to clear guest cart", err);
    }
  }

  return {
    items: [],
    itemCount: 0,
    subtotalPaise: 0,
    hasUnavailableItems: false,
  };
}

export async function addGuestCartItem(payload: AddCartItemPayload): Promise<ICart> {
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
      console.warn("Could not fetch product details for guest cart fallback", e);
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

export async function syncGuestCartToServer(): Promise<void> {
  const guestCart = getGuestCart();
  if (!guestCart.items || guestCart.items.length === 0) return;

  for (const item of guestCart.items) {
    try {
      await cartService.addItem({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      });
    } catch (err) {
      console.error("Failed to sync guest cart item to server", item, err);
    }
  }

  clearGuestCart();
}
