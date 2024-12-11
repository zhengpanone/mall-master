<template>
   
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="编号" width="80" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="收货地址" width="180" align="center">
          <template v-slot="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="联系电话" width="180" align="center">
          <!-- <template v-slot="scope">{{scope.row.mobile | formatCreateTime}}</template> -->
          <template v-slot="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template v-slot="scope">￥{{ scope.row.total }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template v-slot="scope">{{
            formatPayType(scope.row.post)
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="订单来源" width="120" align="center">
          <template v-slot="scope">{{scope.row.sourceType | formatSourceType}}</template>
        </el-table-column> -->
        <el-table-column label="订单状态" width="120" align="center">
          <template v-slot="scope">{{
            formatStatus(scope.row.status)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template v-slot="scope">
            <el-button
              size="small"
              @click="handleViewOrder(scope.$index, scope.row)"
              >查看订单</el-button
            >
            <!-- <el-button
              size="small"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status===0">关闭订单</el-button>
            <el-button
              size="small"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status===1">订单发货</el-button>
            <el-button
              size="small"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status===2||scope.row.status===3">订单跟踪</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status===4">删除订单</el-button> -->
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
        v-model:current-page.sync="pageNum"
        v-model:page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrderRef.dialogVisible"
      width="30%"
    >
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrderRef.content"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrderRef.dialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleCloseOrderConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { fetchList, closeOrder, deleteOrder } from "@/api/oms/order";
import { getOrder } from "@/api/pms/goods";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null,
};
const listQuery = ref(Object.assign({}, defaultListQuery));

const listLoading = ref(true);
const list = ref([]);
const total = ref(null);
const operateType = ref(null);
const pageNum = ref(0);
const multipleSelection = ref([]);
const closeOrderRef = ref({
  dialogVisible: false,
  content: null,
  orderIds: [],
});
const statusOptions = ref([
  {
    label: "待付款",
    value: 0,
  },
  {
    label: "待发货",
    value: 1,
  },
  {
    label: "已发货",
    value: 2,
  },
  {
    label: "已完成",
    value: 3,
  },
  {
    label: "已关闭",
    value: 4,
  },
]);
const orderTypeOptions = ref([
  {
    label: "正常订单",
    value: 0,
  },
  {
    label: "秒杀订单",
    value: 1,
  },
]);
const sourceTypeOptions = ref([
  {
    label: "PC订单",
    value: 0,
  },
  {
    label: "APP订单",
    value: 1,
  },
]);
const operateOptions = ref([
  {
    label: "批量发货",
    value: 1,
  },
  {
    label: "关闭订单",
    value: 2,
  },
  {
    label: "删除订单",
    value: 3,
  },
]);
const logisticsDialogVisible = ref(false);

onMounted(() => {
  getList();
});

// 替代 filters 的方法
const formatCreateTime = (time: any) => {
  let date = new Date(time);
  return formatDate(date, "yyyy-MM-dd hh:mm:ss");
};
const formatPayType = (value: any) => {
  if (value === 1) {
    return "支付宝";
  } else if (value === 2) {
    return "微信";
  } else {
    return "未支付";
  }
};
const formatSourceType = (value: any) => {
  if (value === 1) {
    return "APP订单";
  } else {
    return "PC订单";
  }
};
const formatStatus = (value: any) => {
  if (value === 1) {
    return "待发货";
  } else if (value === 2) {
    return "已发货";
  } else if (value === 3) {
    return "已完成";
  } else if (value === 4) {
    return "已关闭";
  } else if (value === 5) {
    return "无效订单";
  } else {
    return "待付款";
  }
};

const handleResetSearch = () => {
  listQuery.value = Object.assign({}, defaultListQuery);
};
const handleSearchList = () => {
  listQuery.value.pageNum = 1;
  getList();
};
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const handleViewOrder = (index: any, row: any) => {
  router.push({ path: "/oms/orderDetail", query: { id: row.id } });
};
const handleCloseOrder = (index: any, row: any) => {
  closeOrderRef.value.dialogVisible = true;
  closeOrderRef.value.orderIds = [row.id];
};
const handleDeliveryOrder = (index: any, row: any) => {
  let listItem = covertOrder(row);
  router.push({ path: "/oms/deliverOrderList", query: { list: [listItem] } });
};
const handleViewLogistics = (index: any, row: any) => {
  logisticsDialogVisible.value = true;
};
const handleDeleteOrder = (index: any, row: any) => {
  let ids = [];
  ids.push(row.id);
  ElMessageBox.confirm("是否要进行该删除操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let params = new URLSearchParams();
    params.append("ids", ids);
    deleteOrder(params).then((response) => {
      ElMessage({
        message: "删除成功！",
        type: "success",
        duration: 1000,
      });
      getList();
    });
  });
};
const handleBatchOperate = () => {
  if (multipleSelection.value == null || multipleSelection.value.length < 1) {
    ElMessage({
      message: "请选择要操作的订单",
      type: "warning",
      duration: 1000,
    });
    return;
  }
  if (operateType.value === 1) {
    //批量发货
    let list = [];
    for (let i = 0; i < this.multipleSelection.length; i++) {
      if (multipleSelection.value[i].status === 1) {
        list.push(covertOrder(multipleSelection.value[i]));
      }
    }
    if (list.length === 0) {
      ElMessage({
        message: "选中订单中没有可以发货的订单",
        type: "warning",
        duration: 1000,
      });
      return;
    }
    router.push({ path: "/oms/deliverOrderList", query: { list: list } });
  } else if (operateType.value === 2) {
    //关闭订单
    closeOrderRef.value.orderIds = [];
    for (let i = 0; i < multipleSelection.value.length; i++) {
      closeOrderRef.value.orderIds.push(multipleSelection.value[i].id);
    }
    closeOrderRef.value.dialogVisible = true;
  } else if (operateType.value === 3) {
    //删除订单
    let ids = [];
    for (let i = 0; i < multipleSelection.value.length; i++) {
      ids.push(multipleSelection.value[i].id);
    }
    deleteOrder(ids);
  }
};
const handleSizeChange = (val: any) => {
  listQuery.value.pn = 1;
  listQuery.value.pnum = val;
  getList();
};
const handleCurrentChange = (val: any) => {
  listQuery.value.pn = val;
  getList();
};
const handleCloseOrderConfirm = () => {
  if (
    closeOrderRef.value.content == null ||
    closeOrderRef.value.content === ""
  ) {
    ElMessage({
      message: "操作备注不能为空",
      type: "warning",
      duration: 1000,
    });
    return;
  }
  let params = new URLSearchParams();
  params.append("ids", closeOrderRef.value.orderIds);
  params.append("note", closeOrderRef.value.content);
  closeOrder(params).then((response) => {
    closeOrderRef.value.orderIds = [];
    closeOrderRef.value.dialogVisible = false;
    getList();
    ElMessage({
      message: "修改成功",
      type: "success",
      duration: 1000,
    });
  });
};
const getList = () => {
  listLoading.value = true;
  getOrder(listQuery).then((response) => {
    listLoading.value = false;
    list.value = list.value.concat(response.data);
    total.value = response.total;
    pageNum.value = listQuery.value.pn;
    listQuery.value.pn =
      response.data.length == listQuery.value.pnum
        ? listQuery.value.pn + 1
        : listQuery.value.pn;
  });
};

const covertOrder = (order: any) => {
  let address =
    order.receiverProvince +
    order.receiverCity +
    order.receiverRegion +
    order.receiverDetailAddress;
  let listItem = {
    orderId: order.id,
    orderSn: order.orderSn,
    receiverName: order.receiverName,
    receiverPhone: order.receiverPhone,
    receiverPostCode: order.receiverPostCode,
    address: address,
    deliveryCompany: null,
    deliverySn: null,
  };
  return listItem;
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
