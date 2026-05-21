"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, CreditCard, TrendingUp, Building2, AlertTriangle, DollarSign, RefreshCw } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonTable } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Subscription {
  id: string;
  companyId: string;
  status: string;
  interval: string;
  amount: number;
  startDate?: string;
  endDate?: string;
  paymentProofUrl?: string;
  paymentReference?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  plan: { id: string; name: string; monthlyPrice: number; yearlyPrice: number };
  company: { name: string; slug: string };
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  ACTIVE:          { label: "Active",          cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  EXPIRED:         { label: "Expired",         cls: "bg-red-100 text-red-600",         icon: XCircle     },
  PENDING_PAYMENT: { label: "Pending Payment", cls: "bg-amber-100 text-amber-700",     icon: Clock       },
  CANCELLED:       { label: "Cancelled",       cls: "bg-gray-100 text-gray-500",       icon: XCircle     },
};

export default function SuperAdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading]             = useState(true);
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selected, setSelected]           = useState<Subscription | null>(null);
  const [confirm, setConfirm]             = useState<{ type: "approve" | "reject"; sub: Subscription } | null>(null);
  const [isLoading, setIsLoading]         = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api("/subscriptions/all");
      setSubscriptions(res.data || []);
    } catch (e: any) {
      toast.error("Failed to load subscriptions: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const stats = {
    total:   subscriptions.length,
    active:  subscriptions.filter((s) => s.status === "ACTIVE").length,
    pending: subscriptions.filter((s) => s.status === "PENDING_PAYMENT").length,
    expired: subscriptions.filter((s) => s.status === "EXPIRED").length,
    revenue: subscriptions.filter((s) => s.status === "ACTIVE").reduce((sum, s) => sum + s.amount, 0),
  };

  const filtered = subscriptions.filter((s) =>
    statusFilter === "all" || s.status === statusFilter
  );

  const planRevenue = ["starter", "growth", "enterprise"].map((planId) => {
    const subs = subscriptions.filter((s) => s.plan?.id === planId && s.status === "ACTIVE");
    return {
      plan: subs[0]?.plan?.name || planId,
      count: subs.length,
      revenue: subs.reduce((sum, s) => sum + s.amount, 0),
      pct: stats.active > 0 ? Math.round((subs.length / stats.active) * 100) : 0,
    };
  });

  return (
    <div className="space-y-0">
      <AdminTopBar title="Subscriptions" subtitle="Manage company subscriptions and payments"
        userName="Super Admin" showTimePeriod={false} unreadNotifications={stats.pending} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            { label: "Total",    value: stats.total,                    color: "text-gray-900",    icon: Building2  },
            { label: "Active",   value: stats.active,                   color: "text-emerald-600", icon: CheckCircle },
            { label: "Pending",  value: stats.pending,                  color: "text-amber-600",   icon: Clock      },
            { label: "Expired",  value: stats.expired,                  color: "text-red-500",     icon: XCircle    },
            { label: "Revenue",  value: formatCurrency(stats.revenue),  color: "text-purple-600",  icon: DollarSign },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className={cn("font-bold text-lg", color)}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {stats.pending > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <strong>{stats.pending} subscription{stats.pending > 1 ? "s" : ""} pending payment review.</strong>{" "}
              Check the <a href="/super-admin/payments" className="underline font-medium">Payments page</a> to approve them.
            </p>
          </div>
        )}

        {/* Filter + Refresh */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {(["all", "ACTIVE", "PENDING_PAYMENT", "EXPIRED", "CANCELLED"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                  statusFilter === s ? "bg-emerald-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
                {s === "all" ? `All (${subscriptions.length})` : s.replace(/_/g, " ").toLowerCase()}
              </button>
            ))}
          </div>
          <button onClick={fetchSubscriptions} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? <SkeletonTable rows={4} /> : filtered.length === 0 ? (
          <EmptyState icon={CreditCard} title="No subscriptions found"
            description={subscriptions.length === 0 ? "No companies have subscribed yet." : "No subscriptions match this filter."} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Company", "Plan", "Interval", "Amount", "Period", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((sub) => {
                    const cfg = STATUS_CONFIG[sub.status] || { label: sub.status, cls: "bg-gray-100 text-gray-500", icon: Clock };
                    const Icon = cfg.icon;
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-xs">{sub.company.name}</p>
                              <p className="text-[10px] text-gray-400">{sub.company.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-gray-700 font-medium">{sub.plan?.name}</td>
                        <td className="py-3.5 px-5 capitalize text-gray-500">{sub.interval?.toLowerCase()}</td>
                        <td className="py-3.5 px-5 font-bold text-emerald-600">{formatCurrency(sub.amount)}</td>
                        <td className="py-3.5 px-5 text-gray-400 text-xs whitespace-nowrap">
                          {sub.startDate ? `${formatDate(sub.startDate)} → ${formatDate(sub.endDate || "")}` : "—"}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.cls)}>
                            <Icon className="h-3 w-3" />{cfg.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <button onClick={() => setSelected(sub)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{selected.company.name}</h2>
            <div className="space-y-2.5 text-sm mb-5">
              {[
                { label: "Plan",      value: selected.plan?.name },
                { label: "Interval",  value: selected.interval?.toLowerCase() },
                { label: "Amount",    value: formatCurrency(selected.amount) },
                { label: "Status",    value: selected.status.replace(/_/g, " ") },
                { label: "Start",     value: selected.startDate ? formatDate(selected.startDate) : "—" },
                { label: "End",       value: selected.endDate ? formatDate(selected.endDate) : "—" },
                { label: "Reference", value: selected.paymentReference || "—" },
                { label: "Approved",  value: selected.approvedBy ? `By ${selected.approvedBy}` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800 capitalize">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)}
              className="w-full border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
