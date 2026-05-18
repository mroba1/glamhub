"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Users, Calendar, Package, Star, Plus, MoreHorizontal, CheckCircle, Circle, Copy, ExternalLink, CreditCard, Paintbrush, Globe } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { MOCK_BOOKINGS, MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_ANALYTICS } from "@/constants/mock-data";
import { useBrandingStore } from "@/store/branding.store";
import { useAuthStore } from "@/store/auth.store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

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
  const max = Math.max(...data.map((d) => Math.max(d.value, d.secondary)), 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full flex gap-0.5 items-end" style={{ height: "128px" }}>
            <div className="flex-1 rounded-t-md bg-blue-200 group-hover:bg-blue-400 transition-colors" style={{ height: `${(d.secondary / max) * 128}px` }} />
            <div className="flex-1 rounded-t-md bg-emerald-400 group-hover:bg-emerald-500 transition-colors" style={{ height: `${(d.value / max) * 128}px` }} />
          </div>
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const DONUT_DATA = [
  { label: "Hair Care",  pct: 28, color: "#6366f1" },
  { label: "Skin Care",  pct: 22, color: "#10b981" },
  { label: "Makeup",     pct: 18, color: "#f59e0b" },
  { label: "Nail Care",  pct: 14, color: "#ec4899" },
  { label: "Fragrance",  pct: 10, color: "#06b6d4" },
  { label: "Others",     pct: 8,  color: "#8b5cf6" },
];

function DonutChart() {
  const radius = 60; const cx = 80; const cy = 80; const sw = 24;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" className="shrink-0">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
        {DONUT_DATA.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const seg = (
            <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={d.color} strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#111827" fontSize="13" fontWeight="700">100%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#9ca3af" fontSize="9">Total</text>
      </svg>
      <div className="grid grid-cols-1 gap-1.5 flex-1">
        {DONUT_DATA.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-gray-500 flex-1">{d.label}</span>
            <span className="text-xs font-semibold text-gray-700">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const branding = useBrandingStore((s) => s.branding);
  const [copied, setCopied] = useState(false);

  const pendingBookings = MOCK_BOOKINGS.filter((b) => b.status === "pending").length;
  const revenue = MOCK_BOOKINGS.filter((b) => b.status !== "rejected").reduce((s, b) => s + b.servicePrice, 0);
  const chartData = MOCK_ANALYTICS.revenueChart.slice(0, 8).map((d) => ({ label: d.label, value: d.value, secondary: d.secondary ?? 0 }));

  // Derive company slug from branding business name
  const companySlug = (branding.businessName || user?.name || "my-salon")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const customerLink = `${BASE_URL}/${companySlug}`;

  // Onboarding steps
  const steps = [
    { id: "register",  label: "Create your account",        done: !!user,                    href: "/join",                  icon: CheckCircle },
    { id: "pay",       label: "Choose a subscription plan", done: false,                     href: "/admin/billing",          icon: CreditCard },
    { id: "customize", label: "Customize your mini-site",   done: !!branding.businessName,   href: "/admin/customization",    icon: Paintbrush },
    { id: "live",      label: "Share your customer link",   done: false,                     href: customerLink,              icon: Globe },
  ];
  const completedSteps = steps.filter((s) => s.done).length;
  const isLive = completedSteps >= 3;

  const copyLink = () => {
    navigator.clipboard.writeText(customerLink).then(() => {
      setCopied(true);
      toast.success("Customer link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Dashboard" subtitle={`Welcome back, ${user?.name ?? "Admin"}`} userName={user?.name ?? "Admin"} unreadNotifications={pendingBookings} />

      <div className="p-4 md:p-6 space-y-6">

        {/* ── Onboarding checklist ── */}
        {!isLive && (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div>
                <h2 className="font-semibold text-gray-900">Get Started</h2>
                <p className="text-xs text-gray-400 mt-0.5">Complete these steps to launch your mini-site</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">
                {completedSteps}/{steps.length} complete
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(completedSteps / steps.length) * 100}%` }} />
            </div>
            <div className="divide-y divide-gray-50">
              {steps.map(({ id, label, done, href, icon: Icon }) => (
                <a key={id} href={href} target={id === "live" ? "_blank" : undefined} rel="noopener noreferrer"
                  className={cn("flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group", done && "opacity-70")}>
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    done ? "bg-emerald-500" : "border-2 border-gray-200")}>
                    {done
                      ? <CheckCircle className="h-4 w-4 text-white" />
                      : <Circle className="h-3 w-3 text-gray-300" />}
                  </div>
                  <span className={cn("text-sm flex-1", done ? "text-gray-400 line-through" : "text-gray-700 font-medium")}>{label}</span>
                  {!done && (
                    <span className="text-xs text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {id === "live" ? "Open →" : "Go →"}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Customer link ── */}
        <div className={cn("rounded-2xl border p-5", isLive ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-white shadow-sm")}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your Customer Link</p>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-500 shrink-0" />
                <code className="text-sm font-medium text-emerald-700 break-all">{customerLink}</code>
              </div>
              <p className="text-xs text-gray-400 mt-1">Share this with your customers so they can book & shop</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={copyLink}
                className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all",
                  copied ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
              <a href={customerLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </a>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Bookings"   value={MOCK_BOOKINGS.length}  change={`${MOCK_ANALYTICS.bookingGrowth}%`}  up icon={Calendar} iconBg="bg-blue-50 text-blue-500" />
          <StatCard label="Pending Approval" value={pendingBookings}                                                       icon={Star}     iconBg="bg-amber-50 text-amber-500" />
          <StatCard label="Total Products"   value={MOCK_PRODUCTS.length}  change={`${MOCK_ANALYTICS.revenueGrowth}%`}  up icon={Package} iconBg="bg-purple-50 text-purple-500" />
          <StatCard label="Total Customers"  value={MOCK_CUSTOMERS.length} change={`${MOCK_ANALYTICS.customerGrowth}%`} up icon={Users}   iconBg="bg-emerald-50 text-emerald-600" />
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Revenue & Bookings</h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-300 inline-block" />Bookings</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />Revenue</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between text-[9px] text-gray-300 h-40 text-right pr-1">
                {["70K","60K","50K","40K","30K","20K","10K","0"].map((l) => <span key={l}>{l}</span>)}
              </div>
              <div className="flex-1"><BarChart data={chartData} /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Sales by category</h2>
              <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <DonutChart />
          </div>
        </div>

        {/* ── Recent bookings ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-xs text-emerald-600 hover:underline font-medium">View all</a>
          </div>
          {MOCK_BOOKINGS.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">No bookings yet. Share your customer link to get started.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {MOCK_BOOKINGS.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{b.customerName}</p>
                    <p className="text-xs text-gray-400 truncate">{b.serviceName} · {formatDate(b.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:block text-xs font-semibold text-emerald-600">{formatCurrency(b.servicePrice)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
