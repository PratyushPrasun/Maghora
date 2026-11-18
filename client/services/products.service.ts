import { apiClient } from "@/lib/api-client";
import { ApiResponse, IProduct, ProductListResponse, ProductQueryOptions } from "@/types/api";

export interface CreateProductFormValues {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  variants: {
    sku: string;
    weightGrams: number;
    pricePaise: number;
    mrpPaise: number;
    stock: number;
    isActive: boolean;
  }[];
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface UpdateProductFormValues {
  name?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  variants?: {
    variantId?: string;
    sku: string;
    weightGrams: number;
    pricePaise: number;
    mrpPaise: number;
    stock?: number;
    isActive: boolean;
  }[];
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
  removeImagePublicIds?: string[];
}

export const productsService = {
  async getProducts(params?: ProductQueryOptions): Promise<ProductListResponse> {
    const response = await apiClient.get<ApiResponse<ProductListResponse>>("/products", {
      params,
    });
    return response.data.data;
  },

  async getProductBySlug(slug: string): Promise<IProduct> {
    const response = await apiClient.get<ApiResponse<{ product: IProduct }>>(`/products/${slug}`);
    return response.data.data.product;
  },

  async getAdminProducts(params?: ProductQueryOptions): Promise<ProductListResponse> {
    const response = await apiClient.get<ApiResponse<ProductListResponse>>("/products/manage", {
      params,
    });
    return response.data.data;
  },

  async getAdminProductById(id: string): Promise<IProduct> {
    const response = await apiClient.get<ApiResponse<{ product: IProduct }>>(`/products/manage/${id}`);
    return response.data.data.product;
  },

  async createProduct(formData: FormData): Promise<IProduct> {
    const response = await apiClient.post<ApiResponse<{ product: IProduct }>>("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data.product;
  },

  async updateProduct(id: string, formData: FormData): Promise<IProduct> {
    const response = await apiClient.patch<ApiResponse<{ product: IProduct }>>(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data.product;
  },

  async updateProductStatus(id: string, isActive: boolean): Promise<IProduct> {
    const response = await apiClient.patch<ApiResponse<{ product: IProduct }>>(`/products/${id}/status`, { isActive });
    return response.data.data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
  },
};

