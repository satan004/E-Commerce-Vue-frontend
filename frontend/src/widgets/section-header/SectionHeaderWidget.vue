<script setup lang="ts">
defineProps<{
  prefix?: string;
  accent: string;
  viewAll?: boolean;
  viewAllTo?: string;
  allProducts?: boolean;
  allProductsTo?: string;
}>();
</script>

<template>
  <div class="section-title">
    <h2>
      <span v-if="prefix" class="prefix">{{ prefix }} </span>
      <span class="accent">{{ accent }}</span>
    </h2>
    <div class="section-actions">
      <RouterLink v-if="allProducts" :to="allProductsTo ?? '/products'" class="all-products-link">
        All Products
      </RouterLink>
      <RouterLink v-if="viewAll" :to="viewAllTo ?? '/products'" class="view-all">View All
        <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
}
.section-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--mm-text);
  letter-spacing: -0.3px;
}
.section-title h2 .prefix {
  color: var(--mm-text);
}
.section-title h2 .accent {
  color: var(--mm-primary);
}
.section-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.all-products-link {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: var(--mm-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  padding: 0 16px;
  box-shadow: 0 10px 20px rgba(43, 190, 249, 0.2);
}
.all-products-link:hover {
  background: var(--mm-primary-dark);
}
.view-all {
  color: var(--mm-primary);
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.view-all:hover {
  text-decoration: underline;
}
.view-all .arrow {
  margin-top: 1px;
}

@media (max-width: 560px) {
  .section-title {
    align-items: flex-start;
    gap: 12px;
  }
  .section-actions {
    gap: 8px;
  }
  .all-products-link,
  .view-all {
    min-height: 34px;
  }
}
</style>
