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
  Sparkles,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ProductThumbnail } from "@/components/storefront/ProductThumbnail";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatWeight } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clearCart, isUpdatingItem, isRemovingItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotalPaise = cart?.subtotalPaise || 0;
  const shippingPaise = 0; // Free shipping
  const totalPaise = subtotalPaise + shippingPaise;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "MAGHORA10" || couponCode.toUpperCase() === "WELCOME") {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
    } else {
      toast.info("Special launch code: MAGHORA10 for ₹50 off!");
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#702C32] hover:underline mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#33251F]">
              Your Shopping Basket
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-[#EEDEC4] text-xs font-serif font-bold text-[#702C32]">
              {cart?.itemCount || 0} {cart?.itemCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-[#E8D7BE] bg-white p-8 sm:p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="h-14 w-14 rounded-full bg-[#F8EEDC] text-[#702C32] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#33251F]">Please Sign In</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#7B685F] mb-6 leading-relaxed">
              Sign in to your Maghora account to access your saved items, fast checkout, and track orders.
            </p>
            <Link href="/login?redirect=/cart">
              <Button className="w-full bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] rounded-xl text-xs font-serif font-bold uppercase tracking-wider h-11">
                Sign In to Maghora
              </Button>
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E8D7BE] bg-white p-12 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="h-16 w-16 bg-[#F8EEDC] rounded-full flex items-center justify-center text-[#702C32] mx-auto mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#33251F]">Your basket is empty</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#7B685F] mb-6 leading-relaxed">
              Looks like you haven&apos;t added any crunchy roasted flavours to your basket yet.
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-xl bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-wider">
                Explore Flavours
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Notification */}
              <div className="p-3.5 bg-white border border-[#E8D7BE] rounded-2xl flex items-center gap-3 text-xs text-[#33251F] shadow-2xs">
                <span className="h-7 w-7 rounded-full bg-[#536B42] text-white flex items-center justify-center shrink-0">
                  ✓
                </span>
                <div>
                  <span className="font-bold text-[#536B42]">Free Nationwide Shipping</span>
                  <span className="text-[#7B685F] block text-[11px]">Direct from our Mithila fulfillment hub across India.</span>
                </div>
              </div>

              {cart.hasUnavailableItems && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  ⚠️ Notice: One or more variants in your basket currently exceed our available stock. Please reduce the quantity or remove unavailable items to proceed.
                </div>
              )}

              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white divide-y divide-[#E8D7BE]/60 overflow-hidden shadow-xs">
                {items.map((item) => (
                  <div key={item.cartItemId} className="p-3.5 sm:p-5 flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-3 sm:gap-3.5 items-center min-w-0 w-full sm:w-auto">
                      <ProductThumbnail slug={item.productSlug} name={item.productName} className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-[#F8EEDC] shrink-0" />

                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.productSlug}`} className="hover:underline">
                          <h3 className="text-sm sm:text-base font-serif font-bold text-[#33251F] truncate">
                            {item.productName}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-[#7B685F] mt-0.5">
                          {item.weightGrams ? `${formatWeight(item.weightGrams)} pack` : "Standard pack"}
                        </p>
                        <p className="text-xs font-serif font-bold text-[#702C32] mt-1">
                          {formatPrice(item.pricePaise)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-0 border-[#E8D7BE]/40">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E8D7BE] rounded-xl bg-[#F8EEDC]/40 h-9">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateItem({ itemId: item.cartItemId, quantity: item.quantity - 1 });
                            } else {
                              removeItem(item.cartItemId);
                            }
                          }}
                          disabled={isUpdatingItem || isRemovingItem}
                          className="h-full px-2.5 text-[#7B685F] hover:text-[#702C32] transition-colors rounded-l-xl cursor-pointer flex items-center justify-center min-w-[32px]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#33251F] font-serif min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem({ itemId: item.cartItemId, quantity: item.quantity + 1 })}
                          disabled={isUpdatingItem || isRemovingItem || item.quantity >= item.currentStock}
                          className="h-full px-2.5 text-[#7B685F] hover:text-[#702C32] transition-colors rounded-r-xl disabled:opacity-30 cursor-pointer flex items-center justify-center min-w-[32px]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <p className="text-sm sm:text-base font-serif font-bold text-[#33251F]">
                          {formatPrice(item.lineTotalPaise)}
                        </p>
                        {item.mrpPaise > item.pricePaise && (
                          <p className="text-[10px] sm:text-[11px] text-[#7B685F] line-through font-normal">
                            {formatPrice(item.mrpPaise * item.quantity)}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        disabled={isRemovingItem}
                        className="text-[#7B685F] hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
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
                  className="text-xs text-[#7B685F] hover:text-rose-600 cursor-pointer"
                >
                  Clear Shopping Basket
                </Button>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
                <h2 className="text-base font-serif font-bold text-[#33251F] pb-3 border-b border-[#E8D7BE]/70">
                  Order Summary
                </h2>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#33251F] flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-[#C65D35]" />
                    Promotional Voucher
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. MAGHORA10"
                      className="h-10 text-xs uppercase border-[#E8D7BE] focus:ring-[#702C32]/30"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 text-xs font-serif font-bold uppercase border-[#E8D7BE] hover:bg-[#F8EEDC] cursor-pointer"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-[#536B42] font-semibold">
                      ✓ Promo code {appliedCoupon} applied
                    </p>
                  )}
                </form>

                {/* Costs breakdown */}
                <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-[#7B685F]">
                    <span>Subtotal</span>
                    <span className="text-[#33251F] font-semibold font-serif">
                      {formatPrice(subtotalPaise)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#7B685F]">
                    <span>Shipping Charges</span>
                    <span className="text-[#536B42] font-bold">FREE</span>
                  </div>
                  <div className="border-t border-[#E8D7BE]/80 pt-3 flex justify-between text-base sm:text-lg font-serif font-bold text-[#33251F]">
                    <span>Total Payable</span>
                    <span className="text-[#702C32]">{formatPrice(totalPaise)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button
                    size="lg"
                    disabled={cart.hasUnavailableItems}
                    className="w-full rounded-xl gap-2 font-serif font-bold uppercase tracking-wider text-xs h-12 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="pt-2 text-center text-[11px] text-[#7B685F] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#536B42]" />
                  <span>Encrypted 256-bit Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
