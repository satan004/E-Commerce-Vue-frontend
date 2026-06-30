<script setup lang="ts">
import { computed, onMounted } from 'vue';
import HeroBannerWidget from '@/widgets/hero-banner/HeroBannerWidget.vue';
import CategoryCardWidget from '@/widgets/category-card/CategoryCardWidget.vue';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import SectionHeaderWidget from '@/widgets/section-header/SectionHeaderWidget.vue';
import { useCatalogStore } from '@/store/modules/catalog';

const catalog = useCatalogStore();

onMounted(() => {
  catalog.loadCategories();
  catalog.loadFeatured(8);
  catalog.loadProducts({ per_page: 12 });
});

const featuredProducts = computed(() => catalog.featured);

// Get top categories
const categoryList = computed(() => catalog.categories);
const latestProducts = computed(() => catalog.products);
</script>

<template>
  <div class="page">
    <!-- Hero Carousel Banner -->
    <HeroBannerWidget />

    <!-- Featured Products Section -->
    <section class="mm-section">
      <div class="container">
        <SectionHeaderWidget
          prefix="Grab the best deal on"
          accent="Smartphones"
          viewAll
          allProducts
          viewAllTo="/products"
          allProductsTo="/products"
        />
        <div class="mm-products-grid">
          <ProductCardWidget v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <!-- Top Categories Section -->
    <section class="mm-section">
      <div class="container">
        <SectionHeaderWidget prefix="Shop From" accent="Top Categories" viewAll viewAllTo="/products" />
        <div class="mm-categories-grid">
          <CategoryCardWidget v-for="category in categoryList" :key="category.id" :category="category" />
        </div>
      </div>
    </section>

    <!-- Brand Promotions Section -->
    <section v-if="latestProducts.length" class="mm-section">
      <div class="container">
        <SectionHeaderWidget
          prefix="Latest"
          accent="Products"
          viewAll
          allProducts
          viewAllTo="/products"
          allProductsTo="/products"
        />
        <div class="mm-products-grid">
          <ProductCardWidget v-for="product in latestProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  background: var(--mm-bg-page);
}

.mm-section {
  padding: 28px 0;
}

.mm-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.mm-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

@media (max-width: 1024px) {
  .mm-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .mm-categories-grid {
    grid-template-columns: repeat(5, 1fr);
  }

}

@media (max-width: 640px) {
  .mm-section {
    padding: 20px 0;
  }

  .mm-products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .mm-categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

}
</style>
