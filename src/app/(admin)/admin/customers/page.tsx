"use client";
import { useState } from "react";
import { Search, Users, Star, Package, Calendar } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_CUSTOMERS } from "@/constants/mock-data";
import { getInitials, formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search)
  );

  const totalOrders   = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0);
  const totalBookings = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalBookings, 0);

  return (
    <div className="space-y-0">
      <AdminTopBar
        title="Customers"
        subtitle="View and manage your customer base"
        userName="Studio Admin"
        showTimePeriod={false}
      />

      <div className="p-4 md:p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Customers", value: MOCK_CUSTOMERS.length, icon: Users,    bg: "bg-blue-50 text-blue-500" },
            { label: "Total Orders",    value: totalOrders,            icon: Package,  bg: "bg-emerald-50 text-emerald-600" },
            { label: "Total Bookings",  value: totalBookings,          icon: Calendar, bg: "bg-purple-50 text-purple-500" },
          ].map(({ label, value, icon: Icon, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? "No customers found" : "No customers yet"}
            description={search ? `No results for "${search}"` : "Customers who book or buy from your store will appear here."}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Customer", "Phone", "Orders", "Bookings", "Loyalty Pts", "Joined"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{customer.name}</p>
                            <p className="text-xs text-gray-400">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-500">{customer.phone ?? "—"}</td>
                      <td className="py-3.5 px-5"><Badge variant="info">{customer.totalOrders}</Badge></td>
                      <td className="py-3.5 px-5"><Badge variant="purple">{customer.totalBookings}</Badge></td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                          <span className="font-semibold text-gray-700">{customer.loyaltyPoints}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-400 text-xs whitespace-nowrap">{formatDate(customer.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
