import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { invoicesService } from "@/services/invoices.service";
import type { IInvoiceSettings } from "@/types/api";

export const INVOICE_KEYS = {
  myInvoices: ["invoices", "my"] as const,
  myOrderInvoice: (orderId: string) => ["invoices", "order", orderId] as const,
  adminList: (params: Record<string, any>) =>
    ["admin", "invoices", "list", params] as const,
  adminStats: ["admin", "invoices", "stats"] as const,
  adminDetail: (id: string) => ["admin", "invoices", "detail", id] as const,
  adminSettings: ["admin", "invoices", "settings"] as const,
};

export function useMyInvoices() {
  return useQuery({
    queryKey: INVOICE_KEYS.myInvoices,
    queryFn: () => invoicesService.getMyInvoices(),
  });
}

export function useMyInvoiceByOrder(orderId: string) {
  return useQuery({
    queryKey: INVOICE_KEYS.myOrderInvoice(orderId),
    queryFn: () => invoicesService.getMyInvoiceByOrder(orderId),
    enabled: Boolean(orderId),
  });
}

export function useAdminInvoices(params: {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: string;
  invoiceType?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: INVOICE_KEYS.adminList(params),
    queryFn: () => invoicesService.listAdminInvoices(params),
  });
}

export function useAdminInvoiceStats() {
  return useQuery({
    queryKey: INVOICE_KEYS.adminStats,
    queryFn: () => invoicesService.getAdminStats(),
  });
}

export function useAdminInvoiceDetail(invoiceId: string) {
  return useQuery({
    queryKey: INVOICE_KEYS.adminDetail(invoiceId),
    queryFn: () => invoicesService.getAdminInvoiceById(invoiceId),
    enabled: Boolean(invoiceId),
  });
}

export function useAdminInvoiceSettings() {
  return useQuery({
    queryKey: INVOICE_KEYS.adminSettings,
    queryFn: () => invoicesService.getSettings(),
  });
}

export function useUpdateInvoiceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<IInvoiceSettings>) =>
      invoicesService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.adminSettings });
      toast.success("Business & GST invoice settings saved");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save invoice settings");
    },
  });
}

export function useGenerateInvoiceForOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => invoicesService.generateForOrder(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invoices"] });
      queryClient.invalidateQueries({
        queryKey: INVOICE_KEYS.myOrderInvoice(orderId),
      });
      toast.success("Invoice generated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Could not generate invoice");
    },
  });
}

export function useCreateAdjustmentNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      payload,
    }: {
      invoiceId: string;
      payload: {
        noteType: "credit_note" | "debit_note";
        amountPaise: number;
        reason: string;
      };
    }) => invoicesService.createAdjustmentNote(invoiceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "invoices"] });
      toast.success("Adjustment note issued successfully");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to issue adjustment note");
    },
  });
}
