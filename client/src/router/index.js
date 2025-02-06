// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const financeRoutes = [
  {
    path: '/Finance',
    name: 'Finance',
    component: () => import('@/pages/TabsMonth.vue'),
    meta: { title: 'Финансы' },
  },
  {
    path: '/FinanceSumMonth',
    name: 'FinanceSumMonth',
    component: () => import('@/pages/FinanceSumMonth.vue'),
    meta: { title: 'Итоги месяца' },
  },
]

const chartRoutes = [
  {
    path: '/Chart',
    name: 'Chart',
    component: () => import('@/pages/ChartData.vue'),
    meta: { title: 'График данных' },
  },
]

const depositRoutes = [
  {
    path: '/Deposit',
    name: 'Deposit',
    component: () => import('@/pages/Deposit.vue'),
    meta: { title: 'Депозиты' },
  },
]

const authRoutes = [
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: 'Вход' },
  },
]

const errorRoutes = [
  {
    path: '/:catchAll(.*)',
    name: 'Error404',
    component: () => import('@/views/404.vue'),
    meta: { title: 'Ошибка 404' },
  },
]

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/modules/editor-finance/Home.vue'),
    meta: { title: 'Главная' },
  },
  ...financeRoutes,
  ...chartRoutes,
  ...depositRoutes,
  ...authRoutes,
  ...errorRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const defaultTitle = 'Моё приложение'
  document.title = to.meta.title || defaultTitle
  next()
})

export default router
