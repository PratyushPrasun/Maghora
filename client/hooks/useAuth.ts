"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginPayload, RegisterPayload } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { syncGuestCartToServer } from "@/lib/guest-cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CART_KEYS } from "@/hooks/useCart";

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

  /**
   * Post-auth handler shared by login and register.
   *
   * Sequence:
   * 1. Update auth state so the UI reflects the authenticated user.
   * 2. Merge guest cart → server via the idempotent /cart/merge endpoint.
   * 3. Set the returned cart as the query cache so the UI updates immediately
   *    without an extra round-trip.
   * 4. Invalidate other user-specific queries (orders, addresses).
   *
   * The merge function has its own concurrency guard so even if React
   * Strict Mode or the useCart effect tries to call it again, only one
   * request runs.
   */
  const handlePostAuth = async (userData: { user: any }) => {
    // 1. Update auth store + react-query cache
    setUser(userData.user);
    queryClient.setQueryData(AUTH_KEYS.currentUser, userData.user);

    // 2. Merge guest cart (idempotent, guarded against double calls)
    const mergedCart = await syncGuestCartToServer();

    // 3. Update cart query cache with the confirmed server cart
    if (mergedCart) {
      queryClient.setQueryData(CART_KEYS.cart, mergedCart);
    } else {
      // No guest items to merge – just refresh the server cart
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    }

    // 4. Refresh user-specific data
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  };

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginPayload) => authService.login(credentials),
    onSuccess: async (data) => {
      await handlePostAuth(data);
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Invalid email/phone or password.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: async (data) => {
      await handlePostAuth(data);
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
