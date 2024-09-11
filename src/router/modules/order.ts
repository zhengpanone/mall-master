import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/oms',
  name: 'oms',
  component: RouterView,
  meta: {
    title: '订单',
    icon: 'order'
  },
  children: [
    {
      path: 'order_list',
      name: 'orderList',
      component: () => import('@/views/oms/order/index.vue'),
      meta: {
        // 自定义元数据
        title: '订单列表',
        icon: 'product-list'
      },
    },{
      path: 'order_detail',
      name: 'orderDetail',
      component: () => import('@/views/oms/order/orderDetail.vue'),
      meta: {
        // 自定义元数据
        title: '订单详情',
        hidden: true
      },
    }
    
  ],
}

export default routes