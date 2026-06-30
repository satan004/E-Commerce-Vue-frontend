<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCardWidget from '@/widgets/product-card/ProductCardWidget.vue';
import { useCartStore } from '@/store/modules/cart';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useAuthStore } from '@/store/modules/auth';
import { useOrdersStore } from '@/store/modules/orders';
import * as catalogApi from '@/services/catalog';
import { adaptProduct } from '@/services/adapters';
import { formatPrice } from '@/utils/currency';
import { loginRedirect } from '@/utils/authRedirect';
import type { Product } from '@/data/types';

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const wishlist = useWishlistStore();
const auth = useAuthStore();
const orders = useOrdersStore();

const product = ref<Product | null>(null);
const related = ref<Product[]>([]);
const qty = ref(1);
const activeImg = ref(0);
const reviewRating = ref(5);
const reviewComment = ref('');
const reviewSubmitting = ref(false);
const reviewError = ref('');
const reviewSuccess = ref('');
const showAuthPrompt = ref(false);
const toastMessage = ref('');
const toastTone = ref<'success' | 'error'>('success');
let toastTimer: number | undefined;

const images = computed(() => {
  if (!product.value) return [];
  return [product.value.image, ...(product.value.images ?? [])];
});
const productReviews = computed(() => product.value?.reviews ?? []);
const canReview = computed(() => {
  if (!product.value || !auth.isAuthenticated) return false;
  return orders.orders.some((order) =>
    order.status !== 'Cancelled' &&
    order.items.some((item) => item.productId === product.value?.id),
  );
});
const existingReview = computed(() => {
  if (!product.value || !auth.user) return undefined;
  return productReviews.value.find((review) => review.userId === auth.user?.id);
});

async function loadProduct() {
  product.value = null;
  related.value = [];
  activeImg.value = 0;
  reviewError.value = '';
  reviewSuccess.value = '';

  const apiProduct = await catalogApi.fetchProduct(route.params.slug as string);
  product.value = adaptProduct(apiProduct);
  reviewRating.value = existingReview.value?.rating ?? 5;
  reviewComment.value = existingReview.value?.comment ?? '';

  if (auth.isAuthenticated) {
    await orders.loadOrders();
    reviewRating.value = existingReview.value?.rating ?? 5;
    reviewComment.value = existingReview.value?.comment ?? '';
  }

  const res = await catalogApi.fetchProducts({
    category: product.value.category,
    per_page: 5,
  });
  related.value = res.data
    .map(adaptProduct)
    .filter((p) => p.id !== product.value?.id)
    .slice(0, 4);
}

watch(() => route.params.slug, () => void loadProduct(), { immediate: true });

async function addToCart() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    openAuthPrompt();
    return;
  }

  try {
    await cart.add(product.value.id, qty.value);
    showToast('Product added to your cart.');
  } catch (e: any) {
    if (e?.status === 401) {
      openAuthPrompt();
      return;
    }
    showToast(e?.message ?? 'Could not add product to cart.', 'error');
  }
}

async function buyNow() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    openAuthPrompt();
    return;
  }

  try {
    await cart.add(product.value.id, qty.value);
    router.push('/checkout');
  } catch (e: any) {
    if (e?.status === 401) {
      openAuthPrompt();
      return;
    }
    showToast(e?.message ?? 'Could not start checkout.', 'error');
  }
}

function openAuthPrompt() {
  showAuthPrompt.value = true;
}

function closeAuthPrompt() {
  showAuthPrompt.value = false;
}

function goToLogin() {
  closeAuthPrompt();
  router.push({ path: '/login', query: { redirect: product.value ? `/product/${product.value.slug}` : '/products' } });
}

function goToRegister() {
  closeAuthPrompt();
  router.push({ path: '/register', query: { redirect: product.value ? `/product/${product.value.slug}` : '/products' } });
}

function showToast(message: string, tone: 'success' | 'error' = 'success') {
  toastMessage.value = message;
  toastTone.value = tone;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2800);
}

onUnmounted(() => {
  if (toastTimer) window.clearTimeout(toastTimer);
});

async function toggleFav() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    router.push(loginRedirect('/wishlist'));
    return;
  }
  await wishlist.toggle(product.value.id);
}

