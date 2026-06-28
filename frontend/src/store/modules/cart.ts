import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem } from '@/data/types';
import * as cartApi from '@/services/cart';
import { adaptProduct } from '@/services/adapters';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const detailed = ref<Array<CartItem & { id: number; product: ReturnType<typeof adaptProduct> }>>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const itemCount = computed(() =>
    items.value.reduce((sum, it) => sum + it.qty, 0),
  );

  const subtotal = computed(() =>
    detailed.value.reduce((sum, it) => sum + it.product.price * it.qty, 0),
  );

  const shipping = computed(() => (subtotal.value === 0 ? 0 : subtotal.value >= 499 ? 0 : 49));

  const total = computed(() => subtotal.value + shipping.value);

  function applyCart(cart: cartApi.ApiCart) {
    items.value = cart.items.map((it) => ({
      productId: String(it.product.id),
      qty: it.quantity,
    }));
    detailed.value = cart.items.map((it) => ({
      id: it.id,
      productId: String(it.product.id),
      qty: it.quantity,
      product: adaptProduct(it.product),
    }));
  }

  async function loadCart() {
    loading.value = true;
    error.value = null;
    try {
      applyCart(await cartApi.fetchCart());
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load cart';
      if (e?.status === 401) clear();
    } finally {
      loading.value = false;
    }
  }

  async function add(productId: string, qty: number = 1) {
    applyCart(await cartApi.addCartItem(Number(productId), qty));
  }

  async function setQty(productId: string, qty: number) {
    const item = detailed.value.find((x) => x.productId === productId);
    if (!item) return;
    if (qty <= 0) await remove(productId);
    else applyCart(await cartApi.updateCartItem(item.id, qty));
  }

  async function remove(productId: string) {
    const item = detailed.value.find((x) => x.productId === productId);
    if (!item) return;
    applyCart(await cartApi.removeCartItem(item.id));
  }

  function clear() {
    items.value = [];
    detailed.value = [];
  }

  return { items, detailed, loading, error, itemCount, subtotal, shipping, total, loadCart, add, setQty, remove, clear };
});
