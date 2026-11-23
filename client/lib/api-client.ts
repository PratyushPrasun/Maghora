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
    "X-Requested-With": "XMLHttpRequest", // CSRF protection: marks as AJAX request
  },
});

// ---------- Retry configuration ----------
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 502, 503, 504]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Initialise retry counter on first attempt
    if (!config.headers["x-retry-count"]) {
      config.headers["x-retry-count"] = "0";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<{ success?: boolean; message?: string; errors?: Array<{ field?: string; message: string }> }>) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;

    // ---- Automatic retry for transient server / network errors ----
    if (config) {
      const retryCount = parseInt(
        (config.headers["x-retry-count"] as string) || "0",
        10
      );

      const isRetryable =
        // Network error (no response at all)
        (!error.response && error.code !== "ERR_CANCELED") ||
        // Server returned a retryable status
        (error.response && RETRYABLE_STATUS_CODES.has(error.response.status));

      if (isRetryable && retryCount < MAX_RETRIES) {
        config.headers["x-retry-count"] = String(retryCount + 1);

        // Exponential back-off: 1s, 2s
        await sleep(RETRY_DELAY_MS * (retryCount + 1));

        return apiClient.request(config);
      }
    }

    // ---- Build a user-friendly error ----
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
