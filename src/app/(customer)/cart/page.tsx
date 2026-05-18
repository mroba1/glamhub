"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/shared/upload-zone";
import { EmptyState } from "@/components/shared/empty-state";
import { useCartStore } from "@/store/cart.store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = items.length > 0 ? 1500 : 0;
  const total = subtotal + shipping;
  const [coupon, setCoupon] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "payment">("cart");

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Discover our premium beauty products and add them to your cart."
          action={{ label: "Browse Products", onClick: () => router.push("/marketplace") }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-[hsl(0,0%,95%)]">
          Shopping Cart <span className="text-[hsl(0,0%,55%)] text-xl">({items.length} items)</span>
        </h1>
        <Button variant="ghost" size="sm" onClick={() => setClearConfirm(true)} className="text-red-400 hover:text-red-300">
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-4">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-[hsl(0,0%,10%)] shrink-0">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[hsl(0,0%,90%)] text-sm line-clamp-1">{item.productName}</p>
                <p className="text-xs text-[hsl(0,0%,50%)] mt-0.5">{item.companyName}</p>
                <p className="text-[hsl(38,65%,60%)] font-bold mt-1">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => { removeItem(item.id); toast.info("Item removed"); }}
                  className="text-[hsl(0,0%,45%)] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5 border border-[hsl(0,0%,15%)] rounded-lg p-0.5">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded-md hover:bg-[hsl(0,0%,12%)] flex items-center justify-center">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded-md hover:bg-[hsl(0,0%,12%)] flex items-center justify-center">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-sm font-bold text-[hsl(0,0%,85%)]">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-5 sticky top-20">
            <h2 className="font-serif text-lg font-semibold text-[hsl(0,0%,90%)] mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-[hsl(0,0%,65%)]">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[hsl(0,0%,65%)]">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="border-t border-[hsl(0,0%,12%)] pt-2 flex justify-between font-bold text-[hsl(0,0%,90%)] text-base">
                <span>Total</span>
                <span className="text-[hsl(38,65%,60%)] font-serif text-xl">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(0,0%,45%)]" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full h-9 rounded-lg border border-[hsl(0,0%,15%)] bg-[hsl(0,0%,9%)] pl-9 pr-3 text-xs text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,40%)] focus:outline-none focus:ring-1 focus:ring-[hsl(38,65%,60%)/50%]"
                />
              </div>
              <Button variant="secondary" size="sm" className="text-xs shrink-0">Apply</Button>
            </div>

            {/* Payment Upload */}
            <div className="mb-4">
              <UploadZone
                label="Upload Payment Proof"
                hint="Upload bank transfer or payment screenshot"
                onFilesSelected={(f) => setPaymentFile(f[0])}
              />
            </div>

            <Button variant="gold" size="lg" className="w-full" disabled={!paymentFile}>
              Place Order <ArrowRight className="h-4 w-4" />
            </Button>

            <Link href="/marketplace" className="block text-center text-xs text-[hsl(0,0%,50%)] hover:text-[hsl(38,65%,60%)] mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear Cart"
        description="Are you sure you want to remove all items from your cart? This cannot be undone."
        confirmLabel="Clear All"
        variant="destructive"
        onConfirm={() => { clearCart(); setClearConfirm(false); toast.info("Cart cleared"); }}
      />
    </div>
  );
}
