// In your router/index.js or where your routes are configured
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    fetch('/api/admin/verify')
      .then(response => response.json())
      .then(data => {
        console.log("Admin status:", data.admin);
        if (data.admin) {
          next();
        } else {
          next({ path: '/' });
          alert('You are not authorized to view this page.');
        }
      })
      .catch(error => {
        console.error('Error verifying admin status:', error);
        next('/');
      });
  } else {
    next();
  }
});

export default router;