async function submitReview() {
  if (!product.value) return;
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: `/product/${product.value.slug}` } });
    return;
  }

  reviewSubmitting.value = true;
  reviewError.value = '';
  reviewSuccess.value = '';

  try {
    const hadReview = !!existingReview.value;
    const updated = await catalogApi.submitProductReview(product.value.id, {
      rating: reviewRating.value,
      comment: reviewComment.value.trim(),
    });
    product.value = adaptProduct(updated);
    reviewSuccess.value = hadReview ? 'Your feedback was updated.' : 'Thanks for your feedback.';
  } catch (e: any) {
    reviewError.value = e?.errors?.product?.[0] ?? e?.message ?? 'Could not submit your review.';
  } finally {
    reviewSubmitting.value = false;
  }
}

function formatReviewDate(value?: string): string {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
}
</script>

<template>
  <div v-if="product" class="pdp">
    <div class="container">
      <nav class="breadcrumbs">
        <RouterLink to="/">Home</RouterLink>
        <span>›</span>
        <RouterLink :to="`/category/${product.category}`">{{ product.brand }}</RouterLink>
        <span>›</span>
        <span>{{ product.name }}</span>
      </nav>

      <div class="pdp-layout">
        <section class="pdp-gallery">
          <div class="pdp-main-img">
            <img :src="images[activeImg]" :alt="product.name" />
            <button
              class="pdp-fav"
              :class="{ active: wishlist.has(product.id) }"
              aria-label="Toggle wishlist"
              @click="toggleFav"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" :fill="wishlist.has(product.id) ? '#ff3b30' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          <div v-if="images.length > 1" class="pdp-thumbs">
            <button
              v-for="(img, i) in images"
              :key="i"
              :class="{ active: i === activeImg }"
              @click="activeImg = i"
            >
              <img :src="img" :alt="`thumb ${i + 1}`" />
            </button>
          </div>
        </section>

        <section class="pdp-info">
          <p class="pdp-brand">{{ product.brand }}</p>
          <h1 class="pdp-title">{{ product.name }}</h1>
          <div v-if="product.rating" class="pdp-rating">
            <span class="pdp-rating-box">{{ product.rating.toFixed(1) }} ★</span>
            <span class="pdp-rating-count">{{ product.ratingCount }} ratings</span>
          </div>

          <div class="pdp-pricing">
            <span class="pdp-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.oldPrice" class="pdp-old">{{ formatPrice(product.oldPrice) }}</span>
            <span v-if="product.discount" class="pdp-discount">{{ product.discount }}% off</span>
          </div>
          <p v-if="product.oldPrice" class="pdp-save">
            You save {{ formatPrice(product.oldPrice - product.price) }}
          </p>

          <p v-if="product.description" class="pdp-desc">{{ product.description }}</p>

          <ul v-if="product.highlights?.length" class="pdp-highlights">
            <li v-for="h in product.highlights" :key="h">
              <span class="dot">•</span>
              {{ h }}
            </li>
          </ul>

          <div class="pdp-qty">
            <span>Quantity</span>
            <div class="qty-stepper">
              <button @click="qty = Math.max(1, qty - 1)" aria-label="Decrease">−</button>
              <span>{{ qty }}</span>
              <button @click="qty += 1" aria-label="Increase">+</button>
            </div>
          </div>

          <div class="pdp-actions">
            <button class="btn-primary" @click="addToCart">Add to Cart</button>
            <button class="btn-accent" @click="buyNow">Buy Now</button>
          </div>

          <div v-if="product.specs" class="pdp-specs">
            <h3>Specifications</h3>
            <table>
              <tbody>
                <tr v-for="(v, k) in product.specs" :key="k">
                  <th>{{ k }}</th>
                  <td>{{ v }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section v-if="related.length" class="related">
        <h2>Similar Products</h2>
        <div class="related-grid">
          <ProductCardWidget v-for="p in related" :key="p.id" :product="p" />
        </div>
      </section>

      <section class="reviews-panel">
        <div class="reviews-head">
          <div>
            <p class="eyebrow">Customer feedback</p>
            <h2>Reviews</h2>
          </div>
          <span class="review-summary">
            {{ product.rating ? product.rating.toFixed(1) : 'No' }} ★ · {{ product.ratingCount ?? 0 }} reviews
          </span>
        </div>

        <form v-if="canReview" class="review-form" @submit.prevent="submitReview">
          <h3>{{ existingReview ? 'Update your review' : 'Write a review' }}</h3>
          <label>
            Rating
            <select v-model.number="reviewRating" :disabled="reviewSubmitting">
              <option v-for="rating in [5, 4, 3, 2, 1]" :key="rating" :value="rating">
                {{ rating }} star{{ rating > 1 ? 's' : '' }}
              </option>
            </select>
          </label>
          <label>
            Feedback
            <textarea
              v-model="reviewComment"
              rows="4"
              maxlength="1000"
              placeholder="Share what you liked, delivery experience, quality, or anything helpful for other customers."
              :disabled="reviewSubmitting"
            ></textarea>
          </label>
          <p v-if="reviewError" class="review-error">{{ reviewError }}</p>
          <p v-if="reviewSuccess" class="review-success">{{ reviewSuccess }}</p>
          <button class="btn-primary review-submit" type="submit" :disabled="reviewSubmitting">
            {{ reviewSubmitting ? 'Submitting...' : existingReview ? 'Update feedback' : 'Submit feedback' }}
          </button>
        </form>

        <div v-else class="review-gate">
          <span v-if="auth.isAuthenticated">Buy this product to share your feedback.</span>
          <span v-else>Log in after buying this product to write a review.</span>
        </div>

        <div v-if="productReviews.length" class="review-list">
          <article v-for="review in productReviews" :key="review.id" class="review-item">
            <div class="review-item-head">
              <strong>{{ review.userName }}</strong>
              <span>{{ review.rating }} ★</span>
            </div>
            <p v-if="review.comment">{{ review.comment }}</p>
            <small>{{ formatReviewDate(review.createdAt) }}</small>
          </article>
        </div>
        <p v-else class="review-empty">No feedback yet.</p>
      </section>
    </div>
  </div>

  <div v-else class="container empty">
    <p>Product not found.</p>
    <RouterLink to="/products" class="link">Continue shopping</RouterLink>
  </div>

  <Teleport to="body">
    <Transition name="auth-modal">
      <div v-if="showAuthPrompt" class="auth-modal-backdrop" @click.self="closeAuthPrompt">
        <section
          class="auth-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          aria-describedby="auth-modal-message"
        >
          <div class="auth-modal-icon" aria-hidden="true">!</div>
          <h2 id="auth-modal-title">Login Required</h2>
          <p id="auth-modal-message">
            Please login or register before purchasing or adding products to your cart.
          </p>
          <div class="auth-modal-actions">
            <button class="auth-modal-primary" type="button" @click="goToLogin">Login</button>
            <button class="auth-modal-secondary" type="button" @click="goToRegister">Register</button>
            <button class="auth-modal-cancel" type="button" @click="closeAuthPrompt">Cancel</button>
          </div>
        </section>
      </div>
    </Transition>

    <Transition name="cart-toast">
      <div v-if="toastMessage" class="cart-toast" :class="toastTone" role="status" aria-live="polite">
        <span aria-hidden="true">{{ toastTone === 'success' ? '✓' : '!' }}</span>
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pdp { padding: 22px 0 40px; }

.breadcrumbs {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12.5px;
  color: var(--mm-text-mute);
  margin-bottom: 14px;
}
.breadcrumbs a { color: var(--mm-text-soft); }
.breadcrumbs a:hover { color: var(--mm-primary); }

.pdp-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 24px;
}

