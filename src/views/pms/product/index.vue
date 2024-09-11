<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-bottom:25px">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="goodsParams" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="goodsParams.q" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="goodsParams.c" @change="getBrand"
              :props="{ value: 'id', label: 'name', children: 'sub_category' }" :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="goodsParams.brandId" placeholder="请选择品牌" clearable>
              <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column label="编号" width="80">
          <template v-slot="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template v-slot="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品品牌">
          <template v-slot="scope">
            <p>{{ scope.row.brand.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品分类">
          <template v-slot="scope">
            <p>{{ scope.row.category.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120">
          <template v-slot="scope">
            <p>价格：￥{{ scope.row.shop_price }}</p>
            <!-- <p>货号：{{scope.row.goods_brief}}</p> -->
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template v-slot="scope">
            <p>上架：
              <el-switch @change="handlePublishStatusChange('sale', scope.$index, scope.row)" :active-value="true"
                :inactive-value="false" v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>新品：
              <el-switch @change="handlePublishStatusChange('new', scope.$index, scope.row)" :active-value="true"
                :inactive-value="false" v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch @change="handlePublishStatusChange('hot', scope.$index, scope.row)" :active-value="true"
                :inactive-value="false" v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template v-slot="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看详情
              </el-button>
              <!-- <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button> -->
            </p>
            <p>
              <!-- <el-button
                size="mini"
                @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="goodsParams.pageSize"
        :current-page.sync="goodsParams.pageSize" :total="total">
        <!-- :page-sizes="[5,10,15]" -->
      </el-pagination>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { fetchList, updateDeleteStatus, updateNewStatus, updateRecommendStatus, updatePublishStatus } from '@/api/pms/product';
import { fetchList as fetchSkuStockList, update as updateSkuStockList } from '@/api/pms/skuStock';
import { fetchList as fetchProductAttrList } from '@/api/pms/productAttr';
import { fetchList as fetchBrandList } from '@/api/pms/brand';
import { fetchListWithChildren } from '@/api/pms/productCategory';
import { getGoods, deleteGoods, getBrands, getCategoryList, putGoodsStatus, getBrandsByCate } from '@/api/pms/goods';

const router = useRouter();


const goodsParams = reactive({
  pageNum: 1,
  pageSize: 20,
  c: '',
  q: ''
});

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};

const editSkuInfo = reactive({
  dialogVisible: false,
  productId: null,
  productSn: '',
  productAttributeCategoryId: null,
  stockList: [],
  productAttr: [],
  keyword: null
});


const operates = [
  { label: '商品上架', value: 'publishOn' },
  { label: '新品', value: 'publishOn' },
  { label: '推荐', value: 'publishOn' },
  { label: '删除', value: 'delete' }
];

const operateType = ref(null);
const listQuery = reactive({ ...defaultListQuery });
const list = ref(null);
const total = ref(null);
const listLoading = ref(true);
const selectProductCateValue = ref(null);
const multipleSelection = ref([]);
const productCateOptions = ref([]);
const brandOptions = ref([]);

const publishStatusOptions = [
  { value: 1, label: '上架' },
  { value: 0, label: '下架' }
];

const verifyStatusOptions = [
  { value: 1, label: '审核通过' },
  { value: 0, label: '未审核' }
];

// Watchers
watch(selectProductCateValue, (newValue: any) => {
  if (newValue != null && newValue.length === 2) {
    listQuery.productCategoryId = newValue[1];
  } else {
    listQuery.productCategoryId = null;
  }
});

// Methods
const getProductSkuSp = (row: any, index: any) => {
  const spData = JSON.parse(row.spData);
  return spData != null && index < spData.length ? spData[index].value : null;
};

const getBrand = async (id: any) => {
  goodsParams.c = id[2];
  const res = await getBrandsByCate(id[2], null);
  brandOptions.value = res;
};

const getList = async () => {
  listLoading.value = true;
  try {
    const response = await getGoods(goodsParams);
    list.value = response.data;
    total.value = response.total;
  } finally {
    listLoading.value = false;
  }
};

const getBrandList = async () => {
  const response = await getBrands(null);
  brandOptions.value = response;
};

const getProductCateList = async () => {
  const response = await getCategoryList(null);
  productCateOptions.value = response;
};

const handleSearchEditSku = async () => {
  const response = await fetchSkuStockList(editSkuInfo.productId, { keyword: editSkuInfo.keyword });
  editSkuInfo.stockList = response.data;
};

const handleSearchList = () => {
  listQuery.pageNum = 1;
  getList();
};

const handleAddProduct = () => {
  router.push({ path: '/product/product_add' });
};

const handleBatchOperate = async () => {
  if (operateType.value == null) {
    ElMessage({
      message: '请选择操作类型',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  if (multipleSelection.value == null || multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择要操作的商品',
      type: 'warning',
      duration: 1000
    });
    return;
  }
  try {
    await ElMessageBox.confirm('是否要进行该批量操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const ids = multipleSelection.value.map(item => item.id);
    switch (operateType.value) {
      case operates[0].value:
        await handleUpdatePublishStatus(true, ids, null);
        break;
      case operates[1].value:
        await handleUpdatePublishStatus(false, ids, null);
        break;
      case operates[2].value:
        await handleUpdateRecommendStatus(1, ids);
        break;
      case operates[3].value:
        await handleUpdateRecommendStatus(0, ids);
        break;
      case operates[4].value:
        await handleUpdateNewStatus(1, ids);
        break;
      case operates[5].value:
        await handleUpdateNewStatus(0, ids);
        break;
      case operates[6].value:
        break;
      case operates[7].value:
        await handleUpdateDeleteStatus(1, ids);
        break;
      default:
        break;
    }
    await getList();
  } catch (error) {
    console.error(error);
  }
};

const handleSizeChange = (val: number) => {
  goodsParams.pageNum = 1;
  goodsParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  goodsParams.pageNum = val;
  getList();
};

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};

const handlePublishStatusChange = (paramname: any, index: any, row: any) => {
  if (index === 0) {
    handleUpdatePublishStatus(paramname, false, row);
  } else if (index === 1) {
    handleUpdatePublishStatus(paramname, true, row);
  }
};

const handleNewStatusChange = (index: any, row: any) => {
  const ids = [row.id];
  updateNewStatus(row.newStatus, ids);
};

const handleRecommendStatusChange = (index: any, row: any) => {
  const ids = [row.id];
  handleUpdateRecommendStatus(row.recommandStatus, ids);
};

const handleResetSearch = () => {
  selectProductCateValue.value = [];
  Object.assign(listQuery, defaultListQuery);
};

const handleDelete = async (index: any, row: any) => {
  try {
    await ElMessageBox.confirm('是否要进行删除商品?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteGoods(row.id, null);
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 1000
    });
    list.value.splice(index, 1, null);
  } catch (error) {
    console.error(error);
  }
};

const handleUpdateProduct = (index: any, row: any) => {
  router.push({ path: '/updateProduct', query: { id: row.id } });
};

const handleShowProduct = (index: any, row: any) => {
  router.push({ path: '/updateProduct', query: { id: row.id } });
};

const handleShowVerifyDetail = (index: any, row: any) => {
  console.log("handleShowVerifyDetail", row);
};

const handleShowLog = (index: any, row: any) => {
  console.log("handleShowLog", row);
};

const handleUpdatePublishStatus = async (paramname: any, param: any, row: any) => {
  const params = {
    sale: row.on_sale,
    hot: row.is_hot,
    new: row.is_new
  };
  params[paramname] = param;

  await putGoodsStatus(row.id, params);
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  });

};

const handleUpdateNewStatus = async (newStatus: any, ids: any) => {
  const params = new URLSearchParams();
  params.append('ids', ids);
  params.append('newStatus', newStatus);

  await updateNewStatus(params);
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  });

};

const handleUpdateRecommendStatus = async (recommendStatus: any, ids: any) => {
  const params = new URLSearchParams();
  params.append('ids', ids);
  params.append('recommendStatus', recommendStatus);

  await updateRecommendStatus(params);
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  });

};

const handleUpdateDeleteStatus = async (deleteStatus: any, ids: any) => {
  const params = new URLSearchParams();
  params.append('ids', ids);
  params.append('deleteStatus', deleteStatus);
  try {
    await updateDeleteStatus(params);
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 1000
    });
    await getList();
  } catch (err) {
    let errorMessage = '发生未知错误';
    console.error(err);
    if (err instanceof Error) {
      ElMessage({
        message: err.message,
        type: 'error',
        duration: 1000
      });
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err && typeof err === 'object' && 'msg' in err) {
      errorMessage = (err as any).msg; // 类型断言
    }

  }
};

// Lifecycle hooks
onMounted(() => {
  getList();
  getBrandList();
  getProductCateList();
});
</script>