<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import { useCartStore } from '@/store/modules/cart';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useAuthStore } from '@/store/modules/auth';
import * as catalogApi from '@/services/catalog';
import { adaptProduct } from '@/services/adapters';
import type { Product } from '@/data/types';

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const wishlist = useWishlistStore();
const auth = useAuthStore();

const product = ref<Product | null>(null);
const related = ref<Product[]>([]);
const qty = ref(1);
const activeImg = ref(0);

const images = computed(() => {
  if (!product.value) return [];
  return [product.value.image, ...(product.value.images ?? [])];
});

async function loadProduct() {
  product.value = null;
  related.value = [];
  activeImg.value = 0;

  const apiProduct = await catalogApi.fetchProduct(route.params.slug as string);
  product.value = adaptProduct(apiProduct);

  const res = await catalogApi.fetchProducts({
    category: product.value.category,
    per_page: 5,
  });
  related.value = res.data
    .map(adaptProduct)
    .filter((p) => p.id !== product.value?.id)
    .slice(0, 4);
}

watch(() => route.params.slug, () => void loadProduct(), { immediate: true });

async function addToCart() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: `/product/${product.value.slug}` } });
    return;
  }
  await cart.add(product.value.id, qty.value);
  router.push('/cart');
}

async function buyNow() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: `/product/${product.value.slug}` } });
    return;
  }
  await cart.add(product.value.id, qty.value);
  router.push('/checkout');
}

async function toggleFav() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: `/product/${product.value.slug}` } });
    return;
  }
  await wishlist.toggle(product.value.id);
}
</script>

<template>
  <div v-if="product" class="pdp">
    <div class="container">
      <nav class="breadcrumbs">
        <RouterLink to="/">Home</RouterLink>
        <span>›</span>
        <RouterLink :to="`/category/${product.category}`">{{ product.brand }}</RouterLink>
        <span>›</span>
        <span>{{ product.name }}</span>
      </nav>

      <div class="pdp-layout">
        <section class="pdp-gallery">
          <div class="pdp-main-img">
            <img :src="images[activeImg]" :alt="product.name" />
            <button
              class="pdp-fav"
              :class="{ active: wishlist.has(product.id) }"
              aria-label="Toggle wishlist"
              @click="toggleFav"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" :fill="wishlist.has(product.id) ? '#ff3b30' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          <div v-if="images.length > 1" class="pdp-thumbs">
            <button
              v-for="(img, i) in images"
              :key="i"
              :class="{ active: i === activeImg }"
              @click="activeImg = i"
            >
              <img :src="img" :alt="`thumb ${i + 1}`" />
            </button>
          </div>
        </section>

        <section class="pdp-info">
          <p class="pdp-brand">{{ product.brand }}</p>
          <h1 class="pdp-title">{{ product.name }}</h1>
          <div v-if="product.rating" class="pdp-rating">
            <span class="pdp-rating-box">{{ product.rating.toFixed(1) }} ★</span>
            <span class="pdp-rating-count">{{ product.ratingCount }} ratings</span>
          </div>

          <div class="pdp-pricing">
            <span class="pdp-price">₹{{ product.price.toLocaleString('en-IN') }}</span>
            <span v-if="product.oldPrice" class="pdp-old">₹{{ product.oldPrice.toLocaleString('en-IN') }}</span>
            <span v-if="product.discount" class="pdp-discount">{{ product.discount }}% off</span>
          </div>
          <p v-if="product.oldPrice" class="pdp-save">
            You save ₹{{ (product.oldPrice - product.price).toLocaleString('en-IN') }}
          </p>

          <p v-if="product.description" class="pdp-desc">{{ product.description }}</p>

          <ul v-if="product.highlights?.length" class="pdp-highlights">
            <li v-for="h in product.highlights" :key="h">
              <span class="dot">•</span>
              {{ h }}
            </li>
          </ul>

          <div class="pdp-qty">
            <span>Quantity</span>
            <div class="qty-stepper">
              <button @click="qty = Math.max(1, qty - 1)" aria-label="Decrease">−</button>
              <span>{{ qty }}</span>
              <button @click="qty += 1" aria-label="Increase">+</button>
            </div>
          </div>

          <div class="pdp-actions">
            <button class="btn-primary" @click="addToCart">Add to Cart</button>
            <button class="btn-accent" @click="buyNow">Buy Now</button>
          </div>

          <div v-if="product.specs" class="pdp-specs">
            <h3>Specifications</h3>
            <table>
              <tbody>
                <tr v-for="(v, k) in product.specs" :key="k">
                  <th>{{ k }}</th>
                  <td>{{ v }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section v-if="related.length" class="related">
        <h2>Similar Products</h2>
        <div class="related-grid">
          <ProductCardWidget v-for="p in related" :key="p.id" :product="p" />
        </div>
      </section>
    </div>
  </div>

  <div v-else class="container empty">
    <p>Product not found.</p>
    <RouterLink to="/products" class="link">Continue shopping</RouterLink>
  </div>
</template>

<style scoped>
.pdp { padding: 22px 0 40px; }

.breadcrumbs {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12.5px;
  color: var(--mm-text-mute);
  margin-bottom: 14px;
}
.breadcrumbs a { color: var(--mm-text-soft); }
.breadcrumbs a:hover { color: var(--mm-primary); }

.pdp-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 24px;
}

