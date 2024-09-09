import request from '@/utils/request'

export const fetchList=(parentId:any, params:any)=>{
  return request({
    url: '/menu/list/' + parentId,
    method: 'get',
    params: params
  })
}

export const deleteMenu=(id:any)=>{
  return request({
    url: '/menu/delete/' + id,
    method: 'post'
  })
}

export const createMenu=(data:any)=>{
  return request({
    url: '/menu/create',
    method: 'post',
    data: data
  })
}

export const updateMenu=(id:any, data:any)=>{
  return request({
    url: '/menu/update/' + id,
    method: 'post',
    data: data
  })
}

export const getMenu=(id:any)=>{
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

export const updateHidden=(id:any, params:any)=>{
  return request({
    url: '/menu/updateHidden/' + id,
    method: 'post',
    params: params
  })
}

export const fetchTreeList=()=>{
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

