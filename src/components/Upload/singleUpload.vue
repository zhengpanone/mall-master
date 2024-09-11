<template> 
  <div>
    <!-- :action="useOss?ossUploadUrl:minioUploadUrl" -->
    <el-upload :action="useOss ? dataObj.host : minioUploadUrl" :data="useOss ? dataObj : null" list-type="picture"
      :multiple="false" :show-file-list="showFileList" :file-list="fileList" :before-upload="beforeUpload2"
      :on-remove="handleRemove" :on-success="handleUploadSuccess" :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
      <!-- <i class="el-icon-plus"></i> -->

    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { ossPolicy } from '@/api/common';
import sendRequest from '@/utils/update';

interface DataObj {
  policy?: string;
  signature?: string;
  OSSAccessKeyId?: string;
  key?: string;
  dir?: string;
  host?: string;
  success_action_status?: string;
  callback?: string;
  expire?: ''
}

const props = defineProps<{
  value: string;
}>();

const emit = defineEmits(['update:value']);

const dialogVisible = ref(false);
const useOss = ref(true); // 使用oss->true; 使用MinIO->false
const ossUploadUrl = 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com';
const minioUploadUrl = 'http://localhost:8080/minio/upload';

const dataObj = ref<DataObj>({
  signature: '',
  key: '',
  host: '',

});

const imageUrl = computed(() => props.value);

const imageName = computed(() => {
  if (props.value != null && props.value !== '') {
    return props.value.substr(props.value.lastIndexOf("/") + 1);
  } else {
    return null;
  }
});

const fileList = computed(() => [{
  name: imageName.value,
  url: imageUrl.value,
}]);

const showFileList = ref(false);

watch(() => props.value, (newValue) => {
  showFileList.value = newValue !== null && newValue !== '' && newValue !== undefined;
});

const emitInput = (val: string) => {
  emit('update:value', val);
};

const handleRemove = () => {
  emitInput('');
};

const handlePreview = () => {
  dialogVisible.value = true;
};

const beforeUpload2 = (file: File) => {
  if (!useOss.value) {
    // 不使用oss不需要获取策略
    return true;
  }
  return new Promise((resolve, reject) => {
    const body = sendRequest();
    if (body) {
      try {
        const obj = JSON.parse(body);
        dataObj.value.policy = obj.policy;
        dataObj.value.signature = obj.signature;
        dataObj.value.OSSAccessKeyId = obj.accessid;
        dataObj.value.key = obj.dir;
        dataObj.value.expire = obj.expire;
        dataObj.value.host = obj.host;
        dataObj.value.callback = obj.callback;
        dataObj.value.success_action_status = '200'; // 让服务端返回200,不然，默认会返回204

        resolve(true);
      } catch (err) {
        console.error('JSON 解析错误', err);
        reject(false);
      }
    } else {
      reject(false);
    }
  });
};

const beforeUpload = (file: File) => {
  if (!useOss.value) {
    // 不使用oss不需要获取策略
    return true;
  }
  return new Promise((resolve, reject) => {
    ossPolicy().then(response => {
      dataObj.value.policy = response.data.policy;
      dataObj.value.signature = response.data.signature;
      dataObj.value.OSSAccessKeyId = response.data.accessKeyId;
      dataObj.value.key = `${response.data.dir}/\${filename}`;
      dataObj.value.dir = response.data.dir;
      dataObj.value.host = response.data.host;
      resolve(true);
    }).catch(err => {
      console.error('获取策略失败', err);
      reject(false);
    });
  });
};

const handleUploadSuccess = (res: any, file: File) => {
  showFileList.value = true;
  fileList.value.pop();
  let url = `${dataObj.value.host}/${dataObj.value.dir}/${file.name}`;
  if (!useOss.value) {
    // 不使用oss直接获取图片路径
    url = res.data.url;
  }
  fileList.value.push({ name: file.name, url });
  emitInput(fileList.value[0].url);
};
</script>

<style></style>
