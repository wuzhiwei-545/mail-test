import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: () => import(/* webpackChunkName: "inbox" */ '../views/Inbox')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
