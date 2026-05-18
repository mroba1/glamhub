"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, BookOpen, Package, Tag, Users, Bell, Settings,
  BarChart3, Building2, Home, ShoppingBag, User, LogOut, Sparkles, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

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

interface SidebarProps {
  navItems: readonly NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string;
  onLogout?: () => void;
}

export function Sidebar({
  navItems,
  userName = "User",
  userEmail = "",
  userAvatar,
  userRole = "customer",
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[hsl(0,0%,12%)] bg-[hsl(0,0%,5%)] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[hsl(0,0%,12%)]">
        <div className="h-8 w-8 rounded-lg bg-[hsl(38,65%,60%)] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-[hsl(0,0%,4%)]" />
        </div>
        <span className="font-serif text-lg font-bold text-[hsl(0,0%,95%)]">{APP_NAME}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[hsl(38,65%,60%)/15%] text-[hsl(38,65%,60%)] border-l-[3px] border-[hsl(38,65%,60%)]"
                      : "text-[hsl(0,0%,60%)] hover:bg-[hsl(0,0%,10%)] hover:text-[hsl(0,0%,90%)] border-l-[3px] border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="h-5 min-w-[20px] rounded-full bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] text-xs font-bold flex items-center justify-center px-1">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-[hsl(0,0%,12%)] p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-[hsl(0,0%,10%)] transition-colors cursor-pointer group">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[hsl(0,0%,90%)] truncate">{userName}</p>
            <p className="text-xs text-[hsl(0,0%,50%)] capitalize">{userRole.replace(/_/g, " ")}</p>
          </div>
          <button
            onClick={onLogout}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[hsl(0,0%,50%)] hover:text-red-400"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
