import request from '@/utils/request'

export const fetchList=(params:any)=>{
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

export const createRole=(data:any)=>{
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

export const updateRole=(id:any, data:any)=>{
  return request({
    url: '/role/update/' + id,
    method: 'post',
    data: data
  })
}

export const updateStatus=(id:any, params:any)=>{
  return request({
    url: '/role/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export const deleteRole=(data:any)=>{
  return request({
    url:'/role/delete',
    method:'post',
    data:data
  })
}

export const fetchAllRoleList=()=>{
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}

export const listMenuByRole=(roleId:any)=>{
  return request({
    url: '/role/listMenu/'+roleId,
    method: 'get'
  })
}

export const listResourceByRole=(roleId:any)=>{
  return request({
    url: '/role/listResource/'+roleId,
    method: 'get'
  })
}

export const allocMenu=(data:any)=>{
  return request({
    url: '/role/allocMenu',
    method: 'post',
    data:data
  })
}

export const allocResource=(data:any)=>{
  return request({
    url: '/role/allocResource',
    method: 'post',
    data:data
  })
}
