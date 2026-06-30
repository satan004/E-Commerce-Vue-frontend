// filepath: src/services/auth.ts
import { api, setAuthToken } from './apiClient';

const backendURL = ((import.meta.env.VITE_BACKEND_URL as string | undefined) ?? '').replace(/\/$/, '');

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  is_admin?: boolean;
  google_id?: string | null;
  avatar_path?: string | null;
  avatar_url?: string | null;
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
  avatar?: File | null;
  remove_avatar?: boolean;
}): Promise<AuthUser> {
  if (payload.avatar || payload.remove_avatar) {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone ?? '');
    formData.append('address', payload.address ?? '');
    if (payload.avatar) formData.append('avatar', payload.avatar);
    if (payload.remove_avatar) formData.append('remove_avatar', '1');

    return api<AuthUser>({ method: 'POST', url: '/profile', data: formData });
  }

  return api<AuthUser>({ method: 'PUT', url: '/profile', data: payload });
}

export function googleRedirectUrl(): string {
  const path = '/auth/google/redirect';
  return backendURL ? `${backendURL}${path}` : path;
}
