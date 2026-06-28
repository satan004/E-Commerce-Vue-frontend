<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useWishlistStore } from '@/store/modules/wishlist';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import { useAuthStore } from '@/store/modules/auth';

const wishlist = useWishlistStore();
const auth = useAuthStore();
const items = computed(() => wishlist.detailed);

onMounted(() => {
  if (auth.isAuthenticated) wishlist.loadWishlist();
});
</script>

<template>
  <div class="container page-pad">
    <h1>My Wishlist</h1>
    <p v-if="items.length === 0" class="empty-state">
      Your wishlist is empty. <RouterLink to="/products">Browse products</RouterLink>.
    </p>

    <div v-else class="grid">
      <ProductCardWidget v-for="p in items" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<style scoped>
.page-pad { padding: 24px 20px 50px; }
h1 { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
.empty-state {
  background: #fff;
  border: 1px dashed var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 50px 20px;
  text-align: center;
  color: var(--mm-text-soft);
}
.empty-state a { color: var(--mm-primary); font-weight: 600; }

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
</style>
