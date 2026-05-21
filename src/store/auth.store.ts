"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  companySlug: string | null;   // stable slug from DB — never derived from branding
  companyId:   string | null;   // company ID for API calls
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setCompany: (id: string, slug: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:            null,
      companySlug:     null,
      companyId:       null,
      isAuthenticated: false,
      isLoading:       false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setCompany: (companyId, companySlug) =>
        set({ companyId, companySlug }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false, companySlug: null, companyId: null }),
    }),
    {
      name: "glam-hub-auth",
      partialize: (state) => ({
        user:            state.user,
        companySlug:     state.companySlug,
        companyId:       state.companyId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
