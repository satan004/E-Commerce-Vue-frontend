<script setup lang="ts">
import { computed } from 'vue';
import HeroBannerWidget from '@/widgets/hero-banner/HeroBannerWidget.vue';
import CategoryCardWidget from '@/widgets/category-card/CategoryCardWidget.vue';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import BrandCardWidget from '@/widgets/brand-card/BrandCardWidget.vue';
import SectionHeaderWidget from '@/widgets/section-header/SectionHeaderWidget.vue';
import { products, topCategories, brands } from '@/data/megamart';

// Get featured smartphones for the hero products section
const featuredProducts = computed(() => products.slice(0, 5));

// Get brands to display
const brandList = computed(() => brands);

// Get top categories
const categoryList = computed(() => topCategories);
</script>

<template>
  <div class="page">
    <!-- Hero Carousel Banner -->
    <HeroBannerWidget />

    <!-- Featured Products Section -->
    <section class="mm-section">
      <div class="container">
        <SectionHeaderWidget prefix="Grab the best deal on" accent="Smartphones" :viewAll="true" />
        <div class="mm-products-grid">
          <ProductCardWidget v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <!-- Top Categories Section -->
    <section class="mm-section">
      <div class="container">
        <SectionHeaderWidget prefix="Shop From" accent="Top Categories" :viewAll="true" />
        <div class="mm-categories-grid">
          <CategoryCardWidget v-for="category in categoryList" :key="category.id" :category="category" />
        </div>
      </div>
    </section>

    <!-- Brand Promotions Section -->
    <section class="mm-section">
      <div class="container">
        <SectionHeaderWidget prefix="Top" accent="Electronics Brands" :viewAll="true" />
        <div class="mm-brands-grid">
          <BrandCardWidget v-for="brand in brandList" :key="brand.id" :brand="brand" />
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

.mm-brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 1024px) {
  .mm-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .mm-categories-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .mm-brands-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .mm-brands-grid {
    grid-template-columns: 1fr;
  }
}
</style>
