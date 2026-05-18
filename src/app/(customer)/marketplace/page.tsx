"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/constants/mock-data";
import { useCartStore } from "@/store/cart.store";
import { formatCurrency } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const debouncedSearch = useDebounce(search, 300);

  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.categoryId === selectedCategory);
    }
    if (sortBy === "price_asc") products.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") products.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") products.sort((a, b) => b.rating - a.rating);
    return products;
  }, [debouncedSearch, selectedCategory, sortBy]);

  const handleAddToCart = (product: (typeof MOCK_PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url ?? "",
      price: product.price,
      quantity: 1,
      companyId: product.companyId,
      companyName: product.companyName,
    });
    toast.success("Added to cart", { description: product.name });
  };

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.info("Removed from wishlist"); }
      else { next.add(id); toast.success("Added to wishlist"); }
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(0,0%,95%)] mb-2">
          Beauty Marketplace
        </h1>
        <p className="text-[hsl(0,0%,55%)]">Discover premium beauty products from top brands</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(0,0%,45%)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands, categories…"
            className="w-full h-11 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] pl-10 pr-4 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,70%)]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {selectedCategory !== "all" && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">1</Badge>
          )}
        </Button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-11 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,7%)] px-3 text-sm text-[hsl(0,0%,90%)] focus:outline-none focus:ring-2 focus:ring-[hsl(38,65%,60%)/50%]"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]"
              : "border border-[hsl(0,0%,15%)] text-[hsl(0,0%,60%)] hover:border-[hsl(38,65%,60%)/50%]"
          }`}
        >
          All ({MOCK_PRODUCTS.length})
        </button>
        {MOCK_CATEGORIES.filter((cat) =>
          MOCK_PRODUCTS.some((p) => p.categoryId === cat.id)
        ).map((cat) => {
          const count = MOCK_PRODUCTS.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)]"
                  : "border border-[hsl(0,0%,15%)] text-[hsl(0,0%,60%)] hover:border-[hsl(38,65%,60%)/50%]"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[hsl(0,0%,55%)]">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
        {(debouncedSearch || selectedCategory !== "all") && (
          <button
            onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            className="text-xs text-[hsl(38,65%,60%)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No products found"
          description={`No products match "${debouncedSearch}". Try adjusting your search or filters.`}
          action={{ label: "Clear Search", onClick: () => setSearch("") }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group rounded-2xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] overflow-hidden card-hover">
              <div className="relative aspect-square overflow-hidden bg-[hsl(0,0%,10%)]">
                <Link href={`/marketplace/${product.id}`}>
                  <Image
                    src={product.images[0]?.url ?? ""}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </Link>
                {product.compareAtPrice && (
                  <span className="absolute top-2 left-2 rounded-full bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] text-xs font-bold px-2 py-0.5">
                    SALE
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Heart
                    className={`h-4 w-4 ${wishlisted.has(product.id) ? "fill-red-500 text-red-500" : "text-[hsl(0,0%,80%)]"}`}
                  />
                </button>
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-[hsl(38,65%,60%)] mb-1">{product.categoryName}</p>
                <Link href={`/marketplace/${product.id}`}>
                  <h3 className="text-sm font-semibold text-[hsl(0,0%,90%)] line-clamp-1 hover:text-[hsl(38,65%,60%)] transition-colors mb-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-[hsl(38,65%,60%)] text-[hsl(38,65%,60%)]" />
                  <span className="text-xs text-[hsl(0,0%,55%)]">{product.rating} ({product.reviewCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[hsl(0,0%,95%)]">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-xs text-[hsl(0,0%,40%)] line-through">{formatCurrency(product.compareAtPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
