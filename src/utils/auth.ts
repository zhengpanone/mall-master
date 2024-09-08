const TokenKey = 'loginToken'

export const getToken=() =>{
  return localStorage.getItem(TokenKey)
}

export const setToken=(token:string) =>{
  return localStorage.setItem(TokenKey,token)
}

export const removeToken=()=> {
  return localStorage.removeItem(TokenKey)

}
