"use client";
import { useState } from "react";
import {
  CheckCircle, Clock, XCircle, CreditCard, Calendar,
  Upload, AlertTriangle, Zap, Shield, Star, ChevronRight, RefreshCw,
} from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { UploadZone } from "@/components/shared/upload-zone";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { MOCK_SUBSCRIPTION_PLANS, MOCK_SUBSCRIPTIONS } from "@/constants/mock-data";
import type { SubscriptionInterval, SubscriptionPlan } from "@/types";
import { toast } from "sonner";

const PLAN_ICONS = [Zap, Shield, Star];

function PlanCard({
  plan,
  interval,
  selected,
  onSelect,
}: {
  plan: SubscriptionPlan;
  interval: SubscriptionInterval;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const yearlyDiscount = Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100);
  const Icon = PLAN_ICONS[MOCK_SUBSCRIPTION_PLANS.indexOf(plan)] ?? Zap;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative text-left w-full rounded-2xl border-2 p-5 transition-all duration-200",
        selected
          ? "border-emerald-500 bg-emerald-50 shadow-md"
          : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-sm"
      )}
    >
      {plan.isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-3 py-0.5 whitespace-nowrap">
          Most Popular
        </span>
      )}
      {selected && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        </div>
      )}

      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", selected ? "bg-emerald-500" : "bg-gray-100")}>
        <Icon className={cn("h-5 w-5", selected ? "text-white" : "text-gray-500")} />
      </div>

      <h3 className="font-bold text-gray-900 mb-0.5">{plan.name}</h3>
      <p className="text-xs text-gray-400 mb-4">{plan.description}</p>

      <div className="mb-4">
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</span>
          <span className="text-xs text-gray-400 mb-1">/{interval === "monthly" ? "mo" : "yr"}</span>
        </div>
        {interval === "yearly" && (
          <span className="text-xs text-emerald-600 font-semibold">Save {yearlyDiscount}% vs monthly</span>
        )}
      </div>

      <ul className="space-y-1.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

