// filepath: src/services/cart.ts
import { api } from './apiClient';
import type { ApiProduct } from './catalog';

export interface ApiCartLine {
  id: number;
  quantity: number;
  line_total: number;
  product: ApiProduct;
}

export interface ApiCart {
  items: ApiCartLine[];
  count: number;
  subtotal: number;
}

export async function fetchCart(): Promise<ApiCart> {
  return api<ApiCart>({ method: 'GET', url: '/cart' });
}

export async function addCartItem(productId: number, quantity = 1): Promise<ApiCart> {
  return api<ApiCart>({
    method: 'POST',
    url: '/cart',
    data: { product_id: productId, quantity },
  });
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<ApiCart> {
  return api<ApiCart>({
    method: 'PUT',
    url: `/cart/${cartItemId}`,
    data: { quantity },
  });
}

export async function removeCartItem(cartItemId: number): Promise<ApiCart> {
  return api<ApiCart>({
    method: 'DELETE',
    url: `/cart/${cartItemId}`,
  });
}