.pdp-main-img {
  position: relative;
  background: #f7f9fc;
  border-radius: var(--mm-radius);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.pdp-main-img img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.pdp-fav {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  color: var(--mm-text-mute);
}
.pdp-fav.active { color: #ff3b30; }

.pdp-thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.pdp-thumbs button {
  width: 64px;
  height: 64px;
  background: #f7f9fc;
  border-radius: 8px;
  padding: 6px;
  border: 2px solid transparent;
}
.pdp-thumbs button.active { border-color: var(--mm-primary); }
.pdp-thumbs img { width: 100%; height: 100%; object-fit: contain; }

.pdp-brand {
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--mm-text-mute);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}
.pdp-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--mm-text);
  letter-spacing: -0.3px;
  margin-bottom: 10px;
}

.pdp-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
}
.pdp-rating-box {
  background: var(--mm-sale);
  color: #fff;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 700;
}
.pdp-rating-count { color: var(--mm-text-mute); }

.pdp-pricing {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}
.pdp-price { font-size: 28px; font-weight: 800; color: var(--mm-text); }
.pdp-old { font-size: 16px; color: var(--mm-text-mute); text-decoration: line-through; }
.pdp-discount { font-size: 14px; color: var(--mm-sale); font-weight: 700; }

.pdp-save { color: var(--mm-sale); font-weight: 600; font-size: 14px; margin-bottom: 14px; }

