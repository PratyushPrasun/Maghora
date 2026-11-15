"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { ProductQueryOptions } from "@/types/api";
import { toast } from "sonner";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (params?: ProductQueryOptions) => ["products", "list", params] as const,
  detail: (slug: string) => ["products", "detail", slug] as const,
  adminList: (params?: ProductQueryOptions) => ["products", "adminList", params] as const,
};

export function useProducts(params?: ProductQueryOptions) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productsService.getProducts(params),
    staleTime: 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });
}

export function useAdminProducts(params?: ProductQueryOptions) {
  return useQuery({
    queryKey: PRODUCT_KEYS.adminList(params),
    queryFn: () => productsService.getAdminProducts(params),
    staleTime: 15 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => productsService.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productsService.updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update product");
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productsService.updateProductStatus(id, isActive),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success(`Product ${updated.isActive ? "activated" : "deactivated"}`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Product deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete product");
    },
  });
}

