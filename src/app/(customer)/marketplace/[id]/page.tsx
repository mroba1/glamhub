"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Minus, Plus, Package, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { MOCK_PRODUCTS } from "@/constants/mock-data";
import { useCartStore } from "@/store/cart.store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id) ?? MOCK_PRODUCTS[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url ?? "",
      price: product.price,
      quantity,
      companyId: product.companyId,
      companyName: product.companyName,
    });
    toast.success("Added to cart", { description: `${quantity}x ${product.name}` });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-[hsl(0,0%,55%)] hover:text-[hsl(38,65%,60%)] transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)]">
            <Image
              src={product.images[selectedImage]?.url ?? product.images[0]?.url ?? ""}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
            {product.compareAtPrice && (
              <span className="absolute top-4 left-4 rounded-full bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] text-sm font-bold px-3 py-1">
                SALE
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedImage ? "border-[hsl(38,65%,60%)]" : "border-[hsl(0,0%,15%)]"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.categoryName}</Badge>
              <StatusBadge status={product.status} />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)] mb-2">{product.name}</h1>
            <p className="text-sm text-[hsl(0,0%,50%)]">by {product.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= Math.round(product.rating) ? "fill-[hsl(38,65%,60%)] text-[hsl(38,65%,60%)]" : "text-[hsl(0,0%,30%)]"}`} />
              ))}
            </div>
            <span className="text-sm text-[hsl(0,0%,60%)]">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="font-serif text-4xl font-bold text-[hsl(38,65%,60%)]">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-[hsl(0,0%,40%)] line-through mb-1">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
            {product.compareAtPrice && (
              <Badge variant="success" className="mb-1">
                {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          <p className="text-[hsl(0,0%,65%)] leading-relaxed">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[hsl(0,0%,15%)] px-3 py-1 text-xs text-[hsl(0,0%,55%)]">
                #{tag}
              </span>
            ))}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-[hsl(38,65%,60%)]" />
            <span className="text-[hsl(0,0%,60%)]">
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[hsl(0,0%,70%)]">Quantity:</span>
            <div className="flex items-center gap-2 border border-[hsl(0,0%,15%)] rounded-lg p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 rounded-md hover:bg-[hsl(0,0%,12%)] flex items-center justify-center transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="h-8 w-8 rounded-md hover:bg-[hsl(0,0%,12%)] flex items-center justify-center transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="gold" size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart — {formatCurrency(product.price * quantity)}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setWishlisted(!wishlisted)}>
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[hsl(0,0%,12%)]">
            {[
              { icon: Truck, label: "Fast Delivery" },
              { icon: Shield, label: "Authentic Products" },
              { icon: Package, label: "Easy Returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="h-10 w-10 rounded-xl bg-[hsl(38,65%,60%)/10%] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[hsl(38,65%,60%)]" />
                </div>
                <span className="text-xs text-[hsl(0,0%,55%)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
