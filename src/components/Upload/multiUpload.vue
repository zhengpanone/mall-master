<template> 
  <div>
    <el-upload :action="useOss ? host : minioUploadUrl" :data="useOss ? dataObj : null" list-type="picture-card"
      :file-list="value" :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess"
      :on-preview="handlePreview" :limit="maxCount" :on-exceed="handleExceed" :disabled="disabled" ref="load"
      :multiple="multiple">
      <!-- :http-request="requestImg" -->
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, reactive, watch, PropType } from 'vue';
import { ElMessage } from 'element-plus'
import { ossPolicy } from '@/api/common';
import axios from 'axios';
import qs from 'qs';
import send_request from '@/utils/update';

// props 定义
const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  maxCount: {
    type: Number,
    default: 5,
  },
  disabled: Boolean,
});
interface DataObj {
  signature: string;
  key: string;
  policy: string;
  OSSAccessKeyId: string;
  success_action_status: string;
  name?: string; // 添加 name 属性
  host?: string;
}
// 组件数据
const dataObj = reactive<DataObj>({
  signature: '',
  key: '',
  policy: '',
  OSSAccessKeyId: '',
  success_action_status: '200',
});
const host = ref('');
const dir = ref('');
const dialogVisible = ref(false);
const dialogImageUrl = ref<string | null>(null);
const useOss = ref(true); // 使用OSS->true; 使用MinIO->false
const ossUploadUrl = ref('');
const minioUploadUrl = 'http://localhost:8080/minio/upload';

// 计算属性
const fileList = computed(() => props.value || []);

// 方法
const emitInput = (value: any) => {
  const emit = defineEmits(['input']);
  emit('input', value);
};

const handleRemove = (file: any, value: any) => {
  emitInput(value);
};

const handlePreview = (file: any) => {
  dialogVisible.value = true;
  dialogImageUrl.value = file.url;
};

const beforeUpload = async (file: any) => {
  dataObj.name = file.name;
  if (!useOss.value) {
    // 不使用OSS，不需要获取策略
    return true;
  }
  try {
    console.log('文件名', file);
    const body = send_request();
    if (body) {
      const obj = JSON.parse(body);
      dataObj.policy = obj.policy;
      dataObj.signature = obj.signature;
      dataObj.OSSAccessKeyId = obj.accessid;
      dataObj.key = obj.dir + "${filename}";
      dir.value = obj.dir;
      host.value = obj.host;
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const requestImg = (file: any) => {
  console.log(file, axios);
  const params = { ...file.data, file: file.file };
  axios.post(dataObj.host ? dataObj.host : '', qs.stringify(params), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => {
    console.log(res);
  });
};

const handleUploadSuccess = (res: any, file: any, fileList: any[]) => {
  console.log('图片上传回调', fileList);
  const imgList = fileList.map(item => {
    if (item.size) {
      return { url: host.value + '/' + dir.value + item.name };
    } else {
      return item;
    }
  });
  emitInput(imgList);
};

const handleExceed = (files: any, value: any) => {
  ElMessage({
    message: '最多只能上传' + props.maxCount + '张图片',
    type: 'warning',
    duration: 1000,
  });
};
</script>

<style></style>
