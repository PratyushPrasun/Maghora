"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminsService, CreateAdminPayload, UpdateAdminPayload } from "@/services/admins.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export const ADMIN_KEYS = {
  all: ["admins"] as const,
  list: (page: number, limit: number) => ["admins", "list", page, limit] as const,
  audit: (page: number, limit: number) => ["admins", "audit", page, limit] as const,
};

export function useAdmins(page: number = 1, limit: number = 20) {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_KEYS.list(page, limit),
    queryFn: () => adminsService.getAdmins(page, limit),
    enabled: isSuperAdmin,
    staleTime: 30 * 1000,
  });
}

export function useAdminAuditLogs(page: number = 1, limit: number = 20) {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";

  return useQuery({
    queryKey: ADMIN_KEYS.audit(page, limit),
    queryFn: () => adminsService.getAdminAuditLogs(page, limit),
    enabled: isSuperAdmin,
    staleTime: 30 * 1000,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => adminsService.createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all });
      toast.success("Administrator invited successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create administrator");
    },
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminPayload }) =>
      adminsService.updateAdmin(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all });
      toast.success("Administrator updated");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update administrator");
    },
  });
}

export function useUpdateAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminsService.updateAdminStatus(id, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all });
      toast.success(`Administrator ${data.admin.isActive ? "activated" : "deactivated"}`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update administrator status");
    },
  });
}