.pdp-desc { color: var(--mm-text-soft); margin-bottom: 12px; }

.pdp-highlights { margin-bottom: 16px; }
.pdp-highlights li {
  font-size: 13.5px;
  color: var(--mm-text-soft);
  padding: 3px 0;
}
.dot { color: var(--mm-primary); margin-right: 6px; font-weight: 700; }

.pdp-qty {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 13.5px;
  color: var(--mm-text-soft);
}
.qty-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  overflow: hidden;
}
.qty-stepper button {
  width: 36px;
  height: 36px;
  background: var(--mm-bg-mute);
  font-size: 16px;
  font-weight: 700;
  color: var(--mm-text);
}
.qty-stepper button:hover { background: var(--mm-primary-light); color: var(--mm-primary); }
.qty-stepper span {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
}

.pdp-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-primary, .btn-accent {
  flex: 1;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s;
}
.btn-primary { background: var(--mm-primary); color: #fff; }
.btn-primary:hover { background: var(--mm-primary-dark); }
.btn-accent { background: #fff; color: var(--mm-primary); border: 1.5px solid var(--mm-primary); }
.btn-accent:hover { background: var(--mm-primary-light); }

.pdp-specs h3 {
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mm-text-soft);
}
.pdp-specs table {
  width: 100%;
  border-collapse: collapse;
}
.pdp-specs th, .pdp-specs td {
  border: 1px solid var(--mm-border);
  padding: 8px 10px;
  font-size: 13px;
  text-align: left;
}
.pdp-specs th {
  background: var(--mm-bg-mute);
  width: 40%;
  color: var(--mm-text-soft);
  font-weight: 600;
}

.related { padding: 40px 0 0; }
.related h2 { font-size: 22px; margin-bottom: 16px; }
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.reviews-panel {
  margin-top: 28px;
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 24px;
}

.reviews-head,
.review-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.reviews-head h2 {
  font-size: 22px;
}

.review-summary {
  color: var(--mm-text-soft);
  font-size: 13px;
  font-weight: 800;
}

.review-form {
  display: grid;
  gap: 14px;
  margin-top: 18px;
  padding: 18px;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  background: var(--mm-bg-mute);
}

.review-form h3 {
  color: var(--mm-text);
  font-size: 16px;
}

.review-form label {
  display: grid;
  gap: 7px;
  color: var(--mm-text-soft);
  font-size: 13px;
  font-weight: 800;
}

.review-form select,
.review-form textarea {
  width: 100%;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  background: #fff;
  color: var(--mm-text);
  padding: 11px 12px;
}

.review-form textarea {
  resize: vertical;
}

.review-error,
.review-success,
.review-gate,
.review-empty {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  padding: 10px 12px;
}

.review-error {
  background: #fff5f5;
  border: 1px solid #ffd8d6;
  color: var(--mm-accent-red);
}

.review-success {
  background: #effcf6;
  border: 1px solid #bdf0d4;
  color: #13794c;
}

.review-gate,
.review-empty {
  margin-top: 16px;
  background: var(--mm-primary-light);
  border: 1px solid rgba(43, 190, 249, 0.22);
  color: var(--mm-primary-dark);
}

.review-submit {
  width: fit-content;
  min-width: 170px;
}

.review-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.review-item {
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  padding: 14px;
}

.review-item-head strong {
  color: var(--mm-text);
}

.review-item-head span {
  background: var(--mm-sale);
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  padding: 3px 7px;
}

.review-item p {
  color: var(--mm-text-soft);
  margin-top: 8px;
}

.review-item small {
  display: block;
  color: var(--mm-text-mute);
  margin-top: 8px;
}

.empty {
  background: #fff;
  border: 1px dashed var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 60px 20px;
  text-align: center;
  margin: 40px auto;
  color: var(--mm-text-soft);
}
.empty .link { color: var(--mm-primary); font-weight: 600; display: inline-block; margin-top: 10px; }

.auth-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
}

