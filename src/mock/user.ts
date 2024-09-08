export default [
    // 用户登录
    {
        url: '/api/user/login',
        method: 'POST',
        response: (res: any) => {
            return {
                code: 200,
                message: 'success',
                data: {
                    token: 'token'
                }
            }
        }
    },
    // 获取用户信息
    {
        url: '/api/user/info',
        method: 'GET',
        response: (res: any) => {
            return {
                code: 200,
                message: 'success',
                data: {
                    id: "2467751560226270",
                    username: "昆吾kw",
                    avatar: "https://p3-passport.byteimg.com/img/user-avatar/3745b7eb198f2357155cd88eb7930f35~180x180.awebp",
                    description: "前端开发",
                }
            }
        }

    },
    // 退出登录
    {
        url: "/api/user/logout",
        method: "post",
        response: (res: any) => {
            return {
                code: 1,
                message: '密码错误',
                data: null
            }
        }
    },
    // 一个失败的请求
    {
        url: "/api/error",
        method: "get",
        response: (res: any) => {
            return {
                code: 1,
                message: '密码错误',
                data: null
            }
        }
    }

]