<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SectionHeaderWidget from '@/widgets/section-header/SectionHeaderWidget.vue';
import type { Product } from '@/data/types';
import { useCatalogStore } from '@/store/modules/catalog';
import { useCartStore } from '@/store/modules/cart';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useAuthStore } from '@/store/modules/auth';
import type { ProductQuery } from '@/services/catalog';
import { formatPrice } from '@/utils/currency';
import { loginRedirect } from '@/utils/authRedirect';

const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const auth = useAuthStore();

const categorySlug = computed(() => (route.params.slug as string) || '');
const searchQuery = computed(() => (route.query.q as string) || '');
const activeBrand = ref('All');
const activeSort = ref<'pop' | 'lh' | 'hl' | 'discount'>('pop');
const minPrice = ref(0);
const maxPrice = ref(200000);
const inStockOnly = ref(false);
const toastMessage = ref('');
const toastTone = ref<'success' | 'error'>('success');
let toastTimer: number | undefined;

const requestedCategoryLabels = ['iPhone', 'OPPO', 'Pixel', 'Realme', 'Samsung', 'Vivo'];

const categoryInfo = computed(() =>
  catalog.categories.find((c) => c.slug === categorySlug.value),
);

const brandsForCategory = computed(() => {
  const list = catalog.products;
  return ['All', ...Array.from(new Set(list.map((p) => p.brand)))];
});

const phoneCategoryFilters = computed(() =>
  requestedCategoryLabels.map((label) => {
    const match = catalog.categories.find((category) => category.name.toLowerCase() === label.toLowerCase());
    return {
      label,
      slug: match?.slug ?? label.toLowerCase(),
    };
  }),
);

const filtered = computed<Product[]>(() => {
  let list: Product[] = catalog.products;

  if (activeBrand.value !== 'All') {
    list = list.filter((p) => p.brand === activeBrand.value);
  }
  if (inStockOnly.value) list = list.filter((p) => p.inStock !== false);
  return list;
});

const title = computed(() => {
  if (categoryInfo.value) return categoryInfo.value.name;
  if (searchQuery.value) return `Results for "${searchQuery.value}"`;
  return 'All Products';
});

const accent = computed(() => (categoryInfo.value ? 'Products' : 'Store'));
const prefix = computed(() => {
  if (categoryInfo.value) return categoryInfo.value.name;
  if (searchQuery.value) return '';
  return 'Shop All';
});

function setSort(v: typeof activeSort.value) {
  activeSort.value = v;
}

function loadProducts() {
  const query: ProductQuery = {
    search: searchQuery.value || undefined,
    category: categorySlug.value || undefined,
    min_price: minPrice.value || undefined,
    max_price: maxPrice.value || undefined,
    sort:
      activeSort.value === 'lh'
        ? 'price_low'
        : activeSort.value === 'hl'
          ? 'price_high'
          : activeSort.value === 'pop'
            ? undefined
            : 'name',
    per_page: 48,
  };
  catalog.loadProducts(query);
}

function goCategory(slug: string | null) {
  if (slug) router.push(`/category/${slug}`);
  else router.push('/products');
}

async function addToCart(product: Product) {
  if (!auth.isAuthenticated) {
    await router.push(loginRedirect('/products'));
    return;
  }

  try {
    await cart.add(product.id, 1);
    showToast(`${product.name} added to cart.`);
  } catch (e: any) {
    showToast(e?.message ?? 'Could not add product to cart.', 'error');
  }
}

async function buyNow(product: Product) {
  if (!auth.isAuthenticated) {
    await router.push(loginRedirect('/checkout'));
    return;
  }

  try {
    await cart.add(product.id, 1);
    await router.push('/checkout');
  } catch (e: any) {
    showToast(e?.message ?? 'Could not start checkout.', 'error');
  }
}

