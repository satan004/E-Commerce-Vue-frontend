// filepath: src/services/auth.ts
import { api, setAuthToken } from './apiClient';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  is_admin?: boolean;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await api<AuthResponse>({
    method: 'POST',
    url: '/login',
    data: { email, password },
  });
  setAuthToken(data.token);
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}): Promise<AuthResponse> {
  const data = await api<AuthResponse>({
    method: 'POST',
    url: '/register',
    data: payload,
  });
  setAuthToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api({ method: 'POST', url: '/logout' });
  } finally {
    setAuthToken(null);
  }
}

export async function fetchProfile(): Promise<AuthUser> {
  return api<AuthUser>({ method: 'GET', url: '/profile' });
}

export async function updateProfile(payload: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}): Promise<AuthUser> {
  return api<AuthUser>({ method: 'PUT', url: '/profile', data: payload });
}