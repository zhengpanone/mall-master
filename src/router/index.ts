import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import ProductRoutes from './modules/product'
import UmsRoutes from './modules/ums'
import AppLayout from '@/layout/AppLayout.vue'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { indexStore } from '@/store/index'

// import eventEmiter from '@/utils/eventEmiter'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
        },
      },
      ProductRoutes,
      UmsRoutes,
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
] // 路由规则

const router = createRouter({
  history: createWebHashHistory(), // 路由模式
  routes,
})
// 全局前置守卫
/*router.beforeEach((to, from) => {
  const store = indexStore()
  if (to.meta.requireAuth && !store.$state.user) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
  nprogress.start()
})*/

router.afterEach(() => {
  nprogress.done()
})

// eventEmiter.on('API:UN_AUTH',()=>{
//   router.push('/')
// })

export default router
