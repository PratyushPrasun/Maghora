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
} from "lucide-react";
import { useMyOrder } from "@/hooks/useOrders";
import { paymentsService } from "@/services/payments.service";
import { formatPrice, formatDate, formatWeight } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "";
  const router = useRouter();

  const { data: order, isLoading, error, refetch } = useMyOrder(orderId);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);

  if (isLoading) {
    return (
      <div className="py-16 max-w-4xl mx-auto px-4 bg-[#F8EEDC] min-h-screen">
        <Skeleton className="h-64 w-full rounded-3xl bg-white" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center bg-[#F8EEDC] min-h-screen">
        <AlertCircle className="h-12 w-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-serif text-[#33251F]">Order Not Found</h2>
        <p className="mt-1 text-xs text-[#7B685F] mb-6">
          We could not locate this order. Please verify your order ID.
        </p>
        <Link href="/orders">
          <Button className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif uppercase tracking-wider">
            View All Orders
          </Button>
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
          image: "/logo.png",
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
          theme: { color: "#702C32" },
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

      <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#702C32] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
          </Link>

          {/* Header Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#702C32] font-serif">
                  Order Details
                </span>
                <span className="text-[#7B685F] text-xs">•</span>
                <span className="text-xs text-[#7B685F]">{formatDate(order.createdAt)}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold font-serif text-[#33251F]">
                Order #{order.orderNumber}
              </h1>
            </div>

            <div className="flex flex-col sm:items-end gap-0.5">
              <span className="text-[10px] sm:text-xs font-serif uppercase tracking-wider text-[#7B685F]">Total Amount</span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-[#702C32]">
                {formatPrice(order.totalPaise)}
              </span>
            </div>
          </div>

          {/* Pending Payment Alert */}
          {isPendingPayment && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-900 font-serif">
                  Payment Pending
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your order has been recorded. Please complete payment within the reserved inventory window.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleRetryPayment}
                disabled={isRetryingPayment}
                isLoading={isRetryingPayment}
                className="shrink-0 bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-wider h-10 px-5 w-full sm:w-auto"
              >
                Complete Payment Now
              </Button>
            </div>
          )}

          {/* Order Items List */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-[#33251F] pb-3 border-b border-[#E8D7BE]/70">
              Purchased Items ({order.items.length})
            </h2>

            <div className="divide-y divide-[#E8D7BE]/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#F8EEDC] flex items-center justify-center relative overflow-hidden border border-[#E8D7BE]/60 shrink-0">
                      <Image
                        src="/logo.png"
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-[#33251F]">
                        {item.productName}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#7B685F] mt-0.5">
                        {item.weightGrams ? `${formatWeight(item.weightGrams)} pack` : "Standard pack"} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-xs sm:text-sm text-[#33251F] shrink-0">
                    {formatPrice(item.lineTotalPaise)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Delivery Address */}
            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#702C32] mb-1">
                <MapPin className="h-4 w-4" />
                <span>Shipping Address</span>
              </div>
              <p className="text-sm font-bold text-[#33251F] font-serif">
                {order.shippingAddress.recipientName}
              </p>
              <p className="text-xs text-[#7B685F] leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
              </p>
              <p className="text-xs text-[#7B685F]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-xs text-[#33251F] pt-1 font-medium">
                📞 {order.shippingAddress.phone}
              </p>
            </div>

            {/* Tracking Status */}
            <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#536B42] mb-1">
                <Truck className="h-4 w-4" />
                <span>Delivery Status</span>
              </div>
              <p className="text-sm font-bold capitalize text-[#33251F] font-serif">
                {order.status.replace("_", " ")}
              </p>
              <p className="text-xs text-[#7B685F] leading-relaxed">
                {order.status === "delivered"
                  ? "Your artisanal makhana has been successfully delivered. Swaad Mithila Ka!"
                  : "Your batch is prepared and shipped with care from our Mithila hub."}
              </p>
              <div className="pt-2 text-[11px] text-[#536B42] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Free Insured Delivery Across India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
