<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/modules/cart';
import { useAuthStore } from '@/store/modules/auth';
import { useOrdersStore } from '@/store/modules/orders';
import { formatPrice } from '@/utils/currency';

const cart = useCartStore();
const auth = useAuthStore();
const orders = useOrdersStore();
const router = useRouter();

const form = reactive({
  fullName: auth.user?.fullName ?? '',
  email: auth.user?.email ?? '',
  phone: auth.user?.phone ?? '',
  line1: auth.user?.address?.line1 ?? '',
  city: auth.user?.address?.city ?? '',
  state: auth.user?.address?.state ?? '',
  pincode: auth.user?.address?.pincode ?? '',
  payment: 'COD' as 'COD' | 'UPI' | 'Card',
});

const error = ref('');
const placing = ref(false);
const submitted = ref(false);

const touched = reactive({
  fullName: false,
  email: false,
  phone: false,
  line1: false,
  city: false,
  state: false,
  pincode: false,
});

const items = computed(() => cart.detailed);

type ShippingField = keyof typeof touched;

function fieldError(field: ShippingField): string {
  const value = String(form[field] ?? '').trim();

  if (!value) return 'This field is required.';
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Enter a valid email address.';
  }

  return '';
}

function showFieldState(field: ShippingField): boolean {
  return submitted.value || touched[field];
}

function isInvalid(field: ShippingField): boolean {
  return showFieldState(field) && !!fieldError(field);
}

function isValid(field: ShippingField): boolean {
  return showFieldState(field) && !fieldError(field);
}

function markTouched(field: ShippingField) {
  touched[field] = true;
}

function validateShipping(): boolean {
  submitted.value = true;
  (Object.keys(touched) as ShippingField[]).forEach((field) => {
    touched[field] = true;
  });

  return (Object.keys(touched) as ShippingField[]).every((field) => !fieldError(field));
}

async function placeOrder() {
  if (!auth.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/checkout' } });
    return;
  }
  if (items.value.length === 0) {
    error.value = 'Your cart is empty.';
    return;
  }
  if (!validateShipping()) {
    error.value = 'Please check the highlighted shipping fields.';
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
      fullName: form.fullName,
      email: form.email,
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
        <div class="shipping-card">
          <div class="shipping-head">
            <div class="shipping-title-icon" aria-hidden="true">&#128205;</div>
            <div>
              <h2>Shipping Address</h2>
              <p>Please enter your delivery information carefully.</p>
            </div>
          </div>

          <div class="shipping-grid">
            <div class="shipping-field">
              <label for="checkout-full-name">&#128100; Full Name</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('fullName'), valid: isValid('fullName') }">
                <span aria-hidden="true">&#128100;</span>
                <input
                  id="checkout-full-name"
                  v-model="form.fullName"
                  type="text"
                  placeholder="John Smith"
                  autocomplete="name"
                  required
                  @blur="markTouched('fullName')"
                />
              </div>
              <small v-if="isInvalid('fullName')" class="field-error">{{ fieldError('fullName') }}</small>
            </div>

            <div class="shipping-field">
              <label for="checkout-email">&#9993;&#65039; Email</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('email'), valid: isValid('email') }">
                <span aria-hidden="true">&#9993;&#65039;</span>
                <input
                  id="checkout-email"
                  v-model="form.email"
                  type="email"
                  placeholder="john@example.com"
                  autocomplete="email"
                  required
                  @blur="markTouched('email')"
                />
              </div>
              <small v-if="isInvalid('email')" class="field-error">{{ fieldError('email') }}</small>
            </div>

            <div class="shipping-field">
              <label for="checkout-phone">&#128222; Phone</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('phone'), valid: isValid('phone') }">
                <span aria-hidden="true">&#128222;</span>
                <input
                  id="checkout-phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+855 12 345 678"
                  autocomplete="tel"
                  required
                  @blur="markTouched('phone')"
                />
              </div>
              <small v-if="isInvalid('phone')" class="field-error">{{ fieldError('phone') }}</small>
            </div>

            <div class="shipping-field">
              <label for="checkout-city">&#127961; City</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('city'), valid: isValid('city') }">
                <span aria-hidden="true">&#127961;</span>
                <input
                  id="checkout-city"
                  v-model="form.city"
                  type="text"
                  placeholder="Phnom Penh"
                  autocomplete="address-level2"
                  required
                  @blur="markTouched('city')"
                />
              </div>
              <small v-if="isInvalid('city')" class="field-error">{{ fieldError('city') }}</small>
            </div>

            <div class="shipping-field full">
              <label for="checkout-address">&#128205; Address</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('line1'), valid: isValid('line1') }">
                <span aria-hidden="true">&#128205;</span>
                <input
                  id="checkout-address"
                  v-model="form.line1"
                  type="text"
                  placeholder="House No. 123, Street 310"
                  autocomplete="street-address"
                  required
                  @blur="markTouched('line1')"
                />
              </div>
              <small v-if="isInvalid('line1')" class="field-error">{{ fieldError('line1') }}</small>
            </div>

            <div class="shipping-field">
              <label for="checkout-state">&#127758; State</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('state'), valid: isValid('state') }">
                <span aria-hidden="true">&#127758;</span>
                <input
                  id="checkout-state"
                  v-model="form.state"
                  type="text"
                  placeholder="Phnom Penh"
                  autocomplete="address-level1"
                  required
                  @blur="markTouched('state')"
                />
              </div>
              <small v-if="isInvalid('state')" class="field-error">{{ fieldError('state') }}</small>
            </div>

            <div class="shipping-field">
              <label for="checkout-postal-code">&#128238; Postal Code</label>
              <div class="input-wrap" :class="{ invalid: isInvalid('pincode'), valid: isValid('pincode') }">
                <span aria-hidden="true">&#128238;</span>
                <input
                  id="checkout-postal-code"
                  v-model="form.pincode"
                  type="text"
                  placeholder="120101"
                  autocomplete="postal-code"
                  required
                  @blur="markTouched('pincode')"
                />
              </div>
              <small v-if="isInvalid('pincode')" class="field-error">{{ fieldError('pincode') }}</small>
            </div>
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
            <span class="si-price">{{ formatPrice(it.product.price * it.qty) }}</span>
          </div>
        </div>

        <div class="line"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal) }}</span></div>
        <div class="line"><span>Shipping</span><span>{{ cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping) }}</span></div>
        <div class="line total"><span>Total</span><span>{{ formatPrice(cart.total) }}</span></div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button class="place-btn" :disabled="placing" @click="placeOrder">
          {{ placing ? 'Placing order...' : `Place Order - ${formatPrice(cart.total)}` }}
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

