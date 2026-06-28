import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from '@/data/types';
import * as wishlistApi from '@/services/wishlist';
import { adaptProduct } from '@/services/adapters';

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<string[]>([]);
  const detailed = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const count = computed(() => ids.value.length);

  async function loadWishlist() {
    loading.value = true;
    error.value = null;
    try {
      const items = await wishlistApi.fetchWishlist();
      ids.value = items.map((it) => String(it.product_id));
      detailed.value = items.map((it) => adaptProduct(it.product));
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load wishlist';
      if (e?.status === 401) clear();
    } finally {
      loading.value = false;
    }
  }

  async function toggle(productId: string): Promise<boolean> {
    const idx = ids.value.indexOf(productId);
    if (idx >= 0) {
      await remove(productId);
      return false;
    }
    const item = await wishlistApi.addWishlistItem(Number(productId));
    ids.value.push(productId);
    detailed.value.unshift(adaptProduct(item.product));
    return true;
  }

  function has(productId: string): boolean {
    return ids.value.includes(productId);
  }

  async function remove(productId: string) {
    await wishlistApi.removeWishlistItem(Number(productId));
    ids.value = ids.value.filter((id) => id !== productId);
    detailed.value = detailed.value.filter((p) => p.id !== productId);
  }

  function clear() {
    ids.value = [];
    detailed.value = [];
  }

  return { ids, detailed, loading, error, count, loadWishlist, toggle, has, remove, clear };
});
