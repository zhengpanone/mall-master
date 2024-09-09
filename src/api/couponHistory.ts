import request from '@/utils/request'
export const fetchList=(params:any)=> {
  return request({
    url:'/couponHistory/list',
    method:'get',
    params:params
  })
}
