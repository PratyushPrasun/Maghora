"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatWeight } from "@/lib/utils";
import { ProductThumbnail } from "@/components/storefront/ProductThumbnail";
import { Button } from "@/components/ui/button";
import { MithilaLotus } from "./MithilaMotifs";

export function CartDrawer() {
  const { isOpen, closeCart } = useCartStore();
  const { cart, isLoading, updateItem, removeItem, isUpdatingItem, isRemovingItem } = useCart();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;
  const subtotalPaise = cart?.subtotalPaise || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-full sm:w-screen max-w-full sm:max-w-md bg-[#F8EEDC] shadow-2xl flex flex-col border-l border-[#E8D7BE] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#E8D7BE] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#702C32]" />
                  <h2 className="text-base font-serif font-bold text-[#33251F]">
                    Your Basket ({itemCount})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-full hover:bg-[#F8EEDC] text-[#7B685F] hover:text-[#702C32] transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {!isAuthenticated ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="h-16 w-16 rounded-full bg-white border border-[#E8D7BE] flex items-center justify-center text-[#702C32] mb-4 shadow-xs">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#33251F] mb-1.5">
                      Please Sign In
                    </h3>
                    <p className="text-xs text-[#7B685F] mb-6 max-w-xs leading-relaxed">
                      Sign in to your Maghora account to access your basket and checkout.
                    </p>
                    <Link href="/login" onClick={closeCart} className="w-full">
                      <Button className="w-full bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] rounded-xl text-xs font-serif font-bold uppercase tracking-wider h-11" size="lg">
                        Sign In to Continue
                      </Button>
                    </Link>
                  </div>
                ) : items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="h-16 w-16 rounded-full bg-white border border-[#E8D7BE] flex items-center justify-center text-[#7B685F] mb-4">
                      <ShoppingBag className="h-8 w-8 stroke-1" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#33251F] mb-1">
                      Your basket is empty
                    </h3>
                    <p className="text-xs text-[#7B685F] mb-6 max-w-xs">
                      Ancient Roots, Modern Taste — explore our flavours.
                    </p>
                    <Link href="/products" onClick={closeCart} className="w-full">
                      <Button className="w-full bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] rounded-xl text-xs font-serif font-bold uppercase tracking-wider" variant="default">
                        Explore Flavours
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.hasUnavailableItems && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                        Some items in your cart are currently out of stock.
                      </div>
                    )}

                    {items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className={`flex gap-3.5 p-3 rounded-2xl border transition-all bg-white ${
                          !item.available
                            ? "border-amber-200 opacity-75"
                            : "border-[#E8D7BE] shadow-2xs"
                        }`}
                      >
                        <ProductThumbnail slug={item.productSlug} name={item.productName} className="h-16 w-16 rounded-xl bg-[#F8EEDC]" />

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="text-xs font-serif font-bold text-[#33251F] truncate">
                                {item.productName}
                              </h4>
                              <button
                                onClick={() => removeItem(item.cartItemId)}
                                disabled={isRemovingItem}
                                className="text-[#7B685F] hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <p className="text-[10px] text-[#7B685F] mt-0.5">
                              {item.weightGrams ? formatWeight(item.weightGrams) : "Standard Pack"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-[#E8D7BE] rounded-lg bg-[#F8EEDC]/40">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateItem({ itemId: item.cartItemId, quantity: item.quantity - 1 });
                                  } else {
                                    removeItem(item.cartItemId);
                                  }
                                }}
                                disabled={isUpdatingItem || isRemovingItem}
                                className="p-1 text-[#7B685F] hover:text-[#702C32] transition-colors rounded-l-lg cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#33251F] font-serif">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  updateItem({ itemId: item.cartItemId, quantity: item.quantity + 1 });
                                }}
                                disabled={isUpdatingItem || isRemovingItem || item.quantity >= item.currentStock}
                                className="p-1 text-[#7B685F] hover:text-[#702C32] transition-colors rounded-r-lg disabled:opacity-30 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-serif font-bold text-[#33251F]">
                                {formatPrice(item.lineTotalPaise)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {isAuthenticated && items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-[#E8D7BE] bg-white space-y-3.5">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#7B685F]">
                      <span>Subtotal</span>
                      <span className="font-serif font-bold text-[#33251F]">{formatPrice(subtotalPaise)}</span>
                    </div>
                    <div className="flex justify-between text-[#7B685F]">
                      <span>Shipping</span>
                      <span className="text-[#536B42] font-bold">FREE</span>
                    </div>
                    <div className="border-t border-[#E8D7BE]/70 pt-2 flex justify-between text-sm sm:text-base font-serif font-bold text-[#33251F]">
                      <span>Total Amount</span>
                      <span className="text-[#702C32]">{formatPrice(subtotalPaise)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/cart" onClick={closeCart} className="w-full">
                      <Button variant="outline" className="w-full rounded-xl border-[#E8D7BE] text-xs font-serif font-bold uppercase tracking-wider text-[#33251F] hover:bg-[#F8EEDC]">
                        View Basket
                      </Button>
                    </Link>
                    <Link href="/checkout" onClick={closeCart} className="w-full">
                      <Button className="w-full rounded-xl bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-wider" disabled={cart.hasUnavailableItems}>
                        Checkout <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <p className="text-[10px] text-center text-[#7B685F] pt-1">
                    Olive Oil • Direct Mithila Sourcing
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
