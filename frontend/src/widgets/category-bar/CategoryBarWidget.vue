<script setup lang="ts">
import { onMounted } from 'vue';
import { useCatalogStore } from '@/store/modules/catalog';

const catalog = useCatalogStore();

onMounted(() => {
  if (catalog.categories.length === 0) catalog.loadCategories();
});
</script>

<template>
  <nav class="mm-category-bar">
    <div class="container mm-category-inner">
      <RouterLink
        v-for="cat in catalog.categories"
        :key="cat.id"
        :to="`/category/${cat.slug}`"
        class="mm-category-item"
      >
        <span>{{ cat.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.mm-category-bar {
  background: #fff;
  border-bottom: 1px solid var(--mm-border);
  position: sticky;
  top: 68px;
  z-index: 40;
}

.mm-category-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 46px;
  overflow-x: auto;
  scrollbar-width: none;
}

.mm-category-inner::-webkit-scrollbar {
  display: none;
}

.mm-category-item {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13.5px;
  color: var(--mm-text-soft);
  white-space: nowrap;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.mm-category-item:hover {
  background: var(--mm-primary-light);
  color: var(--mm-primary);
}

</style>
