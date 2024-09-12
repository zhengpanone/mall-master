<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliverOrderTable"
                style="width: 100%;"
                :data="list" border>
        <el-table-column label="订单编号" width="180" align="center">
          <template v-slot="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="收货人" width="180" align="center">
          <template v-slot="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160" align="center">
          <template v-slot="scope">{{scope.row.receiverPhone}}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="160" align="center">
          <template v-slot="scope">{{scope.row.receiverPostCode}}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template v-slot="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="160" align="center">
          <template v-slot="scope">
            <el-select placeholder="请选择物流公司"
                       v-model="scope.row.deliveryCompany"
                       size="small">
              <el-option v-for="item in companyOptions"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="180" align="center">
          <template v-slot="scope">
            <el-input size="small" v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deliveryOrder } from '@/api/oms/order';
import { ElMessage, ElMessageBox } from 'element-plus';

const defaultLogisticsCompanies = ["顺丰快递", "圆通快递", "中通快递", "韵达快递"];

// 响应式状态
const list = ref([]);
const companyOptions = ref(defaultLogisticsCompanies);

// 路由和导航
const route = useRoute();
const router = useRouter();

// 在组件挂载时初始化数据
onMounted(() => {
  list.value = route.query.list || [];
});

// 取消操作
function cancel() {
  router.back();
}

// 确认发货操作
function confirm() {
  ElMessageBox.confirm('是否要进行发货操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deliveryOrder(list.value).then(() => {
      router.back();
      ElMessage({
        type: 'success',
        message: '发货成功!',
      });
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消发货',
    });
  });
}
</script>

<style></style>


