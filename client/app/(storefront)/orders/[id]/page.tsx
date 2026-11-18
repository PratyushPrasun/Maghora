"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  CreditCard,
  Truck,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useMyOrder } from "@/hooks/useOrders";
import { paymentsService } from "@/services/payments.service";
import { formatPrice, formatDate, formatWeight } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "";
  const router = useRouter();

  const { data: order, isLoading, error, refetch } = useMyOrder(orderId);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);

  if (isLoading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4">
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
        <h2 className="text-xl font-bold font-serif text-foreground">Order Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground mb-6">
          We could not locate this order. Please verify your order ID or check your orders list.
        </p>
        <Link href="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }

  const handleRetryPayment = async () => {
    try {
      setIsRetryingPayment(true);
      const rzpOrder = await paymentsService.createRazorpayOrder(order._id);

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
              await paymentsService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success("Payment verified successfully!");
              refetch();
            } catch (err: any) {
              toast.error(err?.message || "Payment verification failed");
              refetch();
            }
          },
          theme: { color: "#A74436" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not re-initiate payment.");
    } finally {
      setIsRetryingPayment(false);
    }
  };

  const isPendingPayment = order.paymentStatus === "pending" && order.status === "pending_payment";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="py-12 sm:py-16 bg-background min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to My Orders
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-accent font-bold">
                  Order Details
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground mt-0.5">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "success"
                      : order.status === "shipped"
                      ? "accent"
                      : order.status === "cancelled"
                      ? "destructive"
                      : "default"
                  }
                >
                  Status: {order.status.replace("_", " ")}
                </Badge>

                <Badge
                  variant={
                    order.paymentStatus === "paid"
                      ? "success"
                      : order.paymentStatus === "failed"
                      ? "destructive"
                      : "warning"
                  }
                >
                  Payment: {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Pending Payment Notice Banner */}
          {isPendingPayment && (
            <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Payment Pending</h4>
                  <p className="text-xs text-amber-800">
                    Your inventory reservation is held for 10 minutes from checkout.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleRetryPayment}
                isLoading={isRetryingPayment}
                size="sm"
                className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl"
              >
                Complete Payment Now
              </Button>
            </div>
          )}

          {/* Payment Success Confirmation Banner */}
          {order.paymentStatus === "paid" && (
            <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-700 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Thank you for your order!</h4>
                <p className="text-xs text-emerald-800">
                  Your payment has been confirmed. Our team is roasting your fresh batch with love.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Items in Order */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
                  Items Ordered ({order.items?.length || 0})
                </h2>

                <div className="divide-y divide-border/60">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-16 w-16 rounded-xl bg-secondary/40 border border-border/40 relative flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.imageUrl || "/logo.png"}
                            alt={item.productName}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.weightGrams ? `${formatWeight(item.weightGrams)} pack` : "Standard pack"} • Qty: {item.quantity}
                          </p>
                          <p className="text-xs text-foreground font-semibold">
                            {formatPrice(item.pricePaise)} each
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(item.lineTotalPaise)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Delivery Address</h3>
                </div>

                <div className="text-xs text-foreground/80 space-y-1">
                  <p className="font-bold text-sm text-foreground">
                    {order.shippingAddress.recipientName}
                  </p>
                  <p>
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                    {order.shippingAddress.landmark ? `, Near ${order.shippingAddress.landmark}` : ""}
                  </p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                  <p className="font-semibold text-foreground pt-1">
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Customer Notes */}
              {order.customerNotes && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-1 text-xs">
                  <span className="font-bold text-foreground">Customer Notes:</span>
                  <p className="text-muted-foreground italic">&ldquo;{order.customerNotes}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Right: Payment & Summary Breakdown */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
                  Payment Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items Subtotal</span>
                    <span className="text-foreground font-semibold">
                      {formatPrice(order.subtotalPaise)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Charges</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>

                  {order.paymentOrderId && (
                    <div className="pt-2 border-t border-border/60 flex justify-between text-[11px] text-muted-foreground">
                      <span>Gateway Ref</span>
                      <span className="font-mono">{order.paymentOrderId.substring(0, 14)}...</span>
                    </div>
                  )}

                  <div className="border-t border-border/80 pt-3 flex justify-between text-base font-bold text-foreground">
                    <span>Total Amount</span>
                    <span>{formatPrice(order.totalPaise)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <Link href="/products" className="block w-full">
                    <Button variant="outline" className="w-full rounded-xl">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

