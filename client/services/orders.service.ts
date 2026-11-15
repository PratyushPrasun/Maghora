import { apiClient } from "@/lib/api-client";
import { ApiResponse, IOrder } from "@/types/api";

export interface CreateOrderPayload {
  idempotencyKey: string;
  addressId: string;
  customerNotes?: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalPaise: number;
  reservationExpiresAt: string;
}

export const ordersService = {
  async placeOrder(payload: CreateOrderPayload): Promise<PlaceOrderResponse> {
    const response = await apiClient.post<ApiResponse<PlaceOrderResponse>>("/orders", payload);
    return response.data.data;
  },

  async getMyOrders(): Promise<IOrder[]> {
    const response = await apiClient.get<ApiResponse<IOrder[]>>("/orders");
    return response.data.data;
  },

  async getMyOrderById(orderId: string): Promise<IOrder> {
    const response = await apiClient.get<ApiResponse<IOrder>>(`/orders/${orderId}`);
    return response.data.data;
  },
};

