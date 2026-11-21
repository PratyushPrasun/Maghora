import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiClientError extends Error {
  statusCode: number;
  errors?: Array<{ field?: string; message: string }>;

  constructor(message: string, statusCode: number = 500, errors?: Array<{ field?: string; message: string }>) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true, // Required for session cookie maghora.sid
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ success?: boolean; message?: string; errors?: Array<{ field?: string; message: string }> }>) => {
    if (error.response) {
      const { status, data } = error.response;
      const firstError = data?.errors && data.errors.length > 0 ? data.errors[0].message : null;
      const message =
        firstError && (!data?.message || data.message === "Validation failed")
          ? firstError
          : data?.message ||
            firstError ||
            `Request failed with status code ${status}`;

      const clientError = new ApiClientError(message, status, data?.errors);

      // 401 Unauthorized handling (session expired or unauthenticated)
      if (status === 401) {
        // We do not force hard redirect in API interceptor to prevent redirect loops on public pages
        // The auth state hook or route guards handle route protection
      }

      return Promise.reject(clientError);
    } else if (error.request) {
      return Promise.reject(
        new ApiClientError("Network error. Unable to reach the Maghora server. Please ensure the backend is running.", 0)
      );
    } else {
      return Promise.reject(new ApiClientError(error.message, 500));
    }
  }
);

