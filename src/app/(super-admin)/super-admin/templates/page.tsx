"use client";
import { useState } from "react";
import Image from "next/image";
import { FileImage, Eye, ToggleLeft, ToggleRight, Crown, Plus } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { cn } from "@/lib/utils";
import { MOCK_TEMPLATES } from "@/constants/mock-data";
import type { Template, TemplateCategory } from "@/types";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  beauty: "Beauty", salon: "Salon", spa: "Spa & Wellness", nails: "Nail Studio", barber: "Barber",
};

export default function SuperAdminTemplatesPage() {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [categoryFilter, setCategoryFilter] = useState<"all" | TemplateCategory>("all");
  const [preview, setPreview] = useState<Template | null>(null);

  const filtered = templates.filter((t) => categoryFilter === "all" || t.category === categoryFilter);

  const toggleActive = (id: string) => {
    setTemplates((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const next = { ...t, isActive: !t.isActive };
      toast.success(next.isActive ? `"${t.name}" activated` : `"${t.name}" deactivated`);
      return next;
    }));
  };

  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.isActive).length,
    premium: templates.filter((t) => t.isPremium).length,
    totalUsage: templates.reduce((s, t) => s + t.usageCount, 0),
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Templates" subtitle="Manage mini-site templates available to companies" userName="Super Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Templates", value: stats.total },
            { label: "Active",          value: stats.active },
            { label: "Premium",         value: stats.premium },
            { label: "Total Usage",     value: stats.totalUsage },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategoryFilter("all")}
            className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              categoryFilter === "all" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
            All ({templates.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as TemplateCategory[]).map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                categoryFilter === cat ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-emerald-300")}>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tpl) => (
            <div key={tpl.id} className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden transition-all", tpl.isActive ? "border-gray-100" : "border-gray-100 opacity-60")}>
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <Image src={tpl.thumbnailUrl} alt={tpl.name} fill className="object-cover" unoptimized />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {tpl.isPremium && (
                    <span className="rounded-full bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 flex items-center gap-0.5">
                      <Crown className="h-2.5 w-2.5" /> PRO
                    </span>
                  )}
                  <span className={cn("rounded-full text-[9px] font-bold px-2 py-0.5", tpl.isActive ? "bg-emerald-500 text-white" : "bg-gray-400 text-white")}>
                    {tpl.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{tpl.name}</h3>
                  <span className="text-[10px] text-gray-400 capitalize bg-gray-100 rounded px-1.5 py-0.5">{tpl.category}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{tpl.description}</p>
                <p className="text-[10px] text-gray-400 mb-3">{tpl.usageCount} companies using this</p>
                <div className="flex gap-2">
                  <button onClick={() => setPreview(tpl)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                  <button onClick={() => toggleActive(tpl.id)}
                    className={cn("flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-colors",
                      tpl.isActive ? "border border-red-200 text-red-500 hover:bg-red-50" : "bg-emerald-500 text-white hover:bg-emerald-600")}>
                    {tpl.isActive ? <><ToggleLeft className="h-3.5 w-3.5" /> Deactivate</> : <><ToggleRight className="h-3.5 w-3.5" /> Activate</>}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add template placeholder */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-8 hover:border-emerald-300 transition-colors cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
              <Plus className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-emerald-600 transition-colors">Add Template</p>
            <p className="text-xs text-gray-300 text-center">Coming soon — templates will be added by the development team</p>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-72 bg-gray-100">
              <Image src={preview.thumbnailUrl} alt={preview.name} fill className="object-cover" unoptimized />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{preview.name}</h2>
                  <p className="text-sm text-gray-400 capitalize">{preview.category} template {preview.isPremium ? "· Premium" : "· Free"}</p>
                </div>
                <span className={cn("text-xs font-bold rounded-full px-2.5 py-1", preview.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                  {preview.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{preview.description}</p>
              <div className="flex gap-3">
                <button onClick={() => setPreview(null)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Close</button>
                <button onClick={() => { toggleActive(preview.id); setPreview(null); }}
                  className={cn("flex-1 text-sm font-semibold py-2.5 rounded-xl transition-colors",
                    preview.isActive ? "border border-red-200 text-red-600 hover:bg-red-50" : "bg-emerald-500 text-white hover:bg-emerald-600")}>
                  {preview.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
