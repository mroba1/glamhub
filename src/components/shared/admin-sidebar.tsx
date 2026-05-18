"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, Users, Bell, Settings, BarChart3,
  Building2, CreditCard, Globe, LogOut, Sparkles, Paintbrush,
  Package, ShoppingBag, ClipboardList, Scissors, DollarSign,
  FileImage, Shield, Megaphone, Link2,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

export interface AdminNavGroup {
  section: string;
  items: { label: string; href: string; icon: React.ElementType; badge?: number }[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    section: "OVERVIEW",
    items: [
      { label: "Dashboard",            href: "/admin/dashboard",      icon: LayoutDashboard },
      { label: "Website Customization",href: "/admin/customization",  icon: Paintbrush },
      { label: "Analytics",            href: "/admin/analytics",      icon: BarChart3 },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { label: "Appointments", href: "/admin/appointments", icon: Calendar },
      { label: "Customers",    href: "/admin/customers",   icon: Users },
      { label: "Services",     href: "/admin/services",    icon: Scissors },
    ],
  },
  {
    section: "STORE",
    items: [
      { label: "Marketplace", href: "/admin/marketplace", icon: ShoppingBag },
      { label: "Orders",      href: "/admin/orders",      icon: ClipboardList },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { label: "Payments",      href: "/admin/billing",        icon: CreditCard },
      { label: "Notifications", href: "/admin/notifications",  icon: Bell },
      { label: "Settings",      href: "/admin/settings",       icon: Settings },
    ],
  },
];

export const SUPER_ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    section: "OVERVIEW",
    items: [
      { label: "Dashboard",  href: "/super-admin/analytics",  icon: LayoutDashboard },
      { label: "Analytics",  href: "/super-admin/analytics",  icon: BarChart3 },
    ],
  },
  {
    section: "COMPANIES",
    items: [
      { label: "Companies",     href: "/super-admin/companies",     icon: Building2 },
      { label: "Invite Links",  href: "/super-admin/invites",       icon: Link2 },
      { label: "Subscriptions", href: "/super-admin/subscriptions", icon: CreditCard },
      { label: "Payments",      href: "/super-admin/payments",      icon: DollarSign },
    ],
  },
  {
    section: "CONTENT",
    items: [
      { label: "Templates",              href: "/super-admin/templates",   icon: FileImage },
      { label: "Categories",             href: "/super-admin/categories",  icon: Globe },
      { label: "Marketplace Moderation", href: "/super-admin/products",    icon: ShoppingBag },
    ],
  },
  {
    section: "PLATFORM",
    items: [
      { label: "Notifications",    href: "/super-admin/notifications", icon: Megaphone },
      { label: "Platform Settings",href: "/super-admin/settings",      icon: Settings },
      { label: "Security Logs",    href: "/super-admin/security",      icon: Shield },
    ],
  },
];

interface AdminSidebarProps {
  navGroups: AdminNavGroup[];
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export function AdminSidebar({ navGroups, userName = "Admin User", userRole = "Admin Manager", onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 tracking-tight">Glam Hub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] font-semibold text-gray-400 px-3 mb-1.5 tracking-widest">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, badge }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={`${group.section}-${href}`}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-emerald-600" : "text-gray-400")} />
                      <span className="flex-1">{label}</span>
                      {badge !== undefined && badge > 0 && (
                        <span className="h-5 min-w-[20px] rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                          {badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
            <p className="text-[10px] text-gray-400 truncate capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors w-full px-1 py-1 rounded-lg hover:bg-red-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
