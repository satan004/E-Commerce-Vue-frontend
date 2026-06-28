import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Order } from '@/data/types';
import * as ordersApi from '@/services/orders';

function parseAddress(address: string): Order['address'] {
  try {
    const parsed = JSON.parse(address);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}

  return {
    fullName: '',
    phone: '',
    line1: address,
    city: '',
    state: '',
    pincode: '',
  };
}

function mapStatus(status: ordersApi.ApiOrder['status']): Order['status'] {
  if (status === 'completed') return 'Delivered';
  if (status === 'cancelled') return 'Cancelled';
  return 'Processing';
}

function adaptOrder(order: ordersApi.ApiOrder): Order {
  const items = order.items.map((it) => ({
    productId: String(it.product_id),
    name: it.product_name,
    image: it.product?.image_url ?? '',
    price: Number(it.unit_price),
    qty: it.quantity,
  }));

  return {
    id: String(order.id),
    createdAt: order.created_at ?? new Date().toISOString(),
    items,
    subtotal: Number(order.subtotal),
    shipping: 0,
    total: Number(order.total),
    status: mapStatus(order.status),
    address: parseAddress(order.shipping_address),
    payment: (order.payment_method === 'UPI' || order.payment_method === 'Card' ? order.payment_method : 'COD'),
  };
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadOrders() {
    loading.value = true;
    error.value = null;
    try {
      orders.value = (await ordersApi.fetchOrders()).map(adaptOrder);
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load orders';
      if (e?.status === 401) orders.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const saved = await ordersApi.checkout({
      shipping_address: JSON.stringify(order.address),
      payment_method: order.payment,
    });
    const adapted = adaptOrder(saved);
    orders.value.unshift(adapted);
    return adapted;
  }

  function clear() {
    orders.value = [];
  }

  return { orders, loading, error, loadOrders, placeOrder, clear };
});
