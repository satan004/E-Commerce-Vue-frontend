// filepath: src/services/orders.ts
import { api } from './apiClient';
import type { ApiProduct } from './catalog';

export interface ApiOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  total: string;
  product?: ApiProduct | null;
}

export interface ApiOrder {
  id: number;
  user_id: number;
  status: 'pending' | 'completed' | 'cancelled';
  subtotal: string;
  total: string;
  shipping_address: string;
  payment_method?: string | null;
  notes?: string | null;
  items: ApiOrderItem[];
  created_at?: string;
  updated_at?: string;
}

export async function fetchOrders(): Promise<ApiOrder[]> {
  return api<ApiOrder[]>({ method: 'GET', url: '/orders' });
}

export async function fetchOrder(id: number): Promise<ApiOrder> {
  return api<ApiOrder>({ method: 'GET', url: `/orders/${id}` });
}

export async function checkout(payload: {
  shipping_address: string;
  payment_method?: string;
  notes?: string;
}): Promise<ApiOrder> {
  return api<ApiOrder>({
    method: 'POST',
    url: '/checkout',
    data: payload,
  });
}