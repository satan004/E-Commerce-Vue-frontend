import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Order } from '@/data/types';

const STORAGE_KEY = 'mm-orders';

function load(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>(load());

  function placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + Date.now().toString().slice(-7),
      createdAt: new Date().toISOString(),
      status: 'Processing',
    };
    orders.value.unshift(newOrder);
    return newOrder;
  }

  watch(
    orders,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value));
    },
    { deep: true },
  );

  return { orders, placeOrder };
});