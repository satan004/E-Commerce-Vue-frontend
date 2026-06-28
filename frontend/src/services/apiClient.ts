// filepath: src/services/apiClient.ts

// In dev, Vite proxies `/api/*` to the Laravel backend (see vite.config.ts).
// In production, set VITE_API_BASE_URL to the absolute URL of your API.
const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method?: ApiMethod;
  url: string;
  params?: object;
  data?: unknown;
  headers?: Record<string, string>;
}

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

// --- Response interceptor: normalize errors ----------------------------------
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

function buildUrl(path: string, params?: ApiRequestConfig['params']): string {
  const url = new URL(`${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, window.location.origin);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function readJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function api<T>(config: ApiRequestConfig): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...config.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (config.data !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(buildUrl(config.url, config.params), {
      method: config.method ?? 'GET',
      headers,
      body: config.data !== undefined ? JSON.stringify(config.data) : undefined,
    });
  } catch (err) {
    throw { status: 0, message: (err as Error)?.message ?? 'Network error' } satisfies ApiError;
  }

  const data = await readJson(response);
  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message ?? response.statusText ?? 'Request failed',
      errors: data?.errors,
    } satisfies ApiError;
  }

  return data as T;
}
