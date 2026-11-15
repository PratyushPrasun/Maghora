import { apiClient } from "@/lib/api-client";
import { ApiResponse, ICart } from "@/types/api";

export interface AddCartItemPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

export const cartService = {
  async getCart(): Promise<ICart> {
    const response = await apiClient.get<ApiResponse<ICart>>("/cart");
    return response.data.data;
  },

  async addItem(payload: AddCartItemPayload): Promise<ICart> {
    const response = await apiClient.post<ApiResponse<ICart>>("/cart/items", payload);
    return response.data.data;
  },

  async updateItem(itemId: string, quantity: number): Promise<ICart> {
    const response = await apiClient.patch<ApiResponse<ICart>>(`/cart/items/${itemId}`, { quantity });
    return response.data.data;
  },

  async removeItem(itemId: string): Promise<ICart> {
    const response = await apiClient.delete<ApiResponse<ICart>>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  async clearCart(): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>("/cart");
  },
};

