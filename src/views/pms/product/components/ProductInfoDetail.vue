<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">

      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="成本价：" prop="name">
        <el-input v-model="value.shop_price" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="库存：" prop="name">
        <el-input v-model="value.stocks" :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="商品编码" prop="name">
        <el-input v-model="value.goods_sn" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="销售价：" prop="name">
        <el-input v-model="value.market_price" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="是否免运费：" prop="name">
        <!-- <el-select
              v-model="value.ship_free"
              :disabled="disabled"
              placeholder="请选择是否免运费">
              <el-option
                v-for="item in shipList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
                @change="handlePublishStatusChange('sale',scope.$index, scope.row)"
        </el-select> -->
        <el-switch :active-value="true" :inactive-value="false" :disabled="disabled" v-model="value.ship_free">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品分类：" prop="brand">
        <!-- <el-cascader
          v-model="selectProductCateValue"
          :disabled="disabled"
          :options="productCateOptions">
        </el-cascader> -->
        <el-select v-model="value.first_cate" @change="handleCateChange" :disabled="disabled" placeholder="请选择一级分类">
          <el-option v-for="item in selectProductCateValue" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="value.second_cate" @change="handleSecondCateChange" v-if="value.first_cate"
          :disabled="disabled" placeholder="请选择二级分类">
          <el-option v-for="item in selectProductSecondCateValue" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="value.third_cate" @change="handleThirdCateChange" :disabled="disabled"
          v-if="value.second_cate" placeholder="请选择三级分类">
          <el-option v-for="item in selectProductThirdCateValue" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select v-model="value.brand" @change="handleBrandChange" :disabled="disabled" placeholder="请选择品牌">
          <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="img1" @input="multiInput" key="images" :disabled="disabled"></multi-upload>
      </el-form-item>
      <el-form-item label="商品简介：" prop="name">
        <el-input v-model="value.goods_brief" type="textarea" :disabled="disabled"></el-input>
      </el-form-item>
      <!-- <el-form-item label="商品详情：" prop="name">
        <el-input v-model="value.desc"  type="textarea" :disabled="disabled"></el-input>
      </el-form-item> -->
      <el-form-item label="商品详情图片：">
        <multi-upload v-model="img2" @input="multiInput2" :disabled="disabled" key="desc-images"></multi-upload>
      </el-form-item>
      <el-form-item label="商品封面：">
        <multi-upload v-model="img3" :multiple='false' @input="multiInput3" :disabled="disabled" :maxCount='1'
          key="front-images"></multi-upload>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" v-if="!disabled" size="medium" @click="finishCommit('productInfoForm')">确认</el-button>
        <el-button type="primary" v-else size="medium" @click="edit()">编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import MultiUpload from '@/components/Upload/multiUpload.vue';
import { fetchListWithChildren } from '@/api/pms/productCategory';
import { fetchList as fetchBrandList } from '@/api/pms/brand';
import { getGoodsEach, getCategoryList, getBrands, putGoods, createGoods, getBrandsByCate } from '@/api/pms/goods';

// Define default product parameter
const defaultValue = {
  images: [],
  desc_images: [],
  front_image: [],
  shop_price: 0,
  stocks: 0,
  market_price: 0,
  category: null,
  brand: null,
  name: '',
  subTitle: '',
  productCategoryId: null,
  brandId: null,
  description: '',
  requiredProp: ''
};

// Define reactive states
const route = useRoute();
const router = useRouter();

const hasEditCreated = ref(false);
const selectProductCateValue = ref([]);
const selectProductSecondCateValue = ref([]);
const selectProductThirdCateValue = ref([]);
const id = ref('');
const value = ref({ ...defaultValue });
const shipList = ref([
  { value: true, label: '是' },
  { value: false, label: '否' }
]);
const img1 = ref([]);
const img2 = ref([]);
const img3 = ref([]);
const selectProductPics = ref([]);
const disabled = ref(false);
const isEdit = ref(false);
const imgList = ref([]);
const productCateOptions = ref([]);
const brandOptions = ref([]);

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  subTitle: [{ required: true, message: '请输入商品副标题', trigger: 'blur' }],
  productCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
  brandId: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
  requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
};

// Handle product category change
const handleCateChange = (data: any) => {
  value.value.category = data;
  selectProductCateValue.value.forEach((res: any) => {
    if (res.id === data) {
      selectProductSecondCateValue.value = res.sub_category;
    }
  });
  getBrandsBy(data);
};

const handleSecondCateChange = (data: any) => {
  value.value.category = data;
  selectProductSecondCateValue.value.forEach((res: any) => {
    if (res.id === data) {
      selectProductThirdCateValue.value = res.sub_category;
    }
  });
  getBrandsBy(data);
};

const handleThirdCateChange = (data: any) => {
  value.value.category = data;
  getBrandsBy(data);
};

