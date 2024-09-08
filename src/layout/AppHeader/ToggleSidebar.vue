<template>
    <el-icon @click="store.setIsCollapse(!store.isCollapse)">
        <Expand v-if="store.isCollapse" />
        <Fold v-else="store.isCollapse" />
    </el-icon>
</template>
<script lang="ts" setup>
import {
    Fold, Expand
} from '@element-plus/icons-vue'
import { indexStore } from '@/store/index'
const store = indexStore()

</script>
<style scoped>
.el-icon {
    cursor: pointer;
}
</style>