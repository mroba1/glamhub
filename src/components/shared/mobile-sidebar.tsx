"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Sparkles, LogOut } from "lucide-react";
import {
  LayoutDashboard, Calendar, BookOpen, Package, Tag, Users, Bell, Settings,
  BarChart3, Building2, Home, ShoppingBag, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants";

const iconMap = {
  LayoutDashboard, Calendar, BookOpen, Package, Tag, Users, Bell, Settings,
  BarChart3, Building2, Home, ShoppingBag, User,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: readonly NavItem[];
  onLogout?: () => void;
}

export function MobileSidebar({ isOpen, onClose, navItems, onLogout }: MobileSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-[hsl(0,0%,12%)] bg-[hsl(0,0%,5%)] flex flex-col lg:hidden slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(0,0%,12%)]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[hsl(38,65%,60%)] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-[hsl(0,0%,4%)]" />
            </div>
            <span className="font-serif text-lg font-bold text-[hsl(0,0%,95%)]">{APP_NAME}</span>
          </div>
          <button onClick={onClose} className="text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,80%)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[hsl(38,65%,60%)/15%] text-[hsl(38,65%,60%)] border-l-[3px] border-[hsl(38,65%,60%)]"
                        : "text-[hsl(0,0%,60%)] hover:bg-[hsl(0,0%,10%)] hover:text-[hsl(0,0%,90%)] border-l-[3px] border-transparent"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="h-5 min-w-[20px] rounded-full bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] text-xs font-bold flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {onLogout && (
          <div className="border-t border-[hsl(0,0%,12%)] p-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
