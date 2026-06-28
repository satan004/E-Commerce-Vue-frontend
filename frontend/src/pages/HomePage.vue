<script setup lang="ts">
import { computed, onMounted } from 'vue';
import HeroBannerWidget from '@/widgets/hero-banner/HeroBannerWidget.vue';
import CategoryCardWidget from '@/widgets/category-card/CategoryCardWidget.vue';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import BrandCardWidget from '@/widgets/brand-card/BrandCardWidget.vue';
import SectionHeaderWidget from '@/widgets/section-header/SectionHeaderWidget.vue';
import { brands, popularPhones } from '@/data/megamart';
import { useCatalogStore } from '@/store/modules/catalog';

const catalog = useCatalogStore();

onMounted(() => {
  catalog.loadCategories();
  catalog.loadFeatured(8);
});

const featuredProducts = computed(() => catalog.featured);

// Get brands to display
const brandList = computed(() => brands);

// Get top categories
const categoryList = computed(() => catalog.categories);

// Get popular phones
const popularPhonesList = computed(() => popularPhones);
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

    <!-- Popular Phones Section -->
    <section class="mm-section">
      <div class="container">
        <SectionHeaderWidget prefix="Popular" accent="Phones" :viewAll="true" />
        <div class="mm-essentials-grid">
          <div v-for="item in popularPhonesList" :key="item.id" class="mm-essential-card">
            <div class="mm-essential-image">
              <img :src="item.image" :alt="item.name" />
              <div class="mm-essential-discount">UP to {{ item.discount }}% OFF</div>
            </div>
            <div class="mm-essential-name">{{ item.name }}</div>
          </div>
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

.mm-essentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.mm-essential-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 1px 3px rgba(20, 30, 60, 0.08);
}

.mm-essential-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(20, 30, 60, 0.12);
}

.mm-essential-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f4f6f9;
}

.mm-essential-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mm-essential-discount {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  background: rgba(43, 190, 249, 0.95);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  text-align: center;
}

.mm-essential-name {
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--mm-text);
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

  .mm-essentials-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
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

  .mm-essentials-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
