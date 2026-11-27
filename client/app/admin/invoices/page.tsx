"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Search,
  Eye,
  Settings,
  IndianRupee,
  CheckCircle2,
  Clock,
  Calendar,
  PlusCircle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  useAdminInvoices,
  useAdminInvoiceStats,
  useAdminInvoiceSettings,
  useUpdateInvoiceSettings,
  useCreateAdjustmentNote,
} from "@/hooks/useInvoices";
import { invoicesService } from "@/services/invoices.service";
import type { IInvoice, IInvoiceSettings } from "@/types/api";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminInvoicesPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "settings">("invoices");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [invoiceType, setInvoiceType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [noteTarget, setNoteTarget] = useState<IInvoice | null>(null);
  const [noteType, setNoteType] = useState<"credit_note" | "debit_note">("credit_note");
  const [noteAmountRupees, setNoteAmountRupees] = useState("");
  const [noteReason, setNoteReason] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: stats, isLoading: statsLoading } = useAdminInvoiceStats();
  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useAdminInvoices({
    page,
    limit: 15,
    search: debouncedSearch || undefined,
    paymentStatus,
    invoiceType,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: settingsData, isLoading: settingsLoading } =
    useAdminInvoiceSettings();
  const updateSettings = useUpdateInvoiceSettings();
  const createNote = useCreateAdjustmentNote();

  const [settingsForm, setSettingsForm] = useState<Partial<IInvoiceSettings>>({});

  useEffect(() => {
    if (settingsData) {
      setSettingsForm(settingsData);
    }
  }, [settingsData]);

  const handleDownloadPdf = async (inv: IInvoice) => {
    try {
      setDownloadingId(inv._id);
      await invoicesService.downloadAdminInvoicePdf(inv._id, inv.invoiceNumber);
      toast.success(`Downloaded ${inv.invoiceNumber}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleIssueNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTarget) return;
    const amountPaise = Math.round(Number(noteAmountRupees) * 100);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      toast.error("Please enter a valid positive amount in ₹");
      return;
    }
    if (noteReason.trim().length < 5) {
      toast.error("Please provide a reason (minimum 5 characters)");
      return;
    }

    await createNote.mutateAsync({
      invoiceId: noteTarget._id,
      payload: {
        noteType,
        amountPaise,
        reason: noteReason.trim(),
      },
    });
    setNoteTarget(null);
    setNoteAmountRupees("");
    setNoteReason("");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync({
      brandName: settingsForm.brandName,
      tagline: settingsForm.tagline,
      legalName: settingsForm.legalName,
      gstin: settingsForm.gstin,
      isGstRegistered: settingsForm.isGstRegistered,
      businessAddress: settingsForm.businessAddress,
      contactNumber: settingsForm.contactNumber,
      supportEmail: settingsForm.supportEmail,
      website: settingsForm.website,
      returnPolicyUrl: settingsForm.returnPolicyUrl,
      invoicePrefix: settingsForm.invoicePrefix,
      defaultHsnCode: settingsForm.defaultHsnCode,
      defaultGstRate: Number(settingsForm.defaultGstRate ?? 5),
      shippingGstRate: Number(settingsForm.shippingGstRate ?? 5),
      pricesIncludeGst: settingsForm.pricesIncludeGst,
      footerNote: settingsForm.footerNote,
      footerTagline: settingsForm.footerTagline,
      termsAndConditions: settingsForm.termsAndConditions,
    });
  };

  const paymentBadgeVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Refunded":
      case "Partially Refunded":
        return "destructive";
      case "COD":
      case "Pending":
      case "Partially Paid":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Invoice & GST Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Immutable tax invoices, credit/debit notes, and SARA FOODS ENTERPRISES GST configuration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "invoices" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("invoices")}
            className="gap-1.5 text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            Invoices
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="gap-1.5 text-xs"
          >
            <Settings className="h-3.5 w-3.5" />
            Business & GST Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statsLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Invoices</span>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xl font-bold font-serif mt-2">
                {stats?.totalInvoices ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Invoiced</span>
                <IndianRupee className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xl font-bold font-serif mt-2">
                {formatPrice(stats?.totalInvoicedPaise ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Paid Amount</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xl font-bold font-serif text-emerald-700 mt-2">
                {formatPrice(stats?.paidAmountPaise ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pending / COD</span>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-xl font-bold font-serif text-amber-700 mt-2">
                {formatPrice(stats?.pendingAmountPaise ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>FY {stats?.currentFinancialYear || "26-27"}</span>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xl font-bold font-serif mt-2">
                {stats?.currentFinancialYearCount ?? 0}
              </p>
            </div>
          </>
        )}
      </div>

      {activeTab === "invoices" ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice #, order #, customer, email, phone..."
                className="pl-9 text-xs h-9"
              />
            </div>

            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="COD">COD</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Refunded">Refunded</option>
              <option value="Partially Refunded">Partially Refunded</option>
            </select>

            <select
              value={invoiceType}
              onChange={(e) => {
                setInvoiceType(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs"
            >
              <option value="all">All Document Types</option>
              <option value="Tax Invoice">Tax Invoice</option>
              <option value="Bill of Supply">Bill of Supply</option>
              <option value="Credit Note">Credit Note</option>
              <option value="Debit Note">Debit Note</option>
            </select>

            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="text-xs h-9"
              aria-label="Start Date"
            />

            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="text-xs h-9"
              aria-label="End Date"
            />
          </div>

          {/* Table */}
          {listLoading ? (
            <Skeleton className="h-80 w-full rounded-2xl" />
          ) : listError ? (
            <div className="p-8 rounded-2xl border border-destructive/30 bg-card text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              <p className="text-sm font-semibold">Failed to load invoices</p>
              <p className="text-xs text-muted-foreground">
                {(listError as Error).message}
              </p>
            </div>
          ) : !listData?.invoices?.length ? (
            <div className="p-12 rounded-2xl border border-dashed border-border bg-card text-center space-y-2">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-bold font-serif">No invoices found</p>
              <p className="text-xs text-muted-foreground">
                Invoices are automatically generated when Razorpay payments are captured or COD orders are confirmed.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Invoice #</th>
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Issued Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {listData.invoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-secondary/20">
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <Link
                            href={`/admin/orders/${inv.orderId}`}
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {inv.orderNumber}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/customers/${inv.customerId}`}
                            className="font-semibold text-foreground hover:text-primary"
                          >
                            {inv.customerSnapshot.fullName}
                          </Link>
                          <p className="text-[10px] text-muted-foreground">
                            {inv.customerSnapshot.mobile}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(inv.issuedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{inv.invoiceType}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={paymentBadgeVariant(inv.paymentStatus) as any}>
                            {inv.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-bold font-serif">
                          {formatPrice(inv.grandTotalPaise)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedInvoice(inv)}
                              title="View Invoice Details"
                              className="h-8 px-2"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadPdf(inv)}
                              disabled={downloadingId === inv._id}
                              title="Download PDF"
                              className="h-8 px-2"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            {inv.documentType === "invoice" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setNoteTarget(inv);
                                  setNoteType("credit_note");
                                  setNoteAmountRupees("");
                                  setNoteReason("");
                                }}
                                title="Issue Credit / Debit Note"
                                className="h-8 px-2 text-primary"
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {listData.pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Page {listData.pagination.page} of{" "}
                    {listData.pagination.totalPages} ({listData.pagination.total}{" "}
                    records)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= listData.pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Business & GST Settings */
        <form
          onSubmit={handleSaveSettings}
          className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6 max-w-4xl"
        >
          {settingsLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Brand Name</Label>
                  <Input
                    value={settingsForm.brandName || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, brandName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tagline</Label>
                  <Input
                    value={settingsForm.tagline || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, tagline: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Registered Legal Name</Label>
                  <Input
                    value={settingsForm.legalName || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, legalName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">GSTIN</Label>
                  <Input
                    value={settingsForm.gstin || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        gstin: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Contact Number</Label>
                  <Input
                    value={settingsForm.contactNumber || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        contactNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Support Email</Label>
                  <Input
                    type="email"
                    value={settingsForm.supportEmail || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        supportEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Website URL</Label>
                  <Input
                    value={settingsForm.website || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, website: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Return / Refund Policy URL</Label>
                  <Input
                    value={settingsForm.returnPolicyUrl || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        returnPolicyUrl: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="text-sm font-bold">Business Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Address Line 1"
                    value={settingsForm.businessAddress?.addressLine1 || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        businessAddress: {
                          ...s.businessAddress!,
                          addressLine1: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    placeholder="Address Line 2"
                    value={settingsForm.businessAddress?.addressLine2 || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        businessAddress: {
                          ...s.businessAddress!,
                          addressLine2: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    placeholder="City"
                    value={settingsForm.businessAddress?.city || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        businessAddress: {
                          ...s.businessAddress!,
                          city: e.target.value,
                        },
                      }))
                    }
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="State"
                      value={settingsForm.businessAddress?.state || ""}
                      onChange={(e) =>
                        setSettingsForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress!,
                            state: e.target.value,
                          },
                        }))
                      }
                    />
                    <Input
                      placeholder="State Code"
                      value={settingsForm.businessAddress?.stateCode || ""}
                      onChange={(e) =>
                        setSettingsForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress!,
                            stateCode: e.target.value,
                          },
                        }))
                      }
                    />
                    <Input
                      placeholder="PIN Code"
                      value={settingsForm.businessAddress?.postalCode || ""}
                      onChange={(e) =>
                        setSettingsForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress!,
                            postalCode: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Invoice Prefix</Label>
                  <Input
                    value={settingsForm.invoicePrefix || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        invoicePrefix: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Default HSN Code</Label>
                  <Input
                    value={settingsForm.defaultHsnCode || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        defaultHsnCode: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Default GST Rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={28}
                    value={settingsForm.defaultGstRate ?? 5}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        defaultGstRate: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Shipping GST Rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={28}
                    value={settingsForm.shippingGstRate ?? 5}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        shippingGstRate: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(settingsForm.isGstRegistered)}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        isGstRegistered: e.target.checked,
                      }))
                    }
                  />
                  <span>GST Registered (uncheck to issue Bill of Supply without GST)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(settingsForm.pricesIncludeGst)}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        pricesIncludeGst: e.target.checked,
                      }))
                    }
                  />
                  <span>Product prices are GST-inclusive</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Footer Greeting</Label>
                  <Input
                    value={settingsForm.footerNote || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        footerNote: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Footer Tagline</Label>
                  <Input
                    value={settingsForm.footerTagline || ""}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        footerTagline: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={updateSettings.isPending}
                  disabled={updateSettings.isPending}
                >
                  Save Business & GST Settings
                </Button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Invoice Detail Dialog */}
      <Dialog
        open={Boolean(selectedInvoice)}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {selectedInvoice.invoiceType} — {selectedInvoice.invoiceNumber}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-secondary/30">
                  <div>
                    <span className="text-muted-foreground block">Order ID</span>
                    <span className="font-mono font-bold">
                      {selectedInvoice.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Issued</span>
                    <span className="font-semibold">
                      {formatDate(selectedInvoice.issuedAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Payment</span>
                    <span className="font-semibold">
                      {selectedInvoice.paymentStatus} ({selectedInvoice.paymentMethod})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Place of Supply</span>
                    <span className="font-semibold">
                      {selectedInvoice.placeOfSupply.state} (
                      {selectedInvoice.placeOfSupply.isInterstate ? "IGST" : "CGST+SGST"})
                    </span>
                  </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-[11px]">
                    <thead className="bg-secondary/40">
                      <tr>
                        <th className="p-2 text-left">Item</th>
                        <th className="p-2 text-center">HSN</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Taxable</th>
                        <th className="p-2 text-right">GST</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.sNo}>
                          <td className="p-2 font-medium">
                            {item.productName} ({item.sku})
                          </td>
                          <td className="p-2 text-center">{item.hsnCode}</td>
                          <td className="p-2 text-center">{item.quantity}</td>
                          <td className="p-2 text-right">
                            {formatPrice(item.taxableValuePaise)}
                          </td>
                          <td className="p-2 text-right">
                            {formatPrice(item.gstAmountPaise)} ({item.gstRate}%)
                          </td>
                          <td className="p-2 text-right font-bold">
                            {formatPrice(item.totalPaise)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 p-3 rounded-xl bg-secondary/20">
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Amount in Words</span>
                    <p className="font-semibold">{selectedInvoice.amountInWords}</p>
                    {selectedInvoice.razorpayPaymentId && (
                      <p className="text-[11px] text-muted-foreground font-mono">
                        Razorpay Ref: {selectedInvoice.razorpayPaymentId}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 text-right min-w-[180px]">
                    <p>Taxable: {formatPrice(selectedInvoice.taxableAmountPaise)}</p>
                    <p>Total GST: {formatPrice(selectedInvoice.taxBreakdown.totalGstPaise)}</p>
                    <p className="text-sm font-bold text-primary">
                      Grand Total: {formatPrice(selectedInvoice.grandTotalPaise)}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPdf(selectedInvoice)}
                  disabled={downloadingId === selectedInvoice._id}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download A4 PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Credit / Debit Note Dialog */}
      <Dialog
        open={Boolean(noteTarget)}
        onOpenChange={(open) => !open && setNoteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">
              Issue Adjustment Note
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssueNote} className="space-y-4 text-xs">
            <p className="text-muted-foreground">
              Issued invoices are legally immutable. Issue a Credit Note or Debit Note against{" "}
              <span className="font-mono font-bold text-foreground">
                {noteTarget?.invoiceNumber}
              </span>
              .
            </p>
            <div className="space-y-1.5">
              <Label>Note Type</Label>
              <select
                value={noteType}
                onChange={(e) =>
                  setNoteType(e.target.value as "credit_note" | "debit_note")
                }
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
              >
                <option value="credit_note">Credit Note (Refund / Reduction)</option>
                <option value="debit_note">Debit Note (Additional Charge)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                required
                value={noteAmountRupees}
                onChange={(e) => setNoteAmountRupees(e.target.value)}
                placeholder="e.g. 199.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input
                required
                value={noteReason}
                onChange={(e) => setNoteReason(e.target.value)}
                placeholder="e.g. Partial refund for damaged packet"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                isLoading={createNote.isPending}
                disabled={createNote.isPending}
              >
                Issue Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
