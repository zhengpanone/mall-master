<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttrCate()" size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productAttrCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
      >
        <el-table-column label="编号" width="100" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200" align="center">
          <template v-slot="scope">{{
            scope.row.attributeCount == null ? 0 : scope.row.attributeCount
          }}</template>
        </el-table-column>
        <el-table-column label="参数数量" width="200" align="center">
          <template v-slot="scope">{{
            scope.row.paramCount == null ? 0 : scope.row.paramCount
          }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template v-slot="scope">
            <el-button
              size="small"
              @click="getAttrList(scope.$index, scope.row)"
              >属性列表
            </el-button>
            <el-button
              size="small"
              @click="getParamList(scope.$index, scope.row)"
              >参数列表
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template v-slot="scope">
            <el-button
              size="small"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
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
        v-model:page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        v-model:current-page.sync="listQuery.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
      <el-form
        ref="productAttrCatForm"
        :model="productAttrCate"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input
            v-model="productAttrCate.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrCatForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import {
  fetchList,
  deleteProductAttrCate,
  createProductAttrCate,
  updateProductAttrCate,
} from "@/api/pms/productAttrCate"; // 导入 API 方法

const router = useRouter();

const list = ref([]);
const total = ref(0);
const listLoading = ref(true);
const listQuery = reactive({
  pageNum: 1,
  pageSize: 5,
});
const dialogVisible = ref(false);
const dialogTitle = ref("");
const productAttrCate = reactive({
  name: "",
  id: null,
});
const rules = reactive({
  name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
});

const formRef = ref<InstanceType<typeof ElForm> | null>(null);

// 获取列表数据
const getList = async () => {
  listLoading.value = true;
  try {
    const response = await fetchList(listQuery);
    list.value = response.data.list;
    total.value = response.data.total;
  } catch (error) {
    console.error(error);
  } finally {
    listLoading.value = false;
  }
};

// 组件挂载时获取列表
onMounted(() => {
  getList();
});

const addProductAttrCate = () => {
  dialogVisible.value = true;
  dialogTitle.value = "添加类型";
};
// 分页大小变化
const handleSizeChange = (val: number) => {
  listQuery.pageNum = 1;
  listQuery.pageSize = val;
  getList();
};

// 当前页变化
const handleCurrentChange = (val: number) => {
  listQuery.pageNum = val;
  getList();
};

// 删除
const handleDelete = async (index: number, row: any) => {
  try {
    await ElMessageBox.confirm("是否要删除该品牌", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteProductAttrCate(row.id);
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    getList();
  } catch (error) {
    console.error(error);
  }
};

// 更新
const handleUpdate = (index: number, row: any) => {
  dialogVisible.value = true;
  dialogTitle.value = "编辑类型";
  productAttrCate.name = row.name;
  productAttrCate.id = row.id;
};

// 确认
const handleConfirm = (formName: string) => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const data = new URLSearchParams();
      data.append("name", productAttrCate.name);
      try {
        if (dialogTitle.value === "添加类型") {
          await createProductAttrCate(data);
          ElMessage({
            message: "添加成功",
            type: "success",
            duration: 1000,
          });
        } else {
          await updateProductAttrCate(productAttrCate.id, data);
          ElMessage({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        }
        dialogVisible.value = false;
        getList();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("error submit!!");
    }
  });
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
};

// 路由跳转
const getAttrList = (index: number, row: any) => {
  router.push({
    path: "/productAttrList",
    query: { cid: row.id, cname: row.name, type: 0 },
  });
};

const getParamList = (index: number, row: any) => {
  router.push({
    path: "/productAttrList",
    query: { cid: row.id, cname: row.name, type: 1 },
  });
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
