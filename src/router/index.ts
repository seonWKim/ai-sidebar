// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: 'index.html',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: 'index.html',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/SidePanel.vue'),
      },
      {
        path: 'landing.html',
        name: 'Landing',
        component: () => import('@/views/About.vue')
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
