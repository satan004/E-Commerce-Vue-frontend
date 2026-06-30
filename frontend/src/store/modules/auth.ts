import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/data/types';
import * as authApi from '@/services/auth';
import { getAuthToken, setAuthToken } from '@/services/apiClient';

const STORAGE_KEY = 'mm-auth';

function parseAddress(address?: string | null): User['address'] | undefined {
  if (!address) return undefined;
  try {
    const parsed = JSON.parse(address);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}
  return {
    line1: address,
    city: '',
    state: '',
    pincode: '',
  };
}

function formatAddress(address?: User['address']): string | undefined {
  if (!address) return undefined;
  return JSON.stringify(address);
}

function adaptUser(user: authApi.AuthUser): User {
  return {
    id: String(user.id),
    fullName: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    avatarUrl: user.avatar_url ?? undefined,
    address: parseAddress(user.address),
  };
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.user ?? parsed ?? null;
    }
  } catch {}
  return null;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(loadUser());
  const token = ref<string | null>(getAuthToken());
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  function persist(nextUser: User | null, nextToken = getAuthToken()) {
    user.value = nextUser;
    token.value = nextToken;
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser }));
    else localStorage.removeItem(STORAGE_KEY);
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const trimmedEmail = (email ?? '').trim();
    if (!trimmedEmail || !password) {
      return { ok: false, error: 'Please enter email and password.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters.' };
    }

    loading.value = true;
    try {
      const data = await authApi.login(trimmedEmail, password);
      persist(adaptUser(data.user), data.token);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Login failed.' };
    } finally {
      loading.value = false;
    }
  }

  async function loginWithToken(authToken: string): Promise<{ ok: boolean; error?: string }> {
    if (!authToken) {
      return { ok: false, error: 'Google login did not return an auth token.' };
    }

    loading.value = true;
    try {
      setAuthToken(authToken);
      token.value = authToken;
      await loadProfile();

      if (!user.value) {
        throw new Error('Unable to load your profile after Google login.');
      }

      return { ok: true };
    } catch (e: any) {
      setAuthToken(null);
      persist(null, null);
      return { ok: false, error: e?.message ?? 'Google login failed.' };
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ ok: boolean; error?: string }> {
    const fullName = (payload.fullName ?? '').trim();
    const email = (payload.email ?? '').trim();
    const password = payload.password ?? '';
    if (!fullName || !email || !password) {
      return { ok: false, error: 'Please fill in all required fields.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters.' };
    }

    loading.value = true;
    try {
      const data = await authApi.register({
        name: fullName,
        email,
        password,
        password_confirmation: password,
        phone: payload.phone,
      });
      persist(adaptUser(data.user), data.token);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Registration failed.' };
    } finally {
      loading.value = false;
    }
  }

  async function loadProfile(): Promise<void> {
    if (!getAuthToken()) return;
    loading.value = true;
    try {
      const profile = await authApi.fetchProfile();
      persist(adaptUser(profile));
    } catch {
      setAuthToken(null);
      persist(null, null);
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(updates: Partial<User>) {
    if (!user.value) return;
    const next = { ...user.value, ...updates };
    const saved = await authApi.updateProfile({
      name: next.fullName,
      email: next.email,
      phone: next.phone,
      address: formatAddress(next.address),
    });
    persist(adaptUser(saved));
  }

  async function updateProfileWithAvatar(updates: Partial<User> & { avatar?: File | null; removeAvatar?: boolean }) {
    if (!user.value) return;
    const next = { ...user.value, ...updates };
    const saved = await authApi.updateProfile({
      name: next.fullName,
      email: next.email,
      phone: next.phone,
      address: formatAddress(next.address),
      avatar: updates.avatar,
      remove_avatar: updates.removeAvatar,
    });
    persist(adaptUser(saved));
  }

  async function logout() {
    await authApi.logout();
    persist(null, null);
  }

  return { user, token, loading, isAuthenticated, login, loginWithToken, register, logout, loadProfile, updateProfile, updateProfileWithAvatar };
});
