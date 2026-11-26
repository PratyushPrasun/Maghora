"use client";

import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginPayload, RegisterPayload } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { getGuestCart, syncGuestCartToServer } from "@/lib/guest-cart";
import { ApiClientError } from "@/lib/api-client";
import { AUTH_KEYS, CART_KEYS } from "@/lib/query-keys";
import { ICart, IUser } from "@/types/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export { AUTH_KEYS };

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isLoading: storeLoading, isInitialized, setUser, logout: storeLogout } = useAuthStore();
  const recoveryInFlightRef = useRef(false);

  const {
    data: currentUser,
    isLoading: queryLoading,
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

  // Sync query result to Zustand auth store
  useEffect(() => {
    if (!queryLoading) {
      setUser(currentUser ?? null);
    }
  }, [currentUser, queryLoading, setUser]);

  /**
   * Synchronize guest cart & verify session cookie immediately after login or
   * registration, BEFORE setting `user` in Zustand (which triggers redirects
   * and parallel cart/address queries).
   */
  const syncAndVerifyPostAuth = async (userData: { user: IUser }) => {
    const hasGuestItems = getGuestCart().items.length > 0;
    let confirmedCart: ICart | null = null;

    if (hasGuestItems) {
      try {
        confirmedCart = await syncGuestCartToServer();
      } catch (err: any) {
        if (err?.statusCode === 401) {
          console.error("[Maghora] Session verification failed (401) during guest cart merge");
          storeLogout();
          queryClient.setQueryData(AUTH_KEYS.currentUser, null);
          throw new ApiClientError(
            "Sign-in completed, but your browser did not retain the session cookie. Please enable cookies and try again.",
            401
          );
        }
        // Transient network / server failure: preserve guest cart for recovery
        console.warn("[Maghora] Guest cart merge deferred; guest cart preserved", err);
        toast.warning(
          "Signed in, but your basket could not sync right now. Your items remain saved and will sync shortly."
        );
      }
    } else {
      // Even without guest items, verify the authenticated session works and
      // warm the cart cache before navigating to protected routes like /checkout.
      try {
        confirmedCart = await cartService.getCart();
      } catch (err: any) {
        if (err?.statusCode === 401) {
          console.error("[Maghora] Session verification failed (401) on /cart");
          storeLogout();
          queryClient.setQueryData(AUTH_KEYS.currentUser, null);
          throw new ApiClientError(
            "Sign-in completed, but your browser did not retain the session cookie. Please enable cookies and try again.",
            401
          );
        }
      }
    }

    if (confirmedCart) {
      queryClient.setQueryData(CART_KEYS.cart, confirmedCart);
      console.info("[Maghora] Cart state synchronized after authentication");
    } else {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    }

    queryClient.setQueryData(AUTH_KEYS.currentUser, userData.user);
    setUser(userData.user);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const data = await authService.login(credentials);
      console.info("[Maghora] Authentication completed");
      await syncAndVerifyPostAuth(data);
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Invalid email/phone or password.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await authService.register(payload);
      console.info("[Maghora] Registration and authentication completed");
      await syncAndVerifyPostAuth(data);
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully! Welcome to Maghora.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Registration failed. Please check your details.");
    },
  });

  // Recovery sync: if an already-authenticated user returns with leftover guest items
  // (for example, after a transient merge failure), merge them automatically.
  useEffect(() => {
    if (
      queryLoading ||
      !currentUser ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      recoveryInFlightRef.current
    ) {
      return;
    }

    const pendingGuestCart = getGuestCart();
    if (pendingGuestCart.items.length === 0) return;

    recoveryInFlightRef.current = true;
    syncGuestCartToServer()
      .then((mergedCart) => {
        if (mergedCart) {
          queryClient.setQueryData(CART_KEYS.cart, mergedCart);
          console.info("[Maghora] Recovered and synchronized leftover guest cart items");
        }
      })
      .catch((err: any) => {
        if (err?.statusCode === 401) {
          storeLogout();
          queryClient.setQueryData(AUTH_KEYS.currentUser, null);
        }
      })
      .finally(() => {
        recoveryInFlightRef.current = false;
      });
  }, [
    currentUser,
    queryLoading,
    loginMutation.isPending,
    registerMutation.isPending,
    queryClient,
    storeLogout,
  ]);

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
