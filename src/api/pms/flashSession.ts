import request from '@/utils/request'

export const fetchList=(params:any)=>{
  return request({
    url: '/flashSession/list',
    method: 'get',
    params: params
  })
}

export const fetchSelectList=(params:any)=>{
  return request({
    url: '/flashSession/selectList',
    method: 'get',
    params: params
  })
}

export const updateStatus=(id:any, params:any)=>{
  return request({
    url: '/flashSession/update/status/' + id,
    method: 'post',
    params: params
  })
}

export const deleteSession=(id:any)=>{
  return request({
    url: '/flashSession/delete/' + id,
    method: 'post'
  })
}

export const createSession=(data:any)=>{
  return request({
    url: '/flashSession/create',
    method: 'post',
    data: data
  })
}

export const updateSession=(id:any, data:any)=>{
  return request({
    url: '/flashSession/update/' + id,
    method: 'post',
    data: data
  })
}
