"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useAdminProducts, useUpdateProductStatus, useDeleteProduct } from "@/hooks/useProducts";
import { formatPrice, formatWeight } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useAdminProducts({
    search: search.trim() || undefined,
    page,
    limit: 15,
    sort: "newest",
  });

  const updateStatusMutation = useUpdateProductStatus();
  const deleteMutation = useDeleteProduct();

  const products = data?.products || [];
  const pagination = data?.pagination;

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await updateStatusMutation.mutateAsync({ id, isActive: !currentStatus });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Products Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, curate, update variants, upload images, and control catalogue visibility
          </p>
        </div>

        <Link href="/admin/products/create">
          <Button className="rounded-xl font-bold gap-2 text-xs shadow-sm">
            <Plus className="h-4 w-4" /> Create Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Variants & Pricing</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-4">
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const primaryImage =
                    product.images?.find((img) => img.isPrimary)?.url ||
                    product.images?.[0]?.url ||
                    "/logo.png";

                  const categoryName =
                    typeof product.category === "object" && product.category?.name
                      ? product.category.name
                      : "General";

                  const totalAvailableStock = product.variants?.reduce(
                    (acc, v) => acc + Math.max(0, (v.stockOnHand ?? 0) - (v.reservedStock ?? 0)),
                    0
                  ) || 0;

                  return (
                    <tr key={product._id} className="hover:bg-muted/20 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-secondary/40 border border-border/40 relative flex-shrink-0 overflow-hidden">
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              className="object-contain p-1.5"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{product.name}</p>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-medium text-foreground">
                        {categoryName}
                      </td>

                      {/* Variants & Pricing */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {product.variants?.map((v, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {v.sku || formatWeight(v.weightGrams)}:
                              </span>
                              <span className="font-semibold text-foreground">
                                {formatPrice(v.pricePaise)}
                              </span>
                              {v.mrpPaise > v.pricePaise && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                  {formatPrice(v.mrpPaise)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Available Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            totalAvailableStock <= 10
                              ? "text-amber-700"
                              : "text-foreground"
                          }`}
                        >
                          {totalAvailableStock} units
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(product._id, product.isActive)}
                          disabled={updateStatusMutation.isPending}
                          className="cursor-pointer"
                        >
                          {product.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="outline">Hidden</Badge>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Preview on store"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Link href={`/admin/products/${product._id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-primary"
                              title="Edit product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(product._id)}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            title="Soft delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {products.length} of {pagination.total} products
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 rounded-lg"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
              </Button>
              <span className="font-semibold text-foreground px-2">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="h-8 rounded-lg"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent onClose={() => setDeleteId(null)}>
          <DialogHeader>
            <DialogTitle>Confirm Soft Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this product? It will be marked as inactive and removed from public catalogue, preserving historical order records.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteMutation.isPending}
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

