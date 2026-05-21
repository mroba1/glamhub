"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useBrandingStore } from "@/store/branding.store";
import { getToken } from "@/lib/api";
import { authService } from "@/services/auth.service";

const roleMap: Record<string, "customer" | "admin" | "super_admin"> = {
  CUSTOMER:    "customer",
  ADMIN:       "admin",
  SUPER_ADMIN: "super_admin",
};

export function useRestoreSession() {
  const setUser     = useAuthStore((s) => s.setUser);
  const setCompany  = useAuthStore((s) => s.setCompany);
  const user        = useAuthStore((s) => s.user);
  const setBranding = useBrandingStore((s) => s.setBranding);

  useEffect(() => {
    // If already have user in store, no need to restore
    if (user) return;

    const token = getToken();
    if (!token) return;

    // Token exists but user not in store — fetch profile to restore session
    authService.getProfile()
      .then((res) => {
        const u = res.data;
        setUser({
          id:        u.id,
          name:      u.name,
          email:     u.email,
          phone:     u.phone,
          role:      roleMap[u.role] ?? "customer",
          avatarUrl: u.avatarUrl,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        });

        if (u.managedCompany) {
          setCompany(u.managedCompany.id, u.managedCompany.slug);

          // Restore branding if admin
          if (u.managedCompany.branding) {
            const b = u.managedCompany.branding;
            setBranding((prev) => ({
              ...prev,
              companyId:    u.managedCompany.id,
              businessName: b.businessName || u.managedCompany.name || prev.businessName,
              primaryColor: b.primaryColor || prev.primaryColor,
              tagline:      b.tagline      || prev.tagline,
              about:        b.about        || prev.about,
              phone:        b.phone        || prev.phone,
              email:        b.email        || prev.email,
              address:      b.address      || prev.address,
              logoUrl:      b.logoUrl      || prev.logoUrl,
              bannerUrl:    b.bannerUrl    || prev.bannerUrl,
            }));
          }
        }
      })
      .catch(() => {
        // Token expired or invalid — clear everything
        import("@/lib/api").then(({ clearToken }) => clearToken());
      });
  }, []);
}
