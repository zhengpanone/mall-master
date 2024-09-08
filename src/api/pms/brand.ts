import request from '@/utils/request'
export const fetchList=(params:any)=> {
  return request({
    url:'/brand/list',
    method:'get',
    params:params
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

export const getBrand=(id:any)=> {
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

