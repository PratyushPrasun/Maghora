"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Eye,
  Home,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useAdminCustomerDetail,
  useAdminCustomerOrders,
} from "@/hooks/useAdminDashboard";
import { formatPrice, formatDate, formatWeight } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function getAddressIcon(label: string) {
  if (label === "office") return <Building2 className="h-4 w-4 text-primary" />;
  return <Home className="h-4 w-4 text-primary" />;
}

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

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = (params?.id as string) || "";
  const [ordersPage, setOrdersPage] = useState(1);

  const { data, isLoading } = useAdminCustomerDetail(customerId);
  const { data: ordersData, isLoading: ordersLoading } = useAdminCustomerOrders(
    customerId,
    ordersPage,
    10
  );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">Customer Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested customer could not be loaded.
        </p>
        <Link href="/admin/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    );
  }

  const { customer, addresses, purchaseSummary } = data;
  const orders = ordersData?.orders || [];
  const ordersPagination = ordersData?.pagination;

  // Identify order delivery addresses that differ from saved profile addresses
  const normalizeAddr = (a: {
    recipientName?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }) =>
    [
      a.recipientName?.trim().toLowerCase(),
      a.phone?.trim(),
      a.addressLine1?.trim().toLowerCase(),
      a.city?.trim().toLowerCase(),
      a.state?.trim().toLowerCase(),
      a.postalCode?.trim(),
    ].join("|");

  const savedAddrSet = new Set(addresses.map((a) => normalizeAddr(a)));
  const uniqueOrderDeliveryAddresses: Array<{
    key: string;
    orderNumber: string;
    orderId: string;
    address: NonNullable<(typeof orders)[number]["shippingAddress"]>;
  }> = [];
  const seenOrderAddrKeys = new Set<string>();

  for (const ord of orders) {
    if (!ord.shippingAddress) continue;
    const key = normalizeAddr(ord.shippingAddress);
    if (!savedAddrSet.has(key) && !seenOrderAddrKeys.has(key)) {
      seenOrderAddrKeys.add(key);
      uniqueOrderDeliveryAddresses.push({
        key,
        orderNumber: ord.orderNumber,
        orderId: ord._id,
        address: ord.shippingAddress,
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Customers
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                {customer.name}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customer since {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
          <Badge variant={customer.isActive ? "success" : "destructive"} className="text-xs">
            {customer.isActive ? "Active Account" : "Inactive Account"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* ═══ A. Personal Information ═══ */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <User className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3 w-3" /> Full Name
                </p>
                <p className="font-semibold text-foreground text-sm">{customer.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Email Address
                </p>
                <p className="font-semibold text-foreground">{customer.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> Phone Number
                </p>
                <p className="font-semibold text-foreground font-mono">{customer.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Registration Date
                </p>
                <p className="font-semibold text-foreground">{formatDate(customer.createdAt)}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-muted-foreground">Customer ID</p>
                <p className="font-mono text-[11px] text-foreground/70">{customer._id}</p>
              </div>
            </div>
          </div>

          {/* ═══ B. Order History ═══ */}
          <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Order History</h2>
                {ordersPagination && (
                  <Badge variant="outline" className="text-[11px] ml-1">
                    {ordersPagination.total} orders
                  </Badge>
                )}
              </div>
            </div>

            {ordersLoading ? (
              <div className="p-5 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                This customer has not placed any orders yet.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 hidden sm:table-cell">Products</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 hidden md:table-cell">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-foreground">
                            #{order.orderNumber}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell text-foreground/80 max-w-[200px] truncate">
                            {order.items?.map((i) => `${i.productName} (x${i.quantity})`).join(", ")}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-foreground whitespace-nowrap">
                            {formatPrice(order.totalPaise)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-0.5 items-start">
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                                {order.paymentProvider || "Razorpay"}
                              </span>
                              {getPaymentStatusBadge(order.paymentStatus)}
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            {getOrderStatusBadge(order.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link href={`/admin/orders/${order._id}`}>
                              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Orders Pagination */}
                {ordersPagination && ordersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground">
                      Page {ordersPagination.page} of {ordersPagination.totalPages}
                    </p>
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        disabled={ordersPage <= 1}
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        disabled={ordersPage >= ordersPagination.totalPages}
                        onClick={() => setOrdersPage((p) => p + 1)}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ═══ C. Addresses ═══ */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Saved Addresses ({addresses.length})
              </h2>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl">
                This customer has no saved addresses.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      addr.isDefault
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getAddressIcon(addr.label)}
                        <span className="font-bold text-foreground capitalize">
                          {addr.customLabel || addr.label}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <Badge variant="accent" className="text-[10px]">Default</Badge>
                      )}
                    </div>
                    <p className="font-semibold text-foreground">{addr.recipientName}</p>
                    <p className="text-foreground/70">{addr.addressLine1}</p>
                    {addr.addressLine2 && (
                      <p className="text-foreground/70">{addr.addressLine2}</p>
                    )}
                    {addr.landmark && (
                      <p className="text-foreground/60 italic">Near {addr.landmark}</p>
                    )}
                    <p className="text-foreground/70">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-foreground/70">{addr.country}</p>
                    <p className="font-mono text-muted-foreground pt-1">📞 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {uniqueOrderDeliveryAddresses.length > 0 && (
              <div className="pt-4 border-t border-border/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order Delivery Addresses (Different from Saved Profile)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uniqueOrderDeliveryAddresses.map((entry) => (
                    <div
                      key={entry.key}
                      className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Delivery Address</span>
                        <Link
                          href={`/admin/orders/${entry.orderId}`}
                          className="font-mono text-[10px] text-primary hover:underline"
                        >
                          Order #{entry.orderNumber}
                        </Link>
                      </div>
                      <p className="font-semibold text-foreground">{entry.address.recipientName}</p>
                      <p className="text-foreground/70">{entry.address.addressLine1}</p>
                      {entry.address.addressLine2 && (
                        <p className="text-foreground/70">{entry.address.addressLine2}</p>
                      )}
                      {entry.address.landmark && (
                        <p className="text-foreground/60 italic">Near {entry.address.landmark}</p>
                      )}
                      <p className="text-foreground/70">
                        {entry.address.city}, {entry.address.state} - {entry.address.postalCode}
                      </p>
                      <p className="text-foreground/70">{entry.address.country}</p>
                      <p className="font-mono text-muted-foreground pt-1">📞 {entry.address.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Right Column: D. Purchase Summary ═══ */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              <h3 className="text-base font-bold text-foreground">Purchase Summary</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-bold text-foreground">{purchaseSummary.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Successful Purchases</span>
                <span className="font-bold text-emerald-700">{purchaseSummary.paidOrderCount}</span>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-foreground text-sm">
                  {formatPrice(purchaseSummary.totalPaidPaise)}
                </span>
              </div>
              {purchaseSummary.totalRefundedPaise > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refunded</span>
                  <span className="font-bold text-amber-700">
                    {formatPrice(purchaseSummary.totalRefundedPaise)}
                    <span className="text-muted-foreground font-normal ml-1">
                      ({purchaseSummary.refundedOrderCount} orders)
                    </span>
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Order Value</span>
                <span className="font-bold text-foreground">
                  {purchaseSummary.averageOrderValuePaise > 0
                    ? formatPrice(purchaseSummary.averageOrderValuePaise)
                    : "—"}
                </span>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between">
                <span className="text-muted-foreground">Last Purchase</span>
                <span className="font-semibold text-foreground">
                  {purchaseSummary.lastOrderDate
                    ? formatDate(purchaseSummary.lastOrderDate)
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={customer.isActive ? "success" : "destructive"}
                className="text-xs"
              >
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Member since {formatDate(customer.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
