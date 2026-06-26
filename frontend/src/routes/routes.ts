import type { RouteRecordRaw } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

import HomePage from '@/pages/HomePage.vue';
import ProductListPage from '@/pages/products/ProductListPage.vue';
import ProductDetailPage from '@/pages/products/ProductDetailPage.vue';
import WishlistPage from '@/pages/WishlistPage.vue';
import CartPage from '@/pages/CartPage.vue';
import CheckoutPage from '@/pages/CheckoutPage.vue';
import OrdersPage from '@/pages/OrdersPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import NotFound from '@/pages/404.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { name: 'home',     path: '',                 component: HomePage },
      { name: 'products', path: 'products',         component: ProductListPage },
      { name: 'product',  path: 'product/:slug',    component: ProductDetailPage },
      { name: 'category', path: 'category/:slug',   component: ProductListPage },
      { name: 'wishlist', path: 'wishlist',         component: WishlistPage },
      { name: 'cart',     path: 'cart',             component: CartPage },
      { name: 'checkout', path: 'checkout',         component: CheckoutPage },
      { name: 'orders',   path: 'orders',           component: OrdersPage },
      { name: 'profile',  path: 'profile',          component: ProfilePage },
      { name: 'login',    path: 'login',            component: LoginPage },
      { name: 'register', path: 'register',         component: RegisterPage },
    ],
  },
  { name: 'not-found', path: '/:pathMatch(.*)*', component: NotFound },
];