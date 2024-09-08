import Cookies from "js-cookie";

const SupportKey='supportKey' as const;

export const getSupport=()=> {
  return Cookies.get(SupportKey)
}

export const setSupport=(isSupport:any)=> {
  return Cookies.set(SupportKey, isSupport,{ expires: 3 })
}

export const setCookie=(key:any,value:any,expires:any)=> {
  return Cookies.set(key, value,{ expires: expires})
}

export const getCookie=(key:any)=> {
  return Cookies.get(key)
}