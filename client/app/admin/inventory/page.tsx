"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useAdminProducts } from "@/hooks/useProducts";
import { formatWeight, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminProducts({ limit: 50 });

  const products = data?.products || [];

  // Flatten products into variant rows
  const variantInventoryRows: Array<{
    productId: string;
    productName: string;
    productSlug: string;
    variantId?: string;
    sku: string;
    weightGrams: number;
    pricePaise: number;
    stockOnHand: number;
    reservedStock: number;
    availableStock: number;
    isActive: boolean;
  }> = [];

  products.forEach((p) => {
    p.variants?.forEach((v) => {
      const stockOnHand = v.stockOnHand ?? 0;
      const reservedStock = v.reservedStock ?? 0;
      const availableStock = Math.max(0, stockOnHand - reservedStock);

      variantInventoryRows.push({
        productId: p._id,
        productName: p.name,
        productSlug: p.slug,
        variantId: v._id,
        sku: v.sku || "N/A",
        weightGrams: v.weightGrams,
        pricePaise: v.pricePaise,
        stockOnHand,
        reservedStock,
        availableStock,
        isActive: v.isActive !== false && p.isActive,
      });
    });
  });

  const filteredRows = variantInventoryRows.filter(
    (row) =>
      row.productName.toLowerCase().includes(search.toLowerCase()) ||
      row.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Inventory & Stock Tracking
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time physical stock on hand, reserved checkout holds, and available units
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Catalogue Management
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by flavour or SKU..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Flavour & Pack Size</th>
                <th className="py-3.5 px-4">SKU Code</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-center">Stock On Hand</th>
                <th className="py-3.5 px-4 text-center">Active Reservation</th>
                <th className="py-3.5 px-4 text-center">Available to Buy</th>
                <th className="py-3.5 px-4">Health Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="p-4">
                      <Skeleton className="h-9 w-full rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No variant stock records found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-foreground text-sm">
                          {item.productName}
                        </p>
                        <span className="text-[11px] text-muted-foreground">
                          {formatWeight(item.weightGrams)} pouch
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] font-semibold text-foreground">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {formatPrice(item.pricePaise)}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-foreground">
                      {item.stockOnHand}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.reservedStock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-accent font-bold">
                          <Lock className="h-3 w-3" />
                          {item.reservedStock} held
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-sm font-bold ${
                          item.availableStock <= 10
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {item.availableStock}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {item.availableStock <= 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : item.availableStock <= 10 ? (
                        <Badge variant="warning">Low Stock (&le;10)</Badge>
                      ) : (
                        <Badge variant="success">Healthy</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

