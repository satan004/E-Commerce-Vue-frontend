<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { useCartStore } from '@/store/modules/cart';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useOrdersStore } from '@/store/modules/orders';
import * as authApi from '@/services/auth';
import {
  CART_WISHLIST_AUTH_REASON,
  CART_WISHLIST_LOGIN_MESSAGE,
  isCartOrWishlistDestination,
  normalizeRedirect,
} from '@/utils/authRedirect';

const auth = useAuthStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const orders = useOrdersStore();
const router = useRouter();
const route = useRoute();

const form = reactive({
  email: '',
  password: '',
});

const error = ref('');
const submitting = ref(false);
const googleLoading = ref(false);
const oauthLoading = ref(false);
const successVisible = ref(false);
let successTimer: number | undefined;

const redirectTarget = computed(() => loginDestination(route.query.redirect));
const googleCallbackError = computed(() => queryString(route.query.google_error));
const displayError = computed(() => error.value || googleCallbackError.value);
const isBusy = computed(() => submitting.value || googleLoading.value || oauthLoading.value || successVisible.value);
const showAuthMessage = computed(
  () =>
    route.query.authRequired === CART_WISHLIST_AUTH_REASON ||
    isCartOrWishlistDestination(redirectTarget.value),
);

onMounted(() => {
  void completeGoogleLogin();
});

onUnmounted(() => {
  if (successTimer) window.clearTimeout(successTimer);
});

function queryString(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
}

function loginDestination(value: Parameters<typeof normalizeRedirect>[0]): string {
  const destination = normalizeRedirect(value);
  return destination === '/' ? '/dashboard' : destination;
}

async function completeGoogleLogin() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const token = hash.get('token');

  if (!token) return;

  oauthLoading.value = true;
  error.value = '';

  await router
    .replace({
      path: route.path,
      query: {},
      hash: '',
    })
    .catch(() => undefined);

  const result = await auth.loginWithToken(token);

  if (!result.ok) {
    error.value = result.error ?? 'Google login failed.';
    oauthLoading.value = false;
    return;
  }

  await handleLoginSuccess();
}

async function refreshCustomerState() {
  await Promise.all([
    auth.loadProfile(),
    cart.loadCart(),
    wishlist.loadWishlist(),
    orders.loadOrders(),
  ]);
}

async function handleLoginSuccess() {
  if (successVisible.value) return;

  await refreshCustomerState();
  googleLoading.value = false;
  oauthLoading.value = false;
  submitting.value = false;
  successVisible.value = true;

  if (successTimer) window.clearTimeout(successTimer);
  successTimer = window.setTimeout(() => {
    successVisible.value = false;
    void router.push('/');
  }, 3000);
}

async function submit() {
  if (isBusy.value) return;
  error.value = '';
  submitting.value = true;

  try {
    const result = await auth.login(form.email.trim(), form.password);
    if (!result.ok) {
      error.value = result.error ?? 'Login failed.';
      return;
    }

    await handleLoginSuccess();
  } catch (e) {
    error.value = (e as Error).message || 'Unexpected error.';
  } finally {
    if (!successVisible.value) submitting.value = false;
  }
}

