import { apiClient } from "@/lib/api-client";
import { ApiResponse, ICart, IProduct, IProductVariant } from "@/types/api";

export interface AddCartItemPayload {
  productId: string;
  variantId: string;
  quantity: number;
  product?: IProduct;
  variant?: IProductVariant;
}

export const cartService = {
  async getCart(): Promise<ICart> {
    const response = await apiClient.get<ApiResponse<ICart>>("/cart");
    return response.data.data;
  },

  async addItem(payload: AddCartItemPayload): Promise<ICart> {
    // Only send strictly accepted fields to the backend API schema
    const response = await apiClient.post<ApiResponse<ICart>>("/cart/items", {
      productId: payload.productId,
      variantId: payload.variantId,
      quantity: payload.quantity,
    });
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
