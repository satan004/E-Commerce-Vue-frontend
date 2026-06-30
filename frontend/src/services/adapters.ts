// filepath: src/services/adapters.ts
import type { Product, Category } from '@/data/types';
import type { ApiProduct, ApiCategory } from './catalog';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">No image</text></svg>',
  );

function imageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith('http://localhost/storage/')) {
    return url.replace('http://localhost', '');
  }
  return url;
}

const CATEGORY_STYLES: Record<string, Pick<Category, 'icon' | 'bg' | 'textColor' | 'type'>> = {
  iphone: { icon: 'apple', bg: '#111827', textColor: '#ffffff', type: 'phone' },
  apple: { icon: 'apple', bg: '#111827', textColor: '#ffffff', type: 'phone' },
  oppo: { icon: 'OPPO', bg: '#e9fbf0', textColor: '#07823f', type: 'phone' },
  pixel: { icon: 'G', bg: '#eef6ff', textColor: '#1a73e8', type: 'phone' },
  google: { icon: 'G', bg: '#eef6ff', textColor: '#1a73e8', type: 'phone' },
  realme: { icon: 'realme', bg: '#fff7cf', textColor: '#111827', type: 'phone' },
  samsung: { icon: 'SAMSUNG', bg: '#eef4ff', textColor: '#1428a0', type: 'phone' },
  vivo: { icon: 'vivo', bg: '#eaf1ff', textColor: '#415fff', type: 'phone' },
  xiaomi: { icon: 'Mi', bg: '#fff1eb', textColor: '#ff6900', type: 'phone' },
  redmi: { icon: 'Mi', bg: '#fff1eb', textColor: '#ff6900', type: 'phone' },
  oneplus: { icon: '1+', bg: '#fff1f3', textColor: '#eb0028', type: 'phone' },
  motorola: { icon: 'M', bg: '#e8f7fd', textColor: '#1d6cb5', type: 'phone' },
  nokia: { icon: 'NOKIA', bg: '#e6f7f3', textColor: '#124191', type: 'phone' },
  honor: { icon: 'HONOR', bg: '#fff0f0', textColor: '#111827', type: 'phone' },
};

function categoryStyle(c: ApiCategory): Pick<Category, 'icon' | 'bg' | 'textColor' | 'type'> {
  const key = c.slug.toLowerCase();
  const nameKey = c.name.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_STYLES[key] ?? CATEGORY_STYLES[nameKey] ?? {
    icon: c.name.slice(0, 1).toUpperCase(),
    bg: '#f3f6fb',
    textColor: '#1f2937',
    type: 'generic',
  };
}

/**
 * Map an `ApiProduct` returned by the Laravel backend to the frontend
 * `Product` shape used by widgets, pages, and the existing cart/wishlist stores.
 */
export function adaptProduct(p: ApiProduct): Product {
  const price = Number(p.price) || 0;
  const rating = p.reviews_avg_rating ? Number(p.reviews_avg_rating) : undefined;
  const stock = p.stock ?? 0;
  const image = imageUrl(p.image_url);
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
    reviews: p.reviews?.map((review) => ({
      id: String(review.id),
      userId: String(review.user_id),
      userName: review.user?.name ?? 'Customer',
      rating: review.rating,
      comment: review.comment ?? undefined,
      createdAt: review.created_at,
    })) ?? [],
  };
}

export function adaptCategory(c: ApiCategory): Category {
  const style = categoryStyle(c);
  return {
    id: String(c.id),
    slug: c.slug,
    name: c.name,
    ...style,
  };
}
