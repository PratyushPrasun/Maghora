"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/useProducts";
import { useAdminCategories } from "@/hooks/useCategories";
import { useMyOrders } from "@/hooks/useOrders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { data: productsData, isLoading: productsLoading } = useAdminProducts({ limit: 50 });
  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();

  const products = productsData?.products || [];
  const totalProducts = productsData?.pagination?.total || products.length;

  // Compute real metrics from backend products
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = totalProducts - activeProducts;

  // Calculate real low-stock alerts from variant inventory
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

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1A3826] to-[#2A563C] text-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-accent">
            Maghora Storefront Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
            Catalogue & Inventory Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Live telemetry connected to MongoDB database and Redis caching layer.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/products/create">
            <Button className="bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-md">
              + New Product
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-xl text-xs">
              Manage Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Products
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

        {/* Units in Stock */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Inventory Units
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

        {/* Low Stock Alerts */}
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Low Stock Variants
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
                  Threshold &le; 10 units
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Low Stock Alert Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-7 space-y-4">
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

        {/* Recent Orders Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Recent Orders</h2>
              </div>
              <Link href="/admin/orders">
                <span className="text-xs font-semibold text-primary hover:underline">
                  All Orders →
                </span>
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl">
                No orders recorded yet. As orders are placed, they will appear here.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentOrders.map((ord) => (
                  <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono font-bold text-foreground">#{ord.orderNumber}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(ord.createdAt)}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="font-bold text-foreground">{formatPrice(ord.totalPaise)}</p>
                      <Badge variant={ord.paymentStatus === "paid" ? "success" : "warning"}>
                        {ord.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

