"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, ShoppingBag, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Book", href: "/booking", icon: Calendar },
  { label: "Shop", href: "/marketplace", icon: ShoppingBag, showCart: true },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-[hsl(0,0%,12%)] bg-[hsl(0,0%,4%)/95%] backdrop-blur-md lg:hidden">
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map(({ label, href, icon: Icon, showCart }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors relative",
                isActive ? "text-[hsl(38,65%,60%)]" : "text-[hsl(0,0%,50%)] hover:text-[hsl(0,0%,80%)]"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {showCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 min-w-[16px] rounded-full bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] text-[9px] font-bold flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[hsl(38,65%,60%)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
