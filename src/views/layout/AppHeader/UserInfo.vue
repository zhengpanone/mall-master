<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ store.user?.account }}
      <el-icon class="el-icon--right">
        <ArrowDown />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { ArrowDown } from "@element-plus/icons-vue";
import { indexStore } from "@/store/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { logout } from "@/api/login";
import { useRouter } from "vue-router";

const router = useRouter();
const store = indexStore();
const handleLogout = () => {
  // 退出提示
  ElMessageBox.confirm("确认退出吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      // 确认发出退出请求
      await logout();
      // 跳转到登录页
      store.setUser(null);
      ElMessage({
        type: "success",
        message: "退出成功",
      });
      router.push({ name: "login" });
    })
    .catch(() => {
      ElMessage({
        type: "success",
        message: "已取消退出",
      });
    });
};
</script>
<style scoped></style>
