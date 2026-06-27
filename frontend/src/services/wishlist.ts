// filepath: src/services/wishlist.ts
import { api } from './apiClient';
import type { ApiProduct } from './catalog';

export interface ApiWishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product: ApiProduct;
  created_at?: string;
  updated_at?: string;
}

export async function fetchWishlist(): Promise<ApiWishlistItem[]> {
  return api<ApiWishlistItem[]>({ method: 'GET', url: '/wishlist' });
}

export async function addWishlistItem(productId: number): Promise<ApiWishlistItem> {
  return api<ApiWishlistItem>({
    method: 'POST',
    url: '/wishlist',
    data: { product_id: productId },
  });
}

export async function removeWishlistItem(productId: number): Promise<{ deleted: boolean }> {
  return api<{ deleted: boolean }>({
    method: 'DELETE',
    url: `/wishlist/${productId}`,
  });
}