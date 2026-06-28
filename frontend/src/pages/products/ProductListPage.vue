<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import SectionHeaderWidget from '@/widgets/section-header/SectionHeaderWidget.vue';
import type { Product } from '@/data/types';
import { useCatalogStore } from '@/store/modules/catalog';
import type { ProductQuery } from '@/services/catalog';

const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();

const categorySlug = computed(() => (route.params.slug as string) || '');
const searchQuery = computed(() => (route.query.q as string) || '');
const activeBrand = ref('All');
const activeSort = ref<'pop' | 'lh' | 'hl' | 'discount'>('pop');
const minPrice = ref(0);
const maxPrice = ref(200000);
const inStockOnly = ref(false);

const categoryInfo = computed(() =>
  catalog.categories.find((c) => c.slug === categorySlug.value),
);

const brandsForCategory = computed(() => {
  const list = catalog.products;
  return ['All', ...Array.from(new Set(list.map((p) => p.brand)))];
});

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
            <ProductCardWidget
              v-for="product in filtered"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>
      </div>
    </div>
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
  .listing-side { position: static; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
