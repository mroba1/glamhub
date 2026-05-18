"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Menu, X, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { APP_NAME } from "@/constants";
import { useCartStore } from "@/store/cart.store";

interface TopNavbarProps {
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
  showSearch?: boolean;
  showCart?: boolean;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function TopNavbar({
  userName = "User",
  userAvatar,
  unreadNotifications = 0,
  showSearch = true,
  showCart = true,
  onMenuToggle,
  isMobileMenuOpen,
}: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[hsl(0,0%,12%)] bg-[hsl(0,0%,4%)/80%] backdrop-blur-md flex items-center px-4 gap-4">
      {/* Mobile menu toggle */}
      {onMenuToggle && (
        <Button variant="ghost" size="icon-sm" onClick={onMenuToggle} className="lg:hidden">
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Search */}
      {showSearch && (
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(0,0%,45%)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, services…"
              className="w-full h-9 rounded-full border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,9%)] pl-9 pr-4 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%] transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Cart */}
        {showCart && (
          <Link href="/cart">
            <Button variant="ghost" size="icon-sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4.5 min-w-[18px] rounded-full bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] text-[10px] font-bold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        )}

        {/* Notifications */}
        <Link href="/notifications">
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Button>
        </Link>

        {/* Avatar */}
        <Link href="/profile">
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-[hsl(38,65%,60%)/30%] hover:ring-[hsl(38,65%,60%)/60%] transition-all">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