export default function AdminBillingPage() {
  const currentSub = MOCK_SUBSCRIPTIONS.find((s) => s.companyId === "co1") ?? MOCK_SUBSCRIPTIONS[0];
  const [interval, setInterval] = useState<SubscriptionInterval>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [step, setStep] = useState<"plan" | "payment" | "pending">("plan");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isExpiringSoon = (currentSub?.daysRemaining ?? 0) <= 14 && (currentSub?.daysRemaining ?? 0) > 0;
  const isExpired = currentSub?.status === "expired";
  const isPendingPayment = currentSub?.status === "pending_payment";

  const handleSubmitPayment = async () => {
    if (!paymentFile || !paymentRef) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep("pending");
    toast.success("Payment submitted!", { description: "Awaiting Glam Hub review. You'll be notified once approved." });
  };

  return (
    <div className="space-y-6">
      <AdminTopBar title="Billing & Subscription" subtitle="Manage your platform access plan" userName="Studio Admin" showTimePeriod={false} />

      {/* Current subscription status */}
      <div className={cn(
        "rounded-2xl border-2 p-5",
        isExpired ? "border-red-200 bg-red-50" :
        isPendingPayment ? "border-amber-200 bg-amber-50" :
        isExpiringSoon ? "border-amber-200 bg-amber-50" :
        "border-emerald-200 bg-emerald-50"
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
              isExpired ? "bg-red-100" : isPendingPayment ? "bg-amber-100" : "bg-emerald-100"
            )}>
              {isExpired ? <XCircle className="h-5 w-5 text-red-600" /> :
               isPendingPayment ? <Clock className="h-5 w-5 text-amber-600" /> :
               <CheckCircle className="h-5 w-5 text-emerald-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900">{currentSub?.planName ?? "No Plan"} Plan</p>
                <span className={cn("text-[10px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wide",
                  isExpired ? "bg-red-100 text-red-600" :
                  isPendingPayment ? "bg-amber-100 text-amber-600" :
                  isExpiringSoon ? "bg-amber-100 text-amber-600" :
                  "bg-emerald-100 text-emerald-700"
                )}>
                  {currentSub?.status?.replace(/_/g, " ") ?? "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {isExpired ? "Your subscription has expired. Renew to regain admin access." :
                 isPendingPayment ? "Payment uploaded — awaiting Glam Hub approval." :
                 isExpiringSoon ? `Expires in ${currentSub?.daysRemaining} days — renew now to avoid interruption.` :
                 `Active until ${formatDate(currentSub?.endDate ?? "")} · ${currentSub?.daysRemaining} days remaining`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">Billed {currentSub?.interval}</p>
              <p className="font-bold text-gray-900">{formatCurrency(currentSub?.amount ?? 0)}</p>
            </div>
            {(isExpired || isExpiringSoon) && (
              <button
                onClick={() => setStep("plan")}
                className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Renew Now
              </button>
            )}
          </div>
        </div>

        {/* Subscription history details */}
        {!isExpired && !isPendingPayment && (
          <div className="mt-4 pt-4 border-t border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Plan", value: currentSub?.planName },
              { label: "Billing", value: currentSub?.interval === "monthly" ? "Monthly" : "Yearly" },
              { label: "Started", value: formatDate(currentSub?.startDate ?? "") },
              { label: "Expires", value: formatDate(currentSub?.endDate ?? "") },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{value}</p>
              </div>
            ))}
          </div>
        )}

        {isPendingPayment && (
          <div className="mt-3 flex items-center gap-2 text-amber-700 text-sm">
            <Clock className="h-4 w-4" />
            Payment reference: <span className="font-mono font-semibold">{currentSub?.paymentReference}</span>
          </div>
        )}
      </div>

      {/* Expiry warning */}
      {isExpiringSoon && !isExpired && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <strong>Action required:</strong> Your subscription expires in {currentSub?.daysRemaining} days. Renew before {formatDate(currentSub?.endDate ?? "")} to maintain uninterrupted access to your admin dashboard.
          </p>
        </div>
      )}

      {/* Step: Plan selection */}
      {step === "plan" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Choose a Plan</h2>
            {/* Toggle monthly / yearly */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {(["monthly", "yearly"] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setInterval(i)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all",
                    interval === i ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {i}
                  {i === "yearly" && <span className="ml-1.5 text-[10px] text-emerald-500 font-bold">-17%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                interval={interval}
                selected={selectedPlan?.id === plan.id}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep("payment")}
              disabled={!selectedPlan}
              className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Payment
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Payment */}
      {step === "payment" && selectedPlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment instructions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Make Payment</h2>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Transfer Details</p>
              <div className="space-y-2">
                {[
                  { label: "Bank", value: "First Bank of Nigeria" },
                  { label: "Account Number", value: "2089 4567 3321" },
                  { label: "Account Name", value: "Glam Hub Ltd" },
                  { label: "Amount", value: formatCurrency(interval === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice) },
                  { label: "Reference", value: `GLAMHUB-${selectedPlan.name.toUpperCase()}-${Date.now().toString().slice(-6)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className={cn("text-sm font-semibold", label === "Amount" ? "text-emerald-600 text-base" : label === "Reference" ? "font-mono text-xs text-gray-700" : "text-gray-800")}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                Use the reference code above as your transfer narration so we can identify your payment.
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-2">Order Summary</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{selectedPlan.name} Plan ({interval})</span>
                <span className="font-bold text-gray-900">{formatCurrency(interval === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice)}</span>
              </div>
            </div>
          </div>

          {/* Upload proof */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Upload Payment Proof</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <UploadZone
                label="Payment Screenshot or Receipt"
                hint="Upload your bank transfer confirmation"
                onFilesSelected={(f) => setPaymentFile(f[0])}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Payment Reference / Narration</label>
                <input
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g., GLAMHUB-GROWTH-284719"
                  className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep("plan")}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={!paymentFile || !paymentRef || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Submitting…</>
                  ) : (
                    <><Upload className="h-4 w-4" />Submit Payment</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Pending */}
      {step === "pending" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Awaiting Approval</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your payment proof has been submitted and is under review by the Glam Hub team. You&apos;ll receive a notification once approved — usually within 24 hours.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Plan</span><span className="font-semibold text-gray-800">{selectedPlan?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Billing</span><span className="font-semibold text-gray-800 capitalize">{interval}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Amount</span><span className="font-semibold text-emerald-600">{formatCurrency(interval === "monthly" ? (selectedPlan?.monthlyPrice ?? 0) : (selectedPlan?.yearlyPrice ?? 0))}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Reference</span><span className="font-mono text-xs text-gray-700">{paymentRef}</span></div>
          </div>
          <button onClick={() => setStep("plan")} className="text-sm text-emerald-600 hover:underline font-medium">
            Change Plan or Re-upload
          </button>
        </div>
      )}

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                {["Plan", "Amount", "Interval", "Period", "Status", "Reference"].map((h) => (
                  <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SUBSCRIPTIONS.filter((s) => s.companyId === "co1").map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-gray-800">{sub.planName}</td>
                  <td className="py-3.5 px-5 font-semibold text-emerald-600">{formatCurrency(sub.amount)}</td>
                  <td className="py-3.5 px-5 capitalize text-gray-600">{sub.interval}</td>
                  <td className="py-3.5 px-5 text-gray-500 text-xs">{formatDate(sub.startDate)} → {formatDate(sub.endDate)}</td>
                  <td className="py-3.5 px-5">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                      sub.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      sub.status === "expired" ? "bg-red-100 text-red-600" :
                      sub.status === "pending_payment" ? "bg-amber-100 text-amber-600" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {sub.status === "active" && <CheckCircle className="h-3 w-3" />}
                      {sub.status === "expired" && <XCircle className="h-3 w-3" />}
                      {sub.status === "pending_payment" && <Clock className="h-3 w-3" />}
                      {sub.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-gray-400">{sub.paymentReference ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
