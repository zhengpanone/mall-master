<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCateInfo" :rules="rules" ref="productCateFrom" label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCateInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productCateInfo.parent_first" placeholder="请选择第一级分类" @change="chooseCateFirst()">
          <el-option v-for="item in productCate" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-if="selectProductCateList.length > 0" v-model="productCateInfo.parent_second"
          placeholder="请选择二级分类">
          <el-option v-for="item in selectProductCateList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-select v-model="productCate.parentId"
                   placeholder="请选择二级分类">
          <el-option
            v-for="item in selectProductSecondCateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select> -->
      </el-form-item>
      <!-- <el-form-item label="排序：">
        <el-input v-model="productCateInfo.sort"></el-input>
      </el-form-item> -->
      <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productCateInfo.is_tab">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import { postCategorys, putCategorys, getCategoryDetail, getCategoryList } from '@/api/pms/goods';
import { fetchListWithAttr } from '@/api/pms/productAttrCate';
import SingleUpload from '@/components/Upload/singleUpload';

const router = useRouter();
const route = useRoute();

const defaultProductCate = reactive({
  is_tab: '',
  icon: '',
  keywords: '',
  name: '',
  navStatus: 0,
  parentId: 0,
  productUnit: '',
  showStatus: 0,
  productAttributeIdList: []
});

const isEdit = ref<boolean>(false);
const productCateInfo = reactive<any>({});
const productCate = ref<any[]>([]);
const selectProductCateList = ref<any[]>([]);
const defaultCate = ref([{ id: 0, name: '无此级分类' }]);
const filterAttrs = ref<any[]>([]);
type FilterProductAttr = {
  value: any[] | null;
  key?: number;
};

const filterProductAttrList = ref<FilterProductAttr[]>([{ value: [] }]);

const rules = reactive({
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
  ],
  is_tab: [
    { required: true, message: '请选择是否显示在导航栏', trigger: 'blur' },
  ],
});

const getProductAttrCateList = async () => {
  const response = await fetchListWithAttr();
  const list = response.data;
  list.forEach((productAttrCate: any) => {
    const children = productAttrCate.productAttributeList?.map((attr: any) => ({
      label: attr.name,
      value: attr.id,
    })) || [];
    filterAttrs.value.push({ label: productAttrCate.name, value: productAttrCate.id, children });
  });
};

const chooseCateFirst = () => {
  const parentFirst = productCateInfo.parent_first;
  const selectedCate = productCate.value.find(item => item.id === parentFirst);
  if (selectedCate) {
    selectProductCateList.value = defaultCate.value.concat(selectedCate.sub_category || []);
  }
};

const getProductAttributeIdList = () => {
  return filterProductAttrList.value
    .filter(item => item.value?.length === 2)
    .map(item => item.value ? item.value[1] : null);
};

const onSubmit = (formName: string) => {
  const formRef = ref<any>(null);
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage({
        message: '验证失败',
        type: 'error',
        duration: 1000,
      });
      return;
    }

    await ElMessageBox.confirm('是否提交数据', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    if (productCateInfo.parent_second) {
      productCateInfo.level = 3;
      productCateInfo.parent = productCateInfo.parent_second;
      delete productCateInfo.parent_second;
    } else if (productCateInfo.parent_first && !productCateInfo.parent_second) {
      productCateInfo.level = 2;
      productCateInfo.parent = productCateInfo.parent_first;
      delete productCateInfo.parent_first;
    } else {
      productCateInfo.level = 1;
    }

    const { name, parent, level, is_tab } = productCateInfo;
    const params = { name, parent, level, is_tab };

    if (isEdit.value) {
      productCateInfo.productAttributeIdList = getProductAttributeIdList();
      await putCategorys(route.query.id as string, params);
      ElMessage({
        message: '修改成功',
        type: 'success',
        duration: 1000,
      });
      router.back();
    } else {
      await postCategorys(params);
      ElMessage({
        message: '提交成功',
        type: 'success',
        duration: 1000,
      });
      router.push('/productCate');
    }
  });
};

const resetForm = (formName: string) => {
  const formRef = ref<any>(null);
  formRef.value.resetFields();
  // 使用 Object.assign 重置 reactive 对象的属性
  Object.assign(productCateInfo, defaultProductCate);
  selectProductCateList.value = [];
  filterProductAttrList.value = [{ value: [] }];
};

const removeFilterAttr = (productAttributeId: number) => {
  if (filterProductAttrList.value.length === 1) {
    ElMessage({
      message: '至少要留一个',
      type: 'warning',
      duration: 1000,
    });
    return;
  }
  const index = filterProductAttrList.value.findIndex(item => item.value !== null && item.value[1] === productAttributeId);
  if (index !== -1) {
    filterProductAttrList.value.splice(index, 1);
  }
};

const handleAddFilterAttr = () => {
  if (filterProductAttrList.value.length === 3) {
    ElMessage({
      message: '最多添加三个',
      type: 'warning',
      duration: 1000,
    });
    return;
  }
  filterProductAttrList.value.push({ value: null, key: Date.now() });
};

onMounted(() => {
  getCategoryList(null).then(res => {
    productCate.value = defaultCate.value.concat(res);
  });

  if (isEdit.value) {
    getCategoryDetail(route.query.id as string).then(response => {
      Object.assign(productCateInfo, response);
    });
  }
});

</script>


<style scoped></style>
