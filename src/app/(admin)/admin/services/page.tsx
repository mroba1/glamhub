"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Scissors, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { UploadZone } from "@/components/shared/upload-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MOCK_ADMIN_SERVICES, MOCK_CATEGORIES } from "@/constants/mock-data";
import { formatCurrency, generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AdminService } from "@/types";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>(MOCK_ADMIN_SERVICES);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const openAdd = () => {
    setEditing(null);
    setName(""); setDesc(""); setPrice(""); setDuration(""); setCategoryId("");
    setShowForm(true);
  };

  const openEdit = (s: AdminService) => {
    setEditing(s);
    setName(s.name); setDesc(s.description); setPrice(String(s.price));
    setDuration(String(s.duration)); setCategoryId(s.categoryId);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name || !price || !duration || !categoryId) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const cat = MOCK_CATEGORIES.find((c) => c.id === categoryId);
    if (editing) {
      setServices((prev) => prev.map((s) => s.id === editing.id
        ? { ...s, name, description: desc, price: Number(price), duration: Number(duration), categoryId, categoryName: cat?.name ?? "" }
        : s
      ));
      toast.success("Service updated");
    } else {
      setServices((prev) => [...prev, {
        id: generateId(), name, description: desc, price: Number(price),
        duration: Number(duration), categoryId, categoryName: cat?.name ?? "",
        isActive: true, companyId: "co1", bookingCount: 0, createdAt: new Date().toISOString(),
      }]);
      toast.success("Service created");
    }
    setIsLoading(false);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    setIsLoading(false);
    toast.success("Service deleted");
  };

  const toggleActive = (id: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Services" subtitle="Manage the services your salon offers" userName="Studio Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{services.length} service{services.length !== 1 ? "s" : ""} listed</p>
          <Button variant="gold" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        </div>

        {services.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title="No services yet"
            description="Add the services your salon offers so customers can book appointments."
            action={{ label: "Add First Service", onClick: openAdd }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className={cn("bg-white rounded-2xl border shadow-sm p-5 transition-all", service.isActive ? "border-gray-100" : "border-gray-100 opacity-60")}>
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Scissors className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(service)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => toggleActive(service.id)} className={cn("h-7 w-7 rounded-lg flex items-center justify-center transition-all", service.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100")}>
                      {service.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <button onClick={() => setDeleteTarget(service)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 font-medium mb-0.5">{service.categoryName}</p>
                <h3 className="font-semibold text-gray-800 mb-1">{service.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{service.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{formatCurrency(service.price)}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />{service.duration} min
                  </span>
                </div>
                {service.bookingCount > 0 && (
                  <p className="text-[10px] text-gray-400 mt-2">{service.bookingCount} bookings total</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader><DialogTitle className="text-gray-900">{editing ? "Edit Service" : "Add New Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Service Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Luxury Facial" className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe the service…" rows={3} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Price (₦) *</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Duration (min) *</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all">
                <option value="">Select category</option>
                {MOCK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <UploadZone label="Service Image (optional)" hint="JPEG or PNG, max 5MB" />
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
            <Button variant="gold" onClick={handleSave} isLoading={isLoading}>
              {editing ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Service"
        description={`Delete "${deleteTarget?.name}"? Existing bookings won't be affected.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
