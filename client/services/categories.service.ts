import { apiClient } from "@/lib/api-client";
import { ApiResponse, ICategory } from "@/types/api";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export const categoriesService = {
  async getCategories(): Promise<ICategory[]> {
    const response = await apiClient.get<ApiResponse<{ categories: ICategory[] }>>("/categories");
    return response.data.data.categories;
  },

  async getCategoryBySlug(slug: string): Promise<ICategory> {
    const response = await apiClient.get<ApiResponse<{ category: ICategory }>>(`/categories/${slug}`);
    return response.data.data.category;
  },

  async getAdminCategories(): Promise<ICategory[]> {
    const response = await apiClient.get<ApiResponse<{ categories: ICategory[] }>>("/categories/manage");
    return response.data.data.categories;
  },

  async createCategory(payload: CreateCategoryPayload): Promise<ICategory> {
    const response = await apiClient.post<ApiResponse<{ category: ICategory }>>("/categories", payload);
    return response.data.data.category;
  },

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<ICategory> {
    const response = await apiClient.patch<ApiResponse<{ category: ICategory }>>(`/categories/${id}`, payload);
    return response.data.data.category;
  },

  async updateCategoryStatus(id: string, isActive: boolean): Promise<ICategory> {
    const response = await apiClient.patch<ApiResponse<{ category: ICategory }>>(`/categories/${id}/status`, { isActive });
    return response.data.data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};

