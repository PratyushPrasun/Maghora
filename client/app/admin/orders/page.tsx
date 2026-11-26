"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminOrders } from "@/hooks/useAdminDashboard";
import { formatPrice, formatDate } from "@/lib/utils";
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

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useAdminOrders({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Order Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track order fulfillment, payment gateways, and shipping logistics
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {pagination?.total ?? 0} Total Orders
        </Badge>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Order #..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Phone</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">Items</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Payment</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Fulfillment</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="p-4">
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {getCustomerName(order.userId)}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-muted-foreground font-mono">
                      {getCustomerPhone(order.userId)}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center hidden md:table-cell font-semibold">
                      {order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground whitespace-nowrap">
                      {formatPrice(order.totalPaise)}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {getOrderStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                          <Eye className="h-3.5 w-3.5" /> Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
            </p>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
