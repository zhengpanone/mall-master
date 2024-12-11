<template>
  <el-container>
    <el-aside>
      <app-menu />
    </el-aside>
    <el-container>
      <el-header>
        <app-header />
      </el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import AppMenu from "./AppMenu/index.vue";
import AppHeader from "./AppHeader/index.vue";
</script>
<style scoped lang="scss">
@import "src/styles/mixin.scss";
.el-container {
  @include clearfix;
  // position: relative;
  // height: 100%;
  // width: 100%;
  // height: 100vh;

  .el-aside {
    background-color: #304156;
    width: auto;
  }

  .el-container {
    .el-header {
      background-color: #fff;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
    }
  }
}
</style>
