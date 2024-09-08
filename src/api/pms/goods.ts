import request from '@/utils/request'

let host = 'http://shop.projectsedu.com';
let baseUrl = "http://39.107.30.137:8000"
let goodsUrl = "http://127.0.0.1:18022"
let orderUrl = "http://127.0.0.1:8023"
let userUrl = "http://127.0.0.1:18021"
let userOpUrl = "http://127.0.0.1:8027"
export let ossUrl = "http://127.0.0.1:8029"
// 分类
export const getCategoryList=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/category/list',
    method:'get',
    params:params
  })
}
export const getCategoryDetail=(id:any)=> {
  return request({
    url:goodsUrl+'/v1/categorys/'+id,
    method:'get'
  })
}
export const postCategorys=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/categorys',
    method:'post',
    data:params
  })
}
export const putCategorys=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/categorys/'+id,
    method:'put',
    data:params
  })
}
export const deleteCategorys=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/categorys/'+id,
    method:'delete',
    data:params
  })
}
// 品牌
export const getBrands=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/brand/list',
    method:'get',
    params:params
  })
}
export const getBrandsByCate=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/category-brand/'+id,
    method:'get',
    params:params
  })
}
export const createBrand=(data:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/brands',
    method:'post',
    data:data
  })
}
export const putBrands=(id:any,params:any) =>{
  return request({
    url:goodsUrl+'/brands/'+id,
    method:'put',
    data:params
  })
}
export const deleteBrands=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/brands/'+id,
    method:'delete',
    data:params
  })
}
// 品牌+分类关系
export const getBrandToCate=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/category-brand/list',
    method:'get',
    params:params
  })
}

export const getBrandToCateDetail=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/category-brand/'+id,
    method:'get',
    params:params
  })
}
export const createBrandToCate=(data:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/category-brand',
    method:'post',
    data:data
  })
}
export const putBrandToCate=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/category-brand/'+id,
    method:'put',
    data:params
  })
}
export const deleteBrandToCate=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/category-brand/'+id,
    method:'delete',
    data:params
  })
}
// 商品管理
export const getGoods=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/goods/list',
    method:'get',
    params:params
  })
}
export const getGoodsEach=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/goods/list'+params,
    method:'get',
  })
}

export const createGoods=(data:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/goods/create',
    method:'post',
    data:data
  })
}
export const putGoods=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/'+id,
    method:'put',
    data:params
  })
}
export const deleteGoods=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/'+id,
    method:'delete',
    data:params
  })
}
export const putGoodsStatus=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/goods/'+id,
    method:'patch',
    data:params
  })
}



// 订单
export const getOrder=(params:any)=> {
  return request({
    url:orderUrl+'/o/v1/orders',
    method:'get',
    params:params
  })
}
export const getOrderEach=(id:any,params:any)=> {
  return request({
    url:orderUrl+'/o/v1/orders/'+id,
    method:'get',
    params:params
  })
}

export const createOrder=(data:any)=> {
  return request({
    url:orderUrl+'/orders',
    method:'post',
    data:data
  })
}
export const putOrder=(id:any,params:any)=> {
  return request({
    url:orderUrl+'/orders/'+id,
    method:'put',
    data:params
  })
}
export const deleteOrder=(id:any,params:any)=> {
  return request({
    url:orderUrl+'/orders/'+id,
    method:'delete',
    data:params
  })
}

// 留言
export const getMessage=(params:any)=> {
  return request({
    url:userOpUrl+'/up/v1/message',
    method:'get',
    params:params
  })
}

export const createMessage=(data:any)=> {
  return request({
    url:userOpUrl+'/message',
    method:'post',
    data:data
  })
}
export const putMessage=(id:any,params:any)=> {
  return request({
    url:userOpUrl+'/message/'+id,
    method:'put',
    data:params
  })
}
export const deleteMessage=(id:any,params:any) =>{
  return request({
    url:userOpUrl+'/message/'+id,
    method:'delete',
    data:params
  })
}
// 收藏
export const getUserFav=(params:any)=> {
  return request({
    url:userOpUrl+'/userfav',
    method:'get',
    params:params
  })
}

export const createUserFav=(data:any)=> {
  return request({
    url:userOpUrl+'/userfav',
    method:'post',
    data:data
  })
}
export const putUserFav=(id:any,params:any)=> {
  return request({
    url:userOpUrl+'/userfav/'+id,
    method:'put',
    data:params
  })
}
export const deleteUserfav=(id:any,params:any)=> {
  return request({
    url:userOpUrl+'/userfav/'+id,
    method:'delete',
    data:params
  })
}
//用户地址、
export const getAddress=(params:any)=> {
  return request({
    url:userOpUrl+'/up/v1/address',
    method:'get',
    params:params
  })
}
export const getAddressEach=(params:any)=> {
  return request({
    url:userOpUrl+'/address',
    method:'get',
    params:params
  })
}

export const createAddress=(data:any)=> {
  return request({
    url:userOpUrl+'/address',
    method:'post',
    data:data
  })
}
export const putAddress=(id:any,params:any)=> {
  return request({
    url:userOpUrl+'/address/'+id,
    method:'put',
    data:params
  })
}
export const deleteAddress=(id:any,params:any) =>{
  return request({
    url:userOpUrl+'/address/'+id,
    method:'delete',
    data:params
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
    url:goodsUrl+'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export const deleteBrand=(id:any) =>{
  return request({
    url:goodsUrl+'/brand/delete/'+id,
    method:'get',
  })
}

export const getBrand=(id:any)=> {
  return request({
    url:goodsUrl+'/brand/'+id,
    method:'get',
  })
}

export const updateBrand=(id:any,data:any)=> {
  return request({
    url:goodsUrl+'/brand/update/'+id,
    method:'post',
    data:data
  })
}


export const getBanners=(params:any)=> {
  return request({
    url:goodsUrl+'/v1/banners',
    method:'get',
    params:params
  })
}

export const createBanner=(data:any) =>{
  return request({
    url:goodsUrl+'/v1/banners',
    method:'post',
    data:data
  })
}
export const putBanner=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/banners/'+id,
    method:'put',
    data:params
  })
}
export const deleteBanners=(id:any,params:any)=> {
  return request({
    url:goodsUrl+'/v1/banners/'+id,
    method:'delete',
    data:params
  })
}