.pdp-main-img {
  position: relative;
  background: #f7f9fc;
  border-radius: var(--mm-radius);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.pdp-main-img img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.pdp-fav {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  color: var(--mm-text-mute);
}
.pdp-fav.active { color: #ff3b30; }

.pdp-thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.pdp-thumbs button {
  width: 64px;
  height: 64px;
  background: #f7f9fc;
  border-radius: 8px;
  padding: 6px;
  border: 2px solid transparent;
}
.pdp-thumbs button.active { border-color: var(--mm-primary); }
.pdp-thumbs img { width: 100%; height: 100%; object-fit: contain; }

.pdp-brand {
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--mm-text-mute);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}
.pdp-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--mm-text);
  letter-spacing: -0.3px;
  margin-bottom: 10px;
}

.pdp-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
}
.pdp-rating-box {
  background: var(--mm-sale);
  color: #fff;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 700;
}
.pdp-rating-count { color: var(--mm-text-mute); }

.pdp-pricing {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}
.pdp-price { font-size: 28px; font-weight: 800; color: var(--mm-text); }
.pdp-old { font-size: 16px; color: var(--mm-text-mute); text-decoration: line-through; }
.pdp-discount { font-size: 14px; color: var(--mm-sale); font-weight: 700; }

.pdp-save { color: var(--mm-sale); font-weight: 600; font-size: 14px; margin-bottom: 14px; }

.pdp-desc { color: var(--mm-text-soft); margin-bottom: 12px; }

.pdp-highlights { margin-bottom: 16px; }
.pdp-highlights li {
  font-size: 13.5px;
  color: var(--mm-text-soft);
  padding: 3px 0;
}
.dot { color: var(--mm-primary); margin-right: 6px; font-weight: 700; }

.pdp-qty {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 13.5px;
  color: var(--mm-text-soft);
}
.qty-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  overflow: hidden;
}
.qty-stepper button {
  width: 36px;
  height: 36px;
  background: var(--mm-bg-mute);
  font-size: 16px;
  font-weight: 700;
  color: var(--mm-text);
}
.qty-stepper button:hover { background: var(--mm-primary-light); color: var(--mm-primary); }
.qty-stepper span {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
}

.pdp-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-primary, .btn-accent {
  flex: 1;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s;
}
.btn-primary { background: var(--mm-primary); color: #fff; }
.btn-primary:hover { background: var(--mm-primary-dark); }
.btn-accent { background: #fff; color: var(--mm-primary); border: 1.5px solid var(--mm-primary); }
.btn-accent:hover { background: var(--mm-primary-light); }

.pdp-specs h3 {
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mm-text-soft);
}
.pdp-specs table {
  width: 100%;
  border-collapse: collapse;
}
.pdp-specs th, .pdp-specs td {
  border: 1px solid var(--mm-border);
  padding: 8px 10px;
  font-size: 13px;
  text-align: left;
}
.pdp-specs th {
  background: var(--mm-bg-mute);
  width: 40%;
  color: var(--mm-text-soft);
  font-weight: 600;
}

.related { padding: 40px 0 0; }
.related h2 { font-size: 22px; margin-bottom: 16px; }
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.empty {
  background: #fff;
  border: 1px dashed var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 60px 20px;
  text-align: center;
  margin: 40px auto;
  color: var(--mm-text-soft);
}
.empty .link { color: var(--mm-primary); font-weight: 600; display: inline-block; margin-top: 10px; }

@media (max-width: 900px) {
  .pdp-layout { grid-template-columns: 1fr; }
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
