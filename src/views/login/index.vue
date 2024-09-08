<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginFormRef" label-position="left">
        <div style="text-align: center">
          <SvgIcon name="login-mall" class="color-main" style="width: 56px;height: 56px;color:#409EFF"></SvgIcon>
        </div>
        <h2 class="login-title color-main">慕学生鲜-后台管理系统</h2>
        <el-form-item prop="mobile">
          <el-input name="mobile" type="text" v-model:value="loginForm.mobile" autoComplete="on" placeholder="请输入手机号码">
            <span slot="prefix">
              <SvgIcon name="user" class="color-main"></SvgIcon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码">
            <span slot="prefix">
              <SvgIcon name="password"></SvgIcon>
            </span>
            <span slot="suffix" @click="showPwd">
              <SvgIcon name="eye" class="color-main"></SvgIcon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-input name="captcha" type="text" v-model="loginForm.captcha" autoComplete="on" placeholder="请输入验证码">
            <img slot="suffix" :src="captcha.picPath" alt="" v-if="captcha.picPath" @click="getCaptchas"
              class="captcha-img">
            <span slot="suffix" v-else @click="getCaptchas">换一张</span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;text-align: center">
          <el-tag>用户名/密码: 13058318607/admin123</el-tag>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 100%" type="primary" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
    <el-dialog title="公众号二维码" :visible.sync="dialogVisible" :show-close="false" :center="true" width="30%">
      <div style="text-align: center">
        <span class="font-title-large"><span class="color-main font-extra-large">关注公众号</span>回复<span
            class="color-main font-extra-large">体验</span>获取体验账号</span>
        <br>
        <img src="" width="160" height="160" style="margin-top: 10px">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isValidUsername } from '@/utils/validate';
import { setSupport, getCookie } from '@/utils/support';
import { login, getCaptcha } from '@/api/login';
import login_center_bg from '@/assets/images/login_center_bg.png';
import type { IElForm, IFormRule } from '@/types/element-plus'
import { setToken } from '@/utils/auth';

// 引入 svg-icon 组件
import 'virtual:svg-icons-register';

const router = useRouter();
const route = useRoute();

const loginFormRef = ref<IElForm | null>(null)

const loginForm = reactive({
  mobile: '13058318607',
  password: 'admin123',
  captcha: ''
});

const loginRules = reactive<IFormRule>({
  mobile: [{
    required: true,
    trigger: 'blur',
    validator: (rule: any, value: string, callback: (error?: Error) => void) => {
      if (!isValidUsername(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    }
  }],
  password: [{
    required: true,
    trigger: 'blur',
    validator: (rule: any, value: string, callback: (error?: Error) => void) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'));
      } else {
        callback();
      }
    }
  }]
});

const loading = ref(false);
const pwdType = ref('password');
const dialogVisible = ref(false);
const captcha = ref<any>({});


const getCaptchas = async () => {
  try {
    const res = await getCaptcha();
    captcha.value = res;
  } catch (error) {
    console.error(error);
  }
};

const showPwd = () => {
  pwdType.value = pwdType.value === 'password' ? '' : 'password';
};

const handleLogin = async () => {
  const valid = await loginFormRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  loginForm.captcha = captcha.value.captchaId;

  try {
    const response = await login(loginForm);
    const data = response.data;
    const tokenStr = data.token;
    setToken(tokenStr);
    loading.value = false;
    let redirect = route.query.redirect || '/'
    if (typeof redirect !== 'string') {
      redirect = '/'
    }
    router.replace(redirect)
  } catch (error) {
    loading.value = false;
  }
};

const handleTry = () => {
  dialogVisible.value = true;
};

const dialogConfirm = () => {
  dialogVisible.value = false;
  setSupport(true);
};

onMounted(() => {
  loginForm.mobile = getCookie('mobile') || '13058318607';
  loginForm.password = getCookie('password') || 'admin123';
  getCaptchas();
})
</script>
<style scoped lang="scss">
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409EFF;

  .login-title {
    text-align: center;
  }

  :deep(.el-form-item__content) {
    display: flex;
  }

  .captcha-img {
    width: 110px;
    /* background-color: #409EFF; */
    /* height: 50px; */
  }
}

.login-center-layout {
  background: #409EFF;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>