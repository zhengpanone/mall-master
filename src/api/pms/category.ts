import request from "@/utils/request"
import { IResponseData } from "../types/common"
import { CategoryData, ICategoryParam } from "./types/category"

let goodsUrl = "http://127.0.0.1:18022"
// 获取商品分类列表
export const getCategoryList = (params: ICategoryParam) => {
  return request<IResponseData<[CategoryData]>>({
    url: goodsUrl + '/v1/goods/category/list',
    method: 'get',
    params: params
  })
}

export const deleteCategorys = (id: any, params: any) => {
  return request({
    url: goodsUrl + '/v1/categorys/' + id,
    method: 'delete',
    data: params
  })
}

export const putCategorys = (id: any, params: any) => {
  return request({
    url: goodsUrl + '/v1/categorys/' + id,
    method: 'put',
    data: params
  })
}