import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/permission',
  name: 'permission',
  component: RouterView,
  meta: {
    title: '权限管理',
  },
  children: [
    {
      path: 'admin',
      name: 'admin',
      component: () => import('@/views/permission/admin/index.vue'),
      meta: {
        // 自定义元数据
        title: '管理员',
      },
    },
  ],
}

export default routes
