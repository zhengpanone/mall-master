<template>
  <app-dialog-form
    :title="props.adminId ? '编辑管理员' : '添加管理员'"
    :confirm="handleSubmit"
    @closed="handleDialogClose"
    @open="handleDialogOpen">
    <template #default="scope">
      <el-form
        ref="form"
        label-position="right"
        label-width="120px"
        :model="formData"
        :rules="formRules"
        v-loading="formLoading">
        <el-form-item label="管理员账号" prop="account">
          <el-input v-model="formData.account" placeholder="请输入管理员账号" />
        </el-form-item>
        <el-form-item label="管理员密码" prop="pwd">
          <el-input v-model="formData.pwd" placeholder="请输入管理员密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confPwd">
          <el-input v-model="formData.confPwd" placeholder="请输入确认密码" />
        </el-form-item>
        <el-form-item label="管理员姓名" prop="realName">
          <el-input
            v-model="formData.realName"
            placeholder="请输入管理员姓名" />
        </el-form-item>
        <el-form-item label="管理员身份" prop="roles">
          <el-select
            v-model="formData.roles"
            multiple
            placeholder="请选择管理员身份"
            style="width: 100%">
            <el-option
              v-for="item in roles"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">开启</el-radio>
            <el-radio label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </app-dialog-form>
</template>
<script lang="ts" setup>
import { IDict } from '@/api/types/common'
import { AdminPostData } from '@/api/types/admin'
import { IElForm, IFormRule } from '@/types/element-plus'
import { PropType, ref, reactive } from 'vue'
import { getRoles, getAdmin, createAdmin, updateAdmin } from '@/api/admin'
import { ElMessage } from 'element-plus'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const roles = ref<[IDict] | []>([])
const formData = ref<AdminPostData>({
  account: '',
  pwd: '',
  confPwd: '',
  roles: [] as number[],
  status: 0 as 0 | 1,
  realName: '',
})

const formRules = reactive<IFormRule>({
  account: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { min: 3, max: 60, message: '管理员账号长度在3-60之间', trigger: 'blur' },
  ],
  pwd: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }],
  confPwd: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
  roles: [{ required: true, message: '请选择管理员身份', trigger: 'blur' }],
})
const props = defineProps({
  adminId: {
    type: String as PropType<string | null>,
    default: null,
  },
})
interface EmitsType {
  (e: 'update:admin-id', value: string | null): void
  (e: 'success'): void
}
const emit = defineEmits<EmitsType>()
const loadRoles = async () => {
  const data = await getRoles()
  roles.value = data.data
}
const loadAdmin = async () => {
  if (!props.adminId) {
    return
  }
  const data = await getAdmin(props.adminId)
  formData.value = data.data
}
const handleDialogOpen = () => {
  formLoading.value = true
  Promise.all([loadRoles(), loadAdmin()]).finally(() => {
    formLoading.value = false
  })
}
const handleDialogClose = () => {
  emit('update:admin-id', null)
  form.value?.clearValidate() // 清除验证结果
  form.value?.resetFields() // 清除表单数据
}
const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) {
    return
  }
  if (props.adminId) {
    await updateAdmin(props.adminId, formData.value)
  } else {
    await createAdmin(formData.value)
  }
  emit('success')
  ElMessage.success('保存成功')
}
</script>
<style scoped></style>
