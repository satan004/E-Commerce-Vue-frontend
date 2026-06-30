<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useCatalogStore } from '@/store/modules/catalog';
import { formatPrice } from '@/utils/currency';

const catalog = useCatalogStore();
const current = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const slides = computed(() => catalog.featured.slice(0, 3));

function goTo(i: number) {
  if (slides.value.length === 0) return;
  current.value = (i + slides.value.length) % slides.value.length;
}

function next() {
  if (slides.value.length <= 1) return;
  goTo(current.value + 1);
}

function prev() {
  goTo(current.value - 1);
}

onMounted(() => {
  if (catalog.featured.length === 0) catalog.loadFeatured(6);
  timer = setInterval(next, 5000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section class="mm-hero">
    <div class="container">
      <div class="mm-hero-wrap">
        <button class="mm-hero-arrow mm-hero-arrow-left" @click="prev" aria-label="Previous slide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b6472" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div v-if="slides.length" class="mm-hero-track" :style="{ transform: `translateX(-${current * 100}%)` }">
          <div v-for="slide in slides" :key="slide.id" class="mm-hero-slide">
            <div class="mm-hero-content">
              <p class="mm-hero-tag">{{ slide.brand }}</p>
              <h1 class="mm-hero-title">{{ slide.name }}</h1>
              <p class="mm-hero-sub">{{ formatPrice(slide.price) }}</p>
              <RouterLink :to="`/product/${slide.slug}`" class="mm-hero-cta">Shop Now</RouterLink>
            </div>
            <div class="mm-hero-image">
              <img :src="slide.image" :alt="slide.name" />
            </div>
          </div>
        </div>
        <div v-else class="mm-hero-slide mm-hero-empty">
          <div class="mm-hero-content">
            <p class="mm-hero-tag">Loading</p>
            <h1 class="mm-hero-title">Products</h1>
            <p class="mm-hero-sub">Fetching catalog...</p>
          </div>
        </div>

        <button class="mm-hero-arrow mm-hero-arrow-right" @click="next" aria-label="Next slide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b6472" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div class="mm-hero-dots">
          <span
            v-for="(slide, i) in slides"
            :key="i"
            class="mm-dot"
            :class="{ active: i === current }"
            @click="goTo(i)"
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mm-hero {
  padding: 22px 0 14px;
  background: var(--mm-bg-page);
}

.mm-hero-wrap {
  position: relative;
  overflow: hidden;
  border-radius: var(--mm-radius-lg);
}

.mm-hero-track {
  display: flex;
  transition: transform 0.6s ease;
}

.mm-hero-slide {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  background: linear-gradient(135deg, #19294a 0%, #243966 100%);
  border-radius: var(--mm-radius-lg);
  padding: 32px 56px;
  min-height: 290px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.mm-hero-slide::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(
    ellipse at 75% 50%,
    rgba(43, 190, 249, 0.18),
    transparent 65%
  );
  pointer-events: none;
}

.mm-hero-content {
  position: relative;
  z-index: 1;
}

.mm-hero-tag {
  font-size: 15px;
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.mm-hero-title {
  font-size: 44px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1.05;
  margin-bottom: 8px;
}

.mm-hero-sub {
  font-size: 18px;
  margin-bottom: 22px;
  color: #2bbef9;
  font-weight: 600;
}

.mm-hero-cta {
  display: inline-flex;
  background: var(--mm-primary);
  color: #fff;
  padding: 11px 26px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.mm-hero-cta:hover {
  background: var(--mm-primary-dark);
}

.mm-hero-empty {
  width: 100%;
}

.mm-hero-image {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mm-hero-image img {
  max-height: 240px;
  object-fit: contain;
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35));
}

.mm-hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--mm-shadow);
  transition: transform 0.2s;
}

.mm-hero-arrow:hover {
  transform: translateY(-50%) scale(1.08);
}

.mm-hero-arrow-left {
  left: 14px;
}

.mm-hero-arrow-right {
  right: 14px;
}

.mm-hero-dots {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 5;
}

.mm-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.mm-dot.active {
  background: #fff;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .mm-hero-slide {
    grid-template-columns: 1fr;
    padding: 24px;
    text-align: center;
    min-height: 360px;
  }
  .mm-hero-title {
    font-size: 30px;
  }
  .mm-hero-image {
    margin-top: 14px;
  }
  .mm-hero-image img {
    max-height: 160px;
  }
}
</style>
