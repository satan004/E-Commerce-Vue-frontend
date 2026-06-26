<script setup lang="ts">
import type { Product } from '@/data/megamart';

defineProps<{ product: Product }>();
</script>

<template>
  <article class="mm-product-card">
    <div v-if="product.discount" class="mm-pc-badge">{{ product.discount }}% OFF</div>
    <div class="mm-pc-img">
      <img :src="product.image" :alt="product.name" loading="lazy" />
    </div>
    <div class="mm-pc-body">
      <h3 class="mm-pc-name">{{ product.name }}</h3>
      <div class="mm-pc-pricing">
        <span class="mm-pc-price">₹{{ product.price.toLocaleString('en-IN') }}</span>
        <span v-if="product.oldPrice" class="mm-pc-old">₹{{ product.oldPrice.toLocaleString('en-IN') }}</span>
      </div>
      <p v-if="product.oldPrice" class="mm-pc-save">
        Save - ₹{{ (product.oldPrice - product.price).toLocaleString('en-IN') }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.mm-product-card {
  background: var(--mm-card);
  border-radius: var(--mm-radius);
  overflow: hidden;
  position: relative;
  box-shadow: var(--mm-shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid var(--mm-border);
}

.mm-product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--mm-shadow);
}

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

.mm-product-card:hover .mm-pc-img img {
  transform: scale(1.06);
}

.mm-pc-body {
  padding: 12px 14px 14px;
}

.mm-pc-name {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--mm-text);
  margin-bottom: 8px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}

.mm-pc-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.mm-pc-price {
  font-size: 15px;
  font-weight: 700;
  color: var(--mm-text);
}

.mm-pc-old {
  font-size: 12.5px;
  color: var(--mm-text-mute);
  text-decoration: line-through;
}

.mm-pc-save {
  margin-top: 6px;
  font-size: 12.5px;
  color: var(--mm-sale);
  font-weight: 600;
}
</style>