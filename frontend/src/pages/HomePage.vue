<script setup lang="ts">
import HeroBannerWidget from '@/widgets/hero-banner/HeroBannerWidget.vue';
import SectionHeaderWidget from '@/widgets/section-header/SectionHeaderWidget.vue';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import CategoryCardWidget from '@/widgets/category-card/CategoryCardWidget.vue';
import BrandCardWidget from '@/widgets/brand-card/BrandCardWidget.vue';

import { smartphones, topCategories, brands } from '@/data/megamart';
</script>

<template>
  <div class="home">
    <HeroBannerWidget />

    <section class="section container">
      <SectionHeaderWidget
        prefix="Grab the best deal on"
        accent="Smartphones"
        :view-all="true"
      />
      <div class="mm-grid mm-grid-5">
        <ProductCardWidget
          v-for="product in smartphones"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <section class="section container">
      <SectionHeaderWidget
        prefix="Shop From"
        accent="Top Categories"
        :view-all="true"
      />
      <div class="mm-grid mm-grid-7">
        <CategoryCardWidget
          v-for="cat in topCategories"
          :key="cat.id"
          :category="cat"
        />
      </div>
    </section>

    <section class="section container">
      <SectionHeaderWidget
        prefix="Top"
        accent="Electronics Brands"
        :view-all="true"
      />
      <div class="mm-grid mm-grid-3">
        <BrandCardWidget v-for="brand in brands" :key="brand.id" :brand="brand" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.mm-grid {
  display: grid;
  gap: 18px;
}

.mm-grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

.mm-grid-7 {
  grid-template-columns: repeat(7, 1fr);
}

.mm-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1100px) {
  .mm-grid-5 {
    grid-template-columns: repeat(3, 1fr);
  }
  .mm-grid-7 {
    grid-template-columns: repeat(4, 1fr);
  }
  .mm-grid-3 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .mm-grid-5 {
    grid-template-columns: repeat(2, 1fr);
  }
  .mm-grid-7 {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>