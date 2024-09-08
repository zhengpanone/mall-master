import request from '@/utils/request'
let userUrl = "http://127.0.0.1:18021"

export const login=(params:any) =>{
  return request({
    url:userUrl+'/v1/user/pwd_login',
    method:'post',
    data:params
  })
}

export const getCaptcha=()=> {
  return request({
    url:userUrl+'/v1/base/captcha',
    method:'get'
  })
}

export const createBrand=(data:any)=> {
  return request({
    url:'/brand/create',
    method:'post',
    data:data
  })
}
export const updateShowStatus=(data:any)=> {
  return request({
    url:'/brand/update/showStatus',
    method:'post',
    data:data
  })
}

export const updateFactoryStatus=(data:any)=> {
  return request({
    url:'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export const deleteBrand=(id:any) =>{
  return request({
    url:'/brand/delete/'+id,
    method:'get',
  })
}

export const getBrand=(id:any) =>{
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}

export const updateBrand=(id:any,data:any)=> {
  return request({
    url:'/brand/update/'+id,
    method:'post',
    data:data
  })
}

