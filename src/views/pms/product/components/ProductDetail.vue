<template> 
  <el-card class="form-container" shadow="never">
    <!-- <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps> -->
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @finishCommit="finishCommit"
      >
    </product-info-detail>
    <!-- <product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-attr-detail
      v-show="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
    <product-relation-detail
      v-show="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail> -->
  </el-card>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox,ElDialog } from 'element-plus';
import ProductInfoDetail from './ProductInfoDetail.vue';
import ProductRelationDetail from './ProductRelationDetail.vue';
import { createGoods, getGoodsEach, putGoods } from '@/api/pms/goods';

// 定义默认产品参数
const defaultProductParam = {
  albumPics: '',
  brandId: null,
  brandName: '',
  deleteStatus: 0,
  description: '',
  detailDesc: '',
  detailHtml: '',
  detailMobileHtml: '',
  detailTitle: '',
  feightTemplateId: 0,
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  giftPoint: 0,
  giftGrowth: 0,
  keywords: '',
  lowStock: 0,
  name: '',
  newStatus: 0,
  note: '',
  originalPrice: 0,
  pic: '',
  memberPriceList: [],
  productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
  productLadderList: [{ count: 0, discount: 0, price: 0 }],
  previewStatus: 0,
  price: 0,
  productAttributeCategoryId: null,
  productAttributeValueList: [],
  skuStockList: [],
  subjectProductRelationList: [],
  prefrenceAreaProductRelationList: [],
  productCategoryId: null,
  productCategoryName: '',
  productSn: '',
  promotionEndTime: '',
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: '',
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: '',
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
};

// 使用 Composition API
const props = defineProps<{
  isEdit?: boolean
}>();

const route = useRoute();
const router = useRouter();

const active = ref(0);
const productParam = ref({ ...defaultProductParam });
const showStatus = ref([true, false, false, false]);

const hideAll = () => {
  showStatus.value = showStatus.value.map(() => false);
};

const prevStep = () => {
  if (active.value > 0 && active.value < showStatus.value.length) {
    active.value--;
    hideAll();
    showStatus.value[active.value] = true;
  }
};

const nextStep = () => {
  if (active.value < showStatus.value.length - 1) {
    active.value++;
    hideAll();
    showStatus.value[active.value] = true;
  }
};

const finishCommit = async (isEdit: boolean) => {
  const result = await ElDialog.confirm('是否要提交该产品', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });

  if (result === 'confirm') {
    if (isEdit) {
      try {
        await putGoods(route.query.id as string, productParam.value);
        ElMessage.success('提交成功');
        router.back();
      } catch {
        ElMessage.error('提交失败');
      }
    } else {
      try {
        await createGoods(productParam.value);
        ElMessage.success('提交成功');
        location.reload();
      } catch {
        ElMessage.error('提交失败');
      }
    }
  }
};

// 初始化数据
onMounted(() => {
  if (props.isEdit) {
    // getProduct(route.query.id as string).then(response => {
    //   productParam.value = response.data;
    // });
  }
});
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


