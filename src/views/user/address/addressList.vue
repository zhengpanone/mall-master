<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <!-- <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="small">
        添加
      </el-button> -->
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column label="商品图片" width="120" align="center">
          <template v-slot="scope"
            ><img style="height: 80px" :src="scope.row.pic"
          /></template>
        </el-table-column>
        <el-table-column label="省" align="center">
          <template v-slot="scope">
            <p>{{ scope.row.province }}</p>
          </template>
        </el-table-column>
        <el-table-column label="市" align="center">
          <template v-slot="scope">
            {{ scope.row.city }}
          </template>
        </el-table-column>
        <el-table-column label="区域" align="center">
          <template v-slot="scope">
            {{ scope.row.district }}
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template v-slot="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="签收人" align="center">
          <template v-slot="scope">
            {{ scope.row.signer_name }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template v-slot="scope">
            {{ scope.row.signer_mobile }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getAddress } from "@/api/pms/goods";
import { onMounted, reactive, ref, watch } from "vue";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null,
};

const editSkuInfo = reactive({
  dialogVisible: false,
  productId: null,
  productSn: "",
  productAttributeCategoryId: null,
  stockList: [],
  productAttr: [],
  keyword: null,
});
const pageNum = ref(0);

const operates = [
  {
    label: "商品上架",
    value: "publishOn",
  },
  {
    label: "商品下架",
    value: "publishOff",
  },
  {
    label: "设为推荐",
    value: "recommendOn",
  },
  {
    label: "取消推荐",
    value: "recommendOff",
  },
  {
    label: "设为新品",
    value: "newOn",
  },
  {
    label: "取消新品",
    value: "newOff",
  },
  {
    label: "转移到分类",
    value: "transferCategory",
  },
  {
    label: "移入回收站",
    value: "recycle",
  },
];
const operateType = ref(null);
const listQuery = reactive({
  pageNum: 1,
  pageSize: 20,
  productCategoryId: null,
});
const list = ref([]);
const total = ref(null);
const listLoading = ref(true);
const selectProductCateValue = ref(null);
const multipleSelection = ref([]);
const productCateOptions = ref([]);
const brandOptions = ref([]);
const publishStatusOptions = [
  {
    value: 1,
    label: "上架",
  },
  {
    value: 0,
    label: "下架",
  },
];
const verifyStatusOptions = [
  {
    value: 1,
    label: "审核通过",
  },
  {
    value: 0,
    label: "未审核",
  },
];

onMounted(() => {
  getList();
});

watch(selectProductCateValue, (newValue: any) => {
  if (newValue != null && newValue.length == 2) {
    listQuery.productCategoryId = newValue[1];
  } else {
    listQuery.productCategoryId = null;
  }
});

const getList = async () => {
  listLoading.value = true;
  try {
    const response = await getAddress(null);
    listLoading.value = false;
    list.value = list.value.concat(response.data);
    total.value = response.total;
    pageNum.value = listQuery.pageNum;
    listQuery.pageNum =
      response.data.length == listQuery.pageSize
        ? listQuery.pageNum + 2
        : listQuery.pageNum;
  } catch (error) {
    listLoading.value = false;
  }
};
const handleSizeChange = (val: number) => {
  listQuery.pageNum = 1;
  listQuery.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  listQuery.pageNum = val;
  getList();
};
</script>
<style></style>
