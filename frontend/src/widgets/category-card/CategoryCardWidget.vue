<script setup lang="ts">
import type { Category } from '@/data/types';

defineProps<{ category: Category; active?: boolean }>();
</script>

<template>
  <RouterLink :to="`/category/${category.slug}`" class="mm-cat-card" :class="{ active }">
    <div
      class="mm-cat-circle"
      :style="{
        background: category.bg || '#f3f6fb',
        color: category.textColor || '#1f2937',
      }"
    >
      <!-- Special case: iPhone shows the Apple logo -->
      <svg
        v-if="category.name === 'iPhone'"
        width="38"
        height="42"
        viewBox="0 0 384 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
      </svg>
      <span v-else class="mm-cat-icon" :class="{ compact: category.icon.length > 1 }">
        {{ category.icon }}
      </span>
    </div>
    <span class="mm-cat-label">{{ category.name }}</span>
  </RouterLink>
</template>

<style scoped>
.mm-cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 6px;
  border-radius: var(--mm-radius);
  transition: background 0.2s;
  text-align: center;
}

.mm-cat-card:hover {
  background: var(--mm-bg-mute);
}

.mm-cat-card.active .mm-cat-circle {
  border: 3px solid var(--mm-primary);
}

.mm-cat-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid transparent;
  transition: border 0.2s, transform 0.2s;
}

.mm-cat-card:hover .mm-cat-circle {
  transform: scale(1.04);
}

.mm-cat-icon {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1;
}

.mm-cat-icon.compact {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.mm-cat-label {
  font-size: 13.5px;
  color: var(--mm-text);
  font-weight: 500;
}
</style>