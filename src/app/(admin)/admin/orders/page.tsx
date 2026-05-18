"use client";
import { useState } from "react";
import Image from "next/image";
import { ClipboardList, Search, ChevronDown, ChevronUp } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_ORDERS } from "@/constants/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";
import { toast } from "sonner";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: Order["status"]) => {
    await new Promise((r) => setTimeout(r, 400));
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    toast.success(`Order status updated to ${status}`);
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Orders" subtitle="Manage customer orders and delivery" userName="Studio Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order # or customer…"
              className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatusFilter("all")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === "all" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300"}`}>
              All ({orders.length})
            </button>
            {ORDER_STATUSES.map((s) => (
              <button key={s.value} onClick={() => setStatusFilter(s.value)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === s.value ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No orders found" description="Customer orders will appear here once they start shopping." />
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header row */}
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                    </div>
                    <p className="font-bold text-emerald-600 text-sm">{formatCurrency(order.total)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  {expanded === order.id ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                </button>

                {/* Expanded detail */}
                {expanded === order.id && (
                  <div className="border-t border-gray-100 p-4 space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                            {item.productImage && <Image src={item.productImage} alt={item.productName} fill className="object-cover" unoptimized />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary + actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                      <div className="text-sm space-y-1">
                        <div className="flex gap-4 text-gray-500">
                          <span>Shipping: {formatCurrency(order.shippingFee)}</span>
                          {order.discount > 0 && <span>Discount: -{formatCurrency(order.discount)}</span>}
                        </div>
                        <p className="font-bold text-gray-900">Total: {formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-400">{order.shippingAddress}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {order.status === "pending" && (
                          <button onClick={() => updateStatus(order.id, "processing")} className="rounded-lg bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-blue-600 transition-colors">Process</button>
                        )}
                        {order.status === "processing" && (
                          <button onClick={() => updateStatus(order.id, "shipped")} className="rounded-lg bg-cyan-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-cyan-600 transition-colors">Mark Shipped</button>
                        )}
                        {order.status === "shipped" && (
                          <button onClick={() => updateStatus(order.id, "delivered")} className="rounded-lg bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-emerald-600 transition-colors">Mark Delivered</button>
                        )}
                        {(order.status === "pending" || order.status === "processing") && (
                          <button onClick={() => updateStatus(order.id, "cancelled")} className="rounded-lg border border-red-200 text-red-500 text-xs font-semibold px-3 py-1.5 hover:bg-red-50 transition-colors">Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
