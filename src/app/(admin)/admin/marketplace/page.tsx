"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminTopBar } from "@/components/shared/admin-top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import { UploadZone } from "@/components/shared/upload-zone";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";
import { createProductSchema, type CreateProductFormData } from "@/validators";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function AdminMarketplacePage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductFormData, any, CreateProductFormData>({
    resolver: zodResolver(createProductSchema) as any,
  });

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); reset({}); setShowForm(true); };

  const handleSave = async (data: CreateProductFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(editing ? "Product updated" : "Product created");
    setIsLoading(false);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    setIsLoading(false);
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-0">
      <AdminTopBar title="Marketplace" subtitle="Manage your products" userName="Studio Admin" showTimePeriod={false} />

      <div className="p-4 md:p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
              className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
          </div>
          <Button variant="gold" size="sm" onClick={openAdd} className="shrink-0">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No products yet" description="Add your first product to start selling in the marketplace."
            action={{ label: "Add First Product", onClick: openAdd }} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {product.images[0]?.url && (
                              <Image src={product.images[0].url} alt={product.name} fill className="object-cover" unoptimized />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-gray-500">{product.categoryName}</td>
                      <td className="py-3 px-5 font-semibold text-emerald-600">{formatCurrency(product.price)}</td>
                      <td className="py-3 px-5">
                        <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-amber-500" : "text-emerald-600"}`}>{product.stock}</span>
                      </td>
                      <td className="py-3 px-5"><StatusBadge status={product.status} /></td>
                      <td className="py-3 px-5">
                        <div className="flex gap-1">
                          <button onClick={() => { setEditing(product); setShowForm(true); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(product)} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
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

      {/* Form modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader><DialogTitle className="text-gray-900">{editing ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(handleSave as any)} className="space-y-4 mt-2">
            <Input label="Product Name *" error={errors.name?.message} {...register("name")} />
            <Textarea label="Description *" error={errors.description?.message} rows={3} {...register("description")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (₦) *" type="number" error={errors.price?.message} {...register("price")} />
              <Input label="Compare At Price" type="number" {...register("compareAtPrice")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Category *</label>
                <select {...register("categoryId")} className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all">
                  <option value="">Select category</option>
                  {MOCK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>
              <Input label="Stock Quantity *" type="number" error={errors.stock?.message} {...register("stock")} />
            </div>
            <Input label="SKU *" placeholder="e.g. GH-SKN-001" error={errors.sku?.message} {...register("sku")} />
            <UploadZone label="Product Images" maxFiles={5} hint="Upload up to 5 images, drag-and-drop supported" />
            <DialogFooter className="gap-2 mt-2">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
              <Button variant="gold" type="submit" isLoading={isLoading}>
                {editing ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}
        title="Delete Product" description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} isLoading={isLoading}
      />
    </div>
  );
}
