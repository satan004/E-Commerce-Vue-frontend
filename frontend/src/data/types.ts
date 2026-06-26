export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  ratingCount?: number;
  description?: string;
  highlights?: string[];
  specs?: Record<string, string>;
  inStock?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  bg?: string;
  textColor?: string;
  type: 'phone' | 'generic';
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  image: string;
  bg: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: { productId: string; name: string; image: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment: 'COD' | 'UPI' | 'Card';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}