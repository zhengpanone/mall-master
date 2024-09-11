import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse,InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { indexStore } from '@/store/'
import router from '@/router/'
// import eventEmiter from './eventEmiter'
// 创建实例
const request: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASEURL,
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>)=> {
    // 统一设置用户身份 token
    const store = indexStore()
    const user = store.$state.user
    if (user && user.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${user.token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false
// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const store = indexStore()
    // 统一处理接口响应错误,如token过期、服务端异常
    const status = response.data.code

    if (!status || status === 200) {
      // 正确情况
      return Promise.resolve(response)
    }
    // 登录过期
    if (status === 410000) {
      if (isRefreshing) return Promise.reject(response)
      isRefreshing = true
      // token过期
      // eventEmiter.emit('API:UN_AUTH');
      ElMessageBox.confirm(
        '你的登录已经过期,您可以取消停留在此页面,或确认重新登录',
        '登录过期',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }
      )
        .then(() => {
          // 清除本地过期的登录状态
          store.setUser(null)
          // 跳转的登录页面
          router.push({
            name: 'login',
            query: {
              redirect: router.currentRoute.value.fullPath,
            },
          })
        })
        .finally(() => {
          isRefreshing = false
        })
      return Promise.reject(response)
    }/**else if(status===400){
      eventEmiter.emit('API:VALIDATE_ERROR',response.data.data)
    }*/

    ElMessage.error(response.data.msg || '请求失败,请联系管理员')
    // 手动返回promise异常
    return Promise.reject(response)
  },
  (error: AxiosError) => {
    // eventEmiter.emit('API:UN_AUTH')
    // 处理响应错误
    let errorMessage = '发生未知错误';
    if (error.response) {
      // 服务器响应了一个错误
      const responseData = error.response.data;
    // 类型检查和断言
    if (typeof responseData === 'string') {
      errorMessage = responseData;
    } else if (typeof responseData === 'object' && responseData !== null) {
      if ('msg' in responseData) {
        errorMessage = (responseData as { msg: string }).msg;
      } else if ('message' in responseData) {
        errorMessage = (responseData as { message: string }).message;
      }
    }
     
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '请求失败，服务器未响应';
    } else {
      // 其他错误
      errorMessage = error.message;
    }
    ElMessage({
      message: errorMessage,
      type: 'error',
      duration: 1000
    });
    return Promise.reject(error)
  }
)




export default <T = any>(config: AxiosRequestConfig) => {
  return request(config).then((res) => {
    return res.data as T
  })
}
