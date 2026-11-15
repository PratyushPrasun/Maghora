"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService, CreateCategoryPayload, UpdateCategoryPayload } from "@/services/categories.service";
import { toast } from "sonner";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  list: ["categories", "list"] as const,
  adminList: ["categories", "adminList"] as const,
  detail: (slug: string) => ["categories", "detail", slug] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.list,
    queryFn: () => categoriesService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.adminList,
    queryFn: () => categoriesService.getAdminCategories(),
    staleTime: 30 * 1000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(slug),
    queryFn: () => categoriesService.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoriesService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update category");
    },
  });
}

export function useUpdateCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      categoriesService.updateCategoryStatus(id, isActive),
    onSuccess: (cat) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success(`Category ${cat.isActive ? "activated" : "deactivated"}`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success("Category deleted");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete category");
    },
  });
}

