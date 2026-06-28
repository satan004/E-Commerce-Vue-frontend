<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/modules/cart';
import { useAuthStore } from '@/store/modules/auth';
import { useOrdersStore } from '@/store/modules/orders';

const cart = useCartStore();
const auth = useAuthStore();
const orders = useOrdersStore();
const router = useRouter();

const form = reactive({
  fullName: auth.user?.fullName ?? '',
  phone: auth.user?.phone ?? '',
  line1: auth.user?.address?.line1 ?? '',
  city: auth.user?.address?.city ?? '',
  state: auth.user?.address?.state ?? '',
  pincode: auth.user?.address?.pincode ?? '',
  payment: 'COD' as 'COD' | 'UPI' | 'Card',
});

const error = ref('');
const placing = ref(false);

const items = computed(() => cart.detailed);

async function placeOrder() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/checkout' } });
    return;
  }
  if (items.value.length === 0) {
    error.value = 'Your cart is empty.';
    return;
  }
  if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
    error.value = 'Please fill in all shipping fields.';
    return;
  }

  error.value = '';
  placing.value = true;

  try {
    const newOrder = await orders.placeOrder({
      items: items.value.map((it) => ({
        productId: it.productId,
        name: it.product.name,
        image: it.product.image,
        price: it.product.price,
        qty: it.qty,
      })),
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      address: {
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      payment: form.payment,
    });

    await auth.updateProfile({
      phone: form.phone,
      address: {
        line1: form.line1,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
    });

    cart.clear();
    router.push(`/orders?just=${newOrder.id}`);
  } catch (e: any) {
    error.value = e?.message ?? 'Unable to place order.';
  } finally {
    placing.value = false;
  }
}
</script>

<template>
  <div class="container page-pad">
    <h1>Checkout</h1>

    <p v-if="items.length === 0" class="empty-state">
      Your cart is empty. <RouterLink to="/products">Continue shopping</RouterLink>.
    </p>

    <div v-else class="checkout-layout">
      <section class="checkout-form">
        <div class="form-card">
          <h3>Shipping address</h3>
          <div class="row two">
            <label>
              <span>Full name</span>
              <input v-model="form.fullName" type="text" required />
            </label>
            <label>
              <span>Phone</span>
              <input v-model="form.phone" type="tel" required />
            </label>
          </div>
          <label>
            <span>Address</span>
            <input v-model="form.line1" type="text" placeholder="House no., street, area" required />
          </label>
          <div class="row three">
            <label>
              <span>City</span>
              <input v-model="form.city" type="text" required />
            </label>
            <label>
              <span>State</span>
              <input v-model="form.state" type="text" required />
            </label>
            <label>
              <span>Pincode</span>
              <input v-model="form.pincode" type="text" required />
            </label>
          </div>
        </div>

        <div class="form-card">
          <h3>Payment method</h3>
          <div class="payment-options">
            <label class="payment" :class="{ active: form.payment === 'COD' }">
              <input v-model="form.payment" type="radio" value="COD" />
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay in cash when your order arrives.</p>
              </div>
            </label>
            <label class="payment" :class="{ active: form.payment === 'UPI' }">
              <input v-model="form.payment" type="radio" value="UPI" />
              <div>
                <strong>UPI</strong>
                <p>Pay using any UPI app at delivery.</p>
              </div>
            </label>
            <label class="payment" :class="{ active: form.payment === 'Card' }">
              <input v-model="form.payment" type="radio" value="Card" />
              <div>
                <strong>Credit / Debit Card</strong>
                <p>Pay securely with your card.</p>
              </div>
            </label>
          </div>
        </div>
      </section>

      <aside class="checkout-summary">
        <h3>Order Summary</h3>
        <div class="summary-items">
          <div v-for="it in items" :key="it.productId" class="summary-item">
            <img :src="it.product.image" :alt="it.product.name" />
            <div class="summary-item-info">
              <p class="si-name">{{ it.product.name }}</p>
              <p class="si-meta">Qty: {{ it.qty }}</p>
            </div>
            <span class="si-price">₹{{ (it.product.price * it.qty).toLocaleString('en-IN') }}</span>
          </div>
        </div>

        <div class="line"><span>Subtotal</span><span>₹{{ cart.subtotal.toLocaleString('en-IN') }}</span></div>
        <div class="line"><span>Shipping</span><span>{{ cart.shipping === 0 ? 'FREE' : '₹' + cart.shipping.toLocaleString('en-IN') }}</span></div>
        <div class="line total"><span>Total</span><span>₹{{ cart.total.toLocaleString('en-IN') }}</span></div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button class="place-btn" :disabled="placing" @click="placeOrder">
          {{ placing ? 'Placing order…' : `Place Order • ₹${cart.total.toLocaleString('en-IN')}` }}
        </button>
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

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.form-card {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 22px;
  margin-bottom: 18px;
}

.form-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
}

form label { display: block; margin-bottom: 12px; }
form label span {
  display: block;
  font-size: 12.5px;
  color: var(--mm-text-soft);
  margin-bottom: 6px;
  font-weight: 600;
}
form input {
  width: 100%;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--mm-bg-mute);
  font-size: 14px;
}
form input:focus { outline: none; border-color: var(--mm-primary); background: #fff; }

.row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.row.three { display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 12px; }

.payment-options { display: flex; flex-direction: column; gap: 10px; }
.payment {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border: 1.5px solid var(--mm-border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.payment:hover { border-color: var(--mm-primary-light); }
.payment.active { border-color: var(--mm-primary); background: var(--mm-primary-light); }
.payment input { margin-top: 3px; accent-color: var(--mm-primary); }
.payment strong { font-size: 14px; color: var(--mm-text); }
.payment p { font-size: 12.5px; color: var(--mm-text-soft); margin-top: 2px; }

.checkout-summary {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 22px;
  align-self: flex-start;
  position: sticky;
  top: 130px;
}
.checkout-summary h3 { font-size: 16px; font-weight: 700; margin-bottom: 14px; }

.summary-items { display: flex; flex-direction: column; gap: 12px; max-height: 280px; overflow-y: auto; }
.summary-item {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 10px;
  align-items: center;
}
.summary-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: #f7f9fc;
  border-radius: 6px;
  padding: 4px;
}
.si-name {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.si-meta { font-size: 11px; color: var(--mm-text-mute); margin-top: 2px; }
.si-price { font-size: 13px; font-weight: 700; }

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

.auth-error {
  color: var(--mm-accent-red);
  font-size: 13px;
  margin: 6px 0;
}

.place-btn {
  width: 100%;
  background: var(--mm-primary);
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  margin-top: 14px;
}
.place-btn:hover { background: var(--mm-primary-dark); }
.place-btn:disabled { opacity: 0.7; cursor: not-allowed; }

@media (max-width: 900px) {
  .checkout-layout { grid-template-columns: 1fr; }
  .row.two, .row.three { grid-template-columns: 1fr; }
}
</style>
