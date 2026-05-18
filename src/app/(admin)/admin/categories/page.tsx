"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Tag, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MOCK_CATEGORIES } from "@/constants/mock-data";
import { normalizeCategory, slugify } from "@/lib/utils";
import { createCategorySchema, type CreateCategoryFormData } from "@/validators";
import { toast } from "sonner";
import type { Category } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
  });

  const watchedName = watch("name") ?? "";

  const checkDuplicate = (name: string) => {
    const normalized = normalizeCategory(name);
    const exists = categories.some(
      (c) => normalizeCategory(c.name) === normalized && c.id !== editingCategory?.id
    );
    setDuplicateWarning(exists ? `A category named "${name}" already exists.` : "");
    return exists;
  };

  const openForm = (cat?: Category) => {
    setEditingCategory(cat ?? null);
    reset({ name: cat?.name ?? "", description: cat?.description ?? "" });
    setDuplicateWarning("");
    setShowForm(true);
  };

  const handleSave = async (data: CreateCategoryFormData) => {
    if (checkDuplicate(data.name)) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, name: data.name, slug: slugify(data.name), description: data.description } : c));
      toast.success("Category updated");
    } else {
      const newCat: Category = {
        id: `c${Date.now()}`,
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        productCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success("Category created");
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
    toast.success("Category deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Categories</h1>
          <p className="text-[hsl(0,0%,55%)] mt-1">{categories.length} categories</p>
        </div>
        <Button variant="gold" onClick={() => openForm()}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-4 hover:border-[hsl(38,65%,60%)/30%] transition-all group"
          >
            <div className="h-12 w-12 rounded-xl bg-[hsl(38,65%,60%)/10%] flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 text-[hsl(38,65%,60%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[hsl(0,0%,88%)]">{cat.name}</p>
                <Badge variant={cat.isActive ? "success" : "secondary"} className="text-[10px]">
                  {cat.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-[hsl(0,0%,45%)] mt-0.5">/{cat.slug} · {cat.productCount} products</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon-sm" onClick={() => openForm(cat)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-red-400 hover:text-red-300" onClick={() => setDeleteTarget(cat)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4 mt-2">
            <div>
              <Input
                label="Category Name"
                error={errors.name?.message}
                {...register("name", {
                  onChange: (e) => checkDuplicate(e.target.value),
                })}
                placeholder="e.g., Skin Care"
              />
              {duplicateWarning && (
                <div className="flex items-center gap-1.5 mt-1.5 text-yellow-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <p className="text-xs">{duplicateWarning}</p>
                </div>
              )}
              {watchedName && !errors.name && !duplicateWarning && (
                <p className="text-xs text-[hsl(0,0%,45%)] mt-1">
                  Slug: <span className="text-[hsl(38,65%,60%)]">/{slugify(watchedName)}</span>
                </p>
              )}
            </div>
            <Input label="Description (optional)" {...register("description")} placeholder="Brief description of this category" />
            <DialogFooter className="gap-2">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="gold" type="submit" isLoading={isLoading} disabled={!!duplicateWarning}>
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? Products in this category will become uncategorized.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