async function toggleWishlist(product: Product) {
  if (!auth.isAuthenticated) {
    await router.push(loginRedirect('/wishlist'));
    return;
  }

  try {
    const added = await wishlist.toggle(product.id);
    showToast(added ? `${product.name} added to wishlist.` : `${product.name} removed from wishlist.`);
  } catch (e: any) {
    showToast(e?.message ?? 'Could not update wishlist.', 'error');
  }
}

function showToast(message: string, tone: 'success' | 'error' = 'success') {
  toastMessage.value = message;
  toastTone.value = tone;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2600);
}

onMounted(() => {
  catalog.loadCategories();
  loadProducts();
});

watch([categorySlug, searchQuery, activeSort], () => {
  activeBrand.value = 'All';
  loadProducts();
});
</script>

<template>
  <div class="listing">
    <div class="container">
      <nav class="breadcrumbs">
        <RouterLink to="/">Home</RouterLink>
        <span>›</span>
        <span>{{ title }}</span>
      </nav>

      <SectionHeaderWidget :prefix="prefix" :accent="accent" />

      <div class="listing-layout">
        <aside class="listing-side">
          <div class="side-block">
            <h4>Categories</h4>
            <ul>
              <li>
                <button :class="{ active: !categorySlug }" @click="goCategory(null)">All Products</button>
              </li>
              <li v-for="c in catalog.categories" :key="c.id">
                <button
                  :class="{ active: c.slug === categorySlug }"
                  @click="goCategory(c.slug)"
                >
                  {{ c.name }}
                </button>
              </li>
            </ul>
          </div>

          <div class="side-block">
            <h4>Phone brands</h4>
            <div class="phone-filter-list">
              <button
                v-for="category in phoneCategoryFilters"
                :key="category.slug"
                :class="{ active: category.slug === categorySlug }"
                @click="goCategory(category.slug)"
              >
                {{ category.label }}
              </button>
            </div>
          </div>

          <div class="side-block">
            <h4>Price range</h4>
            <div class="price-row">
              <input v-model.number="minPrice" type="number" placeholder="Min" min="0" @change="loadProducts" />
              <span>—</span>
              <input v-model.number="maxPrice" type="number" placeholder="Max" min="0" @change="loadProducts" />
            </div>
          </div>

          <div class="side-block">
            <h4>Availability</h4>
            <label class="check">
              <input v-model="inStockOnly" type="checkbox" />
              <span>In stock only</span>
            </label>
          </div>
        </aside>

        <section class="listing-main">
          <div class="listing-toolbar">
            <p class="result-count">{{ catalog.loading ? 'Loading products...' : `${filtered.length} products` }}</p>
            <div class="brand-tabs">
              <button
                v-for="b in brandsForCategory"
                :key="b"
                class="brand-tab"
                :class="{ active: b === activeBrand }"
                @click="activeBrand = b"
              >
                {{ b }}
              </button>
            </div>
            <div class="sort-tabs">
              <button :class="{ active: activeSort === 'pop' }" @click="setSort('pop')">Popular</button>
              <button :class="{ active: activeSort === 'lh' }" @click="setSort('lh')">Price ↑</button>
              <button :class="{ active: activeSort === 'hl' }" @click="setSort('hl')">Price ↓</button>
              <button :class="{ active: activeSort === 'discount' }" @click="setSort('discount')">Best Discount</button>
            </div>
          </div>

          <div v-if="filtered.length === 0" class="empty">
            <p>No products match your filters.</p>
            <button class="link" @click="router.replace({ path: '/products' })">Reset filters</button>
          </div>

          <div v-else class="grid">
            <article
              v-for="product in filtered"
              :key="product.id"
              class="catalog-card"
            >
              <RouterLink :to="`/product/${product.slug}`" class="catalog-image">
                <img :src="product.image" :alt="product.name" loading="lazy" />
              </RouterLink>
              <div class="catalog-body">
                <div class="catalog-meta">
                  <RouterLink :to="`/category/${product.category}`" class="catalog-category">
                    {{ product.brand }}
                  </RouterLink>
                  <button
                    class="wishlist-btn"
                    :class="{ active: wishlist.has(product.id) }"
                    type="button"
                    :aria-label="wishlist.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                    @click="toggleWishlist(product)"
                  >
                    &#9825;
                  </button>
                </div>
                <RouterLink :to="`/product/${product.slug}`" class="catalog-name">
                  {{ product.name }}
                </RouterLink>
                <div class="catalog-price-row">
                  <span class="catalog-price">{{ formatPrice(product.price) }}</span>
                  <span v-if="product.oldPrice" class="catalog-old-price">{{ formatPrice(product.oldPrice) }}</span>
                </div>
                <div class="catalog-actions">
                  <button class="add-cart-btn" type="button" @click="addToCart(product)">Add to Cart</button>
                  <button class="buy-now-btn" type="button" @click="buyNow(product)">Buy Now</button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>

    <Transition name="catalog-toast">
      <div v-if="toastMessage" class="catalog-toast" :class="toastTone" role="status" aria-live="polite">
        <span aria-hidden="true">{{ toastTone === 'success' ? '✓' : '!' }}</span>
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.listing { padding: 22px 0 40px; }

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

