"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, AddCartItemPayload } from "@/services/cart.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export const CART_KEYS = {
  cart: ["cart"] as const,
};

export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { openCart } = useCartStore();

  const {
    data: cart,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: CART_KEYS.cart,
    queryFn: () => cartService.getCart(),
    enabled: Boolean(user), // Cart requires authentication on backend
    staleTime: 30 * 1000,
  });

  const addItemMutation = useMutation({
    mutationFn: (payload: AddCartItemPayload) => cartService.addItem(payload),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_KEYS.cart, updatedCart);
      toast.success("Added to cart!");
      openCart();
    },
    onError: (err: any) => {
      if (err?.statusCode === 401) {
        toast.error("Please login to add items to your cart");
      } else {
        toast.error(err?.message || "Could not add item to cart");
      }
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_KEYS.cart, updatedCart);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Could not update item quantity");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_KEYS.cart, updatedCart);
      toast.success("Item removed from cart");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Could not remove item");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(CART_KEYS.cart, {
        items: [],
        itemCount: 0,
        subtotalPaise: 0,
        hasUnavailableItems: false,
      });
      toast.success("Cart cleared");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Could not clear cart");
    },
  });

  return {
    cart: cart || {
      items: [],
      itemCount: 0,
      subtotalPaise: 0,
      hasUnavailableItems: false,
    },
    isLoading: isLoading && Boolean(user),
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