function continueWithGoogle() {
  if (isBusy.value) return;
  error.value = '';
  googleLoading.value = true;
  window.location.assign(authApi.googleRedirectUrl());
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-shell" aria-label="Customer login">
      <div class="auth-copy">
        <p class="eyebrow">PHONE SHOP account</p>
        <h1>Sign in to shop faster.</h1>
        <p>
          Track orders, save favorites, and keep your cart ready across every device.
        </p>
        <div class="copy-points" aria-label="Account benefits">
          <span>Secure checkout</span>
          <span>Saved wishlist</span>
          <span>Order history</span>
        </div>
      </div>

      <div class="auth-card">
        <div class="auth-card-head">
          <p class="eyebrow">Welcome back</p>
          <h2>Login</h2>
          <p>Use your email or continue with your Gmail account.</p>
        </div>

        <p v-if="showAuthMessage" class="auth-notice">
          {{ CART_WISHLIST_LOGIN_MESSAGE }}
        </p>
        <p v-if="oauthLoading" class="auth-notice">
          Signing you in with Google...
        </p>

        <button
          type="button"
          class="google-btn"
          :disabled="isBusy"
          @click="continueWithGoogle"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M21.6 12.23c0-.75-.07-1.47-.19-2.16H12v4.09h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.31 2.98-7.46z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.59A9.99 9.99 0 0 0 12 22z" />
            <path fill="#FBBC05" d="M6.4 13.91a6.03 6.03 0 0 1 0-3.82V7.5H3.06a9.99 9.99 0 0 0 0 9l3.34-2.59z" />
            <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.82 1.5l2.87-2.87C16.95 2.97 14.7 2 12 2a9.99 9.99 0 0 0-8.94 5.5l3.34 2.59C7.19 7.72 9.4 5.96 12 5.96z" />
          </svg>
          <span>{{ googleLoading ? 'Opening Google...' : 'Continue with Google' }}</span>
        </button>

        <div class="divider"><span>or sign in with email</span></div>

        <form @submit.prevent="submit" novalidate>
          <label>
            <span>Email address</span>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              :disabled="isBusy"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              :disabled="isBusy"
            />
          </label>

          <p v-if="displayError" class="auth-error">{{ displayError }}</p>

          <button type="submit" class="auth-submit" :disabled="isBusy">
            {{ submitting ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-foot">
          New to PHONE SHOP?
          <RouterLink to="/register">Create an account</RouterLink>
        </p>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="login-success">
        <div v-if="successVisible" class="login-success-backdrop" aria-live="polite">
          <section
            class="login-success-card"
            role="status"
            aria-labelledby="login-success-title"
            aria-describedby="login-success-message"
          >
            <div class="login-success-icon" aria-hidden="true">&#10004;</div>
            <h2 id="login-success-title">Login Successful!</h2>
            <p id="login-success-message">Welcome back! Enjoy your shopping.</p>
            <div class="login-success-progress" aria-hidden="true"></div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 72vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  background:
    linear-gradient(135deg, rgba(3, 52, 150, 0.08), transparent 42%),
    linear-gradient(315deg, rgba(43, 190, 249, 0.12), transparent 38%),
    var(--mm-bg);
}

.auth-shell {
  width: 100%;
  max-width: 980px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 28px;
  align-items: stretch;
}

.auth-copy,
.auth-card {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  box-shadow: var(--mm-shadow-sm);
}

.auth-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 38px;
  border-left: 4px solid var(--mm-primary);
}

.eyebrow {
  color: var(--mm-primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.auth-copy h1 {
  color: var(--mm-text);
  font-size: 38px;
  font-weight: 800;
  line-height: 1.08;
  margin-bottom: 14px;
}

.auth-copy p:not(.eyebrow) {
  color: var(--mm-text-soft);
  font-size: 15px;
  line-height: 1.7;
  max-width: 430px;
}

.copy-points {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.copy-points span {
  background: var(--mm-primary-light);
  border: 1px solid rgba(43, 190, 249, 0.22);
  border-radius: 999px;
  color: var(--mm-primary-dark);
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 11px;
}

.auth-card {
  padding: 30px;
}

.auth-card-head {
  margin-bottom: 20px;
}

.auth-card-head h2 {
  color: var(--mm-text);
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 6px;
}

.auth-card-head p:not(.eyebrow) {
  color: var(--mm-text-soft);
  font-size: 13.5px;
  line-height: 1.5;
}

.auth-notice {
  background: var(--mm-primary-light);
  border: 1px solid rgba(43, 190, 249, 0.28);
  border-radius: 8px;
  color: var(--mm-primary-dark);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 16px;
  padding: 10px 12px;
}

.google-btn,
.auth-submit {
  width: 100%;
  min-height: 44px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid var(--mm-border);
  color: var(--mm-text);
}

.google-btn:hover:not(:disabled) {
  border-color: #c8d3df;
  background: #f8fafc;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--mm-text-mute);
  font-size: 12px;
  font-weight: 700;
  margin: 20px 0;
  text-transform: uppercase;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--mm-border);
}

form label {
  display: block;
  margin-bottom: 14px;
}

form label span {
  display: block;
  color: var(--mm-text-soft);
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 6px;
}

form input {
  width: 100%;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  background: var(--mm-bg-mute);
  color: var(--mm-text);
  font-size: 14px;
  padding: 12px;
}

form input:focus {
  outline: none;
  border-color: var(--mm-primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(43, 190, 249, 0.14);
}

form input:disabled {
  opacity: 0.72;
}

.auth-error {
  background: #fff5f5;
  border: 1px solid #ffd8d6;
  border-radius: 8px;
  color: var(--mm-accent-red);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  margin: 4px 0 12px;
  padding: 10px 12px;
}

.auth-submit {
  background: var(--mm-primary);
  color: #fff;
  margin-top: 4px;
}

.auth-submit:hover:not(:disabled) {
  background: var(--mm-primary-dark);
}

.google-btn:disabled,
.auth-submit:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.auth-foot {
  color: var(--mm-text-soft);
  font-size: 13.5px;
  margin-top: 18px;
  text-align: center;
}

.auth-foot a {
  color: var(--mm-primary);
  font-weight: 800;
}

.auth-foot a:hover {
  text-decoration: underline;
}

.login-success-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(5px);
}

.login-success-card {
  width: min(100%, 400px);
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
  padding: 30px 30px 26px;
  text-align: center;
}

.login-success-icon {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--mm-primary), var(--mm-primary-dark));
  color: #fff;
  font-size: 30px;
  font-weight: 900;
  box-shadow: 0 14px 28px rgba(43, 190, 249, 0.28);
}

.login-success-card h2 {
  color: var(--mm-text);
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.login-success-card p {
  color: var(--mm-text-soft);
  font-size: 14.5px;
  line-height: 1.55;
}

.login-success-progress {
  height: 4px;
  margin: 22px -30px -26px;
  background: var(--mm-primary);
  transform-origin: left center;
  animation: login-success-progress 3s linear forwards;
}

.login-success-enter-active,
.login-success-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.login-success-enter-from,
.login-success-leave-to {
  opacity: 0;
}

.login-success-enter-from .login-success-card,
.login-success-leave-to .login-success-card {
  transform: translateY(12px) scale(0.97);
}

@keyframes login-success-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

@media (max-width: 860px) {
  .auth-page {
    align-items: flex-start;
    padding: 28px 16px 42px;
  }

  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-copy {
    padding: 24px;
  }

  .auth-copy h1 {
    font-size: 30px;
  }
}

@media (max-width: 520px) {
  .auth-card,
  .auth-copy {
    padding: 22px 18px;
  }

  .auth-card-head h2 {
    font-size: 24px;
  }

  .copy-points {
    gap: 8px;
  }
}
</style>
