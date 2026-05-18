"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavbar } from "@/components/shared/top-navbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { MobileSidebar } from "@/components/shared/mobile-sidebar";
import { CUSTOMER_NAV_ITEMS } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { toast } from "sonner";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <TopNavbar
        userName={user?.name ?? "Guest"}
        unreadNotifications={unreadCount}
        showCart
        showSearch
        onMenuToggle={() => setMobileOpen(true)}
        isMobileMenuOpen={mobileOpen}
      />
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={CUSTOMER_NAV_ITEMS}
        onLogout={handleLogout}
      />
      <main className="pb-20 lg:pb-0 min-h-[calc(100vh-4rem)] fade-in">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
