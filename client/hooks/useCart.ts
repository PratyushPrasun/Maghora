"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, AddCartItemPayload } from "@/services/cart.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import {
  getGuestCart,
  addGuestCartItem,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
} from "@/lib/guest-cart";
import { AUTH_KEYS, CART_KEYS } from "@/lib/query-keys";
import { toast } from "sonner";
import { ICart } from "@/types/api";

export { CART_KEYS };

const EMPTY_CART: ICart = {
  items: [],
  itemCount: 0,
  subtotalPaise: 0,
  hasUnavailableItems: false,
};

export function useCart() {
  const queryClient = useQueryClient();
  const { user, logout: storeLogout } = useAuthStore();
  const { openCart } = useCartStore();

  const handleUnauthorized = () => {
    console.warn("[Maghora] Cart API returned unauthorized (401) — clearing expired auth state");
    storeLogout();
    queryClient.setQueryData(AUTH_KEYS.currentUser, null);
    queryClient.removeQueries({ queryKey: CART_KEYS.cart });
  };

  const {
    data: serverCart,
    isLoading: isServerLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: CART_KEYS.cart,
    queryFn: async () => {
      try {
        const fetched = await cartService.getCart();
        console.info("[Maghora] Authenticated cart fetched");
        return fetched;
      } catch (err: any) {
        if (err?.statusCode === 401) {
          handleUnauthorized();
        }
        throw err;
      }
    },
    enabled: Boolean(user),
    staleTime: 30 * 1000,
  });

  // Guest cart state for reactive rendering when unauthenticated
  const [guestCartState, setGuestCartState] = useState<ICart>(EMPTY_CART);

  // Initialize guest cart on client mount
  useEffect(() => {
    if (!user) {
      const initialGuestCart = getGuestCart();
      setGuestCartState(initialGuestCart);
      console.info(
        `[Maghora] Guest cart initialized (${initialGuestCart.itemCount} item(s))`
      );
    }
  }, [user]);

  // Listen for guest cart updates across components / windows
  useEffect(() => {
    if (!user) {
      const handleCartUpdate = () => {
        setGuestCartState(getGuestCart());
      };
      window.addEventListener("guest_cart_updated", handleCartUpdate);
      window.addEventListener("storage", handleCartUpdate);
      return () => {
        window.removeEventListener("guest_cart_updated", handleCartUpdate);
        window.removeEventListener("storage", handleCartUpdate);
      };
    }
  }, [user]);

  const cart: ICart = user
    ? serverCart || EMPTY_CART
    : guestCartState;

  const addItemMutation = useMutation({
    mutationFn: async (payload: AddCartItemPayload) => {
      if (!user) {
        return await addGuestCartItem(payload);
      }
      return await cartService.addItem(payload);
    },
    onSuccess: (updatedCart) => {
      if (!user) {
        setGuestCartState(updatedCart);
      } else {
        queryClient.setQueryData(CART_KEYS.cart, updatedCart);
      }
      toast.success("Added to cart!");
      openCart();
    },
    onError: (err: any) => {
      if (err?.statusCode === 401) {
        handleUnauthorized();
        toast.error("Your session expired. Please sign in again to continue.");
        return;
      }
      toast.error(err?.message || "Could not add item to cart");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!user) {
        return updateGuestCartItem(itemId, quantity);
      }
      return await cartService.updateItem(itemId, quantity);
    },
    onSuccess: (updatedCart) => {
      if (!user) {
        setGuestCartState(updatedCart);
      } else {
        queryClient.setQueryData(CART_KEYS.cart, updatedCart);
      }
    },
    onError: (err: any) => {
      if (err?.statusCode === 401) {
        handleUnauthorized();
        toast.error("Your session expired. Please sign in again to continue.");
        return;
      }
      toast.error(err?.message || "Could not update item quantity");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user) {
        return removeGuestCartItem(itemId);
      }
      return await cartService.removeItem(itemId);
    },
    onSuccess: (updatedCart) => {
      if (!user) {
        setGuestCartState(updatedCart);
      } else {
        queryClient.setQueryData(CART_KEYS.cart, updatedCart);
      }
      toast.success("Item removed from cart");
    },
    onError: (err: any) => {
      if (err?.statusCode === 401) {
        handleUnauthorized();
        toast.error("Your session expired. Please sign in again to continue.");
        return;
      }
      toast.error(err?.message || "Could not remove item");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        return clearGuestCart();
      }
      await cartService.clearCart();
    },
    onSuccess: () => {
      if (!user) {
        setGuestCartState(EMPTY_CART);
      } else {
        queryClient.setQueryData(CART_KEYS.cart, EMPTY_CART);
      }
      toast.success("Cart cleared");
    },
    onError: (err: any) => {
      if (err?.statusCode === 401) {
        handleUnauthorized();
        toast.error("Your session expired. Please sign in again to continue.");
        return;
      }
      toast.error(err?.message || "Could not clear cart");
    },
  });

  return {
    cart,
    isLoading: Boolean(user) && isServerLoading,
    error,
    refetch,
    addItem: addItemMutation.mutateAsync,
    isAddingItem: addItemMutation.isPending,
    updateItem: updateItemMutation.mutateAsync,
    isUpdatingItem: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutateAsync,
    isRemovingItem: removeItemMutation.isPending,
    clearCart: clearCartMutation.mutateAsync,
  };
}
