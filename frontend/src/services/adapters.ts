// filepath: src/services/adapters.ts
import type { Product, Category } from '@/data/types';
import type { ApiProduct, ApiCategory } from './catalog';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">No image</text></svg>',
  );

/**
 * Map an `ApiProduct` returned by the Laravel backend to the frontend
 * `Product` shape used by widgets, pages, and the existing cart/wishlist stores.
 */
export function adaptProduct(p: ApiProduct): Product {
  const price = Number(p.price) || 0;
  const rating = p.reviews_avg_rating ? Number(p.reviews_avg_rating) : undefined;
  const stock = p.stock ?? 0;
  const image = p.image_url || PLACEHOLDER_IMAGE;
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    brand: p.category?.name ?? 'General',
    category: p.category?.slug ?? 'all',
    image,
    price,
    description: p.description ?? undefined,
    rating,
    ratingCount: p.reviews_count,
    inStock: p.is_active && stock > 0,
  };
}

export function adaptCategory(c: ApiCategory): Category {
  return {
    id: String(c.id),
    slug: c.slug,
    name: c.name,
    icon: '🛍️',
    type: 'generic',
  };
}