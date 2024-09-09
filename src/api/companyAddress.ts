import request from '@/utils/request'
export const fetchList=()=> {
  return request({
    url:'/companyAddress/list',
    method:'get'
  })
}
