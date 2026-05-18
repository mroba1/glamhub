"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import { UploadZone } from "@/components/shared/upload-zone";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";
import { createProductSchema, type CreateProductFormData } from "@/validators";
import { toast } from "sonner";
import type { Product } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductFormData, any, CreateProductFormData>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: editingProduct ? {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      categoryId: editingProduct.categoryId,
      stock: editingProduct.stock,
      sku: editingProduct.sku,
    } : {},
  });

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: CreateProductFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setShowForm(false);
    reset();
    toast.success(editingProduct ? "Product updated" : "Product created");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Products</h1>
          <p className="text-[hsl(0,0%,55%)] mt-1">{products.length} products in your store</p>
        </div>
        <Button variant="gold" onClick={() => { setEditingProduct(null); reset({}); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(0,0%,45%)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full h-10 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] pl-10 pr-4 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%]"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Add your first product to get started." action={{ label: "Add Product", onClick: () => setShowForm(true) }} />
      ) : (
        <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(0,0%,12%)] bg-[hsl(0,0%,6%)]">
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[hsl(0,0%,50%)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(0,0%,10%)]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[hsl(0,0%,8%)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[hsl(0,0%,10%)] shrink-0">
                          <Image src={product.images[0]?.url ?? ""} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <p className="font-medium text-[hsl(0,0%,88%)]">{product.name}</p>
                          <p className="text-xs text-[hsl(0,0%,50%)]">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[hsl(0,0%,65%)]">{product.categoryName}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-[hsl(38,65%,60%)]">{formatCurrency(product.price)}</span>
                        {product.compareAtPrice && (
                          <span className="block text-xs text-[hsl(0,0%,40%)] line-through">{formatCurrency(product.compareAtPrice)}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-400" : product.stock < 10 ? "text-yellow-400" : "text-green-400"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={product.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditingProduct(product); setShowForm(true); }}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-red-400 hover:text-red-300" onClick={() => setDeleteTarget(product)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave as any)} className="space-y-4 mt-2">
            <Input label="Product Name" error={errors.name?.message} {...register("name")} />
            <Textarea label="Description" error={errors.description?.message} rows={3} {...register("description")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (NGN)" type="number" error={errors.price?.message} {...register("price")} />
              <Input label="Compare At Price" type="number" error={errors.compareAtPrice?.message} {...register("compareAtPrice")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[hsl(0,0%,80%)]">Category</label>
                <select {...register("categoryId")} className="w-full h-10 rounded-md border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] px-3 text-sm text-[hsl(0,0%,90%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%]">
                  <option value="">Select category</option>
                  {MOCK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-xs text-red-400">{errors.categoryId.message}</p>}
              </div>
              <Input label="Stock Quantity" type="number" error={errors.stock?.message} {...register("stock")} />
            </div>
            <Input label="SKU" error={errors.sku?.message} placeholder="e.g., GH-SKN-001" {...register("sku")} />
            <UploadZone label="Product Images" maxFiles={5} hint="Upload up to 5 product images" />
            <DialogFooter className="gap-2 mt-4">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="gold" type="submit" isLoading={isLoading}>
                {editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
