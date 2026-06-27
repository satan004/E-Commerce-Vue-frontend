// filepath: src/services/catalog.ts
import { api } from './apiClient';

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: string; // decimal
  stock: number;
  image_path?: string | null;
  image_url?: string | null;
  is_active: boolean;
  category?: ApiCategory | null;
  reviews_avg_rating?: string | null;
  reviews_count?: number;
}

interface PaginatedProducts {
  data: ApiProduct[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'price_low' | 'price_high' | 'name';
  per_page?: number;
  page?: number;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return api<ApiCategory[]>({ method: 'GET', url: '/categories' });
}

export async function fetchProducts(query: ProductQuery = {}): Promise<PaginatedProducts> {
  return api<PaginatedProducts>({
    method: 'GET',
    url: '/products',
    params: query,
  });
}

export async function fetchProduct(idOrSlug: number | string): Promise<ApiProduct> {
  return api<ApiProduct>({ method: 'GET', url: `/products/${idOrSlug}` });
}