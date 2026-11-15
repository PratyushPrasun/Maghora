"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  MapPin,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddresses";
import { useAuth } from "@/hooks/useAuth";
import { usePlaceOrder } from "@/hooks/useOrders";
import { paymentsService } from "@/services/payments.service";
import { formatPrice, formatWeight } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AddressFormDialog } from "@/components/storefront/AddressFormDialog";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  const { addresses, isLoading: addressLoading } = useAddresses();
  const placeOrderMutation = usePlaceOrder();

  const [chosenAddressId, setChosenAddressId] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Derive default active address cleanly without cascading effect
  const defaultAddressId = addresses?.find((a) => a.isDefault)?._id || addresses?.[0]?._id || "";
  const selectedAddressId = chosenAddressId || defaultAddressId;

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  const items = cart?.items || [];
  const subtotalPaise = cart?.subtotalPaise || 0;
  const shippingPaise = 0;
  const totalPaise = subtotalPaise + shippingPaise;

  if (authLoading || cartLoading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Securing checkout session...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">Your basket is empty</h2>
        <p className="text-sm text-muted-foreground">
          Please add makhana flavours to your basket before proceeding to checkout.
        </p>
        <Link href="/products">
          <Button>Explore Products</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrderAndPay = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address");
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Step 1: Create Order & Reserve Inventory
      const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const orderResult = await placeOrderMutation.mutateAsync({
        idempotencyKey,
        addressId: selectedAddressId,
        customerNotes: customerNotes.trim(),
      });

      const orderId = orderResult.orderId;

      // Step 2: Initialize Razorpay Order via Payment API
      const rzpOrder = await paymentsService.createRazorpayOrder(orderId);

      // Step 3: Trigger Razorpay Checkout Modal
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: rzpOrder.keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Maghora Foods",
          description: `Order ${rzpOrder.orderNumber}`,
          image: "/Magnora.png",
          order_id: rzpOrder.razorpayOrderId,
          handler: async (response: any) => {
            try {
              // Verify payment on backend
              await paymentsService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              toast.success("Payment verified! Order placed successfully.");
              router.push(`/orders/${orderId}`);
            } catch (err: any) {
              toast.error(err?.message || "Payment verification failed. Please contact support.");
              router.push(`/orders/${orderId}`);
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone,
          },
          theme: {
            color: "#1A3826", // Deep Earthy Green
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", (response: any) => {
          toast.error(response.error.description || "Payment failed. Please retry.");
          router.push(`/orders/${orderId}`);
        });
        razorpayInstance.open();
      } else {
        // Fallback if Razorpay CDN script was blocked
        toast.info("Order created. Please view your order confirmation.");
        router.push(`/orders/${orderId}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Checkout could not be completed. Please retry.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      {/* Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="py-10 sm:py-16 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back to Cart
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
              Express Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Addresses & Delivery Info */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Address Card */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-bold text-foreground">
                      Delivery Address
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressDialog(true)}
                    className="rounded-xl text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-muted/20">
                    <p className="text-sm text-muted-foreground mb-3">
                      You haven&apos;t added any delivery addresses yet.
                    </p>
                    <Button onClick={() => setShowAddressDialog(true)} size="sm">
                      Add Your Delivery Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => setChosenAddressId(addr._id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-xs"
                              : "border-border bg-background hover:bg-muted/40"
                          }`}
                        >
                          <div className="mt-0.5">
                            <input
                              type="radio"
                              name="addressSelection"
                              checked={isSelected}
                              onChange={() => setChosenAddressId(addr._id)}
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="flex-1 text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground text-sm">
                                {addr.recipientName}
                              </span>
                              <span className="capitalize font-semibold text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                                {addr.label === "other" && addr.customLabel ? addr.customLabel : addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-muted-foreground">
                                  (Default)
                                </span>
                              )}
                            </div>
                            <p className="text-foreground/80 leading-relaxed">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                              {addr.landmark ? `, Near ${addr.landmark}` : ""}
                            </p>
                            <p className="text-muted-foreground">
                              {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="text-foreground/80 font-medium">
                              📞 {addr.phone}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Delivery Instructions */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <label className="text-sm font-bold text-foreground">
                  Delivery Instructions (Optional)
                </label>
                <Textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Leave with security guard, call before delivery..."
                  rows={2}
                  maxLength={500}
                />
              </div>

              {/* Payment Method Notice */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">
                    Online Payment via Razorpay
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Support for UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Netbanking, and Wallets.
                </p>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-foreground pb-4 border-b border-border/60">
                  Review Items ({cart?.itemCount || 0})
                </h2>

                {/* Items Mini List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{item.productName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity} • {item.weightGrams ? formatWeight(item.weightGrams) : "Std"}
                        </p>
                      </div>
                      <span className="font-bold text-foreground">
                        {formatPrice(item.lineTotalPaise)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-border/60 text-sm">
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Items Subtotal</span>
                    <span className="text-foreground font-semibold">{formatPrice(subtotalPaise)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Standard Delivery</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border/80 pt-3 flex justify-between text-lg font-bold text-foreground">
                    <span>Total Payable</span>
                    <span>{formatPrice(totalPaise)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  size="lg"
                  onClick={handlePlaceOrderAndPay}
                  disabled={!selectedAddressId || isProcessingPayment || placeOrderMutation.isPending}
                  isLoading={isProcessingPayment || placeOrderMutation.isPending}
                  className="w-full rounded-xl gap-2 font-bold shadow-md h-12"
                >
                  <Lock className="h-4 w-4" />
                  Pay {formatPrice(totalPaise)}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>10-minute reserved inventory lock • Safe & Secure</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddressFormDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onSuccess={(id) => setChosenAddressId(id)}
      />
    </>
  );
}