.listing-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
}

.listing-side {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 18px;
  align-self: flex-start;
  position: sticky;
  top: 130px;
}

.side-block + .side-block { margin-top: 22px; }

.side-block h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--mm-text-soft);
  margin-bottom: 12px;
  font-weight: 700;
}

.side-block ul li + li { margin-top: 6px; }

.side-block button {
  font-size: 13.5px;
  color: var(--mm-text);
  padding: 4px 0;
  text-align: left;
  width: 100%;
}
.side-block button:hover { color: var(--mm-primary); }
.side-block button.active { color: var(--mm-primary); font-weight: 700; }

.phone-filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.phone-filter-list button {
  width: auto;
  min-height: 34px;
  border: 1px solid var(--mm-border);
  border-radius: 999px;
  background: #fff;
  color: var(--mm-text-soft);
  font-size: 12.5px;
  font-weight: 800;
  padding: 0 12px;
}

.phone-filter-list button:hover,
.phone-filter-list button.active {
  border-color: var(--mm-primary);
  background: var(--mm-primary-light);
  color: var(--mm-primary-dark);
}

.price-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.price-row input {
  width: 100%;
  border: 1px solid var(--mm-border);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 13px;
  background: var(--mm-bg-mute);
}
.price-row input:focus { outline: none; border-color: var(--mm-primary); background: #fff; }
.price-row span { color: var(--mm-text-mute); }

.check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--mm-text);
  cursor: pointer;
}
.check input { accent-color: var(--mm-primary); width: 16px; height: 16px; }

.listing-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.result-count { color: var(--mm-text-soft); font-size: 13px; }

.brand-tabs, .sort-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-left: auto;
}

.brand-tab, .sort-tabs button {
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--mm-border);
  font-size: 12.5px;
  color: var(--mm-text-soft);
  font-weight: 500;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.brand-tab:hover, .sort-tabs button:hover { color: var(--mm-primary); border-color: var(--mm-primary); }
