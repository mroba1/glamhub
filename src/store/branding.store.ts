"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompanyBranding } from "@/types";
import { DEFAULT_COMPANY_BRANDING } from "@/constants/mock-data";

interface BrandingStore {
  branding: CompanyBranding;
  setBranding: (updater: CompanyBranding | ((prev: CompanyBranding) => CompanyBranding)) => void;
  reset: () => void;
}

export const useBrandingStore = create<BrandingStore>()(
  persist(
    (set) => ({
      branding: DEFAULT_COMPANY_BRANDING,

      setBranding: (updater) =>
        set((state) => ({
          branding:
            typeof updater === "function" ? updater(state.branding) : updater,
        })),

      reset: () => set({ branding: DEFAULT_COMPANY_BRANDING }),
    }),
    {
      name: "glam-hub-branding",
      // Persist everything EXCEPT blob: URLs — they're temporary browser memory
      // and break on page refresh. Real URLs (from a CDN/backend) persist fine.
      partialize: (state) => ({
        branding: {
          ...state.branding,
          logoUrl:   state.branding.logoUrl?.startsWith("blob:")   ? "" : (state.branding.logoUrl   ?? ""),
          bannerUrl: state.branding.bannerUrl?.startsWith("blob:") ? "" : (state.branding.bannerUrl ?? ""),
          gallery:   state.branding.gallery.filter((u) => !u.startsWith("blob:")),
        },
      }),
      // Merge persisted data with current in-memory state so blob URLs survive
      // navigation within the same browser session (they're in memory, not localStorage)
      merge: (persisted, current) => ({
        ...current,
        branding: {
          ...(persisted as BrandingStore).branding,
          // Keep in-memory blob URLs if they exist (same session)
          logoUrl:   current.branding.logoUrl   || (persisted as BrandingStore).branding.logoUrl,
          bannerUrl: current.branding.bannerUrl || (persisted as BrandingStore).branding.bannerUrl,
          gallery:   current.branding.gallery.length
            ? current.branding.gallery
            : (persisted as BrandingStore).branding.gallery,
        },
      }),
    }
  )
);
