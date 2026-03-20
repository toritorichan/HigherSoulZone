import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/introduce', name: 'introduce', component: () => import('../views/IntroduceView.vue') },
  { path: '/alien-types', name: 'alienTypes', component: () => import('../views/AlienTypesView.vue') },
  { path: '/authors', name: 'authors', component: () => import('../views/AuthorsView.vue') },
  { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
  { path: '/form', name: 'form', component: () => import('../views/FormView.vue') },
  { path: '/dead', name: 'dead', component: () => import('../views/DeadSiteView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
