import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '@/store/modules/auth';
import { loginRedirect } from '@/utils/authRedirect';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth !== true) return true;

  const auth = useAuthStore();
  if (!auth.isAuthenticated && auth.token) {
    await auth.loadProfile();
  }

  if (!auth.isAuthenticated) {
    return loginRedirect(to.fullPath);
  }

  return true;
});

export default router;