.shipping-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  padding: 32px;
  margin-bottom: 18px;
}

.shipping-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 26px;
}

.shipping-title-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: var(--mm-primary-light);
  color: #2563eb;
  font-size: 22px;
}

.shipping-head h2 {
  color: #111827;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
}

.shipping-head p {
  color: #6b7280;
  font-size: 15px;
  margin-top: 6px;
}

.shipping-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.shipping-field {
  min-width: 0;
}

.shipping-field.full {
  grid-column: 1 / -1;
}

.shipping-field label {
  display: block;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.input-wrap {
  position: relative;
}

.input-wrap > span {
  position: absolute;
  left: 16px;
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
  font-size: 16px;
  line-height: 1;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  height: 50px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 15px;
  padding: 0 16px 0 48px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
}

.input-wrap input::placeholder {
  color: #9ca3af;
}

.input-wrap:hover input {
  border-color: #93c5fd;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.06);
}

.input-wrap input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
}

.input-wrap.valid input {
  border-color: #10b981;
}

.input-wrap.valid input:focus {
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.14);
}

.input-wrap.invalid input {
  border-color: #ef4444;
  background: #fffbfb;
}

.input-wrap.invalid input:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.14);
}

.field-error {
  display: block;
  color: #dc2626;
  font-size: 12.5px;
  font-weight: 700;
  margin-top: 7px;
}

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
  .shipping-card { padding: 24px; }
  .shipping-grid, .row.two, .row.three { grid-template-columns: 1fr; }
  .shipping-head h2 { font-size: 24px; }
}

@media (max-width: 560px) {
  .page-pad { padding: 18px 14px 42px; }
  .shipping-card {
    padding: 20px;
    border-radius: 14px;
  }
  .shipping-head {
    gap: 12px;
    margin-bottom: 22px;
  }
  .shipping-title-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .shipping-head h2 { font-size: 22px; }
  .shipping-head p { font-size: 14px; }
}
</style>

