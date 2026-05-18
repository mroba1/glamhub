"use client";
import { useState } from "react";
import { Search, Building2, CheckCircle, XCircle, Eye, Globe, ExternalLink, Users, Copy } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_COMPANIES } from "@/constants/mock-data";
import { COMPANY_STATUSES } from "@/constants";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Company, CompanyStatus } from "@/types";

const BASE = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export default function SuperAdminCompaniesPage() {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]     = useState<Company | null>(null);
  const [confirm, setConfirm]       = useState<{ type: "activate" | "suspend"; company: Company } | null>(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [copied, setCopied]         = useState<string | null>(null);

  const filtered = companies.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = async (type: "activate" | "suspend", company: Company) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const newStatus: CompanyStatus = type === "activate" ? "active" : "suspended";
    setCompanies((prev) => prev.map((c) => c.id === company.id ? { ...c, status: newStatus } : c));
    setConfirm(null);
    setIsLoading(false);
    toast.success(`Company ${type === "activate" ? "activated" : "suspended"}`);
  };

  const copyLink = (key: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(key);
      toast.success("Link copied!");
      setTimeout(() => setCopied(null), 2500);
    });
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Companies" subtitle={`${companies.length} registered companies on the platform`} userName="Super Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMPANY_STATUSES.map((s) => (
            <div key={s.value} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{companies.filter((c) => c.status === s.value).length}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies…"
              className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatusFilter("all")}
              className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === "all" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>All</button>
            {COMPANY_STATUSES.map((s) => (
              <button key={s.value} onClick={() => setStatusFilter(s.value)}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === s.value ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Companies grid */}
        {filtered.length === 0 ? (
          <EmptyState icon={Building2} title="No companies found" description="Registered companies will appear here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((co) => {
              const customerLink  = `${BASE}/${co.slug}`;
              const registerLink  = `${BASE}/${co.slug}/register`;
              return (
                <div key={co.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{co.name}</p>
                        <p className="text-xs text-gray-400">{co.city}, {co.state}</p>
                      </div>
                    </div>
                    <StatusBadge status={co.status} />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {[
                      { label: "Products",  value: co.totalProducts },
                      { label: "Bookings",  value: co.totalBookings },
                      { label: "Rating",    value: co.rating > 0 ? `⭐ ${co.rating}` : "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg bg-gray-50 py-2">
                        <p className="font-bold text-gray-800">{value}</p>
                        <p className="text-gray-400 text-[10px]">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Customer links */}
                  <div className="space-y-1.5 rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Customer Links
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-[11px] text-blue-700 truncate flex-1">{customerLink}</code>
                      <button onClick={() => copyLink(`site-${co.id}`, customerLink)}
                        className={cn("h-6 px-2 rounded-md text-[10px] font-semibold transition-all shrink-0",
                          copied === `site-${co.id}` ? "bg-emerald-500 text-white" : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50")}>
                        {copied === `site-${co.id}` ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button onClick={() => setSelected(co)}
                      className="flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                      <Eye className="h-3.5 w-3.5" />Details
                    </button>
                    <a href={customerLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
                      <ExternalLink className="h-3.5 w-3.5" />View Site
                    </a>
                    {co.status === "active" ? (
                      <button onClick={() => setConfirm({ type: "suspend", company: co })}
                        className="flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                        <XCircle className="h-3.5 w-3.5" />Suspend
                      </button>
                    ) : (
                      <button onClick={() => setConfirm({ type: "activate", company: co })}
                        className="flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all">
                        <CheckCircle className="h-3.5 w-3.5" />Activate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{selected.name}</h2>
            <div className="space-y-2.5 text-sm mb-5">
              {[
                { label: "Email",    value: selected.email },
                { label: "Phone",    value: selected.phone },
                { label: "Location", value: `${selected.address}, ${selected.city}, ${selected.state}` },
                { label: "Status",   value: selected.status },
                { label: "Joined",   value: formatDate(selected.createdAt) },
                { label: "Products", value: selected.totalProducts.toString() },
                { label: "Bookings", value: selected.totalBookings.toString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800 capitalize text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>

            {/* Links in modal */}
            <div className="space-y-2 mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Access Links</p>
              {[
                { label: "Customer Site",     url: `${BASE}/${selected.slug}`,          icon: Globe },
                { label: "Customer Register", url: `${BASE}/${selected.slug}/register`, icon: Users },
              ].map(({ label, url, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
                  <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <code className="text-xs text-gray-600 flex-1 truncate">{url}</code>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => copyLink(`modal-${label}`, url)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                      {copied === `modal-${label}` ? "✓" : <Copy className="h-3 w-3" />}
                    </button>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="h-6 w-6 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {selected.status === "active" ? (
                <button onClick={() => { setSelected(null); setConfirm({ type: "suspend", company: selected }); }}
                  className="flex-1 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors">Suspend</button>
              ) : (
                <button onClick={() => { setSelected(null); setConfirm({ type: "activate", company: selected }); }}
                  className="flex-1 bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">Activate</button>
              )}
              <button onClick={() => setSelected(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={() => setConfirm(null)}
        title={`${confirm?.type === "activate" ? "Activate" : "Suspend"} Company?`}
        description={`Are you sure you want to ${confirm?.type} "${confirm?.company.name}"?`}
        confirmLabel={confirm?.type === "activate" ? "Activate" : "Suspend"}
        variant={confirm?.type === "suspend" ? "destructive" : "default"}
        onConfirm={() => confirm && handleAction(confirm.type, confirm.company)}
        isLoading={isLoading}
      />
    </div>
  );
}
