import request from '@/utils/request'
export const fetchList=(params:any) =>{
  return request({
    url:'/product/list',
    method:'get',
    params:params
  })
}

export const fetchSimpleList=(params:any) =>{
  return request({
    url:'/product/simpleList',
    method:'get',
    params:params
  })
}

export const updateDeleteStatus=(params:any) =>{
  return request({
    url:'/product/update/deleteStatus',
    method:'post',
    params:params
  })
}

export const updateNewStatus=(params:any) =>{
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}

export const updateRecommendStatus=(params:any) =>{
  return request({
    url:'/product/update/recommendStatus',
    method:'post',
    params:params
  })
}

export const updatePublishStatus=(params:any) =>{
  return request({
    url:'/product/update/publishStatus',
    method:'post',
    params:params
  })
}

export const createProduct=(data:any) =>{
  return request({
    url:'/product/create',
    method:'post',
    data:data
  })
}

export const updateProduct=(id:any,data:any) =>{
  return request({
    url:'/product/update/'+id,
    method:'post',
    data:data
  })
}

export const getProduct=(id:any) =>{
  return request({
    url:'/product/updateInfo/'+id,
    method:'get',
  })
}

