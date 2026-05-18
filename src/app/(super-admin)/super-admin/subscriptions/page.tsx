"use client";
import { useState } from "react";
import {
  CheckCircle, XCircle, Clock, Eye, CreditCard,
  TrendingUp, Building2, AlertTriangle, DollarSign,
} from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  MOCK_SUBSCRIPTIONS, MOCK_SUBSCRIPTION_PLANS, MOCK_ANALYTICS,
} from "@/constants/mock-data";
import type { Subscription, SubscriptionStatus } from "@/types";
import { toast } from "sonner";

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; icon: React.ElementType; cls: string }> = {
  active:          { label: "Active",           icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700" },
  expired:         { label: "Expired",          icon: XCircle,     cls: "bg-red-100 text-red-600" },
  pending_payment: { label: "Pending Review",   icon: Clock,       cls: "bg-amber-100 text-amber-600" },
  cancelled:       { label: "Cancelled",        icon: XCircle,     cls: "bg-gray-100 text-gray-500" },
  trial:           { label: "Trial",            icon: Clock,       cls: "bg-blue-100 text-blue-600" },
};

function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.cancelled;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.cls)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function SuperAdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [statusFilter, setStatusFilter] = useState<"all" | SubscriptionStatus>("all");
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject"; sub: Subscription } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = subscriptions.filter((s) =>
    statusFilter === "all" || s.status === statusFilter
  );

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    pending: subscriptions.filter((s) => s.status === "pending_payment").length,
    expired: subscriptions.filter((s) => s.status === "expired").length,
    revenue: subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.amount, 0),
  };

  const handleReview = async (type: "approve" | "reject", sub: Subscription) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? { ...s, status: type === "approve" ? "active" : "expired", approvedBy: "Super Admin", approvedAt: new Date().toISOString() }
          : s
      )
    );
    setConfirmAction(null);
    setIsLoading(false);
    toast.success(`Subscription ${type === "approve" ? "approved" : "rejected"} — ${sub.companyName} notified.`);
  };

  const planRevenue = MOCK_SUBSCRIPTION_PLANS.map((plan) => {
    const subs = subscriptions.filter((s) => s.planId === plan.id && s.status === "active");
    return { plan: plan.name, count: subs.length, revenue: subs.reduce((sum, s) => sum + s.amount, 0) };
  });

  return (
    <div className="space-y-6">
      <AdminTopBar
        title="Subscriptions"
        subtitle="Manage company subscriptions and payments"
        userName="Super Admin"
        showTimePeriod={false}
        unreadNotifications={stats.pending}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { label: "Total Companies", value: stats.total, icon: Building2, iconBg: "bg-blue-50 text-blue-500", change: undefined },
          { label: "Active Plans", value: stats.active, icon: CheckCircle, iconBg: "bg-emerald-50 text-emerald-600", change: undefined },
          { label: "Pending Review", value: stats.pending, icon: Clock, iconBg: "bg-amber-50 text-amber-600", change: undefined },
          { label: "Expired", value: stats.expired, icon: XCircle, iconBg: "bg-red-50 text-red-500", change: undefined },
          { label: "Subscription Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, iconBg: "bg-purple-50 text-purple-600", change: "+12.4%" },
        ].map(({ label, value, icon: Icon, iconBg, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              {change && (
                <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-500">
                  <TrendingUp className="h-3 w-3" />{change}
                </div>
              )}
            </div>
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Pending payment alert */}
      {stats.pending > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <strong>{stats.pending} payment{stats.pending > 1 ? "s" : ""} awaiting review.</strong> Companies are waiting for access — please review promptly.
          </p>
        </div>
      )}

      {/* Revenue by plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {planRevenue.map(({ plan, count, revenue }) => (
          <div key={plan} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-800">{plan} Plan</p>
              <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 font-medium">{count} active</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(revenue)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total active revenue</p>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${stats.active > 0 ? (count / stats.active) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "active", "pending_payment", "expired", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
              statusFilter === s
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300"
            )}
          >
            {s === "all" ? `All (${subscriptions.length})` : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Subscriptions table */}
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
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{sub.companyName}</p>
                        <p className="text-[10px] text-gray-400">{sub.companyId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-gray-700 font-medium">{sub.planName}</td>
                  <td className="py-3.5 px-5 capitalize text-gray-500">{sub.interval}</td>
                  <td className="py-3.5 px-5 font-bold text-emerald-600">{formatCurrency(sub.amount)}</td>
                  <td className="py-3.5 px-5 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(sub.startDate)} → {formatDate(sub.endDate)}
                  </td>
                  <td className="py-3.5 px-5">
                    <SubscriptionStatusBadge status={sub.status} />
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelected(sub)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {sub.status === "pending_payment" && (
                        <>
                          <button
                            onClick={() => setConfirmAction({ type: "approve", sub })}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all"
                            title="Approve payment"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: "reject", sub })}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
                            title="Reject payment"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {sub.status === "expired" && (
                        <button
                          onClick={() => setConfirmAction({ type: "approve", sub })}
                          className="text-xs text-emerald-600 hover:underline font-medium px-1"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{selected.companyName}</h2>
              <SubscriptionStatusBadge status={selected.status} />
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Plan", value: selected.planName },
                { label: "Billing Interval", value: selected.interval },
                { label: "Amount", value: formatCurrency(selected.amount) },
                { label: "Start Date", value: formatDate(selected.startDate) },
                { label: "End Date", value: formatDate(selected.endDate) },
                { label: "Payment Reference", value: selected.paymentReference ?? "—" },
                { label: "Approved By", value: selected.approvedBy ?? "Pending" },
                { label: "Approved At", value: selected.approvedAt ? formatDate(selected.approvedAt) : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-semibold text-gray-800 capitalize">{value}</span>
                </div>
              ))}
            </div>
            {selected.paymentProofUrl && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Payment Proof</p>
                  <a href={selected.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline">
                    View screenshot →
                  </a>
                </div>
              </div>
            )}
            {selected.status === "pending_payment" && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setSelected(null); setConfirmAction({ type: "reject", sub: selected }); }}
                  className="flex-1 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => { setSelected(null); setConfirmAction({ type: "approve", sub: selected }); }}
                  className="flex-1 bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Approve Payment
                </button>
              </div>
            )}
            {selected.status !== "pending_payment" && (
              <button onClick={() => setSelected(null)} className="w-full mt-5 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        title={confirmAction?.type === "approve" ? "Approve Subscription Payment?" : "Reject Subscription Payment?"}
        description={
          confirmAction?.type === "approve"
            ? `Approving will immediately activate ${confirmAction?.sub.companyName}'s ${confirmAction?.sub.planName} plan. They will receive a confirmation notification.`
            : `Rejecting will deny access to ${confirmAction?.sub.companyName}. They will be notified to re-submit payment.`
        }
        confirmLabel={confirmAction?.type === "approve" ? "Approve & Activate" : "Reject Payment"}
        variant={confirmAction?.type === "reject" ? "destructive" : "default"}
        onConfirm={() => confirmAction && handleReview(confirmAction.type, confirmAction.sub)}
        isLoading={isLoading}
      />
    </div>
  );
}
