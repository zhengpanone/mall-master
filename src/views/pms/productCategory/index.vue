<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="handleAddProductCate()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-tree
        :data="list"
        node-key="id"
        :props="{
          children: 'sub_category',
          label: 'name',
        }"
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <!-- {{JSON.stringify(node)}} -->
            <span class="cat-name">{{ node.label }}</span>
            <span>
              <el-switch
                v-model="data.is_tab"
                active-text="导航栏"
                v-if="node.level == 1"
                @change="handleChange(node)"
              >
              </el-switch>
              <el-button type="text" size="small" @click="handleUpdate(data)">
                编辑
              </el-button>
              <el-button type="text" size="small" @click="handleDelete(data)">
                删除
              </el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  fetchList,
  deleteProductCate,
  updateShowStatus,
  updateNavStatus,
} from "@/api/pms/productCategory";
import {
  getCategoryList,
  deleteCategorys,
  putCategorys,
} from "@/api/pms/category";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();
const list = ref(null);
const total = ref(null);
const listLoading = ref(true);
const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});
const parentId = ref<number | null | string>(0);
// 获取列表数据
const getList = async () => {
  listLoading.value = true;
  try {
    const response = await getCategoryList(null);
    listLoading.value = false;
    list.value = response.data;
  } catch (error) {
    listLoading.value = false;
  }
};

onMounted(() => {
  getList();
});
// 监听路由变化
watch(
  () => route.query.parentId,
  (newRoute) => {
    resetParentId();
    getList();
  }
);

const resetParentId = () => {
  listQuery.pageNum = 1;
  if (route.query.parentId != null) {
    parentId.value = route.query.parentId as string;
  } else {
    parentId.value = 0;
  }
};
// 跳转到添加分类页面
const handleAddProductCate = () => {
  router.push("/product/product_category_add");
};

// `${data.data.name+data.data.is_tab?'显示':'不显示'}在导航栏？`
// 修改导航栏设置
const handleChange = (data: any) => {
  ElMessageBox.confirm(`修改在导航栏设置？`, "修改", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let params = {
        name: data.data.name,
        is_tab: data.data.is_tab,
        level: data.data.level,
      };
      try {
        await putCategorys(data.data.id, params);
        ElMessage({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      } catch (err) {
        data.data.is_tab = false;
      }
    })
    .catch(() => {
      data.data.is_tab = false;
    });
};
// 修改分页大小
const handleSizeChange = (val: number) => {
  listQuery.pageNum = 1;
  listQuery.pageSize = val;
  getList();
};
// 修改当前页
const handleCurrentChange = (val: number) => {
  listQuery.pageNum = val;
  getList();
};

// 修改导航状态
const handleNavStatusChange = async (index: any, row: any) => {
  let data = new URLSearchParams();
  let ids = [];
  ids.push(row.id);
  data.append("ids", ids.join(","));
  data.append("navStatus", row.navStatus);
  await updateNavStatus(data);
  ElMessage({
    message: "修改成功",
    type: "success",
    duration: 1000,
  });
};
// 修改显示状态

const handleShowStatusChange = async (index: any, row: any) => {
  let data = new URLSearchParams();
  let ids = [];
  ids.push(row.id);
  data.append("ids", ids.join(", "));
  data.append("showStatus", row.showStatus);
  await updateShowStatus(data);
  ElMessage({
    message: "修改成功",
    type: "success",
    duration: 1000,
  });
};
// 显示下一级分类
const handleShowNextLevel = (index: any, row: any) => {
  router.push({ path: "/productCate", query: { parentId: row.id } });
};
// 更新分类
const handleUpdate = (row: any) => {
  // this.$router.push({path:'/updateProductCate',query:{id:row.id}});
  ElMessageBox.prompt("请输入新名称", "修改" + row.name, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(async ({ value }) => {
    let params = {
      name: value,
      is_tab: row.is_tab,
      level: row.level,
    };
    try {
      await putCategorys(row.id, params);
      ElMessage({
        message: "修改成功",
        type: "success",
        duration: 1000,
      });
    } catch (err) {
      let errorMessage = "发生未知错误";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "msg" in err) {
        errorMessage = (err as any).msg;
      }
      ElMessage({
        type: "error",
        message: errorMessage,
      });
    }
  });
};
const handleDelete = (row: any) => {
  ElMessageBox.confirm("是否要删除该品牌", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await deleteCategorys(row.id, null);
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    getList();
  });
};

// 替代 filters 的方法
const levelFilter = (value: number) => {
  return value === 0 ? "一级" : value === 1 ? "二级" : "";
};

const disableNextLevel = (value: number) => {
  return value !== 0;
};
</script>

<style scoped>
.cat-name {
  margin-right: 50px;
}
</style>
