import { apiClient } from "@/lib/api-client";
import { ApiResponse, RazorpayOrderData, VerifyPaymentPayload } from "@/types/api";

export interface PaymentStatusResponse {
  status: string;
  paymentStatus: string;
  inventoryStatus: string;
  reservationExpiresAt: string;
}

export const paymentsService = {
  async createRazorpayOrder(orderId: string): Promise<RazorpayOrderData> {
    const response = await apiClient.post<ApiResponse<RazorpayOrderData>>(`/payments/create/${orderId}`);
    return response.data.data;
  },

  async verifyPayment(payload: VerifyPaymentPayload): Promise<{ orderId: string; status: string }> {
    const response = await apiClient.post<ApiResponse<{ orderId: string; status: string }>>("/payments/verify", payload);
    return response.data.data;
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    const response = await apiClient.get<ApiResponse<PaymentStatusResponse>>(`/payments/${orderId}`);
    return response.data.data;
  },
};

