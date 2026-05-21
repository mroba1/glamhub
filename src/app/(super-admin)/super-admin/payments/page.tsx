"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Eye, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonTable } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "RE_UPLOAD_REQUESTED";

interface Payment {
  id: string;
  companyId: string;
  planName: string;
  interval: string;
  amount: number;
  screenshotUrl?: string;
  reference?: string;
  status: PaymentStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  company: { name: string; slug: string };
}

const STATUS_STYLE: Record<PaymentStatus, string> = {
  PENDING:             "bg-amber-100 text-amber-700",
  APPROVED:            "bg-emerald-100 text-emerald-700",
  REJECTED:            "bg-red-100 text-red-600",
  RE_UPLOAD_REQUESTED: "bg-blue-100 text-blue-600",
};

export default function SuperAdminPaymentsPage() {
  const [payments, setPayments]   = useState<Payment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<"all" | PaymentStatus>("all");
  const [selected, setSelected]   = useState<Payment | null>(null);
  const [confirm, setConfirm]     = useState<{ type: "approve" | "reject" | "reupload"; p: Payment } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api("/subscriptions/payments");
      setPayments(res.data || []);
    } catch (e: any) {
      toast.error("Failed to load payments: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const filtered = payments.filter((p) => filter === "all" || p.status === filter);

  const handleAction = async (type: "approve" | "reject" | "reupload", p: Payment) => {
    setIsLoading(true);
    try {
      await api(`/subscriptions/payments/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          action: type === "approve" ? "approve" : "reject",
          note: type === "reupload" ? "Please re-upload your payment proof." : undefined,
        }),
      });
      toast.success(
        type === "approve" ? `Payment approved — ${p.company.name} activated` :
        type === "reject"  ? `Payment rejected — ${p.company.name} notified` :
        `Re-upload requested from ${p.company.name}`
      );
      fetchPayments(); // refresh list
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
      setConfirm(null);
    }
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Payments" subtitle="Review subscription payment submissions" userName="Super Admin"
        unreadNotifications={pendingCount} showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {pendingCount > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <strong>{pendingCount} payment{pendingCount > 1 ? "s" : ""} awaiting review.</strong> Companies are waiting for access.
            </p>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(["all", "PENDING", "APPROVED", "REJECTED", "RE_UPLOAD_REQUESTED"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={cn("rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                  filter === s ? "bg-emerald-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
                {s === "all" ? `All (${payments.length})` : s.replace(/_/g, " ").toLowerCase()}
              </button>
            ))}
          </div>
          <button onClick={fetchPayments} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {loading ? <SkeletonTable rows={4} /> : filtered.length === 0 ? (
          <EmptyState icon={DollarSign} title="No payments found"
            description={payments.length === 0 ? "No payment submissions yet. Companies pay after selecting a plan." : "No payments match this filter."} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Company", "Plan", "Amount", "Submitted", "Reference", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-gray-800">{p.company.name}</p>
                        <p className="text-xs text-gray-400">{p.company.slug}</p>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600">{p.planName} / {p.interval?.toLowerCase()}</td>
                      <td className="py-3.5 px-5 font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                      <td className="py-3.5 px-5 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(p.createdAt)}</td>
                      <td className="py-3.5 px-5 font-mono text-xs text-gray-400">{p.reference || "—"}</td>
                      <td className="py-3.5 px-5">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                          STATUS_STYLE[p.status] || "bg-gray-100 text-gray-500")}>
                          {p.status === "PENDING" && <Clock className="h-3 w-3" />}
                          {p.status === "APPROVED" && <CheckCircle className="h-3 w-3" />}
                          {p.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                          {p.status.replace(/_/g, " ").toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex gap-1 items-center">
                          <button onClick={() => setSelected(p)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all" title="View screenshot">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {p.status === "PENDING" && (
                            <>
                              <button onClick={() => setConfirm({ type: "approve", p })}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all" title="Approve">
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setConfirm({ type: "reject", p })}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all" title="Reject">
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment — {selected.company.name}</h2>

            {/* Screenshot */}
            {selected.screenshotUrl ? (
              <div className="rounded-xl overflow-hidden border border-gray-100 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.screenshotUrl} alt="Payment proof" className="w-full max-h-64 object-contain bg-gray-50" />
              </div>
            ) : (
              <div className="rounded-xl bg-gray-100 h-40 flex items-center justify-center mb-4">
                <p className="text-sm text-gray-400">No screenshot uploaded yet</p>
              </div>
            )}

            <div className="space-y-2 text-sm mb-5">
              {[
                { label: "Company",   value: selected.company.name },
                { label: "Plan",      value: `${selected.planName} (${selected.interval?.toLowerCase()})` },
                { label: "Amount",    value: formatCurrency(selected.amount) },
                { label: "Reference", value: selected.reference || "—" },
                { label: "Submitted", value: formatDateTime(selected.createdAt) },
                { label: "Status",    value: selected.status.replace(/_/g, " ") },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800 capitalize">{value}</span>
                </div>
              ))}
            </div>

            {selected.status === "PENDING" && (
              <div className="flex gap-2 mb-3">
                <button onClick={() => { setSelected(null); setConfirm({ type: "reject", p: selected }); }}
                  className="flex-1 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50">Reject</button>
                <button onClick={() => { setSelected(null); setConfirm({ type: "approve", p: selected }); }}
                  className="flex-1 bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-600">Approve</button>
              </div>
            )}
            <button onClick={() => setSelected(null)}
              className="w-full border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={() => setConfirm(null)}
        title={confirm?.type === "approve" ? "Approve Payment?" : "Reject Payment?"}
        description={
          confirm?.type === "approve"
            ? `Approve payment from ${confirm?.p.company.name}? Their subscription will activate immediately.`
            : `Reject payment from ${confirm?.p.company.name}? They will be notified.`
        }
        confirmLabel={confirm?.type === "approve" ? "Approve & Activate" : "Reject"}
        variant={confirm?.type === "reject" ? "destructive" : "default"}
        onConfirm={() => confirm && handleAction(confirm.type, confirm.p)}
        isLoading={isLoading}
      />
    </div>
  );
}
