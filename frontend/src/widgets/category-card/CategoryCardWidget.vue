<script setup lang="ts">
import { computed } from 'vue';
import type { Category } from '@/data/types';

const props = defineProps<{ category: Category; active?: boolean }>();

const logoClass = computed(() => `logo-${props.category.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
const isAppleLogo = computed(() => props.category.icon === 'apple' || props.category.slug === 'iphone');
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
      <svg
        v-if="isAppleLogo"
        width="38"
        height="42"
        viewBox="0 0 384 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
      </svg>
      <span v-else class="mm-cat-logo" :class="[logoClass, { compact: category.icon.length > 3 }]">
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
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.65), 0 10px 22px rgba(15, 23, 42, 0.06);
  transition: border 0.2s, transform 0.2s, box-shadow 0.2s;
}

.mm-cat-card:hover .mm-cat-circle {
  transform: scale(1.04);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75), 0 14px 28px rgba(15, 23, 42, 0.1);
}

.mm-cat-logo {
  max-width: 82px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.4px;
  line-height: 1;
  text-align: center;
  text-transform: none;
}

.mm-cat-logo.compact {
  font-size: 20px;
}

.logo-samsung {
  font-size: 16px;
  font-style: italic;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transform: scaleX(1.15);
}

.logo-oppo {
  font-size: 22px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.logo-pixel {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background:
    conic-gradient(from 35deg, #4285f4 0 25%, #34a853 0 50%, #fbbc05 0 75%, #ea4335 0 100%);
  color: #fff;
  font-size: 25px;
  font-family: Arial, sans-serif;
  box-shadow: 0 8px 18px rgba(26, 115, 232, 0.22);
}

.logo-realme {
  min-width: 64px;
  min-height: 34px;
  border-radius: 6px;
  background: #ffc915;
  color: #111827;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.06em;
  padding: 0 8px;
}

.logo-vivo {
  font-size: 28px;
  font-style: italic;
  letter-spacing: 0.03em;
}

.logo-xiaomi,
.logo-redmi {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #ff6900;
  color: #fff;
  font-size: 20px;
}

.logo-oneplus {
  width: 46px;
  height: 46px;
  border: 3px solid currentColor;
  border-radius: 8px;
  font-size: 20px;
}

.mm-cat-label {
  font-size: 13.5px;
  color: var(--mm-text);
  font-weight: 800;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .mm-cat-circle { width: 80px; height: 80px; }
  .mm-cat-logo { max-width: 68px; font-size: 24px; }
  .logo-pixel, .logo-xiaomi, .logo-redmi, .logo-oneplus { width: 38px; height: 38px; font-size: 18px; }
  .mm-cat-label { font-size: 12px; }
}

@media (max-width: 640px) {
  .mm-cat-card { padding: 6px 2px; gap: 6px; }
  .mm-cat-circle { width: 64px; height: 64px; }
  .mm-cat-logo { max-width: 52px; font-size: 20px; }
  .mm-cat-logo.compact { font-size: 16px; }
  .logo-samsung { font-size: 12px; }
  .logo-oppo { font-size: 16px; }
  .logo-pixel, .logo-xiaomi, .logo-redmi, .logo-oneplus { width: 30px; height: 30px; font-size: 14px; border-radius: 8px; }
  .logo-oneplus { border-width: 2px; }
  .logo-realme { min-width: 48px; min-height: 26px; font-size: 13px; }
  .logo-vivo { font-size: 22px; }
  .mm-cat-label { font-size: 11px; line-height: 1.2; }
}

@media (max-width: 380px) {
  .mm-cat-circle { width: 56px; height: 56px; }
  .mm-cat-logo { max-width: 46px; font-size: 18px; }
  .mm-cat-logo.compact { font-size: 14px; }
  .logo-pixel, .logo-xiaomi, .logo-redmi, .logo-oneplus { width: 26px; height: 26px; font-size: 12px; }
  .mm-cat-label { font-size: 10px; }
}
</style>
