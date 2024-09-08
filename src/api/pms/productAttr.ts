import request from '@/utils/request'
export const fetchList=(cid:any,params:any)=> {
  return request({
    url:'/productAttribute/list/'+cid,
    method:'get',
    params:params
  })
}

export const deleteProductAttr=(data:any)=> {
  return request({
    url:'/productAttribute/delete',
    method:'post',
    data:data
  })
}

export const createProductAttr=(data:any)=> {
  return request({
    url:'/productAttribute/create',
    method:'post',
    data:data
  })
}

export const updateProductAttr=(id:any,data:any)=> {
  return request({
    url:'/productAttribute/update/'+id,
    method:'post',
    data:data
  })
}
export const getProductAttr=(id:any)=> {
  return request({
    url:'/productAttribute/'+id,
    method:'get'
  })
}

export const getProductAttrInfo=(productCategoryId:any)=> {
  return request({
    url:'/productAttribute/attrInfo/'+productCategoryId,
    method:'get'
  })
}
