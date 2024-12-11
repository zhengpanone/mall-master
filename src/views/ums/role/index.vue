<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              v-model="listQuery.keyword"
              class="input-width"
              placeholder="角色名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        size="small"
        class="btn-add"
        @click="handleAdd()"
        style="margin-left: 20px"
        >添加</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="roleTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template v-slot="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="用户数" width="100" align="center">
          <template v-slot="scope">{{ scope.row.adminCount }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template v-slot="scope">{{
            formatDateTime(scope.row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template v-slot="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template v-slot="scope">
            <el-row>
              <el-button
                size="small"
                type="text"
                @click="handleSelectMenu(scope.$index, scope.row)"
                >分配菜单
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="handleSelectResource(scope.$index, scope.row)"
                >分配资源
              </el-button>
            </el-row>
            <el-row>
              <el-button
                size="small"
                type="text"
                @click="handleUpdate(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
                >删除
              </el-button>
            </el-row>
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
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
            v-model="role.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import {
  fetchList,
  createRole,
  updateRole,
  updateStatus,
  deleteRole,
} from "@/api/ums/role";
import { formatDate } from "@/utils/date";
import { ElMessage, ElMessageBox, ElForm } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: null,
};
const defaultRole = {
  id: null,
  name: "",
  description: "",
  adminCount: 0,
  status: 1,
};

const listQuery = reactive({ ...defaultListQuery });
const list = ref([]);
const total = ref(0);
const listLoading = ref(false);
const dialogVisible = ref(false);
const role = reactive({ ...defaultRole });
const isEdit = ref(false);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);

const formatDateTime = (time: string | null) => {
  if (time == null || time === "") {
    return "N/A";
  }
  const date = new Date(time);
  return formatDate(date, "yyyy-MM-dd hh:mm:ss");
};

const handleResetSearch = () => {
  Object.assign(listQuery, defaultListQuery);
};

const handleSearchList = () => {
  listQuery.pageNum = 1;
  getList();
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

const handleAdd = () => {
  dialogVisible.value = true;
  isEdit.value = false;
  Object.assign(role, defaultRole);
};

const handleStatusChange = async (index: number, row: any) => {
  try {
    await ElMessageBox.confirm("是否要修改该状态?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await updateStatus(row.id, { status: row.status });
    ElMessage({
      type: "success",
      message: "修改成功!",
    });
    getList();
  } catch (error) {
    ElMessage({
      type: "info",
      message: "取消修改",
    });
  }
};

const handleDelete = async (index: number, row: any) => {
  try {
    await ElMessageBox.confirm("是否要删除该角色?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const ids = [row.id];
    const params = new URLSearchParams();
    params.append("ids", JSON.stringify(ids));
    await deleteRole(params);
    ElMessage({
      type: "success",
      message: "删除成功!",
    });
    getList();
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = (index: number, row: any) => {
  dialogVisible.value = true;
  isEdit.value = true;
  Object.assign(role, row);
};

const handleDialogConfirm = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate();
      if (isEdit.value) {
        await updateRole(role.id, role);
        ElMessage({
          message: "修改成功！",
          type: "success",
        });
      } else {
        await createRole(role);
        ElMessage({
          message: "添加成功！",
          type: "success",
        });
      }
      dialogVisible.value = false;
      getList();
    } catch (error) {
      console.error(error);
    }
  }
};

const handleSelectMenu = (index: number, row: any) => {
  router.push({ path: "/ums/allocMenu", query: { roleId: row.id } });
};

const handleSelectResource = (index: number, row: any) => {
  router.push({ path: "/ums/allocResource", query: { roleId: row.id } });
};

const handleDialogClose = () => {
  dialogVisible.value = false;
};

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

onMounted(() => {
  getList();
});
</script>
<style></style>
