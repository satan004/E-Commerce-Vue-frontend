import type { RouteRecordRaw } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

import HomePage from '@/pages/HomePage.vue';
import MoviePage from '@/pages/MoviePage.vue';
import NotFound from '@/pages/404.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        name: 'home',
        path: '',
        component: HomePage,
      },
      {
        name: 'movies',
        path: 'movies',
        component: MoviePage,
      },
    ],
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
];