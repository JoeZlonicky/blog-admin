import EditPostView from './views/EditPostView.vue';
import HomeView from './views/HomeView.vue';
import PageNotFoundView from './views/PageNotFoundView.vue';
import PostView from './views/PostView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/post/:postId',
      name: 'post',
      component: PostView,
    },
    {
      path: '/edit-post/:postId',
      name: 'edit-post',
      component: EditPostView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'page-not-found',
      component: PageNotFoundView,
    },
  ],
});

export { router };
