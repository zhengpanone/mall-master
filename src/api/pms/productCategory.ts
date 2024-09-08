import request from '@/utils/request'
export const fetchList=(parentId:any,params:any) =>{
  return request({
    url:'/productCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
export const deleteProductCate=(id:any)=> {
  return request({
    url:'/productCategory/delete/'+id,
    method:'post'
  })
}

export const createProductCate=(data:any)=> {
  return request({
    url:'/productCategory/create',
    method:'post',
    data:data
  })
}

export const updateProductCate=(id:any,data:any)=> {
  return request({
    url:'/productCategory/update/'+id,
    method:'post',
    data:data
  })
}

export const getProductCate=(id:any)=> {
  return request({
    url:'/productCategory/'+id,
    method:'get',
  })
}

export const updateShowStatus=(data:any)=> {
  return request({
    url:'/productCategory/update/showStatus',
    method:'post',
    data:data
  })
}

export const updateNavStatus=(data:any)=> {
  return request({
    url:'/productCategory/update/navStatus',
    method:'post',
    data:data
  })
}

export const fetchListWithChildren=()=> {
  return request({
    url:'/productCategory/list/withChildren',
    method:'get'
  })
}
