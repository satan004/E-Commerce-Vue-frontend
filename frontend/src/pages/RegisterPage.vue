<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
});

const error = ref('');
const submitting = ref(false);

function submit() {
  if (submitting.value) return;
  error.value = '';
  submitting.value = true;
  try {
    const result = auth.register({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      password: form.password,
    });
    if (!result.ok) {
      error.value = result.error ?? 'Registration failed.';
      submitting.value = false;
      return;
    }
    router.push('/');
  } catch (e) {
    error.value = (e as Error).message || 'Unexpected error.';
    submitting.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Create Account</h1>
      <p class="auth-sub">Join MegaMart for exclusive deals and faster checkout.</p>

      <form @submit.prevent="submit" novalidate>
        <label>
          <span>Full Name</span>
          <input v-model="form.fullName" type="text" placeholder="John Doe" autocomplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" />
        </label>
        <label>
          <span>Phone (optional)</span>
          <input v-model="form.phone" type="tel" placeholder="+91 9000000000" autocomplete="tel" />
        </label>
        <label>
          <span>Password</span>
          <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password" />
        </label>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button type="submit" class="auth-submit" :disabled="submitting">
          {{ submitting ? 'Creating…' : 'Create Account' }}
        </button>
      </form>

      <p class="auth-foot">
        Already have an account?
        <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: #fff;
  border: 1px solid var(--mm-border);
  border-radius: var(--mm-radius);
  padding: 32px 28px;
  box-shadow: var(--mm-shadow-sm);
}

h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.auth-sub { color: var(--mm-text-soft); font-size: 13.5px; margin-bottom: 22px; }

form label { display: block; margin-bottom: 14px; }
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
form input:focus {
  outline: none;
  border-color: var(--mm-primary);
  background: #fff;
}

.auth-error {
  color: var(--mm-accent-red);
  font-size: 13px;
  margin: 4px 0 12px;
}

.auth-submit {
  width: 100%;
  background: var(--mm-primary);
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
}
.auth-submit:hover { background: var(--mm-primary-dark); }
.auth-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.auth-foot {
  margin-top: 18px;
  text-align: center;
  color: var(--mm-text-soft);
  font-size: 13.5px;
}
.auth-foot a { color: var(--mm-primary); font-weight: 600; }
.auth-foot a:hover { text-decoration: underline; }
</style>