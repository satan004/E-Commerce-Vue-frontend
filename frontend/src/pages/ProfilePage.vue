<script setup lang="ts">
import { reactive, ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { useOrdersStore } from '@/store/modules/orders';
import { useWishlistStore } from '@/store/modules/wishlist';
import { useCartStore } from '@/store/modules/cart';

const auth = useAuthStore();
const orders = useOrdersStore();
const wishlist = useWishlistStore();
const cart = useCartStore();
const router = useRouter();

const form = reactive({
  fullName: auth.user?.fullName ?? '',
  email: auth.user?.email ?? '',
  phone: auth.user?.phone ?? '',
  line1: auth.user?.address?.line1 ?? '',
  city: auth.user?.address?.city ?? '',
  state: auth.user?.address?.state ?? '',
  pincode: auth.user?.address?.pincode ?? '',
});

const saving = ref(false);
const saved = ref(false);
const selectedAvatar = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const removeAvatar = ref(false);

const initials = computed(() => {
  if (!auth.user?.fullName) return '?';
  return auth.user.fullName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});
const profileImage = computed(() => {
  if (removeAvatar.value) return null;
  return avatarPreview.value || auth.user?.avatarUrl || null;
});

watch(selectedAvatar, (_next, previous) => {
  if (avatarPreview.value && previous) URL.revokeObjectURL(avatarPreview.value);
  avatarPreview.value = selectedAvatar.value ? URL.createObjectURL(selectedAvatar.value) : null;
});

onBeforeUnmount(() => {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
});

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  selectedAvatar.value = input.files?.[0] ?? null;
  if (selectedAvatar.value) removeAvatar.value = false;
}

function clearAvatar() {
  selectedAvatar.value = null;
  removeAvatar.value = true;
}

async function save() {
  saving.value = true;
  try {
    await auth.updateProfileWithAvatar({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      avatar: selectedAvatar.value,
      removeAvatar: removeAvatar.value,
      address: {
        line1: form.line1,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
    });
    selectedAvatar.value = null;
    removeAvatar.value = false;
    saved.value = true;
    setTimeout(() => (saved.value = false), 2000);
  } finally {
    saving.value = false;
  }
}

async function logout() {
  await auth.logout();
  cart.clear();
  wishlist.clear();
  orders.clear();
  router.push('/');
}
</script>

<template>
  <div v-if="auth.isAuthenticated && auth.user" class="container page-pad">
    <div class="profile-head">
      <div class="profile-card">
        <div class="avatar">
          <img v-if="profileImage" :src="profileImage" :alt="auth.user.fullName" />
          <span v-else>{{ initials }}</span>
        </div>
        <div>
          <h1>{{ auth.user.fullName }}</h1>
          <p>{{ auth.user.email }}</p>
        </div>
      </div>

      <div class="stats">
        <RouterLink to="/orders" class="stat">
          <span class="stat-num">{{ orders.orders.length }}</span>
          <span class="stat-label">Orders</span>
        </RouterLink>
        <RouterLink to="/wishlist" class="stat">
          <span class="stat-num">{{ wishlist.count }}</span>
          <span class="stat-label">Wishlist</span>
        </RouterLink>
        <RouterLink to="/cart" class="stat">
          <span class="stat-num">{{ cart.itemCount }}</span>
          <span class="stat-label">In Cart</span>
        </RouterLink>
      </div>
    </div>

    <div class="profile-grid">
      <section class="form-card">
        <h3>Account Information</h3>
        <form @submit.prevent="save">
          <div class="profile-photo-editor">
            <div class="avatar large">
              <img v-if="profileImage" :src="profileImage" :alt="form.fullName || 'Profile picture'" />
              <span v-else>{{ initials }}</span>
            </div>
            <div class="photo-actions">
              <label class="photo-upload">
                <span>Choose profile picture</span>
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" @change="onAvatarChange" />
              </label>
              <button v-if="profileImage" type="button" class="btn-light" @click="clearAvatar">
                Remove picture
              </button>
              <small>PNG, JPG, or WebP up to 2MB.</small>
            </div>
          </div>

          <div class="row two">
            <label>
              <span>Full name</span>
              <input v-model="form.fullName" type="text" required />
            </label>
            <label>
              <span>Email</span>
              <input v-model="form.email" type="email" required />
            </label>
          </div>
          <label>
            <span>Phone</span>
            <input v-model="form.phone" type="tel" />
          </label>

          <h3 style="margin-top: 20px">Default address</h3>
          <label>
            <span>Address</span>
            <input v-model="form.line1" type="text" />
          </label>
          <div class="row three">
            <label>
              <span>City</span>
              <input v-model="form.city" type="text" />
            </label>
            <label>
              <span>State</span>
              <input v-model="form.state" type="text" />
            </label>
            <label>
              <span>Pincode</span>
              <input v-model="form.pincode" type="text" />
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Saving…' : 'Save Changes' }}
            </button>
            <span v-if="saved" class="saved-tag">✓ Saved</span>
          </div>
        </form>
      </section>

      <aside class="side-card">
        <h3>Quick links</h3>
        <ul>
          <li><RouterLink to="/orders">📦  My Orders</RouterLink></li>
          <li><RouterLink to="/wishlist">❤️  My Wishlist</RouterLink></li>
          <li><RouterLink to="/cart">🛒  My Cart</RouterLink></li>
          <li><RouterLink to="/products">🛍️  Continue Shopping</RouterLink></li>
        </ul>
        <button class="btn-logout" @click="logout">Logout</button>
      </aside>
    </div>
  </div>

  <div v-else class="container empty-state page-pad">
    <p>You need to sign in to view your profile.</p>
    <RouterLink to="/login" class="link">Sign in</RouterLink>
  </div>
</template>

<style scoped>
.page-pad { padding: 24px 20px 50px; }
.empty-state {
  background: #fff;
  border: 1px dashed var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 60px 20px;
  text-align: center;
  color: var(--mm-text-soft);
}
.empty-state .link { color: var(--mm-primary); font-weight: 600; }

.profile-head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  margin-bottom: 22px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2bbef9, #1aa7e6);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  overflow: hidden;
  flex: 0 0 auto;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar.large { width: 88px; height: 88px; font-size: 28px; }
.profile-card h1 { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
.profile-card p { color: var(--mm-text-soft); font-size: 13.5px; }

.stats {
  display: flex;
  gap: 10px;
}
.stat {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 14px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  color: var(--mm-text);
  transition: border-color 0.2s, color 0.2s;
}
.stat:hover { border-color: var(--mm-primary); color: var(--mm-primary); }
.stat-num { font-size: 22px; font-weight: 800; }
.stat-label { font-size: 12px; color: var(--mm-text-soft); }

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 22px;
}

.form-card {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 22px;
}
.form-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 14px; }

