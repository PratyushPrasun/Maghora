import { apiClient } from "@/lib/api-client";
import { ApiResponse, IUser } from "@/types/api";

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  identifier: string; // phone or email
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<{ user: IUser }> {
    const response = await apiClient.post<ApiResponse<{ user: IUser }>>("/auth/register", payload);
    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<{ user: IUser }> {
    const response = await apiClient.post<ApiResponse<{ user: IUser }>>("/auth/login", payload);
    return response.data.data;
  },

  async getCurrentUser(): Promise<IUser | null> {
    const response = await apiClient.get<ApiResponse<{ user: IUser | null }>>("/auth/me");
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<null>>("/auth/logout");
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", payload);
    return response.data.message || "Password reset link sent";
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/reset-password", payload);
    return response.data.message || "Password reset successfully";
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ user: IUser }> {
    const response = await apiClient.post<ApiResponse<{ user: IUser }>>("/auth/change-password", payload);
    return response.data.data;
  },
};

