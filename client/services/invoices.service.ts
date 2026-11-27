import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  IInvoice,
  IInvoiceSettings,
  IInvoiceStats,
} from "@/types/api";

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface AdminInvoicesListResponse {
  invoices: IInvoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const invoicesService = {
  // Customer endpoints
  async getMyInvoices(): Promise<IInvoice[]> {
    const res = await apiClient.get<ApiResponse<IInvoice[]>>("/invoices/my");
    return res.data.data;
  },

  async getMyInvoiceByOrder(orderId: string): Promise<IInvoice | null> {
    const res = await apiClient.get<ApiResponse<IInvoice | null>>(
      `/invoices/order/${orderId}`
    );
    return res.data.data;
  },

  async getMyInvoiceById(invoiceId: string): Promise<IInvoice> {
    const res = await apiClient.get<ApiResponse<IInvoice>>(
      `/invoices/${invoiceId}`
    );
    return res.data.data;
  },

  async downloadMyInvoicePdf(invoiceId: string, invoiceNumber?: string) {
    const res = await apiClient.get<Blob>(`/invoices/${invoiceId}/download`, {
      responseType: "blob",
    });
    const safeName = invoiceNumber
      ? `${invoiceNumber.replace(/[^A-Za-z0-9_-]/g, "-")}.pdf`
      : `Maghora-Invoice-${invoiceId}.pdf`;
    triggerBrowserDownload(res.data, safeName);
  },

  // Admin endpoints
  async listAdminInvoices(params: {
    page?: number;
    limit?: number;
    search?: string;
    paymentStatus?: string;
    invoiceType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AdminInvoicesListResponse> {
    const res = await apiClient.get<ApiResponse<AdminInvoicesListResponse>>(
      "/admin/invoices",
      { params }
    );
    return res.data.data;
  },

  async getAdminStats(): Promise<IInvoiceStats> {
    const res = await apiClient.get<ApiResponse<IInvoiceStats>>(
      "/admin/invoices/stats"
    );
    return res.data.data;
  },

  async getAdminInvoiceById(invoiceId: string): Promise<IInvoice> {
    const res = await apiClient.get<ApiResponse<IInvoice>>(
      `/admin/invoices/${invoiceId}`
    );
    return res.data.data;
  },

  async downloadAdminInvoicePdf(invoiceId: string, invoiceNumber?: string) {
    const res = await apiClient.get<Blob>(
      `/admin/invoices/${invoiceId}/download`,
      { responseType: "blob" }
    );
    const safeName = invoiceNumber
      ? `${invoiceNumber.replace(/[^A-Za-z0-9_-]/g, "-")}.pdf`
      : `Maghora-Invoice-${invoiceId}.pdf`;
    triggerBrowserDownload(res.data, safeName);
  },

  async generateForOrder(orderId: string): Promise<IInvoice> {
    const res = await apiClient.post<ApiResponse<IInvoice>>(
      `/admin/invoices/generate/${orderId}`
    );
    return res.data.data;
  },

  async createAdjustmentNote(
    invoiceId: string,
    payload: {
      noteType: "credit_note" | "debit_note";
      amountPaise: number;
      reason: string;
    }
  ): Promise<IInvoice> {
    const res = await apiClient.post<ApiResponse<IInvoice>>(
      `/admin/invoices/${invoiceId}/notes`,
      payload
    );
    return res.data.data;
  },

  async getSettings(): Promise<IInvoiceSettings> {
    const res = await apiClient.get<ApiResponse<IInvoiceSettings>>(
      "/admin/invoices/settings"
    );
    return res.data.data;
  },

  async updateSettings(
    payload: Partial<IInvoiceSettings>
  ): Promise<IInvoiceSettings> {
    const res = await apiClient.put<ApiResponse<IInvoiceSettings>>(
      "/admin/invoices/settings",
      payload
    );
    return res.data.data;
  },
};
