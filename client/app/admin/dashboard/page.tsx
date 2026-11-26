"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  Boxes,
  AlertTriangle,
  ShoppingBag,
  Eye,
  IndianRupee,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/useProducts";
import { useAdminCategories } from "@/hooks/useCategories";
import { useAdminRecentOrders, useAdminOrderStats } from "@/hooks/useAdminDashboard";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getOrderStatusBadge(status: string) {
  const map: Record<string, { variant: "success" | "warning" | "default" | "accent" | "destructive"; label: string }> = {
    pending_payment: { variant: "warning", label: "Pending Payment" },
    confirmed: { variant: "default", label: "Confirmed" },
    processing: { variant: "accent", label: "Processing" },
    shipped: { variant: "accent", label: "Shipped" },
    delivered: { variant: "success", label: "Delivered" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };
  const info = map[status] || { variant: "default" as const, label: status };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

function getPaymentStatusBadge(status: string) {
  const map: Record<string, { variant: "success" | "warning" | "destructive" | "default"; label: string }> = {
    pending: { variant: "warning", label: "Pending" },
    paid: { variant: "success", label: "Paid" },
    failed: { variant: "destructive", label: "Failed" },
    expired: { variant: "destructive", label: "Expired" },
    refund_pending: { variant: "warning", label: "Refund Pending" },
    refunded: { variant: "default", label: "Refunded" },
  };
  const info = map[status] || { variant: "default" as const, label: status };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

function getCustomerName(userId: any): string {
  if (!userId) return "—";
  if (typeof userId === "object" && userId.name) return userId.name;
  return "Customer";
}

function getCustomerPhone(userId: any): string {
  if (!userId) return "—";
  if (typeof userId === "object" && userId.phone) return userId.phone;
  return "—";
}

export default function AdminDashboardPage() {
  const { data: productsData, isLoading: productsLoading } = useAdminProducts({ limit: 50 });
  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();
  const { data: recentOrders, isLoading: ordersLoading, isError: ordersError } = useAdminRecentOrders(10);
  const { data: orderStats, isLoading: statsLoading } = useAdminOrderStats();

  const products = productsData?.products || [];
  const totalProducts = productsData?.pagination?.total || products.length;

  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = totalProducts - activeProducts;

  const lowStockVariants: Array<{
    productName: string;
    sku?: string;
    weightGrams: number;
    availableStock: number;
  }> = [];

  let totalAvailableUnits = 0;

  products.forEach((p) => {
    p.variants?.forEach((v) => {
      const stock = (v.stockOnHand ?? 0) - (v.reservedStock ?? 0);
      totalAvailableUnits += Math.max(0, stock);
      if (stock <= 10 && v.isActive !== false) {
        lowStockVariants.push({
          productName: p.name,
          sku: v.sku,
          weightGrams: v.weightGrams,
          availableStock: Math.max(0, stock),
        });
      }
    });
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1A3826] to-[#2A563C] text-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-accent">
            Maghora Admin Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
            Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Live business metrics, recent orders, and inventory telemetry.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/products/create">
            <Button className="bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-md">
              + New Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-xl text-xs">
              All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: RECENT ORDERS – PRIMARY
          ═══════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">Recent Orders</h2>
            {orderStats && !statsLoading && (
              <Badge variant="outline" className="text-[11px] ml-2">
                {orderStats.totalOrders} total
              </Badge>
            )}
          </div>
          <Link href="/admin/orders">
            <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All Orders <Eye className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="p-5 sm:p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : ordersError ? (
          <div className="p-8 sm:p-12 text-center">
            <XCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">Failed to load orders</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please check your connection and try again.
            </p>
          </div>
        ) : !recentOrders || recentOrders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              When customers place orders, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Phone</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center hidden md:table-cell">Items</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Payment</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-foreground">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">
                        {getCustomerName(order.userId)}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground font-mono">
                      {getCustomerPhone(order.userId)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-center hidden md:table-cell font-semibold">
                      {order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground whitespace-nowrap">
                      {formatPrice(order.totalPaise)}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex flex-col gap-0.5 items-start">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                          {order.paymentProvider || "Razorpay"}
                        </span>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {getOrderStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: KEY BUSINESS METRICS
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(orderStats?.totalRevenuePaise || 0)}
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  {orderStats?.paidOrderCount || 0} paid orders
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeProducts} active • {inactiveProducts} inactive
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {categories?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Active collections</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Units */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Stock Units
            </CardTitle>
            <Boxes className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalAvailableUnits.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  Available for checkout
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Low Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-amber-700">
                  {lowStockVariants.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Threshold ≤ 10 units
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: LOW STOCK ALERTS
          ═══════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-bold text-foreground">
              Low Stock Inventory Alerts
            </h2>
          </div>
          <Link href="/admin/inventory">
            <span className="text-xs font-semibold text-primary hover:underline">
              View Full Inventory →
            </span>
          </Link>
        </div>

        {lowStockVariants.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground bg-secondary/20 rounded-2xl">
            ✓ All product variants currently have healthy inventory levels (&gt; 10 units).
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {lowStockVariants.slice(0, 6).map((variant, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground">{variant.productName}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {variant.sku || "N/A"} • {variant.weightGrams}g pack
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {variant.availableStock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
