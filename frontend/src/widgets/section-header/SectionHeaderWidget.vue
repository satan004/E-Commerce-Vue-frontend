<script setup lang="ts">
defineProps<{
  prefix?: string;
  accent: string;
  viewAll?: boolean;
}>();
</script>

<template>
  <div class="section-title">
    <h2>
      <span v-if="prefix" class="prefix">{{ prefix }} </span>
      <span class="accent">{{ accent }}</span>
    </h2>
    <a v-if="viewAll" href="#" class="view-all">View All
      <svg class="arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>
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
</style>