.brand-tab.active, .sort-tabs button.active {
  background: var(--mm-primary);
  color: #fff;
  border-color: var(--mm-primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.catalog-card {
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  box-shadow: var(--mm-shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.catalog-card:hover {
  transform: translateY(-4px);
  border-color: rgba(43, 190, 249, 0.42);
  box-shadow: var(--mm-shadow);
}

.catalog-image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  background: #f7f9fc;
  padding: 18px;
}

.catalog-image img {
  width: 82%;
  height: 82%;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.catalog-card:hover .catalog-image img {
  transform: scale(1.05);
}

.catalog-body {
  display: grid;
  gap: 10px;
  padding: 14px;
}

.catalog-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.catalog-category {
  min-width: 0;
  color: var(--mm-primary-dark);
  font-size: 11.5px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wishlist-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--mm-border);
  border-radius: 999px;
  background: #fff;
  color: var(--mm-text-mute);
  font-size: 22px;
  line-height: 1;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.wishlist-btn:hover,
.wishlist-btn.active {
  border-color: #ffb4ad;
  background: #fff5f5;
  color: #ff3b30;
  transform: translateY(-1px);
}

.catalog-name {
  min-height: 42px;
  color: var(--mm-text);
  display: -webkit-box;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.catalog-name:hover {
  color: var(--mm-primary);
}

.catalog-price-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.catalog-price {
  color: var(--mm-text);
  font-size: 17px;
  font-weight: 900;
}

.catalog-old-price {
  color: var(--mm-text-mute);
  font-size: 12.5px;
  text-decoration: line-through;
}

.catalog-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.add-cart-btn,
.buy-now-btn {
  min-height: 40px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 900;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.add-cart-btn {
  background: #fff;
  border: 1.5px solid var(--mm-primary);
  color: var(--mm-primary-dark);
}

.buy-now-btn {
  background: var(--mm-primary);
  color: #fff;
  box-shadow: 0 8px 18px rgba(43, 190, 249, 0.2);
}

.add-cart-btn:hover {
  background: var(--mm-primary-light);
}

.buy-now-btn:hover {
  background: var(--mm-primary-dark);
}

.add-cart-btn:hover,
.buy-now-btn:hover {
  transform: translateY(-1px);
}

.catalog-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  max-width: min(420px, calc(100vw - 32px));
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #dbeafe;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
  color: var(--mm-text);
  font-size: 14px;
  font-weight: 800;
}

.catalog-toast span {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: #10b981;
  color: #fff;
  font-weight: 900;
}

.catalog-toast.error {
  border-color: #fecaca;
}

.catalog-toast.error span {
  background: #ef4444;
}

.catalog-toast-enter-active,
.catalog-toast-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.catalog-toast-enter-from,
.catalog-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.empty {
  background: #fff;
  border: 1px dashed var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 50px 20px;
  text-align: center;
  color: var(--mm-text-soft);
}
.empty .link {
  margin-top: 10px;
  color: var(--mm-primary);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .listing-layout { grid-template-columns: 1fr; }
  .listing-side {
    position: static;
    margin-bottom: 16px;
  }
  .listing-side .side-block + .side-block { margin-top: 16px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .listing { padding: 18px 0 32px; }
  .listing-toolbar { gap: 10px; }
  .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .listing-side { padding: 14px; }
  .side-block h4 { font-size: 12px; margin-bottom: 8px; }
  .side-block button { font-size: 12.5px; }
  .phone-filter-list button { font-size: 11.5px; padding: 0 10px; min-height: 30px; }
  .price-row input { padding: 5px 6px; font-size: 12px; }
  .brand-tab, .sort-tabs button { padding: 5px 10px; font-size: 11.5px; }
  .listing-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .side-block + .side-block { margin-top: 0; }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .listing-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .brand-tabs,
  .sort-tabs {
    margin-left: 0;
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }
  .brand-tab, .sort-tabs button { flex-shrink: 0; }
  .catalog-actions {
    grid-template-columns: 1fr;
  }
  .catalog-body {
    padding: 12px;
  }
  .catalog-toast {
    right: 16px;
    bottom: 16px;
    min-width: 0;
    width: calc(100vw - 32px);
  }
  .listing-side { grid-template-columns: 1fr; }
}

@media (max-width: 380px) {
  .grid { gap: 8px; }
  .catalog-body { padding: 10px; }
  .catalog-price { font-size: 15px; }
  .catalog-old-price { font-size: 11px; }
  .catalog-name { font-size: 12.5px; min-height: 36px; }
  .add-cart-btn, .buy-now-btn { font-size: 11.5px; min-height: 36px; }
}
</style>
