"use client";

import React, { useState } from "react";
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const { data: orders, isLoading } = useMyOrders();

  // Extract unique customer records from available orders
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    orderCount: number;
    lastOrderDate: string;
  }>();

  orders?.forEach((ord) => {
    const key = ord.shippingAddress.phone;
    if (customerMap.has(key)) {
      const existing = customerMap.get(key)!;
      existing.orderCount += 1;
    } else {
      customerMap.set(key, {
        name: ord.shippingAddress.recipientName,
        phone: ord.shippingAddress.phone,
        orderCount: 1,
        lastOrderDate: ord.createdAt,
      });
    }
  });

  const customers = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Customer Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Verified customer profiles derived from active delivery records
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          {customers.length} Verified Customers
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or phone..."
          className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4 text-center">Total Orders</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="p-4">
                      <Skeleton className="h-9 w-full rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No customer records found yet.
                  </td>
                </tr>
              ) : (
                customers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground text-sm">{cust.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      📞 {cust.phone}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-foreground">
                      {cust.orderCount}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {formatDate(cust.lastOrderDate)}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="success">Active</Badge>
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

