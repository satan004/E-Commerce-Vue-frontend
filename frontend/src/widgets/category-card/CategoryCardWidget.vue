<script setup lang="ts">
import type { Category } from '@/data/megamart';

defineProps<{ category: Category; active?: boolean }>();
</script>

<template>
  <a href="#" class="mm-cat-card" :class="{ active }">
    <div
      class="mm-cat-circle"
      :style="{ background: category.bg || '#f3f6fb' }"
    >
      <span class="mm-cat-icon">{{ category.icon }}</span>
    </div>
    <span class="mm-cat-label">{{ category.name }}</span>
  </a>
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
  font-size: 42px;
  line-height: 1;
}

.mm-cat-label {
  font-size: 13.5px;
  color: var(--mm-text);
  font-weight: 500;
}
</style>