"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Search } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_ORDERS } from "@/constants/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "all" || o.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">My Orders</h1>
        <p className="text-[hsl(0,0%,55%)] mt-1">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(0,0%,45%)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number…"
            className="w-full h-10 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] pl-10 pr-4 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              selectedStatus === "all" ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]" : "border border-[hsl(0,0%,15%)] text-[hsl(0,0%,60%)]"
            }`}
          >All</button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedStatus(s.value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedStatus === s.value ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]" : "border border-[hsl(0,0%,15%)] text-[hsl(0,0%,60%)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="You haven't placed any orders yet. Browse our marketplace to get started."
          action={{ label: "Shop Now", onClick: () => router.push("/marketplace") }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] overflow-hidden">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[hsl(0,0%,9%)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(38,65%,60%)/10%] flex items-center justify-center">
                    <Package className="h-5 w-5 text-[hsl(38,65%,60%)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(0,0%,90%)] text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-[hsl(0,0%,50%)]">{formatDateTime(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-[hsl(38,65%,60%)] font-serif">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-[hsl(0,0%,50%)]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="border-t border-[hsl(0,0%,12%)] p-5 space-y-4 fade-in">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[hsl(0,0%,10%)] shrink-0">
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[hsl(0,0%,85%)] line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-[hsl(0,0%,50%)]">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-[hsl(0,0%,80%)]">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[hsl(0,0%,12%)] pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[hsl(0,0%,45%)]">Shipping Address</p>
                      <p className="text-[hsl(0,0%,75%)] text-xs mt-0.5">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(0,0%,45%)]">Order Total</p>
                      <p className="text-[hsl(38,65%,60%)] font-bold font-serif">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