.auth-modal {
  width: min(100%, 430px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
  padding: 30px;
  text-align: center;
}

.auth-modal-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  border-radius: 18px;
  background: var(--mm-primary-light);
  color: var(--mm-primary-dark);
  font-size: 30px;
  font-weight: 900;
}

.auth-modal h2 {
  color: var(--mm-text);
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.auth-modal p {
  color: var(--mm-text-soft);
  font-size: 14.5px;
  line-height: 1.55;
  margin-bottom: 22px;
}

.auth-modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.auth-modal-actions button {
  height: 44px;
  border-radius: 10px;
  font-weight: 800;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.auth-modal-actions button:hover {
  transform: translateY(-1px);
}

.auth-modal-primary {
  background: var(--mm-primary);
  color: #fff;
  box-shadow: 0 10px 22px rgba(43, 190, 249, 0.25);
}

.auth-modal-primary:hover {
  background: var(--mm-primary-dark);
}

.auth-modal-secondary {
  background: #fff;
  border: 1px solid #d1d5db;
  color: var(--mm-primary-dark);
}

.auth-modal-secondary:hover {
  border-color: var(--mm-primary);
  background: var(--mm-primary-light);
}

.auth-modal-cancel {
  grid-column: 1 / -1;
  background: #f8fafc;
  color: var(--mm-text-soft);
}

.auth-modal-cancel:hover {
  background: #eef2f7;
}

.cart-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1001;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  max-width: min(420px, calc(100vw - 32px));
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #dbeafe;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
  color: var(--mm-text);
  font-size: 14px;
  font-weight: 800;
}

.cart-toast span {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #fff;
  font-weight: 900;
}

.cart-toast.success span {
  background: #10b981;
}

.cart-toast.error {
  border-color: #fecaca;
}

.cart-toast.error span {
  background: #ef4444;
}

.auth-modal-enter-active,
.auth-modal-leave-active,
.cart-toast-enter-active,
.cart-toast-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.auth-modal-enter-from,
.auth-modal-leave-to {
  opacity: 0;
}

.auth-modal-enter-from .auth-modal,
.auth-modal-leave-to .auth-modal {
  transform: translateY(12px) scale(0.97);
}

.cart-toast-enter-from,
.cart-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 900px) {
  .pdp-layout { grid-template-columns: 1fr; padding: 18px; gap: 22px; }
  .related-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .reviews-head { align-items: flex-start; flex-direction: column; }
  .related { padding: 28px 0 0; }
  .related h2 { font-size: 19px; }
  .reviews-panel { padding: 20px; }
  .review-form { padding: 14px; }
}

@media (max-width: 640px) {
  .pdp { padding: 16px 0 30px; }
  .pdp-layout { padding: 14px; border-radius: 10px; }
  .pdp-title { font-size: 20px; }
  .pdp-price { font-size: 24px; }
  .pdp-old { font-size: 14px; }
  .pdp-main-img { border-radius: 10px; }
  .pdp-thumbs button { width: 52px; height: 52px; padding: 4px; }
  .pdp-thumbs { gap: 6px; }
  .pdp-fav { top: 10px; right: 10px; width: 34px; height: 34px; }
  .pdp-actions { flex-direction: row; }
  .btn-primary, .btn-accent { padding: 11px 14px; font-size: 13px; }
  .breadcrumbs { font-size: 11.5px; flex-wrap: wrap; }
  .pdp-specs th, .pdp-specs td { padding: 6px 8px; font-size: 12px; }
  .qty-stepper button { width: 32px; height: 32px; font-size: 14px; }
  .qty-stepper span { min-width: 36px; }
  .review-submit { width: 100%; min-width: 0; }
}

@media (max-width: 380px) {
  .pdp-actions { flex-direction: column; }
  .pdp-title { font-size: 18px; }
  .pdp-price { font-size: 22px; }
  .related-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
}

@media (max-width: 560px) {
  .auth-modal {
    padding: 24px;
  }
  .auth-modal-actions {
    grid-template-columns: 1fr;
  }
  .auth-modal-cancel {
    grid-column: auto;
  }
  .cart-toast {
    right: 16px;
    bottom: 16px;
    min-width: 0;
    width: calc(100vw - 32px);
  }
}
</style>
