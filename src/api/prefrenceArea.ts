import request from '@/utils/request'
export const fetchList=() =>{
  return request({
    url:'/prefrenceArea/listAll',
    method:'get',
  })
}
