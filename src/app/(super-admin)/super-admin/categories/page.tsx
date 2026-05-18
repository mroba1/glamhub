"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Tag, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MOCK_CATEGORIES } from "@/constants/mock-data";
import { normalizeCategory, slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Category } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState("");

  const checkDuplicate = (v: string) => {
    const exists = categories.some((c) => normalizeCategory(c.name) === normalizeCategory(v) && c.id !== editingCat?.id);
    setDuplicateWarning(exists ? `"${v}" already exists (case-insensitive match).` : "");
    return exists;
  };

  const openForm = (cat?: Category) => {
    setEditingCat(cat ?? null);
    setName(cat?.name ?? "");
    setDuplicateWarning("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim() || checkDuplicate(name)) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (editingCat) {
      setCategories((prev) => prev.map((c) => c.id === editingCat.id ? { ...c, name: name.trim(), slug: slugify(name) } : c));
      toast.success("Global category updated");
    } else {
      setCategories((prev) => [...prev, {
        id: `gc${Date.now()}`, name: name.trim(), slug: slugify(name), productCount: 0, isActive: true, createdAt: new Date().toISOString(),
      }]);
      toast.success("Global category created");
    }
    setIsLoading(false);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
    setIsLoading(false);
    toast.success("Category deleted globally");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Global Categories</h1>
          <p className="text-[hsl(0,0%,55%)] mt-1">Manage platform-wide product categories</p>
        </div>
        <Button variant="gold" onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          Add Global Category
        </Button>
      </div>

      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center gap-3">
        <Globe className="h-4 w-4 text-blue-400 shrink-0" />
        <p className="text-sm text-blue-300">Global categories are shared across all companies on the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-4 group hover:border-[hsl(38,65%,60%)/30%] transition-all">
            <div className="h-10 w-10 rounded-xl bg-[hsl(38,65%,60%)/10%] flex items-center justify-center shrink-0">
              <Tag className="h-4 w-4 text-[hsl(38,65%,60%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[hsl(0,0%,85%)] text-sm">{cat.name}</p>
              <p className="text-[10px] text-[hsl(0,0%,45%)] mt-0.5">/{cat.slug} · {cat.productCount} products</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon-sm" onClick={() => openForm(cat)}><Edit2 className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon-sm" className="text-red-400" onClick={() => setDeleteTarget(cat)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingCat ? "Edit Category" : "Add Global Category"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Input label="Category Name" value={name} onChange={(e) => { setName(e.target.value); checkDuplicate(e.target.value); }} placeholder="e.g., Wellness" />
              {duplicateWarning && <p className="text-xs text-yellow-400 mt-1">⚠ {duplicateWarning}</p>}
              {name && !duplicateWarning && <p className="text-xs text-[hsl(0,0%,45%)] mt-1">Slug: <span className="text-[hsl(38,65%,60%)]">/{slugify(name)}</span></p>}
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleSave} isLoading={isLoading} disabled={!!duplicateWarning || !name.trim()}>
              {editingCat ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Global Category"
        description={`Delete "${deleteTarget?.name}" globally? All companies using this category will be affected.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
