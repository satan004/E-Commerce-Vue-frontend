<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/modules/cart';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useAuthStore } from '@/store/modules/auth';

const router = useRouter();
const cart = useCartStore();
const wishlist = useWishlistStore();
const auth = useAuthStore();

const searchQuery = ref('');
const isCompact = ref(false);

function updateCompact() {
  isCompact.value = window.innerWidth <= 480;
}

onMounted(() => {
  updateCompact();
  window.addEventListener('resize', updateCompact);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCompact);
});

function submitSearch() {
  const q = searchQuery.value.trim();
  router.push({ path: '/products', query: q ? { q } : {} });
}
</script>

<template>
  <header class="mm-header">
    <div class="container mm-header-inner">
      <RouterLink to="/" class="mm-logo">
        <span class="mm-logo-icon" aria-hidden="true">
          <img src="../../assets/icons/Icon web.png" width="45" height="45"alt="">
        </span>
        <span class="mm-logo-text">PHONE SHOP</span>
      </RouterLink>

      <form class="mm-search" @submit.prevent="submitSearch">
        <span class="mm-search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b6472" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isCompact ? 'Search phones...' : 'Search essentials, groceries and more...'"
          class="mm-search-input"
        />
        <button type="button" class="mm-search-btn" aria-label="Open categories">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b6472" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </form>

      <div class="mm-actions">
        <RouterLink
          :to="auth.isAuthenticated ? '/profile' : '/login'"
          class="mm-action mm-action-link"
        >
          <span class="mm-action-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span class="mm-action-text">{{ auth.isAuthenticated ? auth.user?.fullName : 'Sign Up/Sign In' }}</span>
        </RouterLink>

        <RouterLink to="/wishlist" class="mm-action">
          <span class="mm-action-icon mm-action-icon-stack" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span v-if="wishlist.count" class="mm-badge">{{ wishlist.count }}</span>
          </span>
        </RouterLink>

        <RouterLink to="/cart" class="mm-action">
          <span class="mm-action-icon mm-action-icon-stack" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span v-if="cart.itemCount" class="mm-badge">{{ cart.itemCount }}</span>
          </span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.mm-header {
  background: #fff;
  border-bottom: 1px solid var(--mm-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.mm-header-inner {
  display: flex;
  align-items: center;
  gap: 28px;
  height: 68px;
}

.mm-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--mm-text);
  flex-shrink: 0;
}
.mm-logo-icon { display: inline-flex; }
.mm-logo-text { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; color: #033496; }

.mm-search {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--mm-bg-mute);
  border: 1px solid transparent;
  border-radius: 8px;
  height: 42px;
  padding: 0 14px;
  gap: 10px;
  transition: border-color 0.2s, background 0.2s;
  max-width: 640px;
}
.mm-search:focus-within { border-color: var(--mm-primary); background: #fff; }
.mm-search-icon { display: inline-flex; }
.mm-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--mm-text);
  font-size: 14px;
}
.mm-search input::placeholder { color: var(--mm-text-mute); }

.mm-search-btn {
  display: inline-flex;
  padding-left: 12px;
  border-left: 1px solid var(--mm-border);
  height: 22px;
  align-items: center;
}

.mm-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}

.mm-action {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--mm-text);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  background: none;
  cursor: pointer;
  text-decoration: none;
}
.mm-action:hover { color: var(--mm-primary); }
.mm-action-link {
  text-decoration: none;
}
.mm-action-icon { display: inline-flex; position: relative; }

.mm-action-icon-stack {
  position: relative;
}

.mm-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--mm-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

@media (max-width: 900px) {
  .mm-header-inner { gap: 16px; }
  .mm-action-text { display: none; }
  .mm-search { max-width: none; }
}

@media (max-width: 640px) {
  .mm-header-inner { height: 58px; gap: 10px; }
  .mm-logo-text { font-size: 16px; }
  .mm-logo-icon img { width: 32px; height: 32px; }
  .mm-search {
    height: 38px;
    padding: 0 10px;
    gap: 6px;
    min-width: 0;
  }
  .mm-search input { font-size: 13px; }
  .mm-search input::placeholder { font-size: 12px; }
  .mm-search-btn { display: none; }
  .mm-actions { gap: 14px; }
  .mm-badge { min-width: 16px; height: 16px; font-size: 9px; }
  .mm-search input.mm-search-input::placeholder {
    text-overflow: ellipsis;
  }
}
</style>
