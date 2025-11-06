import { createRouter, createWebHistory } from 'vue-router';

// Guest (public) pages
import Home from '@/views/guest/Home.vue';
import Login from '@/views/guest/Login.vue';
import Register from '@/views/guest/Register.vue';

// Private (authenticated) pages can be added here
import { PATH, ROUTES } from '@/constants/common';
import Dashboard from '@/views/private/Dashboard.vue';

const routes = [
  {
    path: ROUTES.BASE,
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false, layout: PATH.PUBLIC },
  },
  {
    path: ROUTES.LOGIN,
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, layout: PATH.PUBLIC },
  },
  {
    path: ROUTES.REGISTER,
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false, layout: PATH.PUBLIC },
  },
  {
    path: ROUTES.DASHBOARD,
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, layout: PATH.PRIVATE },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards can be added here if needed

router.beforeEach((to, _from, next) => {
  const user = router.authUser ?? null;

  const requiresAuth = to.matched.some((rec) => rec.meta?.requiresAuth);

  if (requiresAuth && !user) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  const isPublicAuthPage = to.name === 'Login' || to.name === 'Register' || to.name === 'Home';
  if (user && isPublicAuthPage) {
    if (to.name !== 'Dashboard') {
      return next({ name: 'Dashboard' });
    }
  }

  return next();
});

export default router;
