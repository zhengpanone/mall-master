import request from '@/utils/request'

let userUrl = "http://127.0.0.1:18021"
// 用户列表
export function getUserList(params) {
  return request({
    url:userUrl+'/v1/user/list',
    method:'get',
    params:params
  })
}