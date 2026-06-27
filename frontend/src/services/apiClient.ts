// filepath: src/services/apiClient.ts
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

// In dev, Vite proxies `/api/*` to the Laravel backend (see vite.config.ts).
// In production, set VITE_API_BASE_URL to the absolute URL of your API.
const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
});

// --- Token storage -----------------------------------------------------------
const TOKEN_KEY = 'mm-auth-token';

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

// --- Request interceptor: inject bearer token --------------------------------
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: normalize errors ----------------------------------
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

function toApiError(err: unknown): ApiError {
  const ax = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
  if (ax?.isAxiosError) {
    const status = ax.response?.status ?? 0;
    const data = ax.response?.data;
    const message =
      (data && typeof data === 'object' && data.message) ||
      ax.message ||
      'Network error';
    return {
      status,
      message: typeof message === 'string' ? message : 'Network error',
      errors: data && typeof data === 'object' ? data.errors : undefined,
    };
  }
  return { status: 0, message: (err as Error)?.message ?? 'Unknown error' };
}

export async function api<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await apiClient.request<T>(config);
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
}