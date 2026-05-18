"use client";
import { useState } from "react";
import Image from "next/image";
import { Search, EyeOff, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MOCK_PRODUCTS } from "@/constants/mock-data";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function SuperAdminProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [hideTarget, setHideTarget] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (product: Product) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
    setHideTarget(null);
    setIsLoading(false);
    toast.success(`Product ${product.status === "active" ? "hidden" : "restored"}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">Moderate Products</h1>
        <p className="text-[hsl(0,0%,55%)] mt-1">Review and moderate products across all companies</p>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
        <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
        <p className="text-sm text-yellow-300">
          Hiding a product will make it invisible to customers. The company admin will be notified.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(0,0%,45%)]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or companies…"
          className="w-full h-10 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] pl-10 pr-4 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%]" />
      </div>

      <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(0,0%,12%)] bg-[hsl(0,0%,6%)]">
                {["Product", "Company", "Category", "Price", "Stock", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[hsl(0,0%,50%)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(0,0%,10%)]">
              {filtered.map((product) => (
                <tr key={product.id} className={`hover:bg-[hsl(0,0%,8%)] transition-colors ${product.status === "inactive" ? "opacity-60" : ""}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[hsl(0,0%,10%)] shrink-0">
                        <Image src={product.images[0]?.url ?? ""} alt={product.name} fill className="object-cover" unoptimized />
                      </div>
                      <p className="font-medium text-[hsl(0,0%,88%)] line-clamp-1">{product.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[hsl(0,0%,65%)] text-xs">{product.companyName}</td>
                  <td className="py-3 px-4 text-[hsl(0,0%,65%)]">{product.categoryName}</td>
                  <td className="py-3 px-4 font-semibold text-[hsl(38,65%,60%)]">{formatCurrency(product.price)}</td>
                  <td className="py-3 px-4 text-[hsl(0,0%,65%)]">{product.stock}</td>
                  <td className="py-3 px-4"><StatusBadge status={product.status} /></td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-xs ${product.status === "active" ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}`}
                      onClick={() => setHideTarget(product)}
                    >
                      {product.status === "active" ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Restore</>}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hideTarget && (
        <ConfirmDialog
          open
          onOpenChange={() => setHideTarget(null)}
          title={`${hideTarget.status === "active" ? "Hide" : "Restore"} Product?`}
          description={`Are you sure you want to ${hideTarget.status === "active" ? "hide" : "restore"} "${hideTarget.name}" from ${hideTarget.companyName}?`}
          confirmLabel={hideTarget.status === "active" ? "Hide Product" : "Restore Product"}
          variant={hideTarget.status === "active" ? "destructive" : "default"}
          onConfirm={() => handleToggleStatus(hideTarget)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
