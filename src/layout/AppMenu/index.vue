<template>
    <el-menu active-text-color="#ffd04b" background-color="#304156" default-active="2" text-color="#fff"
        :collapse="store.isCollapse" router>
        <el-menu-item index="/">
            <el-icon>
                <icon-menu />
            </el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="/product">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>商品</span>
            </template>
            <el-menu-item index="/product/product_list">商品列表</el-menu-item>
            <el-menu-item index="/product/product_classify">商品分类</el-menu-item>
            <el-menu-item index="/product/product_attr">商品规格</el-menu-item>
            <el-menu-item index="/product/product_reply">商品评论</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/product">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>订单</span>
            </template>
            <el-menu-item index="">订单列表</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <span>媒体</span>
        </el-menu-item>
        <el-sub-menu index="/">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>权限</span>
            </template>
            <el-menu-item index="/permission/admin">管理员</el-menu-item>
            <el-menu-item index="/">角色</el-menu-item>
            <el-menu-item index="/">权限规则</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>
<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { indexStore } from '@/store/index'
const store = indexStore()

</script>
<style scoped lang="scss">
.el-menu {
    border-right: none;
}

.el-menu:not(.el-menu--collapse) {
    width: 200px;
    height: 100vh;
}
</style>