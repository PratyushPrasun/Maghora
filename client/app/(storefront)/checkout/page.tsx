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
import { ProductThumbnail } from "@/components/storefront/ProductThumbnail";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
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

  // Derive default active address
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
        <p className="text-sm text-[#7B685F] animate-pulse">
          Securing checkout session...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#33251F]">Your basket is empty</h2>
        <p className="text-sm text-[#7B685F]">
          Please add makhana flavours to your basket before proceeding to checkout.
        </p>
        <Link href="/products">
          <Button className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC]">
            Explore Products
          </Button>
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
          image: "/logo.png",
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
            color: "#702C32",
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", (response: any) => {
          toast.error(response.error.description || "Payment failed. Please retry.");
          router.push(`/orders/${orderId}`);
        });
        razorpayInstance.open();
      } else {
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#702C32] hover:underline mb-3"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back to Basket
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#33251F]">
              Express Secure Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left: Addresses & Delivery Info */}
            <div className="lg:col-span-7 space-y-5">
              {/* Delivery Address Card */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8D7BE]/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#702C32]" />
                    <h2 className="text-base font-serif font-bold text-[#33251F]">
                      Delivery Address
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressDialog(true)}
                    className="rounded-xl text-xs gap-1 border-[#E8D7BE] text-[#33251F] hover:bg-[#F8EEDC] min-h-[36px]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center border border-dashed border-[#E8D7BE] rounded-2xl bg-[#F8EEDC]/40">
                    <p className="text-xs sm:text-sm text-[#7B685F] mb-3">
                      You haven&apos;t added any delivery addresses yet.
                    </p>
                    <Button
                      onClick={() => setShowAddressDialog(true)}
                      size="sm"
                      className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif uppercase tracking-wider min-h-[40px]"
                    >
                      Add Delivery Address
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
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "border-[#702C32] bg-[#F8EEDC]/35 shadow-xs"
                              : "border-[#E8D7BE] bg-white hover:bg-[#F8EEDC]/20"
                          }`}
                        >
                          <div className="mt-0.5">
                            <input
                              type="radio"
                              name="addressSelection"
                              checked={isSelected}
                              onChange={() => setChosenAddressId(addr._id)}
                              className="h-4 w-4 text-[#702C32] focus:ring-[#702C32]"
                            />
                          </div>
                          <div className="flex-1 text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-[#33251F] text-sm">
                                {addr.recipientName}
                              </span>
                              <span className="capitalize font-semibold text-[10px] bg-[#EEDEC4] px-2 py-0.5 rounded-full text-[#702C32]">
                                {addr.label === "other" && addr.customLabel ? addr.customLabel : addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-[#536B42] font-semibold">
                                  (Default)
                                </span>
                              )}
                            </div>
                            <p className="text-[#33251F]/80 leading-relaxed">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                              {addr.landmark ? `, Near ${addr.landmark}` : ""}
                            </p>
                            <p className="text-[#7B685F]">
                              {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="text-[#33251F] font-medium">
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
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs space-y-2.5">
                <label className="text-xs font-serif font-bold uppercase tracking-wider text-[#33251F] block">
                  Delivery Instructions (Optional)
                </label>
                <Textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Leave with security guard, call before delivery..."
                  rows={2}
                  maxLength={500}
                  className="border-[#E8D7BE] text-xs focus:ring-[#702C32]/30"
                />
              </div>

              {/* Payment Method Notice */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#702C32]" />
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#33251F]">
                    Online Payment via Razorpay
                  </h3>
                </div>
                <p className="text-xs text-[#7B685F] leading-relaxed">
                  Support for UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Netbanking, and Wallets.
                </p>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-sm space-y-5">
                <h2 className="text-base font-serif font-bold text-[#33251F] pb-3 border-b border-[#E8D7BE]/70">
                  Review Basket ({cart?.itemCount || 0})
                </h2>

                {/* Items Mini List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                      <ProductThumbnail slug={item.productSlug} name={item.productName} className="h-12 w-12 rounded-xl bg-[#F8EEDC]" />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif font-bold text-[#33251F] truncate">{item.productName}</p>
                        <p className="text-[11px] text-[#7B685F]">
                          Qty: {item.quantity} • {item.weightGrams ? formatWeight(item.weightGrams) : "Std"}
                        </p>
                      </div>
                      <span className="font-serif font-bold text-[#33251F]">
                        {formatPrice(item.lineTotalPaise)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost breakdown */}
                <div className="space-y-2 pt-3 border-t border-[#E8D7BE]/70 text-xs sm:text-sm">
                  <div className="flex justify-between text-[#7B685F]">
                    <span>Items Subtotal</span>
                    <span className="text-[#33251F] font-semibold font-serif">{formatPrice(subtotalPaise)}</span>
                  </div>
                  <div className="flex justify-between text-[#7B685F]">
                    <span>Standard Delivery</span>
                    <span className="text-[#536B42] font-bold">FREE</span>
                  </div>
                  <div className="border-t border-[#E8D7BE]/80 pt-3 flex justify-between text-base sm:text-lg font-serif font-bold text-[#33251F]">
                    <span>Total Payable</span>
                    <span className="text-[#702C32]">{formatPrice(totalPaise)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  size="lg"
                  onClick={handlePlaceOrderAndPay}
                  disabled={!selectedAddressId || isProcessingPayment || placeOrderMutation.isPending}
                  isLoading={isProcessingPayment || placeOrderMutation.isPending}
                  className="w-full rounded-xl gap-2 font-serif font-bold uppercase tracking-wider text-xs h-12 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] shadow-md cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  Pay {formatPrice(totalPaise)}
                </Button>

                <p className="text-[11px] text-center text-[#7B685F] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#536B42]" />
                  <span>10-minute reserved inventory lock • Safe & Secure</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressFormDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onSuccess={(id) => setChosenAddressId(id)}
      />
    </>
  );
}
