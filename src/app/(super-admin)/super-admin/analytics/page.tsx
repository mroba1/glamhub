"use client";
import { TrendingUp, TrendingDown, Users, Building2, Package, Calendar, DollarSign, CreditCard } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { MOCK_ANALYTICS, MOCK_COMPANIES, MOCK_SUBSCRIPTION_PLANS, MOCK_SUBSCRIPTIONS } from "@/constants/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

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
            {change}
          </div>
        )}
      </div>
      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number; secondary: number }[] }) {
  const max = Math.max(...data.map((d) => Math.max(d.value, d.secondary)));
  return (
    <div className="flex items-end gap-2 h-44 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-full flex gap-0.5 items-end" style={{ height: "144px" }}>
            <div className="flex-1 rounded-t bg-blue-200 group-hover:bg-blue-400 transition-colors" style={{ height: `${(d.secondary / max) * 144}px` }} title={`Subscriptions: ${formatCurrency(d.secondary)}`} />
            <div className="flex-1 rounded-t bg-emerald-400 group-hover:bg-emerald-500 transition-colors" style={{ height: `${(d.value / max) * 144}px` }} title={`Revenue: ${formatCurrency(d.value)}`} />
          </div>
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const COUNTRY_COLORS = ["#10b981","#6366f1","#f59e0b","#ec4899","#06b6d4","#8b5cf6","#f43f5e","#84cc16","#14b8a6"];

export default function SuperAdminAnalyticsPage() {
  const { revenueChart, totalRevenue, totalBookings, totalOrders, totalCustomers, totalCompanies, totalProducts,
    revenueGrowth, bookingGrowth, orderGrowth, customerGrowth, subscriptionRevenue, activeSubscriptions } = MOCK_ANALYTICS;

  const chartData = revenueChart.map((d) => ({ label: d.label, value: d.value, secondary: d.secondary ?? 0 }));
  const maxRevenue = Math.max(...chartData.map((d) => d.value));

  const planBreakdown = MOCK_SUBSCRIPTION_PLANS.map((plan) => {
    const count = MOCK_SUBSCRIPTIONS.filter((s) => s.planId === plan.id && s.status === "active").length;
    const rev = MOCK_SUBSCRIPTIONS.filter((s) => s.planId === plan.id && s.status === "active").reduce((sum, s) => sum + s.amount, 0);
    return { name: plan.name, count, revenue: rev, pct: Math.round((count / Math.max(activeSubscriptions, 1)) * 100) };
  });

  return (
    <div className="space-y-6">
      <AdminTopBar title="Platform Analytics" subtitle="Real-time overview of all platform activity" userName="Super Admin" unreadNotifications={2} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total customers" value={totalCustomers.toLocaleString()} change={`${customerGrowth} %`} up icon={Users} iconBg="bg-blue-50 text-blue-500" />
        <StatCard label="Total revenue" value={`₦${(totalRevenue / 1000000).toFixed(1)}M`} change={`${revenueGrowth} %`} up icon={DollarSign} iconBg="bg-emerald-50 text-emerald-500" />
        <StatCard label="Total bookings" value={totalBookings.toLocaleString()} change={`${bookingGrowth} %`} up icon={Calendar} iconBg="bg-amber-50 text-amber-500" />
        <StatCard label="Subscription rev." value={`₦${(subscriptionRevenue / 1000000).toFixed(2)}M`} change="12.4 %" up icon={CreditCard} iconBg="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={totalOrders.toLocaleString()} change={`${orderGrowth} %`} up icon={Package} iconBg="bg-cyan-50 text-cyan-500" />
        <StatCard label="Companies" value={totalCompanies} icon={Building2} iconBg="bg-indigo-50 text-indigo-500" />
        <StatCard label="Active subscriptions" value={activeSubscriptions} icon={CreditCard} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard label="Products listed" value={totalProducts.toLocaleString()} icon={Package} iconBg="bg-rose-50 text-rose-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue bar chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Platform Revenue</h2>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-300 inline-block" />Subscriptions</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />Marketplace</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-[9px] text-gray-300 h-44 text-right pr-1">
              {["700K","600K","500K","400K","300K","200K","100K","0"].map((l) => <span key={l}>{l}</span>)}
            </div>
            <div className="flex-1"><BarChart data={chartData} /></div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
            <span className="font-bold text-gray-900 text-sm">{formatCurrency(chartData[chartData.length - 1]?.value ?? 0)}</span>
            <span className="flex items-center gap-0.5 text-emerald-500 text-xs font-semibold">
              <TrendingUp className="h-3 w-3" />{revenueGrowth} %
            </span>
          </div>
        </div>

        {/* Subscription plan breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Subscriptions by Plan</h2>
          <div className="space-y-4">
            {planBreakdown.map(({ name, count, revenue, pct }, i) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: COUNTRY_COLORS[i] }} />
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: COUNTRY_COLORS[i] }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{count} companies</span>
                  <span className="font-semibold text-gray-700">{formatCurrency(revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top companies table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Top Companies</h2>
            <a href="/super-admin/companies" className="text-xs text-emerald-600 hover:underline font-medium">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_COMPANIES.map((co, i) => (
              <div key={co.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-sm font-bold text-gray-300 w-5 shrink-0">{i + 1}</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{co.name}</p>
                  <p className="text-xs text-gray-400">{co.city} · {co.totalBookings} bookings</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-700">⭐ {co.rating}</p>
                  <p className="text-[10px] text-gray-400">{co.reviewCount} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent subscription activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Subscription Activity</h2>
            <a href="/super-admin/subscriptions" className="text-xs text-emerald-600 hover:underline font-medium">Manage</a>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_SUBSCRIPTIONS.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                  sub.status === "active" ? "bg-emerald-100" :
                  sub.status === "pending_payment" ? "bg-amber-100" : "bg-red-100"
                )}>
                  <CreditCard className={cn("h-3.5 w-3.5",
                    sub.status === "active" ? "text-emerald-600" :
                    sub.status === "pending_payment" ? "text-amber-600" : "text-red-500"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{sub.companyName}</p>
                  <p className="text-xs text-gray-400">{sub.planName} · {sub.interval}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-emerald-600">{formatCurrency(sub.amount)}</p>
                  <span className={cn("text-[10px] font-semibold capitalize",
                    sub.status === "active" ? "text-emerald-600" :
                    sub.status === "pending_payment" ? "text-amber-600" : "text-red-500"
                  )}>
                    {sub.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
