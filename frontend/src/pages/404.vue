<template>
  <div class="not-found">
    <div class="container nf-inner">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="btn-home">Back to Home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
  background: var(--mm-bg-page);
}
.nf-inner { text-align: center; }
.nf-inner h1 {
  font-size: 72px;
  font-weight: 800;
  color: var(--mm-primary);
  margin-bottom: 8px;
}
.nf-inner p {
  font-size: 16px;
  color: var(--mm-text-soft);
  margin-bottom: 24px;
}
.btn-home {
  display: inline-block;
  background: var(--mm-primary);
  color: #fff;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 600;
}
.btn-home:hover { background: var(--mm-primary-dark); color: #fff; }
</style>