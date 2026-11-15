import { create } from "zustand";
import { IUser } from "@/types/api";

interface AuthStore {
  user: IUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  setUser: (user) => set({ user, isLoading: false, isInitialized: true }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  logout: () => set({ user: null, isLoading: false, isInitialized: true }),
}));

