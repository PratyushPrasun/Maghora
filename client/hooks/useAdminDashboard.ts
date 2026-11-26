"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminDashboardService,
  AdminOrderQueryParams,
  AdminCustomerQueryParams,
} from "@/services/admin-dashboard.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export const ADMIN_DASHBOARD_KEYS = {
  recentOrders: (limit: number) => ["admin", "orders", "recent", limit] as const,
  orderStats: ["admin", "orders", "stats"] as const,
  allOrders: (params?: AdminOrderQueryParams) =>
    ["admin", "orders", "list", params] as const,
  orderDetail: (id: string) => ["admin", "orders", "detail", id] as const,
  customers: (params?: AdminCustomerQueryParams) =>
    ["admin", "customers", "list", params] as const,
  customerDetail: (id: string) => ["admin", "customers", "detail", id] as const,
  customerOrders: (id: string, page: number) =>
    ["admin", "customers", "orders", id, page] as const,
};

// ---- Orders ----

export function useAdminRecentOrders(limit: number = 10) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.recentOrders(limit),
    queryFn: () => adminDashboardService.getRecentOrders(limit),
    enabled: isAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAdminOrderStats() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.orderStats,
    queryFn: () => adminDashboardService.getOrderStats(),
    enabled: isAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAdminOrders(params?: AdminOrderQueryParams) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.allOrders(params),
    queryFn: () => adminDashboardService.getAllOrders(params),
    enabled: isAdmin,
    staleTime: 15 * 1000,
  });
}

export function useAdminOrderDetail(orderId: string) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.orderDetail(orderId),
    queryFn: () => adminDashboardService.getOrderById(orderId),
    enabled: isAdmin && Boolean(orderId),
    staleTime: 15 * 1000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      adminDashboardService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update order status");
    },
  });
}

// ---- Customers ----

export function useAdminCustomers(params?: AdminCustomerQueryParams) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.customers(params),
    queryFn: () => adminDashboardService.getCustomers(params),
    enabled: isAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAdminCustomerDetail(customerId: string) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.customerDetail(customerId),
    queryFn: () => adminDashboardService.getCustomerDetail(customerId),
    enabled: isAdmin && Boolean(customerId),
    staleTime: 30 * 1000,
  });
}

export function useAdminCustomerOrders(
  customerId: string,
  page: number = 1,
  limit: number = 10
) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.customerOrders(customerId, page),
    queryFn: () =>
      adminDashboardService.getCustomerOrders(customerId, { page, limit }),
    enabled: isAdmin && Boolean(customerId),
    staleTime: 15 * 1000,
  });
}
