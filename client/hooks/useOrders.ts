"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, CreateOrderPayload } from "@/services/orders.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { CART_KEYS } from "./useCart";
import { toast } from "sonner";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useMyOrders() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ORDER_KEYS.all,
    queryFn: () => ordersService.getMyOrders(),
    enabled: Boolean(user),
    staleTime: 30 * 1000,
  });
}

export function useMyOrder(orderId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => ordersService.getMyOrderById(orderId),
    enabled: Boolean(user && orderId),
    staleTime: 15 * 1000,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersService.placeOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create order. Please try again.");
    },
  });
}

