<template>
    <el-space size="large">
        <toggle-sidebar />
        <breadcrumb />
    </el-space>
    <el-space size="large">
        <FullScreen />
        <UserInfo />
    </el-space>

</template>
<script lang="ts" setup>
import ToggleSidebar from './ToggleSidebar.vue';
import Breadcrumb from './Breadcrumb.vue';
import FullScreen from './FullScreen.vue';
import UserInfo from './UserInfo.vue';

</script>
<style scoped>

</style>