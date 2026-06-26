<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderWidget from '@/widgets/header/HeaderWidget.vue';
import CategoryBarWidget from '@/widgets/category-bar/CategoryBarWidget.vue';
import FooterWidget from '@/widgets/footer/FooterWidget.vue';
</script>

<template>
  <div class="page">
    <HeaderWidget />
    <CategoryBarWidget />
    <main class="page-main">
      <RouterView />
    </main>
    <FooterWidget />
  </div>
</template>

<style scoped>
.page-main {
  flex: 1;
  width: 100%;
}
</style>