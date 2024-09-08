export interface IResponseData<T> {
  code: number
  msg: string
  data: T
}
/**
 * 登录接口参数
 */
export interface ILoginData {
  account: string
  pwd: string
  imgCode: string
}
export interface ILoginInfo {
  slide: string[]
  logoSquare: string
  logoRectangle: string
  loginLogo: string
}

export interface IUserInfo {
  id: number
  account: string
  head_pic: string
}

export interface IMenu {
  path: string
  title: string
  icon: string
  header: string
  is_header: number
  children?: IMenu[]
}

export interface ILoginRresponse {
  token: string
  expires_time: number
  menus: IMenu[]
  unique_auth: string[]
  userInfo: IUserInfo
  logo: string
  logo_square: string
  version: string
  newOrderAudioLink: string
}

export interface IDict {
  code: string
  name: string
}
