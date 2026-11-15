import { apiClient } from "@/lib/api-client";
import { AddressLabel, ApiResponse, IAddress } from "@/types/api";

export interface CreateAddressPayload {
  label: AddressLabel;
  customLabel?: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: "India";
  isDefault?: boolean;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}

export const addressesService = {
  async getAddresses(): Promise<IAddress[]> {
    const response = await apiClient.get<ApiResponse<IAddress[]>>("/addresses");
    return response.data.data;
  },

  async getAddressById(id: string): Promise<IAddress> {
    const response = await apiClient.get<ApiResponse<IAddress>>(`/addresses/${id}`);
    return response.data.data;
  },

  async createAddress(payload: CreateAddressPayload): Promise<IAddress> {
    const response = await apiClient.post<ApiResponse<IAddress>>("/addresses", payload);
    return response.data.data;
  },

  async updateAddress(id: string, payload: UpdateAddressPayload): Promise<IAddress> {
    const response = await apiClient.patch<ApiResponse<IAddress>>(`/addresses/${id}`, payload);
    return response.data.data;
  },

  async setDefaultAddress(id: string): Promise<IAddress> {
    const response = await apiClient.patch<ApiResponse<IAddress>>(`/addresses/${id}/default`);
    return response.data.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(`/addresses/${id}`);
  },
};

