import request from '@/utils/request'
import { Admin, AdminPostData, IListParams } from './types/admin'
import { IDict, IResponseData } from './types/common'

export const getAdmins = (params: IListParams) => {
  return request<
    IResponseData<{
      total: number
      list: Admin[]
    }>
  >({
    method: 'GET',
    url: '/api/setting/admin',
    params: params,
  })
}
/**
 * 创建管理员
 * @param data
 * @returns
 */
export const createAdmin = (data: AdminPostData) => {
  return request<IResponseData<null>>({
    method: 'POST',
    url: '/api/setting/admin',
    data: data,
  })
}
/**
 * 修改管理员
 * @param id 管理员ID
 * @param data 要更新的数据
 * @returns
 */
export const updateAdmin = (id: string, data: AdminPostData) => {
  return request<IResponseData<null>>({
    method: 'PUT',
    url: `/api/setting/admin/${id}`,
    data: data,
  })
}

export const deleteAdmin = (id: string) => {
  return request<IResponseData<null>>({
    method: 'DELETE',
    url: `/api/setting/admin/${id}`,
  })
}

export const getAdmin = (id: string) => {
  return request<IResponseData<AdminPostData>>({
    method: 'GET',
    url: `/api/setting/admin/:${id}/edit`,
  })
}

export const updateAdminStatus = (id: string, status: number) => {
  return request<IResponseData<null>>({
    method: 'PUT',
    url: `/api/setting/admin/status/${id}/status/${status}`,
  })
}

export const getRoles = () => {
  return request<IResponseData<[IDict]>>({
    method: 'GET',
    url: '/api/setting/admin/roles',
  })
}