.profile-photo-editor {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  background: var(--mm-bg-mute);
  padding: 14px;
  margin-bottom: 18px;
}

.photo-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.photo-actions small {
  flex-basis: 100%;
  color: var(--mm-text-mute);
  font-size: 12px;
  font-weight: 600;
}

.photo-upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  cursor: pointer;
}

.photo-upload > span,
.btn-light {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 800;
  padding: 9px 12px;
}

.photo-upload > span {
  background: var(--mm-primary);
  color: #fff;
}

.photo-upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.btn-light {
  background: #fff;
  border: 1px solid var(--mm-border);
  color: var(--mm-text-soft);
}

.btn-light:hover { border-color: var(--mm-primary); color: var(--mm-primary); }

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

.form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.btn-primary {
  background: var(--mm-primary);
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}
.btn-primary:hover { background: var(--mm-primary-dark); }
.btn-primary:disabled { opacity: 0.7; }

.saved-tag { color: var(--mm-sale); font-weight: 600; font-size: 13px; }

.side-card {
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 18px;
  align-self: flex-start;
}
.side-card h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--mm-text-soft); margin-bottom: 12px; }
.side-card ul li + li { margin-top: 4px; }
.side-card ul a {
  display: block;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13.5px;
  color: var(--mm-text);
}
.side-card ul a:hover { background: var(--mm-primary-light); color: var(--mm-primary); }

.btn-logout {
  margin-top: 14px;
  width: 100%;
  background: #fff;
  color: var(--mm-accent-red);
  border: 1.5px solid #fde0de;
  padding: 9px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13.5px;
}
.btn-logout:hover { background: #fde8e8; }

@media (max-width: 900px) {
  .profile-head { grid-template-columns: 1fr; }
  .stats { width: 100%; }
  .stat { flex: 1; }
  .profile-grid { grid-template-columns: 1fr; }
  .row.two, .row.three { grid-template-columns: 1fr; }
  .profile-photo-editor { align-items: flex-start; flex-direction: column; }
}
</style>
