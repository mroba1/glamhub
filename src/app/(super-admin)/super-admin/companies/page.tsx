"use client";
import { useState, useEffect } from "react";
import { Search, Building2, CheckCircle, XCircle, Eye, Globe, ExternalLink, Users, Copy, RefreshCw } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { COMPANY_STATUSES } from "@/constants";
import { formatDate, cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Company, CompanyStatus } from "@/types";

const BASE = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export default function SuperAdminCompaniesPage() {
  const [companies, setCompanies]       = useState<Company[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]         = useState<Company | null>(null);
  const [confirm, setConfirm]           = useState<{ type: "activate" | "suspend"; company: Company } | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [copied, setCopied]             = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api("/companies");
      setCompanies(res.data?.data || res.data || []);
    } catch (e: any) {
      toast.error("Failed to load companies: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const filtered = companies.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase());
    // Compare case-insensitively — backend returns UPPERCASE, constants use UPPERCASE now
    const matchStatus = statusFilter === "all" || c.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const handleAction = async (type: "activate" | "suspend", company: Company) => {
    setIsLoading(true);
    try {
      const newStatus: CompanyStatus = type === "activate" ? "active" : "suspended";
      await api(`/companies/${company.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });
      setCompanies((prev) => prev.map((c) => c.id === company.id ? { ...c, status: newStatus } : c));
      toast.success(`Company ${type === "activate" ? "activated" : "suspended"}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
      setConfirm(null);
    }
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
      <AdminTopBar title="Companies" subtitle={`${companies.length} registered companies`} userName="Super Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMPANY_STATUSES.map((s) => (
            <div key={s.value} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {companies.filter((c) => c.status?.toUpperCase() === s.value).length}
              </p>
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
              className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === "all" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
              All ({companies.length})
            </button>
            {COMPANY_STATUSES.map((s) => (
              <button key={s.value} onClick={() => setStatusFilter(s.value)}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === s.value ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={fetchCompanies} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600 transition-colors px-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {/* Companies grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Building2} title="No companies found"
            description={companies.length === 0 ? "No businesses have registered yet. Share the join link to get started." : "No companies match your current filters."} />
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
                        <p className="text-xs text-gray-400">{co.city || "—"}, {co.state || "—"}</p>
                      </div>
                    </div>
                    <StatusBadge status={co.status} />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {[
                      { label: "Products",  value: co.totalProducts || 0 },
                      { label: "Bookings",  value: co.totalBookings || 0 },
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
                      <Globe className="h-3 w-3" /> Customer Link
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-[11px] text-blue-700 truncate flex-1">{customerLink}</code>
                      <button onClick={() => copyLink(`site-${co.id}`, customerLink)}
                        className={cn("h-6 px-2 rounded-md text-[10px] font-semibold transition-all shrink-0",
                          copied === `site-${co.id}` ? "bg-emerald-500 text-white" : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50")}>
                        {copied === `site-${co.id}` ? "✓" : "Copy"}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">Joined: {formatDate(co.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
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
                { label: "Phone",    value: selected.phone || "—" },
                { label: "Location", value: `${selected.address || ""} ${selected.city || ""} ${selected.state || ""}`.trim() || "—" },
                { label: "Slug",     value: selected.slug },
                { label: "Status",   value: selected.status },
                { label: "Joined",   value: formatDate(selected.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800 capitalize text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Access Links</p>
              {[
                { label: "Customer Site",     url: `${BASE}/${selected.slug}` },
                { label: "Customer Register", url: `${BASE}/${selected.slug}/register` },
              ].map(({ label, url }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
                  <code className="text-xs text-gray-600 flex-1 truncate">{url}</code>
                  <button onClick={() => copyLink(`modal-${label}`, url)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50">
                    {copied === `modal-${label}` ? "✓" : <Copy className="h-3 w-3" />}
                  </button>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="h-6 w-6 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-50">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {selected.status === "active" ? (
                <button onClick={() => { setSelected(null); setConfirm({ type: "suspend", company: selected }); }}
                  className="flex-1 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50">Suspend</button>
              ) : (
                <button onClick={() => { setSelected(null); setConfirm({ type: "activate", company: selected }); }}
                  className="flex-1 bg-emerald-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-600">Activate</button>
              )}
              <button onClick={() => setSelected(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Close</button>
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
