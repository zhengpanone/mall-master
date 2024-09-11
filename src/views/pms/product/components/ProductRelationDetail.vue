<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productRelationForm" label-width="120px" style="width: 680px" size="small">
      <el-form-item label="关联专题：">
        <el-transfer style="display: inline-block" filterable :filter-method="filterMethod" filter-placeholder="请输入专题名称"
          v-model="selectSubject" :titles="subjectTitles" :data="subjectList">
        </el-transfer>
      </el-form-item>
      <el-form-item label="关联优选：">
        <el-transfer style="display: inline-block" filterable :filter-method="filterMethod" filter-placeholder="请输入优选名称"
          v-model="selectPrefrenceArea" :titles="prefrenceAreaTitles" :data="prefrenceAreaList">
        </el-transfer>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品属性</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { fetchListAll as fetchSubjectList } from '@/api/subject'
import { fetchList as fetchPrefrenceAreaList } from '@/api/prefrenceArea'
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

//所有专题列表
const subjectList = ref<{ label: string; key: number }[]>([])
//所有专题列表
const prefrenceAreaList = ref<{ label: string; key: number }[]>([])
//专题左右标题
const prefrenceAreaTitles = ref(['待选择', '已选择'])
//专题左右标题
const subjectTitles = ref(['待选择', '已选择'])

// Define emits
const emit = defineEmits(['prevStep', 'finishCommit']);

onMounted(() => {
  getSubjectList()
  getPrefrenceAreaList()
})

//选中的专题
const selectSubject = computed({
  get: () => {
    const subjects: number[] = [];
    if (props.value.subjectProductRelationList == null || props.value.subjectProductRelationList.length <= 0) {
      return subjects;
    }
    for (let i = 0; i < props.value.subjectProductRelationList.length; i++) {
      subjects.push(props.value.subjectProductRelationList[i].subjectId);
    }
    return subjects;
  },
  set: (newValue) => {
    props.value.subjectProductRelationList = [];
    for (let i = 0; i < newValue.length; i++) {
      props.value.subjectProductRelationList.push({ subjectId: newValue[i] });
    }
  }
})

//选中的优选
const selectPrefrenceArea = computed({
  get: () => {
    const prefrenceAreas: number[] = [];
    if (props.value.prefrenceAreaProductRelationList == null || props.value.prefrenceAreaProductRelationList.length <= 0) {
      return prefrenceAreas;
    }
    for (let i = 0; i < props.value.prefrenceAreaProductRelationList.length; i++) {
      prefrenceAreas.push(props.value.prefrenceAreaProductRelationList[i].prefrenceAreaId);
    }
    return prefrenceAreas;
  },
  set: (newValue) => {
    props.value.prefrenceAreaProductRelationList = [];
    for (let i = 0; i < newValue.length; i++) {
      props.value.prefrenceAreaProductRelationList.push({ prefrenceAreaId: newValue[i] });
    }
  }
})

const filterMethod = (query: any, item: any) => {
  return item.label.indexOf(query) > -1;
}
const getSubjectList = async () => {
  const response = await fetchSubjectList()
  let list = response.data;
  list.forEach((item: any) => {
    subjectList.value.push({
      label: item.title,
      key: item.id
    });
  })
}

const getPrefrenceAreaList = async () => {
  const response = await fetchPrefrenceAreaList()
  let list = response.data;
  list.forEach((item: any) => {
    prefrenceAreaList.value.push({
      label: item.name,
      key: item.id
    });
  });
}
const handlePrev = () => {
  emit('prevStep')
}

const handleFinishCommit = () => {
  emit('finishCommit', props.isEdit);
}
</script>

<style scoped></style>
