import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { User } from '@/data/types';

const STORAGE_KEY = 'mm-auth';

interface StoredAuth {
  user: User | null;
  token: string | null;
}

function load(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: null, token: null };
}

export const useAuthStore = defineStore('auth', () => {
  const initial = load();
  const user = ref<User | null>(initial.user);
  const token = ref<string | null>(initial.token);

  const isAuthenticated = computed(() => !!user.value);

  function login(email: string, password: string): { ok: boolean; error?: string } {
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

    const localPart = trimmedEmail.split('@')[0] ?? '';
    const fullName = localPart
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'User';

    user.value = { id: 'u-' + Date.now(), fullName, email: trimmedEmail };
    token.value = 'demo-token-' + Date.now();
    return { ok: true };
  }

  function register(payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }): { ok: boolean; error?: string } {
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
    user.value = {
      id: 'u-' + Date.now(),
      fullName,
      email,
      phone: payload.phone?.trim() || undefined,
    };
    token.value = 'demo-token-' + Date.now();
    return { ok: true };
  }

  function updateProfile(updates: Partial<User>) {
    if (!user.value) return;
    user.value = { ...user.value, ...updates };
  }

  function logout() {
    user.value = null;
    token.value = null;
  }

  watch(
    [user, token],
    () => {
      const data: StoredAuth = { user: user.value, token: token.value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    { deep: true },
  );

  return { user, token, isAuthenticated, login, register, logout, updateProfile };
});