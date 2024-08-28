import LogInView from './views/LogInView.vue';
import PageNotFoundView from './views/PageNotFoundView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'log-in',
      component: LogInView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'page-not-found',
      component: PageNotFoundView,
    },
  ],
});

export { router };
