import request from '@/utils/request'

let goodsUrl = "http://127.0.0.1:18022"
export const fetchList=(params:any)=>  {
  return request({
    url:goodsUrl+'/v1/goods/productAttribute/category/list',
    method:'get',
    params:params
  })
}

export const createProductAttrCate=(data:any)=>  {
  return request({
    url:goodsUrl+'/v1/goods/productAttribute/category/create',
    method:'post',
    data:data
  })
}

export const deleteProductAttrCate=(id:any)=>  {
  return request({
    url:goodsUrl+'/v1/goods/productAttribute/category/delete/'+id,
    method:'get'
  })
}

export const updateProductAttrCate=(id:any,data:any)=>  {
  return request({
    url:goodsUrl+'/v1/goods/productAttribute/category/update/'+id,
    method:'post',
    data:data
  })
}
export const fetchListWithAttr=()=> {
  return request({
    url:goodsUrl+'/v1/goods/productAttribute/category/list/withAttr',
    method:'get'
  })
}
