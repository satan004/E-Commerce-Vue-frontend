<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
</script>

<template>
  <header class="mm-header">
    <div class="container mm-header-inner">
      <a href="/" class="mm-logo">
        <span class="mm-logo-icon" aria-hidden="true">
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
            <rect y="2" width="22" height="3" rx="1.5" fill="#2bbef9" />
            <rect y="8" width="22" height="3" rx="1.5" fill="#2bbef9" />
            <rect y="14" width="22" height="3" rx="1.5" fill="#2bbef9" />
          </svg>
        </span>
        <span class="mm-logo-text">MegaMart</span>
      </a>

      <div class="mm-search">
        <span class="mm-search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a93a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search essentials, groceries and more..."
        />
        <button class="mm-search-btn" aria-label="Open categories">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b6472" stroke-width="2" stroke-linecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>

      <div class="mm-actions">
        <a href="/account" class="mm-action">
          <span class="mm-action-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span class="mm-action-text">Sign Up/Sign In</span>
        </a>
        <a href="/cart" class="mm-action">
          <span class="mm-action-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f2937" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </span>
          <span class="mm-action-text">Cart</span>
        </a>
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

.mm-logo-icon {
  display: inline-flex;
}

.mm-logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: #19294a;
}

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

.mm-search:focus-within {
  border-color: var(--mm-primary);
  background: #fff;
}

.mm-search-icon {
  display: inline-flex;
}

.mm-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--mm-text);
  font-size: 14px;
}

.mm-search input::placeholder {
  color: var(--mm-text-mute);
}

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
}

.mm-action:hover {
  color: var(--mm-primary);
}

.mm-action-icon {
  display: inline-flex;
}

@media (max-width: 768px) {
  .mm-action-text {
    display: none;
  }
  .mm-search {
    max-width: none;
  }
}
</style>