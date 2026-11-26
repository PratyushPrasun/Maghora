"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAdminCustomers } from "@/hooks/useAdminDashboard";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "highest_spending">("newest");
  const [orderActivity, setOrderActivity] = useState<"all" | "with_orders" | "no_orders">("all");
  const [registeredAfter, setRegisteredAfter] = useState("");
  const [registeredBefore, setRegisteredBefore] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminCustomers({
    page,
    limit,
    search: search || undefined,
    sort,
    orderActivity: orderActivity !== "all" ? orderActivity : undefined,
    registeredAfter: registeredAfter || undefined,
    registeredBefore: registeredBefore || undefined,
  });

  const customers = data?.customers || [];
  const pagination = data?.pagination;

  const hasFilters =
    Boolean(search) ||
    orderActivity !== "all" ||
    Boolean(registeredAfter) ||
    Boolean(registeredBefore) ||
    sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setOrderActivity("all");
    setRegisteredAfter("");
    setRegisteredBefore("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Customer Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Comprehensive directory of all registered customers with purchase activity
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {pagination?.total ?? 0} Registered Customers
        </Badge>
      </div>

      {/* Search, Filters & Sort Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or phone..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={orderActivity}
            onChange={(e) => { setOrderActivity(e.target.value as any); setPage(1); }}
            aria-label="Filter by order activity"
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="all">All Customers</option>
            <option value="with_orders">With Orders</option>
            <option value="no_orders">No Orders Yet</option>
          </select>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={registeredAfter}
              onChange={(e) => { setRegisteredAfter(e.target.value); setPage(1); }}
              aria-label="Registered after"
              title="Registered from"
              className="h-10 rounded-xl border border-border bg-card px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              type="date"
              value={registeredBefore}
              onChange={(e) => { setRegisteredBefore(e.target.value); setPage(1); }}
              aria-label="Registered before"
              title="Registered until"
              className="h-10 rounded-xl border border-border bg-card px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as any); setPage(1); }}
            aria-label="Sort customers"
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_spending">Highest Spending</option>
          </select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-10 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3.5 w-3.5" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Email</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Phone</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Registered</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Total Spent</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Last Order</th>
                <th className="py-3.5 px-4">Status</th>
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
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    {hasFilters ? "No customers match your filters." : "No registered customers yet."}
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/customers/${cust._id}`}
                            className="font-bold text-foreground text-sm hover:text-primary transition-colors block truncate max-w-[160px]"
                          >
                            {cust.name}
                          </Link>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            ID: {cust._id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-muted-foreground truncate max-w-[180px]">
                      {cust.email}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-muted-foreground">
                      {cust.phone}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                      {formatDate(cust.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-foreground">
                      {cust.totalOrders}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground whitespace-nowrap">
                      {cust.totalSpentPaise > 0 ? formatPrice(cust.totalSpentPaise) : "—"}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                      {cust.lastOrderDate ? formatDate(cust.lastOrderDate) : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={cust.isActive ? "success" : "destructive"}>
                        {cust.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/admin/customers/${cust._id}`}>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                          <Eye className="h-3.5 w-3.5" /> View
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
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} customers)
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