const getBrandsBy = async (id: string) => {
  try {
    const res = await getBrandsByCate(id);
    brandOptions.value = res;
  } catch (error) {
    ElMessage.error('获取品牌失败');
  }
};

// Initialize data
const initData = () => {
  if (route.query.id) {
    disabled.value = true;
    isEdit.value = true;
  }
};

const edit = () => {
  disabled.value = false;
};

const getProductCateList = async () => {
  try {
    const response = await getCategoryList(null);
    selectProductCateValue.value = response;
    if (route.query.id) {
      id.value = route.query.id as string;
      getGoods();
    }
  } catch (error) {
    ElMessage.error('获取分类失败');
  }
};

const getBrandsList = async () => {
  try {
    const response = await getBrands(null);
    brandOptions.value = response;
  } catch (error) {
    ElMessage.error('获取品牌失败');
  }
};

const getGoods = async () => {
  try {
    const response = await getGoodsEach(id.value);
    value.value = response;
    value.value.front_image = [{ url: response.front_image }];
    value.value.images = response.images.map((item: any) => ({ url: item }));
    value.value.desc_images = response.desc_images.map((item: any) => ({ url: item }));
    img1.value = value.value.images;
    img2.value = value.value.desc_images;
    img3.value = value.value.front_image;
    const targetId = response.category.id;
    selectProductCateValue.value.forEach((res: any) => {
      if (res.id === targetId) {
        value.value.first_cate = targetId;
        selectProductSecondCateValue.value = res.sub_category;
      } else if (res.sub_category && res.sub_category.length > 0) {
        res.sub_category.forEach((item: any) => {
          if (item.id === targetId) {
            value.value.second_cate = targetId;
            value.value.first_cate = res.id;
            selectProductThirdCateValue.value = item.sub_category;
          } else if (item.sub_category && item.sub_category.length > 0) {
            item.sub_category.forEach((sub: any) => {
              if (sub.id === targetId) {
                value.value.third_cate = targetId;
                value.value.second_cate = item.id;
                selectProductThirdCateValue.value = item.sub_category;
                selectProductSecondCateValue.value = res.sub_category;
                value.value.first_cate = res.id;
              }
            });
          }
        });
      }
    });
  } catch (error) {
    ElMessage.error('获取商品信息失败');
  }
};

const getCateNameById = (id: string) => {
  let name: string | null = null;
  for (const item of productCateOptions.value) {
    for (const subItem of item.children) {
      if (subItem.value === id) {
        name = subItem.label;
        return name;
      }
    }
  }
  return name;
};

// Handle multi-upload input
const multiInput = (file: any[]) => {
  img1.value = file;
  value.value.images = file.map((item: any) => item.url);
};

const multiInput2 = (file: any[]) => {
  img2.value = file;
  value.value.desc_images = file.map((item: any) => item.url);
};

const multiInput3 = (file: any[]) => {
  img3.value = file;
  value.value.front_image = file.map((item: any) => item.url)[0] || '';
};

// Handle form validation and submission
const handleNext = (formName: string) => {
  (refs[formName] as any).validate((valid: boolean) => {
    if (valid) {
      emit('finishCommit');
    } else {
      ElMessage.error('验证失败');
    }
  });
};

const finishCommit = async () => {
  value.value.shop_price = Number(value.value.shop_price) || 0;
  value.value.stocks = Number(value.value.stocks) || 0;
  value.value.market_price = Number(value.value.market_price) || 0;
  value.value.category = value.value.third_cate || value.value.second_cate || value.value.first_cate;
  delete value.value.first_cate;
  delete value.value.second_cate;
  delete value.value.third_cate;

  try {
    if (isEdit.value) {
      await putGoods(id.value, value.value);
      ElNotification.success({ title: '提示', message: '修改成功' });
      router.push('/product');
    } else {
      await createGoods(value.value);
      ElNotification.success({ title: '提示', message: '新建成功' });
      router.push('/product');
    }
  } catch (error) {
    ElNotification.error({ title: '提示', message: (error as any).msg });
  }
};

const handleBrandChange = (val: string) => {
  // Handle brand change logic
};

// Fetch initial data
onMounted(() => {
  getProductCateList();
  getBrandsList();
  initData();
});

watch(() => value.value.id, (newValue) => {
  if (isEdit.value && !hasEditCreated.value) {
    if (newValue !== undefined && newValue !== null && newValue !== 0) {
      handleEditCreated();
    }
  }
});

const handleEditCreated = () => {
  if (value.value.productCategoryId != null) {
    selectProductCateValue.value.push(value.value.cateParentId);
    selectProductCateValue.value.push(value.value.productCategoryId);
  }
  hasEditCreated.value = true;
};
</script>

<style scoped lang="scss">
:deep(.el-select) {
  width: 150px;
}
</style>
