"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
} from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [authLoading, isAuthenticated, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "shipped":
        return <Badge variant="accent">Shipped</Badge>;
      case "processing":
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>;
      case "pending_payment":
        return <Badge variant="warning">Awaiting Payment</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-emerald-700 font-bold text-xs">● Paid</span>;
      case "pending":
        return <span className="text-amber-700 font-bold text-xs">● Pending</span>;
      case "failed":
        return <span className="text-red-700 font-bold text-xs">● Payment Failed</span>;
      default:
        return <span className="text-muted-foreground font-medium text-xs">● {status}</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-border/80 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-foreground">
              My Orders
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track recent shipments and view previous deliveries
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Shop More
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-3xl" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card max-w-md mx-auto">
            <Package className="h-12 w-12 text-primary mx-auto mb-3" />
            <h2 className="text-lg font-bold text-foreground">No orders yet</h2>
            <p className="text-xs text-muted-foreground mt-1 mb-6">
              When you order your favorite makhana flavours, they will appear here.
            </p>
            <Link href="/products">
              <Button>Discover Flavours</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-foreground">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.paymentStatus)}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>

                  {/* Order items brief */}
                  <div className="pt-2 text-xs text-foreground/80">
                    <span className="font-semibold text-foreground">Items: </span>
                    {order.items?.map((it) => `${it.productName} (x${it.quantity})`).join(", ") || "Makhana Pack"}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-border/60">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-muted-foreground block">Order Total</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(order.totalPaise)}
                    </span>
                  </div>

                  <Link href={`/orders/${order._id}`}>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1 text-xs">
                      View Details <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

