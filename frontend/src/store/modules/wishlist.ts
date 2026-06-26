import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { products } from '@/data/megamart';

const STORAGE_KEY = 'mm-wishlist';

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<string[]>(load());

  const detailed = computed(() =>
    ids.value
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p),
  );

  const count = computed(() => ids.value.length);

  function toggle(productId: string): boolean {
    const idx = ids.value.indexOf(productId);
    if (idx >= 0) {
      ids.value.splice(idx, 1);
      return false;
    }
    ids.value.push(productId);
    return true;
  }

  function has(productId: string): boolean {
    return ids.value.includes(productId);
  }

  function remove(productId: string) {
    ids.value = ids.value.filter((id) => id !== productId);
  }

  function clear() {
    ids.value = [];
  }

  watch(
    ids,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value));
    },
    { deep: true },
  );

  return { ids, detailed, count, toggle, has, remove, clear };
});