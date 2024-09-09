import request from '@/utils/request'
export const fetchList=(params:any)=>{
  return request({
    url:'/order/list',
    method:'get',
    params:params
  })
}

export const closeOrder=(params:any)=>{
  return request({
    url:'/order/update/close',
    method:'post',
    params:params
  })
}

export const deleteOrder=(params:any)=>{
  return request({
    url:'/order/delete',
    method:'post',
    params:params
  })
}

export const deliveryOrder=(data:any)=>{
  return request({
    url:'/order/update/delivery',
    method:'post',
    data:data
  });
}

export const getOrderDetail=(id:any)=>{
  return request({
    url:'/order/'+id,
    method:'get'
  });
}

export const updateReceiverInfo=(data:any)=>{
  return request({
    url:'/order/update/receiverInfo',
    method:'post',
    data:data
  });
}

export const updateMoneyInfo=(data:any)=>{
  return request({
    url:'/order/update/moneyInfo',
    method:'post',
    data:data
  });
}

export const updateOrderNote=(params:any)=>{
  return request({
    url:'/order/update/note',
    method:'post',
    params:params
  })
}
