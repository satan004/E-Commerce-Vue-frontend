export interface Product {
  id: string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // emoji or letter for fallback
  bg?: string;
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  image: string;
  bg: string;
}

export const heroSlides = [
  {
    id: 1,
    tag: 'Best Deal Online on smart watches',
    title: 'SMART WEARABLE.',
    subtitle: 'UP to 80% OFF',
    image:
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&q=80',
  },
  {
    id: 2,
    tag: 'New arrivals in smartphones',
    title: 'SMARTPHONES.',
    subtitle: 'From ₹9,999',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80',
  },
  {
    id: 3,
    tag: 'Home essentials at low prices',
    title: 'HOME & KITCHEN.',
    subtitle: 'Save up to 60%',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
  },
];

export const smartphones: Product[] = [
  {
    id: 'p1',
    name: 'Galaxy S22 Ultra',
    image:
      'https://images.unsplash.com/photo-1610792516775-01de03eae630?w=400&q=80',
    price: 32999,
    oldPrice: 74999,
    discount: 56,
  },
  {
    id: 'p2',
    name: 'Galaxy M13 (4GB | 64 GB)',
    image:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80',
    price: 10499,
    oldPrice: 14999,
    discount: 30,
  },
  {
    id: 'p3',
    name: 'Galaxy M33 (4GB | 64 GB)',
    image:
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&q=80',
    price: 16999,
    oldPrice: 24999,
    discount: 32,
  },
  {
    id: 'p4',
    name: 'Galaxy M53 (4GB | 64 GB)',
    image:
      'https://images.unsplash.com/photo-1606293459167-b4a8db27d59c?w=400&q=80',
    price: 31999,
    oldPrice: 40999,
    discount: 22,
  },
  {
    id: 'p5',
    name: 'Galaxy S22 Ultra',
    image:
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80',
    price: 67999,
    oldPrice: 85999,
    discount: 21,
  },
];

export const topCategories: Category[] = [
  {
    id: 'c1',
    name: 'Mobile',
    icon: '📱',
    bg: '#e8f7fd',
  },
  {
    id: 'c2',
    name: 'Cosmetics',
    icon: '💄',
    bg: '#fde8f0',
  },
  {
    id: 'c3',
    name: 'Electronics',
    icon: '🎧',
    bg: '#fff4d6',
  },
  {
    id: 'c4',
    name: 'Furniture',
    icon: '🛋️',
    bg: '#e8f0fd',
  },
  {
    id: 'c5',
    name: 'Watches',
    icon: '⌚',
    bg: '#dff7e6',
  },
  {
    id: 'c6',
    name: 'Decor',
    icon: '🪴',
    bg: '#e6f7f3',
  },
  {
    id: 'c7',
    name: 'Accessories',
    icon: '💍',
    bg: '#f7e6f3',
  },
];

export const brands: Brand[] = [
  {
    id: 'b1',
    name: 'iPhone',
    tagline: 'UP to 80% OFF',
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    bg: '#1f2937',
  },
  {
    id: 'b2',
    name: 'realme',
    tagline: 'UP to 80% OFF',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
    bg: '#fffbea',
  },
  {
    id: 'b3',
    name: 'Xiaomi',
    tagline: 'UP to 80% OFF',
    image:
      'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400&q=80',
    bg: '#fff1eb',
  },
];

export const navCategories = [
  'Groceries',
  'Premium Fruits',
  'Home & Kitchen',
  'Fashion',
  'Electronics',
  'Beauty',
  'Home Improvement',
  'Sports, Toys & Luggage',
];