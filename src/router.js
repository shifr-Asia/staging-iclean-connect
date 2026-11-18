import { createRouter, createWebHistory } from 'vue-router'
import { isGuest } from './marketplace/store'

const M = (name) => () => import(`./marketplace/pages/${name}.vue`)

const routes = [
  { path: '/', component: () => import('./pages/Landing.vue') },
  { path: '/crm', component: () => import('./pages/CrmApp.vue') },
  { path: '/marketplace', component: M('Home') },
  { path: '/marketplace/produk/:slug', component: M('SiteProduct') },
  { path: '/marketplace/p/:slug', component: M('ProductDetail') },
  { path: '/marketplace/keranjang', component: M('Cart') },
  { path: '/marketplace/masuk', component: M('Login') },
  { path: '/marketplace/daftar', component: M('Register') },
  { path: '/marketplace/checkout', component: M('Checkout'), meta: { auth: true } },
  { path: '/marketplace/pesanan', component: M('Orders') },
  { path: '/marketplace/pesanan/:id', component: M('OrderDetail') },
  { path: '/marketplace/penawaran/:id', redirect: (to) => `/marketplace/pesanan/${to.params.id}` },
  { path: '/marketplace/akun', component: M('Account') },
  { path: '/marketplace/sales', component: M('SalesConsole') },
  { path: '/marketplace/integrasi', component: M('Integration') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (to.meta.auth && isGuest.value) return { path: '/marketplace/masuk', query: { redirect: to.fullPath } }
})
