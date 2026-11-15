import { apiClient } from "@/lib/api-client";
import { ApiResponse, IAdminAuditLog, IUser, Pagination } from "@/types/api";

export interface CreateAdminPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface UpdateAdminPayload {
  name?: string;
  phone?: string;
  email?: string;
}

export interface AdminListResponse {
  admins: IUser[];
  pagination: Pagination;
}

export interface AdminAuditListResponse {
  logs: IAdminAuditLog[];
  pagination: Pagination;
}

export const adminsService = {
  async getAdmins(page: number = 1, limit: number = 20): Promise<AdminListResponse> {
    const response = await apiClient.get<ApiResponse<AdminListResponse>>("/admins", {
      params: { page, limit },
    });
    return response.data.data;
  },

  async createAdmin(payload: CreateAdminPayload): Promise<{ admin: IUser }> {
    const response = await apiClient.post<ApiResponse<{ admin: IUser }>>("/admins", payload);
    return response.data.data;
  },

  async updateAdmin(id: string, payload: UpdateAdminPayload): Promise<{ admin: IUser }> {
    const response = await apiClient.patch<ApiResponse<{ admin: IUser }>>(`/admins/${id}`, payload);
    return response.data.data;
  },

  async updateAdminStatus(id: string, isActive: boolean): Promise<{ admin: IUser }> {
    const response = await apiClient.patch<ApiResponse<{ admin: IUser }>>(`/admins/${id}/status`, { isActive });
    return response.data.data;
  },

  async getAdminAuditLogs(page: number = 1, limit: number = 20): Promise<AdminAuditListResponse> {
    const response = await apiClient.get<ApiResponse<AdminAuditListResponse>>("/admins/audit-logs", {
      params: { page, limit },
    });
    return response.data.data;
  },
};

