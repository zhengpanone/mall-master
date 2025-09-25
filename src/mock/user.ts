import mockJS from 'mockjs'

const userList = mockJS.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [
        {
            // 随机生成id号
            id: '@id',
            // 随机生成中文姓名
            name: '@cname',
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            // 随机生成ip地址
            ip: '@ip',
            // 随机生成省市区地址
            address: '@county(true)',
            // 随机生成邮政编码
            zip: '@zip',
            // 随机生成18-70之间的年龄
            "age|18-70": 20,
            // 随机生成日期
            date: '@date("yyyy-MM-dd")',
            // 随机生成头像
            avatar: "@image('200x200')",
        }
    ]
})

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
                code: 200,
                message: '退出成功',
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