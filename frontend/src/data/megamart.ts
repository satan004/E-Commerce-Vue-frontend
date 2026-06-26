import type { Product, Category, Brand } from './types';

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
  'All',
  'Samsung',
  'iPhone',
  'Oppo',
  'Realme',
  'Vivo',
  'Xiaomi',
  'OnePlus',
  'Motorola',
  'Nokia',
  'Honor',
];

export const topCategories: Category[] = [
  { id: 'c-samsung',  slug: 'samsung',  name: 'Samsung',  icon: 'S',      bg: '#e8f7fd', textColor: '#1428a0', type: 'phone' },
  { id: 'c-iphone',   slug: 'iphone',   name: 'iPhone',   icon: '',       bg: '#1f2937', textColor: '#ffffff', type: 'phone' },
  { id: 'c-oppo',     slug: 'oppo',     name: 'Oppo',     icon: 'O',      bg: '#fde8f0', textColor: '#1a8a4a', type: 'phone' },
  { id: 'c-realme',   slug: 'realme',   name: 'Realme',   icon: 'realme', bg: '#fffbea', textColor: '#ffc901', type: 'phone' },
  { id: 'c-vivo',     slug: 'vivo',     name: 'Vivo',     icon: 'V',      bg: '#e6f0fb', textColor: '#415fff', type: 'phone' },
  { id: 'c-xiaomi',   slug: 'xiaomi',   name: 'Xiaomi',   icon: 'Mi',     bg: '#fff1eb', textColor: '#ff6900', type: 'phone' },
  { id: 'c-oneplus',  slug: 'oneplus',  name: 'OnePlus',  icon: '1+',     bg: '#f3f3f3', textColor: '#eb0028', type: 'phone' },
  { id: 'c-motorola', slug: 'motorola', name: 'Motorola', icon: 'M',      bg: '#e8f7fd', textColor: '#1d6cb5', type: 'phone' },
  { id: 'c-nokia',    slug: 'nokia',    name: 'Nokia',    icon: 'N',      bg: '#e6f7f3', textColor: '#124191', type: 'phone' },
  { id: 'c-honor',    slug: 'honor',    name: 'Honor',    icon: 'H',      bg: '#fde8e8', textColor: '#e60000', type: 'phone' },
];

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80`;

export const products: Product[] = [
  // Samsung
  { id: 'p1',  slug: 'galaxy-s22-ultra',          name: 'Galaxy S22 Ultra',             brand: 'Samsung',  category: 'samsung',  image: IMG('photo-1610792516775-01de03eae630'), price: 32999, oldPrice: 74999, discount: 56, rating: 4.4, ratingCount: 1280, inStock: true, description: 'Top-of-the-line Samsung flagship with built-in S Pen, 108 MP camera, and the most powerful chip in a Galaxy.', highlights: ['8 GB RAM | 128 GB ROM', '108 MP + 12 MP + 10 MP + 10 MP', '5000 mAh Battery', '6.8 inch Dynamic AMOLED 2X'], specs: { Display: '6.8" QHD+ AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 1', RAM: '8 GB', Storage: '128 GB', Battery: '5000 mAh', Camera: '108 MP + 12 MP + 10 MP + 10 MP' } },
  { id: 'p2',  slug: 'galaxy-m13',                name: 'Galaxy M13 (4GB | 64 GB)',     brand: 'Samsung',  category: 'samsung',  image: IMG('photo-1592899677977-9c10ca588bbd'), price: 10499, oldPrice: 14999, discount: 30, rating: 4.1, ratingCount: 612, inStock: true, description: 'Affordable Samsung with a 50 MP triple camera and 6000 mAh battery.', highlights: ['4 GB RAM | 64 GB ROM', '50 MP Triple Camera', '6000 mAh Battery'], specs: { Display: '6.6" FHD+ PLS LCD', Processor: 'Exynos 850', RAM: '4 GB', Storage: '64 GB', Battery: '6000 mAh' } },
  { id: 'p3',  slug: 'galaxy-m33',                name: 'Galaxy M33 (4GB | 64 GB)',     brand: 'Samsung',  category: 'samsung',  image: IMG('photo-1567581935884-3349723552ca'), price: 16999, oldPrice: 24999, discount: 32, rating: 4.2, ratingCount: 488, inStock: true, description: '5G-ready Samsung with 120 Hz display and 6000 mAh battery.', highlights: ['5G Ready', '120 Hz Display', '50 MP Quad Camera'], specs: { Display: '6.6" FHD+ 120Hz', Processor: 'Exynos 1280', RAM: '4 GB', Storage: '64 GB', Battery: '6000 mAh' } },
  { id: 'p4',  slug: 'galaxy-m53',                name: 'Galaxy M53 (4GB | 64 GB)',     brand: 'Samsung',  category: 'samsung',  image: IMG('photo-1606293459167-b4a8db27d59c'), price: 31999, oldPrice: 40999, discount: 22, rating: 4.3, ratingCount: 312, inStock: true, description: 'Premium mid-range Samsung with 108 MP camera and Super AMOLED+ display.', highlights: ['108 MP Camera', 'Super AMOLED+ 120Hz', 'Dimensity 900'], specs: { Display: '6.7" sAMOLED+ 120Hz', Processor: 'Dimensity 900', RAM: '4 GB', Storage: '64 GB', Battery: '5000 mAh' } },
  { id: 'p5',  slug: 'galaxy-s22-ultra-256',      name: 'Galaxy S22 Ultra (256 GB)',    brand: 'Samsung',  category: 'samsung',  image: IMG('photo-1574944985070-8f3ebc6b79d2'), price: 67999, oldPrice: 85999, discount: 21, rating: 4.6, ratingCount: 920, inStock: true, description: 'More storage, same flagship power.', highlights: ['12 GB RAM | 256 GB ROM'], specs: { Display: '6.8" QHD+ AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 1', RAM: '12 GB', Storage: '256 GB', Battery: '5000 mAh' } },

  // iPhone
  { id: 'p6',  slug: 'iphone-15-pro',             name: 'iPhone 15 Pro',                brand: 'iPhone',   category: 'iphone',   image: IMG('photo-1696446702233-9e6e9c7b5f4a'), price: 119900, oldPrice: 134900, discount: 11, rating: 4.8, ratingCount: 2150, inStock: true, description: 'Titanium design, A17 Pro chip, USB-C, and the new Action button.', highlights: ['A17 Pro Chip', 'Titanium Body', 'USB-C'], specs: { Display: '6.1" Super Retina XDR', Processor: 'A17 Pro', Storage: '128 GB', Camera: '48 MP + 12 MP + 12 MP' } },
  { id: 'p7',  slug: 'iphone-15',                 name: 'iPhone 15',                    brand: 'iPhone',   category: 'iphone',   image: IMG('photo-1592286927505-1def25115558'), price: 69900, oldPrice: 79900, discount: 12, rating: 4.7, ratingCount: 1820, inStock: true, description: 'Dynamic Island, 48 MP camera and USB-C.', highlights: ['Dynamic Island', '48 MP Camera', 'USB-C'], specs: { Display: '6.1" Super Retina XDR', Processor: 'A16 Bionic', Storage: '128 GB', Camera: '48 MP + 12 MP' } },
  { id: 'p8',  slug: 'iphone-14',                 name: 'iPhone 14',                    brand: 'iPhone',   category: 'iphone',   image: IMG('photo-1663499482523-1c0c1bae4ce1'), price: 59900, oldPrice: 69900, discount: 14, rating: 4.6, ratingCount: 1540, inStock: true, description: 'A15 Bionic, Crash Detection, and a great dual-camera system.', highlights: ['A15 Bionic', 'Crash Detection'], specs: { Display: '6.1" Super Retina XDR', Processor: 'A15 Bionic', Storage: '128 GB', Camera: '12 MP + 12 MP' } },

  // Oppo
  { id: 'p9',  slug: 'oppo-reno-11',             name: 'Oppo Reno 11',                  brand: 'Oppo',     category: 'oppo',     image: IMG('photo-1606293459167-c77a8d2c5d0e'), price: 24999, oldPrice: 32999, discount: 24, rating: 4.3, ratingCount: 540, inStock: true, description: 'Stylish Oppo with portrait expert camera and 67 W SUPERVOOC charging.', highlights: ['67 W SUPERVOOC', 'Portrait Expert'], specs: { Display: '6.7" AMOLED 120Hz', Processor: 'Dimensity 7050', RAM: '8 GB', Storage: '128 GB', Battery: '5000 mAh' } },
  { id: 'p10', slug: 'oppo-a78',                 name: 'Oppo A78',                      brand: 'Oppo',     category: 'oppo',     image: IMG('photo-1567581935884-3349723552ca'), price: 15999, oldPrice: 19999, discount: 20, rating: 4.1, ratingCount: 410, inStock: true, description: 'Reliable Oppo with 50 MP AI camera and 33 W fast charge.', highlights: ['33 W Fast Charge', '50 MP AI Camera'], specs: { Display: '6.56" HD+ 90Hz', Processor: 'Snapdragon 680', RAM: '8 GB', Storage: '128 GB', Battery: '5000 mAh' } },

  // Realme
  { id: 'p11', slug: 'realme-12-pro',             name: 'Realme 12 Pro',                 brand: 'Realme',   category: 'realme',   image: IMG('photo-1598327105666-5b89351aff97'), price: 21999, oldPrice: 28999, discount: 24, rating: 4.4, ratingCount: 760, inStock: true, description: 'Realme 12 Pro with Sony IMX709 portrait camera and curved display.', highlights: ['Sony IMX709', 'Curved Display'], specs: { Display: '6.7" Curved AMOLED 120Hz', Processor: 'Snapdragon 6 Gen 1', RAM: '8 GB', Storage: '128 GB', Battery: '5000 mAh' } },
  { id: 'p12', slug: 'realme-c67',                name: 'Realme C67',                    brand: 'Realme',   category: 'realme',   image: IMG('photo-1606293459167-8a3aaafea31d'), price: 9999, oldPrice: 13999, discount: 28, rating: 4.0, ratingCount: 320, inStock: true, description: 'Budget Realme with 108 MP camera and Mini Capsule 2.0.', highlights: ['108 MP Camera', 'Mini Capsule 2.0'], specs: { Display: '6.72" FHD+ 90Hz', Processor: 'Snapdragon 685', RAM: '6 GB', Storage: '128 GB', Battery: '5000 mAh' } },

  // Vivo
  { id: 'p13', slug: 'vivo-v29',                  name: 'Vivo V29',                      brand: 'Vivo',     category: 'vivo',     image: IMG('photo-1574944985070-8f3ebc6b79d2'), price: 28999, oldPrice: 34999, discount: 17, rating: 4.3, ratingCount: 612, inStock: true, description: 'Vivo V29 with 50 MP Eye AF selfie and 3D curved display.', highlights: ['50 MP Eye AF Selfie', '3D Curved Display'], specs: { Display: '6.78" AMOLED 120Hz', Processor: 'Snapdragon 778G', RAM: '8 GB', Storage: '128 GB', Battery: '4600 mAh' } },
  { id: 'p14', slug: 'vivo-t2x',                  name: 'Vivo T2x',                      brand: 'Vivo',     category: 'vivo',     image: IMG('photo-1606293459167-b4a8db27d59c'), price: 12999, oldPrice: 17999, discount: 27, rating: 4.0, ratingCount: 285, inStock: true, description: 'Vivo T2x 5G with Dimensity 6020 and 5000 mAh battery.', highlights: ['Dimensity 6020', '5G Ready'], specs: { Display: '6.58" FHD+', Processor: 'Dimensity 6020', RAM: '6 GB', Storage: '128 GB', Battery: '5000 mAh' } },

  // Xiaomi
  { id: 'p15', slug: 'xiaomi-13-pro',             name: 'Xiaomi 13 Pro',                 brand: 'Xiaomi',   category: 'xiaomi',   image: IMG('photo-1607936854279-55e8a4c64888'), price: 59999, oldPrice: 79999, discount: 25, rating: 4.6, ratingCount: 480, inStock: true, description: 'Xiaomi 13 Pro with Leica optics and Snapdragon 8 Gen 2.', highlights: ['Leica Optics', 'Snapdragon 8 Gen 2'], specs: { Display: '6.73" QHD+ AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 2', RAM: '12 GB', Storage: '256 GB', Battery: '4820 mAh' } },
  { id: 'p16', slug: 'redmi-note-13',             name: 'Redmi Note 13',                 brand: 'Xiaomi',   category: 'xiaomi',   image: IMG('photo-1607936854279-55e8a4c64888'), price: 14999, oldPrice: 19999, discount: 25, rating: 4.2, ratingCount: 920, inStock: true, description: 'Redmi Note 13 with 120 Hz AMOLED and 108 MP camera.', highlights: ['120 Hz AMOLED', '108 MP Camera'], specs: { Display: '6.67" AMOLED 120Hz', Processor: 'Snapdragon 685', RAM: '6 GB', Storage: '128 GB', Battery: '5000 mAh' } },

  // OnePlus
  { id: 'p17', slug: 'oneplus-12',                name: 'OnePlus 12',                    brand: 'OnePlus',  category: 'oneplus',  image: IMG('photo-1610792516775-01de03eae630'), price: 56999, oldPrice: 69999, discount: 18, rating: 4.6, ratingCount: 380, inStock: true, description: 'OnePlus 12 with Hasselblad camera and Snapdragon 8 Gen 3.', highlights: ['Hasselblad Camera', 'Snapdragon 8 Gen 3'], specs: { Display: '6.82" QHD+ AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 3', RAM: '12 GB', Storage: '256 GB', Battery: '5400 mAh' } },
  { id: 'p18', slug: 'oneplus-nord-ce3',          name: 'OnePlus Nord CE 3',             brand: 'OnePlus',  category: 'oneplus',  image: IMG('photo-1592899677977-9c10ca588bbd'), price: 22999, oldPrice: 27999, discount: 17, rating: 4.2, ratingCount: 290, inStock: true, description: 'OnePlus Nord CE 3 with 80 W SUPERVOOC charging.', highlights: ['80 W SUPERVOOC', 'Sony IMX890'], specs: { Display: '6.7" AMOLED 120Hz', Processor: 'Snapdragon 782G', RAM: '8 GB', Storage: '128 GB', Battery: '5000 mAh' } },

  // Motorola
  { id: 'p19', slug: 'moto-edge-50',              name: 'Motorola Edge 50',              brand: 'Motorola', category: 'motorola', image: IMG('photo-1567581935884-3349723552ca'), price: 27999, oldPrice: 35999, discount: 22, rating: 4.3, ratingCount: 188, inStock: true, description: 'Motorola Edge 50 with pOLED display and vegan leather finish.', highlights: ['pOLED Display', 'Vegan Leather'], specs: { Display: '6.67" pOLED 144Hz', Processor: 'Snapdragon 7 Gen 1 AE', RAM: '8 GB', Storage: '256 GB', Battery: '5000 mAh' } },

  // Nokia
  { id: 'p20', slug: 'nokia-xr21',                name: 'Nokia XR21',                    brand: 'Nokia',    category: 'nokia',    image: IMG('photo-1574944985070-8f3ebc6b79d2'), price: 32999, oldPrice: 39999, discount: 17, rating: 4.1, ratingCount: 142, inStock: true, description: 'Rugged Nokia XR21 built to military-grade standards.', highlights: ['IP68 + IP69K', 'MIL-STD-810H'], specs: { Display: '6.49" FHD+ 120Hz', Processor: 'Snapdragon 695', RAM: '6 GB', Storage: '128 GB', Battery: '4800 mAh' } },

  // Honor
  { id: 'p21', slug: 'honor-90',                  name: 'Honor 90',                      brand: 'Honor',    category: 'honor',    image: IMG('photo-1607936854279-55e8a4c64888'), price: 27999, oldPrice: 32999, discount: 15, rating: 4.4, ratingCount: 230, inStock: true, description: 'Honor 90 with 200 MP main camera and quad-curved display.', highlights: ['200 MP Camera', 'Quad-Curved Display'], specs: { Display: '6.7" AMOLED 120Hz', Processor: 'Snapdragon 7 Gen 1', RAM: '8 GB', Storage: '256 GB', Battery: '5000 mAh' } },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}

// Popular Phones Categories
export const popularPhones = [
  {
    id: 'pp1',
    name: 'iPhone 15 Pro',
    image: IMG('photo-1696446702233-9e6e9c7b5f4a'),
    discount: 11,
  },
  {
    id: 'pp2',
    name: 'Samsung S22 Ultra',
    image: IMG('photo-1610792516775-01de03eae630'),
    discount: 56,
  },
  {
    id: 'pp3',
    name: 'OnePlus 12',
    image: IMG('photo-1610792516775-01de03eae630'),
    discount: 18,
  },
  {
    id: 'pp4',
    name: 'Xiaomi 13 Pro',
    image: IMG('photo-1607936854279-55e8a4c64888'),
    discount: 25,
  },
  {
    id: 'pp5',
    name: 'Realme 12 Pro',
    image: IMG('photo-1598327105666-5b89351aff97'),
    discount: 24,
  },
  {
    id: 'pp6',
    name: 'Vivo V29',
    image: IMG('photo-1574944985070-8f3ebc6b79d2'),
    discount: 17,
  },
];
