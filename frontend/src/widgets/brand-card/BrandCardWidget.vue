<script setup lang="ts">
import type { Brand } from '@/data/types';

defineProps<{ brand: Brand }>();
</script>

<template>
  <article class="mm-brand-card" :style="{ background: brand.bg }">
    <div class="mm-brand-meta">
      <span class="mm-brand-tag">{{ brand.name.toUpperCase() }}</span>
      <p class="mm-brand-discount">{{ brand.tagline }}</p>
    </div>
    <div class="mm-brand-img">
      <img :src="brand.image" :alt="brand.name" loading="lazy" />
    </div>
  </article>
</template>

<style scoped>
.mm-brand-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--mm-radius);
  padding: 26px 32px;
  min-height: 150px;
  overflow: hidden;
  box-shadow: var(--mm-shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.mm-brand-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--mm-shadow);
}

.mm-brand-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
}

.mm-brand-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--mm-text);
  background: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  width: fit-content;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mm-brand-discount {
  font-size: 22px;
  font-weight: 800;
  color: var(--mm-text);
  margin: 0;
  letter-spacing: -0.5px;
}

.mm-brand-img {
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mm-brand-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}
</style>