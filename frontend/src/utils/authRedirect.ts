import type { LocationQueryValue, RouteLocationRaw } from 'vue-router';

export const CART_WISHLIST_LOGIN_MESSAGE = 'Please log in to access your Cart and Wishlist.';
export const CART_WISHLIST_AUTH_REASON = 'cart-wishlist';

function firstQueryValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0] ?? undefined;
  return value ?? undefined;
}

export function normalizeRedirect(value: LocationQueryValue | LocationQueryValue[] | undefined): string {
  const redirect = firstQueryValue(value);
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) return '/';
  return redirect;
}

export function isCartOrWishlistDestination(destination: string): boolean {
  const [pathPart = ''] = destination.split(/[?#]/);
  const path = pathPart.replace(/\/+$/, '') || '/';
  return path === '/cart' || path === '/wishlist';
}

export function loginRedirect(destination: string): RouteLocationRaw {
  return {
    path: '/login',
    query: {
      redirect: destination,
      authRequired: CART_WISHLIST_AUTH_REASON,
    },
  };
}
