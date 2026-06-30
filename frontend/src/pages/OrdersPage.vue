<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/store/modules/orders';
import { formatPrice } from '@/utils/currency';
import type { Order } from '@/data/types';

const orders = useOrdersStore();
const route = useRoute();

const expanded = ref<string | null>(null);

const justPlacedId = computed(() => (route.query.just as string) || '');

onMounted(() => {
  orders.loadOrders();
  if (justPlacedId.value) expanded.value = justPlacedId.value;
});

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id;
}

function statusColor(status: Order['status']): string {
  switch (status) {
    case 'Processing':
      return 'var(--mm-warn)';
    case 'Shipped':
      return 'var(--mm-primary)';
    case 'Delivered':
      return 'var(--mm-sale)';
    case 'Cancelled':
      return 'var(--mm-accent-red)';
    default:
      return 'var(--mm-text-mute)';
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
</script>

<template>
  <div class="container page-pad">
    <h1>My Orders</h1>

    <p v-if="orders.orders.length === 0" class="empty-state">
      You haven't placed any orders yet. <RouterLink to="/products">Start shopping</RouterLink>.
    </p>

    <div v-else class="orders-list">
      <article
        v-for="order in orders.orders"
        :key="order.id"
        class="order"
        :class="{ expanded: expanded === order.id, just: justPlacedId === order.id }"
      >
        <header class="order-head" @click="toggle(order.id)">
          <div class="oh-cell">
            <p class="oh-label">Order ID</p>
            <p class="oh-value">{{ order.id }}</p>
          </div>
          <div class="oh-cell">
            <p class="oh-label">Date</p>
            <p class="oh-value">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="oh-cell">
            <p class="oh-label">Total</p>
            <p class="oh-value">{{ formatPrice(order.total) }}</p>
          </div>
          <div class="oh-cell">
            <p class="oh-label">Status</p>
            <span class="status" :style="{ background: statusColor(order.status) }">{{ order.status }}</span>
          </div>
          <button class="oh-toggle" aria-label="Toggle details">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: expanded === order.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </header>

        <div v-if="expanded === order.id" class="order-body">
          <p v-if="justPlacedId === order.id" class="just-banner">✓ Order placed successfully!</p>

          <div class="order-items">
            <div v-for="(it, idx) in order.items" :key="idx" class="oi-row">
              <img :src="it.image" :alt="it.name" />
              <div class="oi-info">
                <p class="oi-name">{{ it.name }}</p>
                <p class="oi-meta">Qty: {{ it.qty }} × {{ formatPrice(it.price) }}</p>
              </div>
              <span class="oi-price">{{ formatPrice(it.qty * it.price) }}</span>
            </div>
          </div>

          <div class="order-grid">
            <div>
              <h4>Shipping address</h4>
              <p>{{ order.address.fullName }}</p>
              <p>{{ order.address.line1 }}</p>
              <p>{{ order.address.city }}, {{ order.address.state }} - {{ order.address.pincode }}</p>
              <p>Phone: {{ order.address.phone }}</p>
            </div>
            <div>
              <h4>Payment</h4>
              <p>{{ order.payment }}</p>
              <h4 style="margin-top: 12px">Order summary</h4>
              <p>Subtotal: {{ formatPrice(order.subtotal) }}</p>
              <p>Shipping: {{ order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) }}</p>
              <p class="strong">Total: {{ formatPrice(order.total) }}</p>
            </div>
          </div>
        </div>
      </article>
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

.orders-list { display: flex; flex-direction: column; gap: 14px; }

.order {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.order:hover { box-shadow: var(--mm-shadow-sm); }
.order.just { border-color: var(--mm-primary); }

.order-head {
  display: grid;
  grid-template-columns: 1.4fr 1.4fr 1fr 1fr 30px;
  gap: 12px;
  align-items: center;
  padding: 16px 18px;
  cursor: pointer;
  user-select: none;
}

.oh-label {
  font-size: 11px;
  color: var(--mm-text-mute);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.oh-value { font-size: 13.5px; font-weight: 600; color: var(--mm-text); }

.status {
  display: inline-block;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.oh-toggle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--mm-text-soft);
}
.oh-toggle:hover { background: var(--mm-bg-mute); color: var(--mm-text); }

.order-body {
  padding: 0 18px 18px;
  border-top: 1px solid var(--mm-border);
}

.just-banner {
  margin-top: 14px;
  background: #e8f7ee;
  color: var(--mm-sale);
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 8px;
}

.order-items { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.oi-row {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
  background: var(--mm-bg-mute);
  padding: 10px;
  border-radius: 8px;
}
.oi-row img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  background: #fff;
  border-radius: 6px;
  padding: 4px;
}
.oi-name { font-size: 13.5px; font-weight: 500; }
.oi-meta { font-size: 12px; color: var(--mm-text-mute); margin-top: 2px; }
.oi-price { font-weight: 700; }

.order-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--mm-border);
}
.order-grid h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mm-text-soft);
  margin-bottom: 6px;
}
.order-grid p { font-size: 13px; color: var(--mm-text); margin-bottom: 2px; }
.order-grid p.strong { font-weight: 700; font-size: 14px; }

@media (max-width: 768px) {
  .order-head { grid-template-columns: 1fr 1fr; }
  .order-grid { grid-template-columns: 1fr; }
}
</style>
