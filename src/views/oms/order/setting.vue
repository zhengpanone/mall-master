<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="orderSetting"
             ref="orderSettingForm"
             :rules="rules"
             label-width="150px">
      <!-- <el-form-item label="秒杀订单超过：" prop="flashOrderOvertime">
        <el-input v-model="orderSetting.flashOrderOvertime" class="input-width">
          <template slot="append">分</template>
        </el-input>
        <span class="note-margin">未付款，订单自动关闭</span>
      </el-form-item> -->
      <el-form-item label="订单超过：" prop="normalOrderOvertime">
        <el-input v-model="orderSetting.normalOrderOvertime" class="input-width">
          <template slot="append">分</template>
        </el-input>
        <span class="note-margin">未付款，订单自动关闭</span>
      </el-form-item>
      <!-- <el-form-item label="发货超过：" prop="confirmOvertime">
        <el-input v-model="orderSetting.confirmOvertime" class="input-width">
          <template slot="append">天</template>
        </el-input>
        <span class="note-margin">未收货，订单自动完成</span>
      </el-form-item>
      <el-form-item label="订单完成超过：" prop="finishOvertime">
        <el-input v-model="orderSetting.finishOvertime" class="input-width">
          <template slot="append">天</template>
        </el-input>
        <span class="note-margin">自动结束交易，不能申请售后</span>
      </el-form-item>
      <el-form-item label="订单完成超过：" prop="commentOvertime">
        <el-input v-model="orderSetting.commentOvertime" class="input-width">
          <template slot="append">天</template>
        </el-input>
        <span class="note-margin">自动五星好评</span>
      </el-form-item> -->
      <el-form-item>
        <el-button
          @click="confirm('orderSettingForm')"
          type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getOrderSetting, updateOrderSetting } from '@/api/orderSetting';

// Define the default order setting object
const defaultOrderSetting = {
  id: null,
  flashOrderOvertime: 0,
  normalOrderOvertime: 0,
  confirmOvertime: 0,
  finishOvertime: 0,
  commentOvertime: 0,
};

// Reactive state for order setting and validation rules
const orderSetting = reactive(Object.assign({}, defaultOrderSetting));
const rules = {
  flashOrderOvertime: { validator: checkTime, trigger: 'blur' },
  normalOrderOvertime: { validator: checkTime, trigger: 'blur' },
  confirmOvertime: { validator: checkTime, trigger: 'blur' },
  finishOvertime: { validator: checkTime, trigger: 'blur' },
  commentOvertime: { validator: checkTime, trigger: 'blur' },
};

// Validator function to check time inputs
const checkTime = (rule: any, value: any, callback: Function) => {
  if (!value) {
    return callback(new Error('时间不能为空'));
  }
  const intValue = parseInt(value);
  if (!Number.isInteger(intValue)) {
    return callback(new Error('请输入数字值'));
  }
  callback();
};

// Fetch order setting details on component creation
const getDetail = async () => {
  try {
    const response = await getOrderSetting(1);
    Object.assign(orderSetting, response.data);
  } catch (error) {
    console.error('Failed to fetch order setting:', error);
  }
};

// Submit updated order setting
const confirm = async (formName: string) => {
  const formRef = ref(formName);
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await updateOrderSetting(1, orderSetting);
        // Show success message
        window.$message.success('提交成功!', { duration: 1000 });
      } catch (error) {
        console.error('Failed to update order setting:', error);
      }
    } else {
      window.$message.warning('提交参数不合法');
    }
  });
};

// Fetch details on component creation
getDetail();
</script>

<style scoped>
  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 15px;
  }
</style>


