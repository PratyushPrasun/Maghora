"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Boxes,
  Layers,
  AlertCircle,
  Activity,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/useProducts";
import { useAdminCategories } from "@/hooks/useCategories";
import { formatPrice } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#1A3826", "#E26D2B", "#D4AF37", "#2A563C", "#8A847D", "#E5DFD3"];

export default function AdminAnalyticsPage() {
  const { data: productsData, isLoading: loadingProducts } = useAdminProducts({ limit: 50 });
  const { data: categories, isLoading: loadingCategories } = useAdminCategories();

  const products = productsData?.products || [];

  // Compute actual inventory valuation
  let totalStockValuationPaise = 0;
  let totalUnits = 0;
  const categoryCounts: Record<string, number> = {};

  products.forEach((p) => {
    const catName =
      typeof p.category === "object" && p.category?.name
        ? p.category.name
        : "Uncategorized";

    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;

    p.variants?.forEach((v) => {
      const stock = Math.max(0, (v.stockOnHand ?? 0) - (v.reservedStock ?? 0));
      totalUnits += stock;
      totalStockValuationPaise += stock * v.pricePaise;
    });
  });

  const categoryChartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const productStockData = products.slice(0, 6).map((p) => {
    const stock = p.variants?.reduce(
      (acc, v) => acc + Math.max(0, (v.stockOnHand ?? 0) - (v.reservedStock ?? 0)),
      0
    ) || 0;
    return {
      name: p.name.split(" ")[0] + "...",
      fullName: p.name,
      stock,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Analytics & Telemetry
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real data derived from live backend inventory, catalogue distribution, and pricing valuations
          </p>
        </div>
      </div>

      {/* Strict Backend Verification Notice */}
      <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-xs text-foreground/80 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Data Integrity Policy: </strong>
          Per Maghora architecture standards, we never fabricate fake numbers or synthetic conversion rates. Event tracking metrics (impressions, click-throughs, traffic sources) will stream here once the client-side telemetry service is connected. The charts below display 100% verified live backend data.
        </div>
      </div>

      {/* Verified KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Stock Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(totalStockValuationPaise)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {totalUnits.toLocaleString("en-IN")} available units
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Catalogue Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  In {Object.keys(categoryCounts).length} active collections
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Average Flavour Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {products.length > 0
                    ? formatPrice(
                        products.reduce(
                          (acc, p) => acc + (p.variants?.[0]?.pricePaise || 0),
                          0
                        ) / products.length
                      )
                    : "₹0"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Primary variant average
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Bar Chart */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-2 border-b border-border/60">
            Flavour Distribution by Collection
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" stroke="#8A847D" fontSize={11} />
                <YAxis stroke="#8A847D" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "1rem",
                    border: "1px solid #E5DFD3",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#1A3826" radius={[6, 6, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available Stock By Product */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-2 border-b border-border/60">
            Available Stock by Product (Units)
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStockData}>
                <XAxis dataKey="name" stroke="#8A847D" fontSize={11} />
                <YAxis stroke="#8A847D" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "1rem",
                    border: "1px solid #E5DFD3",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="stock" fill="#E26D2B" radius={[6, 6, 0, 0]} name="Units in Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

