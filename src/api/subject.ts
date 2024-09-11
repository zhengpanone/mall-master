import request from '@/utils/request'
export const fetchListAll=()=> {
  return request({
    url:'/subject/listAll',
    method:'get',
  })
}

export const fetchList=(params:object)=> {
  return request({
    url:'/subject/list',
    method:'get',
    params:params
  })
}
