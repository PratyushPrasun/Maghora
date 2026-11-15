"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useMyOrder } from "@/hooks/useOrders";
import { formatPrice, formatDate, formatWeight } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "";
  const { data: order, isLoading } = useMyOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">Order Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested order ID could not be loaded.
        </p>
        <Link href="/admin/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt)} • System ID: {order._id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={order.status === "delivered" ? "success" : "default"}>
              Fulfillment: {order.status.replace("_", " ")}
            </Badge>
            <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
              Payment: {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items & Delivery Address */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
              Purchased Line Items ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-border/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-secondary/40 border border-border/40 relative overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/logo.png"}
                        alt={item.productName}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.productName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        SKU: {item.sku} • {formatWeight(item.weightGrams)} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-foreground text-sm">
                      {formatPrice(item.lineTotalPaise)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {formatPrice(item.pricePaise)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Shipping Destination</h3>
            </div>

            <div className="text-xs space-y-1 text-foreground/80">
              <p className="font-bold text-sm text-foreground">
                {order.shippingAddress.recipientName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="font-semibold text-foreground pt-1">
                📞 {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Payment & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(order.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
              <div className="border-t border-border/80 pt-3 flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span>{formatPrice(order.totalPaise)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Inventory Lock:</span>
                <span className="font-semibold uppercase text-foreground">{order.inventoryStatus}</span>
              </div>
              {order.paymentOrderId && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Razorpay ID:</span>
                  <span>{order.paymentOrderId.substring(0, 15)}...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

