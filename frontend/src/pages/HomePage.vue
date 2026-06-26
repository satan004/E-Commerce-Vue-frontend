<script setup lang="ts">
// Plain diagnostic build — no widgets, no stores, no router-link.
// If THIS doesn't render, the issue is somewhere in main.ts / router / layout.
</script>

<template>
  <div class="container" style="padding: 40px 20px;">
    <h1 style="color: #2bbef9; font-size: 32px; margin-bottom: 16px;">
      Home Page Works!
    </h1>
    <p style="color: #1f2937; font-size: 16px; margin-bottom: 24px;">
      If you see this message, the routing and layout are working.
    </p>

    <div
      style="background: #fff; border: 1px solid #e6ebf2; border-radius: 12px; padding: 24px; margin-bottom: 16px;"
    >
      <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 12px;">
        Grab the best deal on Smartphones
      </h2>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
        <div
          v-for="i in 5"
          :key="i"
          style="background: #f7f9fc; border-radius: 8px; padding: 20px; text-align: center; color: #5b6472;"
        >
          Phone {{ i }}
        </div>
      </div>
    </div>

    <div
      style="background: #fff; border: 1px solid #e6ebf2; border-radius: 12px; padding: 24px;"
    >
      <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 12px;">
        Shop From Top Categories
      </h2>
      <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 12px;">
        <div
          v-for="i in 10"
          :key="i"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px;"
        >
          <div
            style="width: 80px; height: 80px; border-radius: 50%; background: #e8f7fd; display: flex; align-items: center; justify-content: center; color: #1428a0; font-weight: 700;"
          >
            {{ i }}
          </div>
          <span style="font-size: 13px; color: #1f2937;">Brand {{ i }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>