import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/product',
  name: 'pms',
  component: RouterView,
  meta: {
    title: '商品',
    icon: 'product'
  },
  children: [
    {
      path: 'product_list',
      name: 'product_list',
      component: () => import('@/views/pms/product/index.vue'),
      meta: {
        // 自定义元数据
        title: '商品列表',
        icon: 'product-list'
      },
    },
    {
      path: 'product_category',
      name: 'product_category',
      component: () => import('@/views/pms/productCategory/index.vue'),
      meta: {
        title: '商品分类',
      },
    },
    {
      path: 'product_attr',
      name: 'product_attr',
      component: () => import('@/views/pms/productAttr/index.vue'),
      meta: {
        title: '商品类型',
      },
    },
    /*{
      path: 'product_reply',
      name: 'product_reply',
      component: () => import('@/views/pms/reply/index.vue'),
      meta: {
        title: '商品评论',
      },
    },*/
  ],
}

export default routes
