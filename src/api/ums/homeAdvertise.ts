import request from '@/utils/request'
export const fetchList=(params:any)=>{
  return request({
    url:'/home/advertise/list',
    method:'get',
    params:params
  })
}
export const updateStatus=(id:any,params:any)=>{
  return request({
    url:'/home/advertise/update/status/'+id,
    method:'post',
    params:params
  })
}
export const deleteHomeAdvertise=(data:any)=>{
  return request({
    url:'/home/advertise/delete',
    method:'post',
    data:data
  })
}
export const createHomeAdvertise=(data:any)=>{
  return request({
    url:'/home/advertise/create',
    method:'post',
    data:data
  })
}
export const getHomeAdvertise=(id:any)=>{
  return request({
    url:'/home/advertise/'+id,
    method:'get',
  })
}

export const updateHomeAdvertise=(id:any,data:any)=>{
  return request({
    url:'/home/advertise/update/'+id,
    method:'post',
    data:data
  })
}
