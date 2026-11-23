import { apiClient } from "@/lib/api-client";
import { ApiResponse, RazorpayOrderData, VerifyPaymentPayload } from "@/types/api";

export interface PaymentStatusResponse {
  status: string;
  paymentStatus: string;
  inventoryStatus: string;
  reservationExpiresAt: string;
}

export interface StandardOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id?: string;
}

export const paymentsService = {
  /**
   * Standard Razorpay Order Creation (direct amount in paise)
   */
  async createStandardOrder(
    amount: number,
    currency: string = "INR",
    receipt?: string
  ): Promise<StandardOrderResponse> {
    const response = await apiClient.post<any>("/create-order", {
      amount,
      currency,
      receipt,
    });
    return response.data?.data || response.data;
  },

  /**
   * Standard Razorpay Signature Verification
   */
  async verifyStandardPayment(
    payload: VerifyPaymentPayload
  ): Promise<{ success: boolean; message: string; order_id?: string; payment_id?: string }> {
    const response = await apiClient.post<any>("/verify-payment", payload);
    return response.data;
  },

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

