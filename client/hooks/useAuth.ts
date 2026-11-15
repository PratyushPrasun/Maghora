"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginPayload, RegisterPayload } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const AUTH_KEYS = {
  currentUser: ["auth", "me"] as const,
};

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isLoading: storeLoading, isInitialized, setUser, logout: storeLogout } = useAuthStore();

  const {
    data: currentUser,
    isLoading: queryLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: async () => {
      try {
        const u = await authService.getCurrentUser();
        return u;
      } catch (err: any) {
        if (err?.statusCode === 401) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Sync to store
  useEffect(() => {
    if (!queryLoading) {
      setUser(currentUser ?? null);
    }
  }, [currentUser, queryLoading, setUser]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginPayload) => authService.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(AUTH_KEYS.currentUser, data.user);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Invalid email/phone or password.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(AUTH_KEYS.currentUser, data.user);
      toast.success("Account created successfully! Welcome to Maghora.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Registration failed. Please check your details.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      storeLogout();
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: () => {
      storeLogout();
      queryClient.clear();
      router.push("/");
    },
  });

  return {
    user: user ?? currentUser ?? null,
    isLoading: queryLoading || (!isInitialized && storeLoading),
    isAuthenticated: Boolean(user || currentUser),
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
    isSuperAdmin: user?.role === "super_admin",
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refetchUser,
  };
}

