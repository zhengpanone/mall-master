import request from '@/utils/request'
export const fetchList=(params:any)=>  {
  return request({
    url:'/productAttribute/category/list',
    method:'get',
    params:params
  })
}

export const createProductAttrCate=(data:any)=>  {
  return request({
    url:'/productAttribute/category/create',
    method:'post',
    data:data
  })
}

export const deleteProductAttrCate=(id:any)=>  {
  return request({
    url:'/productAttribute/category/delete/'+id,
    method:'get'
  })
}

export const updateProductAttrCate=(id:any,data:any)=>  {
  return request({
    url:'/productAttribute/category/update/'+id,
    method:'post',
    data:data
  })
}
export const fetchListWithAttr=()=> {
  return request({
    url:'/productAttribute/category/list/withAttr',
    method:'get'
  })
}
