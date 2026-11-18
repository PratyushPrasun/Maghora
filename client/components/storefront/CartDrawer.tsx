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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-card shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    Your Basket ({itemCount})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {!isAuthenticated ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary mb-4">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Please Log In
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                      Sign in to your Maghora account to access your cart and place orders.
                    </p>
                    <Link href="/login" onClick={closeCart} className="w-full">
                      <Button className="w-full" size="lg">
                        Sign In to Continue
                      </Button>
                    </Link>
                  </div>
                ) : items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                      <ShoppingBag className="h-8 w-8 stroke-1" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                      Discover our crisp, artisanal roasted makhana flavours.
                    </p>
                    <Link href="/products" onClick={closeCart} className="w-full">
                      <Button className="w-full" variant="outline">
                        Explore Flavours
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.hasUnavailableItems && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        Some items in your cart are currently out of stock or have lower available inventory.
                      </div>
                    )}

                    {items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className={`flex gap-4 p-3.5 rounded-2xl border transition-all ${
                          !item.available
                            ? "border-amber-200 bg-amber-50/40 opacity-75"
                            : "border-border/80 bg-background"
                        }`}
                      >
                        <ProductThumbnail slug={item.productSlug} name={item.productName} className="h-20 w-20" />

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {item.productName}
                              </h4>
                              <button
                                onClick={() => removeItem(item.cartItemId)}
                                disabled={isRemovingItem}
                                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.weightGrams ? formatWeight(item.weightGrams) : "Standard Pack"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-border rounded-lg bg-card">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateItem({ itemId: item.cartItemId, quantity: item.quantity - 1 });
                                  } else {
                                    removeItem(item.cartItemId);
                                  }
                                }}
                                disabled={isUpdatingItem || isRemovingItem}
                                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-lg cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 text-xs font-semibold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  updateItem({ itemId: item.cartItemId, quantity: item.quantity + 1 });
                                }}
                                disabled={isUpdatingItem || isRemovingItem || item.quantity >= item.currentStock}
                                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-lg disabled:opacity-30 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-bold text-foreground">
                                {formatPrice(item.lineTotalPaise)}
                              </p>
                              {item.mrpPaise > item.pricePaise && (
                                <p className="text-[10px] text-muted-foreground line-through">
                                  {formatPrice(item.mrpPaise * item.quantity)}
                                </p>
                              )}
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
                <div className="p-5 border-t border-border bg-card space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotalPaise)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Estimated Shipping</span>
                      <span className="text-emerald-700 font-medium">FREE</span>
                    </div>
                    <div className="border-t border-border/60 pt-2 flex justify-between text-base font-bold text-foreground">
                      <span>Total Amount</span>
                      <span>{formatPrice(subtotalPaise)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link href="/cart" onClick={closeCart} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/checkout" onClick={closeCart} className="w-full">
                      <Button className="w-full" disabled={cart.hasUnavailableItems}>
                        Checkout <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <p className="text-[11px] text-center text-muted-foreground">
                    100% Roasted in Olive Oil • Pure Foxnuts • Guilt-Free Snacking
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

