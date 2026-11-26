import { apiClient } from "@/lib/api-client";
import { ApiResponse, IOrder, Pagination } from "@/types/api";

// ---- Types ----

export interface AdminOrderListResponse {
  orders: IOrder[];
  pagination: Pagination;
}

export interface OrderStatsResponse {
  totalOrders: number;
  statusBreakdown: Record<string, number>;
  totalRevenuePaise: number;
  paidOrderCount: number;
}

export interface AdminOrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminCustomerListItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpentPaise: number;
  paidOrderCount: number;
  lastOrderDate: string | null;
}

export interface AdminCustomerListResponse {
  customers: AdminCustomerListItem[];
  pagination: Pagination;
}

export interface PurchaseSummary {
  totalOrders: number;
  paidOrderCount: number;
  totalPaidPaise: number;
  totalRefundedPaise: number;
  refundedOrderCount: number;
  averageOrderValuePaise: number;
  lastOrderDate: string | null;
}

export interface AdminCustomerDetailResponse {
  customer: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  addresses: Array<{
    _id: string;
    label: string;
    customLabel?: string;
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
  }>;
  purchaseSummary: PurchaseSummary;
}

export interface AdminCustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "newest" | "oldest" | "highest_spending";
  isActive?: string;
  orderActivity?: "all" | "with_orders" | "no_orders";
  registeredAfter?: string;
  registeredBefore?: string;
}

export interface CustomerOrdersResponse {
  orders: IOrder[];
  pagination: Pagination;
}

// ---- Service ----

export const adminDashboardService = {
  // ---- Orders ----
  async getRecentOrders(limit: number = 10): Promise<IOrder[]> {
    const response = await apiClient.get<ApiResponse<IOrder[]>>(
      "/admin/orders/recent",
      { params: { limit } }
    );
    return response.data.data;
  },

  async getOrderStats(): Promise<OrderStatsResponse> {
    const response = await apiClient.get<ApiResponse<OrderStatsResponse>>(
      "/admin/orders/stats"
    );
    return response.data.data;
  },

  async getAllOrders(
    params?: AdminOrderQueryParams
  ): Promise<AdminOrderListResponse> {
    const response = await apiClient.get<
      ApiResponse<AdminOrderListResponse>
    >("/admin/orders", { params });
    return response.data.data;
  },

  async getOrderById(orderId: string): Promise<IOrder> {
    const response = await apiClient.get<ApiResponse<IOrder>>(
      `/admin/orders/${orderId}`
    );
    return response.data.data;
  },

  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<IOrder> {
    const response = await apiClient.patch<ApiResponse<IOrder>>(
      `/admin/orders/${orderId}/status`,
      { status }
    );
    return response.data.data;
  },

  // ---- Customers ----
  async getCustomers(
    params?: AdminCustomerQueryParams
  ): Promise<AdminCustomerListResponse> {
    const response = await apiClient.get<
      ApiResponse<AdminCustomerListResponse>
    >("/admin/customers", { params });
    return response.data.data;
  },

  async getCustomerDetail(
    customerId: string
  ): Promise<AdminCustomerDetailResponse> {
    const response = await apiClient.get<
      ApiResponse<AdminCustomerDetailResponse>
    >(`/admin/customers/${customerId}`);
    return response.data.data;
  },

  async getCustomerOrders(
    customerId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CustomerOrdersResponse> {
    const response = await apiClient.get<
      ApiResponse<CustomerOrdersResponse>
    >(`/admin/customers/${customerId}/orders`, { params });
    return response.data.data;
  },
};
