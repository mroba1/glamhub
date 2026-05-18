"use client";
import { TrendingUp, TrendingDown, Calendar, Users, ShoppingBag, DollarSign } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { MOCK_ANALYTICS, MOCK_BOOKINGS, MOCK_ORDERS, MOCK_CUSTOMERS } from "@/constants/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

function StatCard({ label, value, change, up, icon: Icon, iconBg }: {
  label: string; value: string | number; change?: string; up?: boolean;
  icon: React.ElementType; iconBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className={cn("flex items-center gap-1 mt-1 text-xs font-semibold", up ? "text-emerald-500" : "text-red-500")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change} vs last month
          </div>
        )}
      </div>
      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function BarChart({ data, color = "#10b981" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-md transition-all cursor-pointer"
            style={{ height: `${Math.max((d.value / max) * 112, d.value > 0 ? 4 : 0)}px`, background: color, opacity: 0.75 }}
            title={String(d.value)}
          />
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const BOOKING_BY_SERVICE = [
  { label: "Hair", value: 0 },
  { label: "Skin", value: 0 },
  { label: "Nails", value: 0 },
  { label: "Makeup", value: 0 },
  { label: "Lashes", value: 0 },
];

export default function AdminAnalyticsPage() {
  const revenueData = MOCK_ANALYTICS.revenueChart.map((d) => ({ label: d.label, value: d.value }));
  const bookingData = MOCK_ANALYTICS.revenueChart.map((d) => ({ label: d.label, value: d.secondary ?? 0 }));
  const revenue = MOCK_BOOKINGS.reduce((s, b) => s + (b.status !== "rejected" ? b.servicePrice : 0), 0);
  const pendingBookings = MOCK_BOOKINGS.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-0">
      <AdminTopBar title="Analytics" subtitle="Insights for your business" userName="Studio Admin" unreadNotifications={pendingBookings} />

      <div className="p-4 md:p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={formatCurrency(revenue)} change={`${MOCK_ANALYTICS.revenueGrowth}%`} up icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600" />
          <StatCard label="Total Bookings" value={MOCK_BOOKINGS.length} change={`${MOCK_ANALYTICS.bookingGrowth}%`} up icon={Calendar} iconBg="bg-blue-50 text-blue-500" />
          <StatCard label="Total Customers" value={MOCK_CUSTOMERS.length} change={`${MOCK_ANALYTICS.customerGrowth}%`} up icon={Users} iconBg="bg-purple-50 text-purple-500" />
          <StatCard label="Total Orders" value={MOCK_ORDERS.length} change={`${MOCK_ANALYTICS.orderGrowth}%`} up icon={ShoppingBag} iconBg="bg-amber-50 text-amber-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Revenue</h2>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />Monthly</span>
            </div>
            <BarChart data={revenueData} color="#10b981" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Bookings</h2>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />Monthly</span>
            </div>
            <BarChart data={bookingData} color="#6366f1" />
          </div>
        </div>

        {/* Bookings by service category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Bookings by Service</h2>
          {BOOKING_BY_SERVICE.every((b) => b.value === 0) ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">No booking data yet. Data will appear once customers start booking.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {BOOKING_BY_SERVICE.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16 shrink-0">{b.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${b.value}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 w-8 text-right shrink-0">{b.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          {MOCK_BOOKINGS.filter((b) => b.status === "approved").length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">No upcoming appointments. They will appear here once bookings are approved.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {MOCK_BOOKINGS.filter((b) => b.status === "approved").map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.serviceName} · {b.date} {b.timeSlot}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 shrink-0">{formatCurrency(b.servicePrice)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
