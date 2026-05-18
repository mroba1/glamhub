"use client";
import { useState } from "react";
import { CheckCircle, XCircle, RefreshCw, Eye, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import { MOCK_PAYMENTS } from "@/constants/mock-data";
import type { Payment, PaymentStatus } from "@/types";
import { toast } from "sonner";

const STATUS_STYLE: Record<PaymentStatus, string> = {
  pending:             "bg-amber-100 text-amber-700",
  approved:            "bg-emerald-100 text-emerald-700",
  rejected:            "bg-red-100 text-red-600",
  re_upload_requested: "bg-blue-100 text-blue-600",
};

export default function SuperAdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [selected, setSelected] = useState<Payment | null>(null);
  const [confirm, setConfirm] = useState<{ type: "approve" | "reject" | "reupload"; p: Payment } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = payments.filter((p) => filter === "all" || p.status === filter);
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  const handleAction = async (type: "approve" | "reject" | "reupload", p: Payment) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newStatus: PaymentStatus = type === "approve" ? "approved" : type === "reject" ? "rejected" : "re_upload_requested";
    setPayments((prev) => prev.map((x) => x.id === p.id
      ? { ...x, status: newStatus, reviewNote: type === "reject" ? rejectNote : undefined, reviewedAt: new Date().toISOString(), reviewedBy: "Super Admin" }
      : x
    ));
    setConfirm(null);
    setRejectNote("");
    setIsLoading(false);
    toast.success(
      type === "approve" ? `Payment approved — ${p.companyName} activated` :
      type === "reject" ? `Payment rejected — ${p.companyName} notified` :
      `Re-upload requested from ${p.companyName}`
    );
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Payments" subtitle="Review subscription payment submissions" userName="Super Admin" unreadNotifications={pendingCount} showTimePeriod={false} />

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
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected", "re_upload_requested"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                filter === s ? "bg-emerald-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300"
              )}>
              {s === "all" ? `All (${payments.length})` : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {payments.length === 0 ? (
          <EmptyState icon={DollarSign} title="No payments yet" description="Subscription payment submissions from companies will appear here." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Company", "Plan", "Amount", "Submitted", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-gray-800">{p.companyName}</p>
                        <p className="text-xs text-gray-400">Ref: {p.reference}</p>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600">{p.planName} / {p.interval}</td>
                      <td className="py-3.5 px-5 font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                      <td className="py-3.5 px-5 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(p.submittedAt)}</td>
                      <td className="py-3.5 px-5">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLE[p.status])}>
                          {p.status === "pending" && <Clock className="h-3 w-3" />}
                          {p.status === "approved" && <CheckCircle className="h-3 w-3" />}
                          {p.status === "rejected" && <XCircle className="h-3 w-3" />}
                          {p.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex gap-1 items-center">
                          <button onClick={() => setSelected(p)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all" title="View screenshot">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {p.status === "pending" && (
                            <>
                              <button onClick={() => setConfirm({ type: "approve", p })} className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all" title="Approve">
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setConfirm({ type: "reject", p })} className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all" title="Reject">
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => setConfirm({ type: "reupload", p })} className="h-7 w-7 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-50 transition-all" title="Request re-upload">
                                <RefreshCw className="h-3.5 w-3.5" />
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

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Screenshot</h2>
            <div className="rounded-xl bg-gray-100 h-48 flex items-center justify-center mb-4">
              <p className="text-sm text-gray-400">Screenshot preview would appear here</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Company", value: selected.companyName },
                { label: "Plan", value: `${selected.planName} (${selected.interval})` },
                { label: "Amount", value: formatCurrency(selected.amount) },
                { label: "Reference", value: selected.reference },
                { label: "Submitted", value: formatDateTime(selected.submittedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            {selected.status === "pending" && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setSelected(null); setConfirm({ type: "reject", p: selected }); }}
                  className="flex-1 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors">Reject</button>
                <button onClick={() => { setSelected(null); setConfirm({ type: "approve", p: selected }); }}
                  className="flex-1 bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">Approve</button>
              </div>
            )}
            {selected.status !== "pending" && (
              <button onClick={() => setSelected(null)} className="w-full mt-4 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Close</button>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={() => { setConfirm(null); setRejectNote(""); }}
        title={
          confirm?.type === "approve" ? "Approve Payment?" :
          confirm?.type === "reject" ? "Reject Payment?" : "Request Re-upload?"
        }
        description={
          confirm?.type === "approve"
            ? `Approve payment from ${confirm?.p.companyName}? Their subscription will be activated immediately.`
            : confirm?.type === "reject"
            ? `Reject payment from ${confirm?.p.companyName}? They will be notified to submit correct payment.`
            : `Request ${confirm?.p.companyName} to re-upload their payment proof.`
        }
        confirmLabel={confirm?.type === "approve" ? "Approve & Activate" : confirm?.type === "reject" ? "Reject" : "Request Re-upload"}
        variant={confirm?.type === "reject" ? "destructive" : "default"}
        onConfirm={() => confirm && handleAction(confirm.type, confirm.p)}
        isLoading={isLoading}
      />
    </div>
  );
}
