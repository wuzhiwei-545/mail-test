import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/detail/:seqno',
    name: 'Detail',
    component: () => import('@/views/Detail')
  },
  {
    path: '/send',
    name: 'Send',
    component: () => import('@/views/SendMail')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
