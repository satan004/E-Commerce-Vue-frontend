<script setup lang="ts">
import type { Product } from '@/data/types';
import { useWishlistStore } from '@/store/modules/wishlist';

const props = defineProps<{ product: Product }>();

const wishlist = useWishlistStore();
const isFav = () => wishlist.has(props.product.id);

function toggleFav(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  wishlist.toggle(props.product.id);
}
</script>

<template>
  <RouterLink :to="`/product/${product.slug}`" class="mm-product-card">
    <button
      class="mm-pc-fav"
      :class="{ active: isFav() }"
      aria-label="Toggle wishlist"
      @click="toggleFav"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" :fill="isFav() ? '#ff3b30' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
    <div v-if="product.discount" class="mm-pc-badge">{{ product.discount }}% OFF</div>
    <div class="mm-pc-img">
      <img :src="product.image" :alt="product.name" loading="lazy" />
    </div>
    <div class="mm-pc-body">
      <p class="mm-pc-brand">{{ product.brand }}</p>
      <h3 class="mm-pc-name">{{ product.name }}</h3>
      <div v-if="product.rating" class="mm-pc-rating">
        <span class="mm-pc-rating-box">{{ product.rating.toFixed(1) }} ★</span>
        <span class="mm-pc-rating-count">({{ product.ratingCount }})</span>
      </div>
      <div class="mm-pc-pricing">
        <span class="mm-pc-price">₹{{ product.price.toLocaleString('en-IN') }}</span>
        <span v-if="product.oldPrice" class="mm-pc-old">₹{{ product.oldPrice.toLocaleString('en-IN') }}</span>
      </div>
      <p v-if="product.oldPrice" class="mm-pc-save">
        Save - ₹{{ (product.oldPrice - product.price).toLocaleString('en-IN') }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped>
.mm-product-card {
  background: var(--mm-card);
  border-radius: var(--mm-radius);
  overflow: hidden;
  position: relative;
  box-shadow: var(--mm-shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--mm-border);
  display: flex;
  flex-direction: column;
  color: inherit;
}
.mm-product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--mm-shadow);
}

.mm-pc-fav {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 3;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--mm-text-mute);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s, color 0.15s;
}
.mm-pc-fav:hover { transform: scale(1.1); color: #ff3b30; }
.mm-pc-fav.active { color: #ff3b30; }

.mm-pc-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--mm-discount);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  z-index: 2;
  line-height: 1;
}

.mm-pc-img {
  background: #f7f9fc;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.mm-pc-img img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  transition: transform 0.3s;
}
.mm-product-card:hover .mm-pc-img img { transform: scale(1.06); }

.mm-pc-body {
  padding: 12px 14px 14px;
}
.mm-pc-brand {
  font-size: 11px;
  color: var(--mm-text-mute);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  margin-bottom: 4px;
}
.mm-pc-name {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--mm-text);
  margin-bottom: 6px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}
.mm-pc-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
}
.mm-pc-rating-box {
  background: var(--mm-sale);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.mm-pc-rating-count { color: var(--mm-text-mute); font-size: 12px; }

.mm-pc-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.mm-pc-price { font-size: 15px; font-weight: 700; color: var(--mm-text); }
.mm-pc-old { font-size: 12.5px; color: var(--mm-text-mute); text-decoration: line-through; }

.mm-pc-save {
  margin-top: 6px;
  font-size: 12.5px;
  color: var(--mm-sale);
  font-weight: 600;
}
</style>