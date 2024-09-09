import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/ums',
  name: 'ums',
  component: RouterView,
  meta: {
    title: '权限管理',
  },
  children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index.vue'),
        meta: {title: '用户列表', icon: 'ums-admin'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index.vue'),
        meta: {title: '角色列表', icon: 'ums-role'}
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu.vue'),
        meta: {title: '分配菜单' ,hidden: true},
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource.vue'),
        meta: {title: '分配资源',hidden: true},
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index.vue'),
        meta: {title: '菜单列表', icon: 'ums-menu'}
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add.vue'),
        meta: {title: '添加菜单', hidden: true},
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update.vue'),
        meta: {title: '修改菜单',hidden: true},
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index.vue'),
        meta: {title: '资源列表', icon: 'ums-resource'}
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList.vue'),
        meta: {title: '资源分类', hidden: true},
      }
  ],
}
export default routes


