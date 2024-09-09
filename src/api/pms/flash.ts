/**
 * 秒杀
 */

import request from '@/utils/request'
export const fetchList=(params:any) =>{
  return request({
    url:'/flash/list',
    method:'get',
    params:params
  })
}
export const updateStatus=(id:any,params:any)=> {
  return request({
    url:'/flash/update/status/'+id,
    method:'post',
    params:params
  })
}
export const deleteFlash=(id:any) =>{
  return request({
    url:'/flash/delete/'+id,
    method:'post'
  })
}
export const createFlash=(data:any)=> {
  return request({
    url:'/flash/create',
    method:'post',
    data:data
  })
}
export const updateFlash=(id:any,data:any)=> {
  return request({
    url:'/flash/update/'+id,
    method:'post',
    data:data
  })
}
