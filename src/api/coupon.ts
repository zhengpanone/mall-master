/**
 * 优惠券
 */
import request from '@/utils/request'
export const fetchList=(params:any)=> {
  return request({
    url:'/coupon/list',
    method:'get',
    params:params
  })
}

export const createCoupon=(data:any) =>{
  return request({
    url:'/coupon/create',
    method:'post',
    data:data
  })
}

export const getCoupon=(id:any) =>{
  return request({
    url:'/coupon/'+id,
    method:'get',
  })
}

export const updateCoupon=(id:any,data:any) =>{
  return request({
    url:'/coupon/update/'+id,
    method:'post',
    data:data
  })
}

export const deleteCoupon=(id:any) =>{
  return request({
    url:'/coupon/delete/'+id,
    method:'post',
  })
}
