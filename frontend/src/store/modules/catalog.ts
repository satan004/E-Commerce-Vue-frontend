import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as catalogApi from '@/services/catalog';
import type { ApiProduct, ApiCategory, ProductQuery } from '@/services/catalog';
import { adaptProduct, adaptCategory } from '@/services/adapters';
import type { Product, Category } from '@/data/types';

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<Product[]>([]);
  const featured = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadCategories(): Promise<void> {
    try {
      const api: ApiCategory[] = await catalogApi.fetchCategories();
      categories.value = api.map(adaptCategory);
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load categories';
    }
  }

  async function loadProducts(query: ProductQuery = {}): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const res = await catalogApi.fetchProducts(query);
      products.value = res.data.map((p: ApiProduct) => adaptProduct(p));
      total.value = res.total;
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load products';
      products.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function loadFeatured(limit = 8): Promise<void> {
    try {
      const res = await catalogApi.fetchProducts({ per_page: limit });
      featured.value = res.data.map((p: ApiProduct) => adaptProduct(p));
    } catch {
      // non-fatal
    }
  }

  function findBySlug(slug: string): Product | undefined {
    return products.value.find((p) => p.slug === slug) ||
      featured.value.find((p) => p.slug === slug);
  }

  const isEmpty = computed(() => !loading.value && products.value.length === 0);

  return {
    products,
    featured,
    categories,
    total,
    loading,
    error,
    isEmpty,
    loadCategories,
    loadProducts,
    loadFeatured,
    findBySlug,
  };
});