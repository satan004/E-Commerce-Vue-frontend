<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/modules/cart';
import { useAuthStore } from '@/store/modules/auth';
import { formatPrice } from '@/utils/currency';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const items = computed(() => cart.detailed);

onMounted(() => {
  if (auth.isAuthenticated) cart.loadCart();
});

function checkout() {
  router.push('/checkout');
}

function continueShopping() {
  router.push('/products');
}
</script>

<template>
  <div class="container page-pad">
    <h1>Shopping Cart</h1>

    <p v-if="items.length === 0" class="empty-state">
      Your cart is empty. <RouterLink to="/products">Browse products</RouterLink>.
    </p>

    <div v-else class="cart-layout">
      <section class="cart-items">
        <div class="cart-head">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span></span>
        </div>

        <div v-for="it in items" :key="it.productId" class="cart-row">
          <RouterLink :to="`/product/${it.product.slug}`" class="cart-prod">
            <img :src="it.product.image" :alt="it.product.name" />
            <div class="cart-prod-info">
              <p class="brand">{{ it.product.brand }}</p>
              <p class="name">{{ it.product.name }}</p>
            </div>
          </RouterLink>
          <span class="cell-price">{{ formatPrice(it.product.price) }}</span>
          <div class="qty">
            <button @click="cart.setQty(it.productId, it.qty - 1)" aria-label="Decrease">−</button>
            <span>{{ it.qty }}</span>
            <button @click="cart.setQty(it.productId, it.qty + 1)" aria-label="Increase">+</button>
          </div>
          <span class="cell-subtotal">{{ formatPrice(it.product.price * it.qty) }}</span>
          <button class="remove" aria-label="Remove" @click="cart.remove(it.productId)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>

        <div class="cart-foot">
          <button class="link" @click="continueShopping">← Continue shopping</button>
        </div>
      </section>

      <aside class="cart-summary">
        <h3>Order Summary</h3>
        <div class="line"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal) }}</span></div>
        <div class="line"><span>Shipping</span><span>{{ cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping) }}</span></div>
        <div v-if="cart.subtotal < 499" class="hint">
          Add {{ formatPrice(499 - cart.subtotal) }} more for free shipping.
        </div>
        <div class="line total"><span>Total</span><span>{{ formatPrice(cart.total) }}</span></div>
        <button class="checkout-btn" @click="checkout">Proceed to Checkout</button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page-pad { padding: 24px 20px 50px; }
h1 { font-size: 24px; font-weight: 700; margin-bottom: 18px; }
.empty-state {
  background: #fff;
  border: 1px dashed var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 50px 20px;
  text-align: center;
  color: var(--mm-text-soft);
}
.empty-state a { color: var(--mm-primary); font-weight: 600; }

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.cart-items {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 12px;
}

.cart-head {
  display: grid;
  grid-template-columns: 2.4fr 1fr 1fr 1fr 30px;
  padding: 8px 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mm-text-mute);
  font-weight: 600;
}

.cart-row {
  display: grid;
  grid-template-columns: 2.4fr 1fr 1fr 1fr 30px;
  align-items: center;
  border-top: 1px solid var(--mm-border);
  padding: 12px;
  font-size: 14px;
}

.cart-prod {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--mm-text);
}
.cart-prod:hover .name { color: var(--mm-primary); }

.cart-prod img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: #f7f9fc;
  border-radius: 8px;
  padding: 6px;
}

.cart-prod-info .brand {
  font-size: 11px;
  color: var(--mm-text-mute);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  font-weight: 600;
}
.cart-prod-info .name {
  font-weight: 500;
  font-size: 13.5px;
  line-height: 1.3;
}

.cell-price, .cell-subtotal { font-weight: 600; color: var(--mm-text); }

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--mm-border);
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}
.qty button {
  width: 28px;
  height: 28px;
  background: var(--mm-bg-mute);
  font-weight: 700;
}
.qty button:hover { background: var(--mm-primary-light); color: var(--mm-primary); }
.qty span {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
}

.remove {
  color: var(--mm-text-mute);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.remove:hover { background: #fde8e8; color: var(--mm-accent-red); }

.cart-foot {
  margin-top: 12px;
  padding: 8px 12px;
}
.link {
  color: var(--mm-primary);
  font-weight: 600;
  font-size: 13.5px;
}
.link:hover { text-decoration: underline; }

.cart-summary {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 20px;
  align-self: flex-start;
  position: sticky;
  top: 130px;
}
.cart-summary h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
}
.line {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  color: var(--mm-text-soft);
  padding: 6px 0;
}
.line.total {
  border-top: 1px solid var(--mm-border);
  margin-top: 8px;
  padding-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--mm-text);
}
.hint {
  margin: 8px 0;
  background: var(--mm-primary-light);
  color: var(--mm-primary);
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
}

.checkout-btn {
  width: 100%;
  margin-top: 14px;
  background: var(--mm-primary);
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}
.checkout-btn:hover { background: var(--mm-primary-dark); }

@media (max-width: 900px) {
  .cart-layout { grid-template-columns: 1fr; }
  .cart-head { display: none; }
  .cart-row {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .cart-prod { grid-column: 1 / -1; }
}
</style>
