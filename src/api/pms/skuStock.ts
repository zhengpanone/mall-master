import request from '@/utils/request'
export const fetchList=(pid:any,params:any)=> {
  return request({
    url:'/sku/'+pid,
    method:'get',
    params:params
  })
}

export const update=(pid:any,data:any)=> {
  return request({
    url:'/sku/update/'+pid,
    method:'post',
    data:data
  })
}
