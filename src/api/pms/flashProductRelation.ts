import request from '@/utils/request'
export const fetchList=(params:any)=>{
  return request({
    url:'/flashProductRelation/list',
    method:'get',
    params:params
  })
}
export const createFlashProductRelation=(data:any)=>{
  return request({
    url:'/flashProductRelation/create',
    method:'post',
    data:data
  })
}
export const deleteFlashProductRelation=(id:any)=>{
  return request({
    url:'/flashProductRelation/delete/'+id,
    method:'post'
  })
}
export const updateFlashProductRelation=(id:any,data:any)=>{
  return request({
    url:'/flashProductRelation/update/'+id,
    method:'post',
    data:data
  })
}
