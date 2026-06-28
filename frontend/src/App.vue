<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { useCartStore } from '@/store/modules/cart';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useOrdersStore } from '@/store/modules/orders';
import { getAuthToken } from '@/services/apiClient';

const auth = useAuthStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const orders = useOrdersStore();

onMounted(async () => {
  if (!getAuthToken()) return;
  await auth.loadProfile();
  if (!auth.isAuthenticated) return;
  await Promise.all([
    cart.loadCart(),
    wishlist.loadWishlist(),
    orders.loadOrders(),
  ]);
});
</script>

<template>
  <RouterView />
</template>
