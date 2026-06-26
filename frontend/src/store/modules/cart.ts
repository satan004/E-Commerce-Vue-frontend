import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CartItem } from '@/data/types';
import { products } from '@/data/megamart';

const STORAGE_KEY = 'mm-cart';

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(load());

  const detailed = computed(() =>
    items.value
      .map((it) => {
        const product = products.find((p) => p.id === it.productId);
        return product ? { ...it, product } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
  );

  const itemCount = computed(() =>
    items.value.reduce((sum, it) => sum + it.qty, 0),
  );

  const subtotal = computed(() =>
    detailed.value.reduce((sum, it) => sum + it.product.price * it.qty, 0),
  );

  const shipping = computed(() => (subtotal.value === 0 ? 0 : subtotal.value >= 499 ? 0 : 49));

  const total = computed(() => subtotal.value + shipping.value);

  function add(productId: string, qty: number = 1) {
    const existing = items.value.find((it) => it.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.value.push({ productId, qty });
    }
  }

  function setQty(productId: string, qty: number) {
    const it = items.value.find((x) => x.productId === productId);
    if (!it) return;
    if (qty <= 0) remove(productId);
    else it.qty = qty;
  }

  function remove(productId: string) {
    items.value = items.value.filter((it) => it.productId !== productId);
  }

  function clear() {
    items.value = [];
  }

  watch(
    items,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
    },
    { deep: true },
  );

  return { items, detailed, itemCount, subtotal, shipping, total, add, setQty, remove, clear };
});