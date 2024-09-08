/**
 * 公共基础接口封装
 */
import request from '@/utils/request'
import { IResponseData, ILoginInfo, ILoginRresponse, ILoginData } from './types/common'

export const getLoginInfo = () => {
  return request<IResponseData<ILoginInfo>>({
    method: 'GET',
    url: '/api/user/login/info',
  })
}
/**
 * 获取图片验证码
 * @returns 返回图片验证码
 */
export const getCaptcha = () => {
  return request<Blob>({
    method: 'GET',
    url: '/api/verify/getCode',
    params: { stamp: Date.now() },
    responseType: 'blob',
  })
}

export const login = (data: ILoginData) => {
  return request<IResponseData<ILoginRresponse>>({
    method: 'POST',
    url: '/api/user/login',
    data,
  })
}

export const logout = () => {
  return request<IResponseData<null>>({
    method: 'POST',
    url: '/api/user/logout',
    headers: {
      Authorization: 'Bearer token',
    },
  })
}
