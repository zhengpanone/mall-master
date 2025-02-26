<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addBrand()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column label="品牌id" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column label="图片" align="center">
          <template v-slot="scope">
            <img :src="scope.row.logo" class="imgs" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template v-slot="scope">
            <el-button size="small" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" v-model:page-size="listQuery.pageSize"
        v-model:current-page.sync="currentPage" :total="total">
        <!-- :page-sizes="[5,10,15]" -->
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  fetchList,
  updateShowStatus,
  updateFactoryStatus,
  deleteBrand,
} from "@/api/pms/brand";
import { getBrands, deleteBrands } from "@/api/pms/goods";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const operates = ref([
  {
    label: "显示品牌",
    value: "showBrand",
  },
  {
    label: "隐藏品牌",
    value: "hideBrand",
  },
]);
const operateType = ref(null);
const currentPage = ref(0);
const listQuery = ref({
  pageNum: 1,
  pageSize: 10,
});
const list = ref([]);
const total = ref(null);
const listLoading = ref(true);
const multipleSelection = ref([]);

const getList = async () => {
  listLoading.value = true;
  try {
    const response = await getBrands(listQuery.value);

    list.value = response.data.list;
    total.value = response.data.total;
    currentPage.value = listQuery.value.pageNum;
    listQuery.value.pageNum =
      response.data.length == listQuery.value.pageSize
        ? listQuery.value.pageNum + 2
        : listQuery.value.pageNum;
  } finally {
    listLoading.value = false;
  }




};

onMounted(() => {
  getList();
});
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const handleUpdate = (index: any, row: any) => {
  router.push({ path: "/updateBrand", query: { id: row.id } });
};
const handleDelete = async (index: any, row: any) => {
  ElMessageBox.confirm("是否要删除该品牌", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  await deleteBrands(row.id, null);
  ElMessage({
    message: "删除成功",
    type: "success",
    duration: 1000,
  });
  getList();
};

const handleFactoryStatusChange = (index: any, row: any) => {
  var data = new URLSearchParams();
  data.append("ids", row.id);
  data.append("factoryStatus", row.factoryStatus);
  updateFactoryStatus(data)
    .then((response) => {
      ElMessage({
        message: "修改成功",
        type: "success",
        duration: 1000,
      });
    })
    .catch((error) => {
      if (row.factoryStatus === 0) {
        row.factoryStatus = 1;
      } else {
        row.factoryStatus = 0;
      }
    });
};
const handleShowStatusChange = (index: any, row: any) => {
  let data = new URLSearchParams();

  data.append("ids", row.id);
  data.append("showStatus", row.showStatus);
  updateShowStatus(data)
    .then((response) => {
      ElMessage({
        message: "修改成功",
        type: "success",
        duration: 1000,
      });
    })
    .catch((error) => {
      if (row.showStatus === 0) {
        row.showStatus = 1;
      } else {
        row.showStatus = 0;
      }
    });
};
const handleSizeChange = (val: any) => {
  listQuery.value.pageNum = 1;
  listQuery.value.pageSize = val;
  getList();
};
const handleCurrentChange = (val: any) => {
  listQuery.value.pageNum = val;
  getList();
};
const searchBrandList = () => {
  listQuery.value.pageNum = 1;
  getList();
};
const handleBatchOperate = () => {
  if (multipleSelection.value.length < 1) {
    ElMessage({
      message: "请选择一条记录",
      type: "warning",
      duration: 1000,
    });
    return;
  }
  let showStatus: number = 0;
  if (operateType.value === "showBrand") {
    showStatus = 1;
  } else if (operateType.value === "hideBrand") {
    showStatus = 0;
  } else {
    ElMessage({
      message: "请选择批量操作类型",
      type: "warning",
      duration: 1000,
    });
    return;
  }
  let ids = [];
  for (let i = 0; i < multipleSelection.value.length; i++) {
    ids.push(multipleSelection.value[i].id);
  }
  let data = new URLSearchParams();
  data.append("ids", ids);
  data.append("showStatus", showStatus);
  updateShowStatus(data).then((response) => {
    getList();
    ElMessage({
      message: "修改成功",
      type: "success",
      duration: 1000,
    });
  });
};

const addBrand = () => {
  router.push({ path: "addBrand" });
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.imgs {
  width: 50px;
  height: 50px;
}
</style>
