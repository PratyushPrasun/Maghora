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
  FileText,
  Download,
} from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { useMyInvoices } from "@/hooks/useInvoices";
import { invoicesService } from "@/services/invoices.service";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MithilaLotus } from "@/components/storefront/MithilaMotifs";
import { toast } from "sonner";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: myInvoices } = useMyInvoices();
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const invoiceByOrderId = React.useMemo(() => {
    const map = new Map<string, NonNullable<typeof myInvoices>[number]>();
    for (const inv of myInvoices || []) {
      if (inv.documentType === "invoice") {
        map.set(inv.orderId, inv);
      }
    }
    return map;
  }, [myInvoices]);

  const handleDownloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setDownloadingId(invoiceId);
      await invoicesService.downloadMyInvoicePdf(invoiceId, invoiceNumber);
      toast.success(`Downloaded ${invoiceNumber}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [authLoading, isAuthenticated, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#536B42] text-white">Delivered</span>;
      case "shipped":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C65D35] text-white">Shipped</span>;
      case "processing":
      case "confirmed":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#702C32] text-white">Confirmed</span>;
      case "pending_payment":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-600 text-white">Awaiting Payment</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-600 text-white">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EEDEC4] text-[#33251F]">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-[#536B42] font-bold text-xs">● Paid via Razorpay</span>;
      case "pending":
        return <span className="text-amber-700 font-bold text-xs">● Pending Payment</span>;
      case "failed":
        return <span className="text-rose-700 font-bold text-xs">● Payment Incomplete</span>;
      default:
        return <span className="text-[#7B685F] font-medium text-xs">● {status}</span>;
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-[#F8EEDC] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 pb-5 border-b border-[#E8D7BE]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] font-bold uppercase tracking-[0.22em] text-[#702C32] mb-1.5 font-serif">
              <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
              <span>Order Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#33251F]">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-[#7B685F] mt-1">
              Track recent shipments and view previous deliveries
            </p>
          </div>

          <Link href="/products" className="self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-serif font-bold uppercase tracking-wider border-[#E8D7BE] bg-white text-[#33251F] hover:bg-[#F8EEDC] min-h-[38px]"
            >
              Shop More Flavours
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl sm:rounded-3xl bg-white" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="p-8 sm:p-16 text-center rounded-2xl sm:rounded-3xl border border-dashed border-[#E8D7BE] bg-white max-w-md mx-auto shadow-xs">
            <Package className="h-12 w-12 text-[#702C32] mx-auto mb-3" />
            <h2 className="text-lg font-bold font-serif text-[#33251F]">No orders yet</h2>
            <p className="text-xs text-[#7B685F] mt-1 mb-6 leading-relaxed">
              When you order your favorite makhana flavours, they will appear right here.
            </p>
            <Link href="/products">
              <Button className="bg-[#702C32] hover:bg-[#551F24] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-wider min-h-[40px]">
                Discover Flavours
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-serif font-bold text-sm sm:text-base text-[#33251F]">
                      Order #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.paymentStatus)}
                  </div>

                  <p className="text-xs text-[#7B685F]">
                    Placed on {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] sm:text-[11px] bg-[#F8EEDC]/60 border border-[#E8D7BE]/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[#33251F]"
                      >
                        {item.productName} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[10px] sm:text-[11px] text-[#7B685F] self-center">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-0 border-[#E8D7BE]/50">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-[#7B685F] block font-serif uppercase tracking-wider">Total</span>
                    <span className="font-serif text-base sm:text-lg font-bold text-[#702C32]">
                      {formatPrice(order.totalPaise)}
                    </span>
                  </div>

                  {(() => {
                    const inv = invoiceByOrderId.get(order._id);
                    if (!inv) {
                      return (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#7B685F] px-2.5 py-1 rounded-lg bg-[#F8EEDC]/60">
                          <FileText className="h-3 w-3" /> Pending Invoice
                        </span>
                      );
                    }
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(inv._id, inv.invoiceNumber)}
                        disabled={downloadingId === inv._id}
                        isLoading={downloadingId === inv._id}
                        className="rounded-xl text-xs font-serif font-bold uppercase tracking-wider gap-1.5 border-[#702C32]/30 text-[#702C32] hover:bg-[#702C32] hover:text-[#F8EEDC] min-h-[38px] px-3"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Invoice</span>
                      </Button>
                    );
                  })()}

                  <Link href={`/orders/${order._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-serif font-bold uppercase tracking-wider gap-1 border-[#E8D7BE] text-[#33251F] hover:bg-[#F8EEDC] min-h-[38px] px-3.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
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
