<template>
  <el-dialog
    ref="dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="50%">
    <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="confirmLoading">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { IElDialog } from '@/types/element-plus'

/* interface EmitsType {
  (e: 'confirm'): void
}
const emit = defineEmits<EmitsType>() */

const props = defineProps({
  confirm: {
    type: Function as PropType<() => Promise<void>>,
    default: () => Promise.resolve(),
  },
})

const dialog = ref<IElDialog | null>(null)
const confirmLoading = ref(false)
// 操作组件实例的visible属性
const handleCancel = () => {
  if (dialog.value) {
    dialog.value.visible = false
  }
}
const handleConfirm = async () => {
  confirmLoading.value = true
  // emit('confirm')
  await props.confirm().finally(() => {
    confirmLoading.value = false
  })
}
</script>
<style scoped></style>
