"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, ADMIN_NAV_GROUPS } from "@/components/shared/admin-sidebar";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

function MobileAdminNav({
  isOpen,
  onClose,
  onLogout,
  userName = "Admin",
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
}) {
  const pathname = usePathname();
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Glam Hub Admin</span>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.section} className="mb-4">
              <p className="text-[10px] font-semibold text-gray-400 px-2 mb-1.5 tracking-widest">{group.section}</p>
              <ul className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={href}>
                      <Link href={href} onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-emerald-600" : "text-gray-400")} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full px-2 py-2 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const user = useAuthStore((s) => s.user);
  const userName = user?.name ?? "Studio Admin";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          navGroups={ADMIN_NAV_GROUPS}
          userName={userName}
          userRole="Admin"
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile nav */}
      <MobileAdminNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        userName={userName}
      />

      {/* Main area */}
      <div className="lg:pl-60">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Glam Hub</span>
          </div>
          <button
            onClick={handleLogout}
            className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <main className="p-4 md:p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
