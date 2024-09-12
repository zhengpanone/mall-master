<template> 
  <div class="detail-container">
    <!-- <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div> -->
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{payStatusDic[order.status]}}</span>
      
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">用户id</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.id}}</el-col>
          <el-col :span="4" class="table-cell">{{order.user}}</el-col>
          <el-col :span="4" class="table-cell">{{order.pay_type | formatPay}}</el-col>
        </el-row>
        
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.name}}</el-col>
          <el-col :span="6" class="table-cell">{{order.mobile}}</el-col>
          <el-col :span="6" class="table-cell">{{order.address}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.goods"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template v-slot="scope">
            <img :src="scope.row.image" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template v-slot="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="商品品牌" align="center">
          <template v-slot="scope">
            <p>{{scope.row.productBrand}}</p>
          </template>
        </el-table-column> -->
        <el-table-column label="价格" width="120" align="center">
          <template v-slot="scope">
            <p>价格：￥{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="属性" width="120" align="center">
          <template v-slot="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column> -->
        <el-table-column label="数量" width="120" align="center">
          <template v-slot="scope">
            {{scope.row.nums}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="小计" width="120" align="center">
          <template v-slot="scope">
            ￥{{scope.row.productPrice*scope.row.productQuantity}}
          </template>
        </el-table-column> -->
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.total}}</span>
      </div>
      <div style="float: right;margin: 20px">
        备注：<span class="color-danger">{{order.post}}</span>
      </div>
      
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateReceiverInfo, updateMoneyInfo, closeOrder, updateOrderNote, deleteOrder } from '@/api/oms/order';
import LogisticsDialog from '@/views/oms/order/components/logisticsDialog.vue';
import { getOrderEach } from '@/api/pms/goods';
import { formatDate } from '@/utils/date';
import VDistpicker from 'v-distpicker';
import { ElMessage, ElMessageBox } from 'element-plus';

const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null
};

// 响应式状态
const id = ref(null);
const order = ref({});
const receiverDialogVisible = ref(false);
const receiverInfo = ref({ ...defaultReceiverInfo });
const moneyDialogVisible = ref(false);
const moneyInfo = ref({ orderId: null, freightAmount: 0, discountAmount: 0, status: null });
const messageDialogVisible = ref(false);
const message = ref({ title: null, content: null });
const closeDialogVisible = ref(false);
const closeInfo = ref({ note: null, id: null });
const markOrderDialogVisible = ref(false);
const markInfo = ref({ note: null });
const logisticsDialogVisible = ref(false);
const payStatusDic = ref({
  'TRADE_SUCCESS': '成功',
  'TRADE_CLOSE': '超时关闭',
  'WAIT_BUYER_PAY': '交易创建',
  'TRADE_FINISHED': '交易结束',
  'paying': '待支付'
});

const route = useRoute();
const router = useRouter();

onMounted(() => {
  id.value = route.query.id;
  getOrderEach(id.value).then(response => {
    order.value = response;
  });
});

// 格式化函数
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
};

const formatStepStatus = (value) => {
  if (value === 1) return 2;
  if (value === 2) return 3;
  if (value === 3) return 4;
  return 1;
};

// 事件处理函数
const onSelectRegion = (data) => {
  receiverInfo.value.receiverProvince = data.province.value;
  receiverInfo.value.receiverCity = data.city.value;
  receiverInfo.value.receiverRegion = data.area.value;
};

const showUpdateReceiverDialog = () => {
  receiverDialogVisible.value = true;
  receiverInfo.value = {
    orderId: order.value.id,
    receiverName: order.value.receiverName,
    receiverPhone: order.value.receiverPhone,
    receiverPostCode: order.value.receiverPostCode,
    receiverDetailAddress: order.value.receiverDetailAddress,
    receiverProvince: order.value.receiverProvince,
    receiverCity: order.value.receiverCity,
    receiverRegion: order.value.receiverRegion,
    status: order.value.status
  };
};

const handleUpdateReceiverInfo = () => {
  ElMessageBox.confirm('是否要修改收货信息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    updateReceiverInfo(receiverInfo.value).then(() => {
      receiverDialogVisible.value = false;
      ElMessage.success('修改成功!');
      getOrderEach(id.value).then(response => {
        order.value = response.data;
      });
    });
  });
};

const showUpdateMoneyDialog = () => {
  moneyDialogVisible.value = true;
  moneyInfo.value.orderId = order.value.id;
  moneyInfo.value.freightAmount = order.value.freightAmount;
  moneyInfo.value.discountAmount = order.value.discountAmount;
  moneyInfo.value.status = order.value.status;
};

const handleUpdateMoneyInfo = () => {
  ElMessageBox.confirm('是否要修改费用信息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    updateMoneyInfo(moneyInfo.value).then(() => {
      moneyDialogVisible.value = false;
      ElMessage.success('修改成功!');
      getOrderEach(id.value).then(response => {
        order.value = response.data;
      });
    });
  });
};

const showMessageDialog = () => {
  messageDialogVisible.value = true;
  message.value.title = null;
  message.value.content = null;
};

const handleSendMessage = () => {
  ElMessageBox.confirm('是否要发送站内信?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    messageDialogVisible.value = false;
    ElMessage.success('发送成功!');
  });
};

const showCloseOrderDialog = () => {
  closeDialogVisible.value = true;
  closeInfo.value.note = null;
  closeInfo.value.id = id.value;
};

const handleCloseOrder = () => {
  ElMessageBox.confirm('是否要关闭?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const params = new URLSearchParams();
    params.append("ids", [closeInfo.value.id]);
    params.append("note", closeInfo.value.note);
    closeOrder(params).then(() => {
      closeDialogVisible.value = false;
      ElMessage.success('订单关闭成功!');
      getOrderEach(id.value).then(response => {
        order.value = response.data;
      });
    });
  });
};

const showMarkOrderDialog = () => {
  markOrderDialogVisible.value = true;
  markInfo.value.id = id.value;
  markInfo.value.note = null;
};

const handleMarkOrder = () => {
  ElMessageBox.confirm('是否要备注订单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const params = new URLSearchParams();
    params.append("id", markInfo.value.id);
    params.append("note", markInfo.value.note);
    params.append("status", order.value.status);
    updateOrderNote(params).then(() => {
      markOrderDialogVisible.value = false;
      ElMessage.success('订单备注成功!');
      getOrderEach(id.value).then(response => {
        order.value = response.data;
      });
    });
  });
};

const handleDeleteOrder = () => {
  ElMessageBox.confirm('是否要进行该删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const params = new URLSearchParams();
    params.append("ids", [id.value]);
    deleteOrder(params).then(() => {
      ElMessage.success('删除成功！');
      router.back();
    });
  });
};

const showLogisticsDialog = () => {
  logisticsDialogVisible.value = true;
};

</script>

<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
    
    border-top: 1px solid #DCDFE6;
  }
</style>


