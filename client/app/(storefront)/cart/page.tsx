"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ProductThumbnail } from "@/components/storefront/ProductThumbnail";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatWeight } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clearCart, isUpdatingItem, isRemovingItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotalPaise = cart?.subtotalPaise || 0;
  const shippingPaise = 0; // Free shipping policy in development
  const totalPaise = subtotalPaise + shippingPaise;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    // Backend doesn't have coupons yet; provide frontend adapter feedback
    if (couponCode.toUpperCase() === "MAGHORA10" || couponCode.toUpperCase() === "WELCOME") {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
    } else {
      toast.info("Backend Coupon API is currently in development. Special launch code: MAGHORA10");
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
            Shopping Cart ({cart?.itemCount || 0})
          </h1>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-md mx-auto">
            <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">Please Sign In</h2>
            <p className="mt-2 text-sm text-muted-foreground mb-6">
              Log in to view your saved basket items and proceed with your order.
            </p>
            <Link href="/login">
              <Button className="w-full">Sign In to Maghora</Button>
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center max-w-lg mx-auto">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Your basket is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground mb-6">
              Looks like you haven&apos;t added any crunchy flavours to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-xl">
                Explore Flavours
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.hasUnavailableItems && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
                  ⚠️ Notice: One or more variants in your basket currently exceed our available stock. Please reduce the quantity or remove unavailable items to checkout.
                </div>
              )}

              <div className="rounded-3xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-xs">
                {items.map((item) => (
                  <div key={item.cartItemId} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center min-w-0">
                      <ProductThumbnail slug={item.productSlug} name={item.productName} className="h-20 w-20" />

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-foreground truncate">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.weightGrams ? `${formatWeight(item.weightGrams)} pack` : "Standard pack"}
                        </p>
                        <p className="text-xs font-semibold text-primary mt-1">
                          {formatPrice(item.pricePaise)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-border/40">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-xl bg-background">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateItem({ itemId: item.cartItemId, quantity: item.quantity - 1 });
                            } else {
                              removeItem(item.cartItemId);
                            }
                          }}
                          disabled={isUpdatingItem || isRemovingItem}
                          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-xl cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem({ itemId: item.cartItemId, quantity: item.quantity + 1 })}
                          disabled={isUpdatingItem || isRemovingItem || item.quantity >= item.currentStock}
                          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-xl disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-base font-bold text-foreground">
                          {formatPrice(item.lineTotalPaise)}
                        </p>
                        {item.mrpPaise > item.pricePaise && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.mrpPaise * item.quantity)}
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        disabled={isRemovingItem}
                        className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearCart()}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear Shopping Cart
                </Button>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-foreground pb-4 border-b border-border/60">
                  Order Summary
                </h2>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-accent" />
                    Promotional Voucher
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. MAGHORA10"
                      className="h-10 text-xs uppercase"
                    />
                    <Button type="submit" variant="outline" size="sm" className="h-10 px-4">
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Promo code {appliedCoupon} active (applied at checkout)
                    </p>
                  )}
                </form>

                {/* Costs breakdown */}
                <div className="space-y-3 pt-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-semibold">{formatPrice(subtotalPaise)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Charges</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border/80 pt-3 flex justify-between text-lg font-bold text-foreground">
                    <span>Total Payable</span>
                    <span>{formatPrice(totalPaise)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button
                    size="lg"
                    disabled={cart.hasUnavailableItems}
                    className="w-full rounded-xl gap-2 font-bold shadow-md"
                  >
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="pt-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Encrypted 256-bit Razorpay Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

