<script setup lang="ts">
import { navCategories } from '@/data/megamart';
</script>

<template>
  <nav class="mm-category-bar">
    <div class="container mm-category-inner">
      <a
        v-for="cat in navCategories"
        :key="cat"
        href="#"
        class="mm-category-item"
      >
        <span>{{ cat }}</span>
        <span class="mm-cat-arrow">▾</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.mm-category-bar {
  background: #fff;
  border-bottom: 1px solid var(--mm-border);
  position: sticky;
  top: 68px;
  z-index: 40;
}

.mm-category-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 46px;
  overflow-x: auto;
  scrollbar-width: none;
}

.mm-category-inner::-webkit-scrollbar {
  display: none;
}

.mm-category-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13.5px;
  color: var(--mm-text-soft);
  white-space: nowrap;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.mm-category-item:hover {
  background: var(--mm-primary-light);
  color: var(--mm-primary);
}

.mm-cat-arrow {
  font-size: 9px;
  opacity: 0.7;
}
</style>