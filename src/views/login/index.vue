<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <el-card class="login-card" shadow="always">
      <!-- 登录卡片顶部装饰条 -->
      <div class="card-header-decoration"></div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="top"
        autocomplete="on"
      >
        <!-- Logo和标题 -->
        <div class="login-header">
          <div class="logo-container">
            <el-icon class="logo-icon" :size="48">
              <Shop />
            </el-icon>
          </div>
          <h1 class="login-title">慕学生鲜</h1>
          <p class="login-subtitle">后台管理系统</p>
        </div>

        <!-- 手机号输入框 -->
        <el-form-item prop="mobile" class="form-item">
          <el-input
            v-model="loginForm.mobile"
            name="mobile"
            type="text"
            placeholder="请输入手机号码"
            size="large"
            autocomplete="username"
            clearable
          >
            <template #prefix>
              <el-icon class="input-icon">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item prop="password" class="form-item">
          <el-input
            v-model="loginForm.password"
            name="password"
            :type="pwdType"
            placeholder="请输入密码"
            size="large"
            autocomplete="current-password"
            clearable
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon class="input-icon">
                <Lock />
                <!-- <SvgIcon name="password" class="color-main"></SvgIcon> -->
              </el-icon>
            </template>
            <template #suffix>
              <el-icon class="password-toggle" @click="showPwd">
                <View v-if="pwdType === 'password'" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 验证码输入框 -->
        <el-form-item prop="captcha" class="form-item">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              name="captcha"
              type="text"
              placeholder="请输入验证码"
              size="large"
              autocomplete="off"
              class="captcha-input"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon class="input-icon">
                  <Grid />
                </el-icon>
              </template>
            </el-input>
            <div class="captcha-image" @click="changeCaptcha">
              <img
                v-if="captcha.picPath"
                :src="captcha.picPath"
                alt="验证码"
                class="captcha-img"
              />
              <div v-else class="captcha-placeholder">
                <el-icon><RefreshRight /></el-icon>
                <span>点击刷新</span>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 演示账号信息 -->
        <div class="demo-info" @click="fillDemoAccount">
          <el-icon class="demo-icon"><InfoFilled /></el-icon>
          <div class="demo-content">
            <div class="demo-label">演示账号</div>
            <div class="demo-value">13058318607 / admin123</div>
            <div class="demo-tip">点击自动填充</div>
          </div>
        </div>

        <!-- 登录按钮 -->
        <el-form-item class="login-button-item">
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            <span v-if="!loading">登录系统</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>

        <!-- 附加操作 -->
        <div class="additional-actions">
          <el-button type="text" class="action-btn" @click="showQrDialog">
            <el-icon><Qrcode /></el-icon>
            获取体验账号
          </el-button>
          <el-divider direction="vertical" />
          <el-button type="text" class="action-btn">
            <el-icon><QuestionFilled /></el-icon>
            忘记密码
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 二维码弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="公众号二维码"
      width="380px"
      center
      :show-close="false"
      class="qr-dialog"
    >
      <div class="qr-content">
        <div class="qr-text">
          <span class="highlight">关注公众号</span> 回复
          <span class="highlight">体验</span> 获取体验账号
        </div>
        <div class="qr-placeholder">
          <el-icon class="qr-icon" :size="40"><Qrcode /></el-icon>
          <p>二维码区域</p>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { isValidUsername } from "@/utils/validate";
import { setSupport, getCookie } from "@/utils/support";
import { login, getCaptcha } from "@/api/login";
import type { IElForm, IFormRule } from "@/types/element-plus";
import { indexStore } from "@/store/index";
import { ElMessage } from "element-plus";
import {
  Shop,
  Iphone,
  Lock,
  View,
  Hide,
  Grid,
  RefreshRight,
  InfoFilled,
  // Qrcode,
  QuestionFilled,
} from "@element-plus/icons-vue";

// 引入 svg-icon 组件
import "virtual:svg-icons-register";

const router = useRouter();
const route = useRoute();

// 表单引用
const loginFormRef = ref<IElForm | null>(null);

// 表单数据
const loginForm = reactive({
  mobile: "13058318607",
  password: "admin123",
  captcha: "",
});

// 验证码数据
const captcha = ref<any>({});

// 表单验证规则
const loginRules = reactive<IFormRule>({
  mobile: [
    {
      required: true,
      trigger: "blur",
      validator: (
        rule: any,
        value: string,
        callback: (error?: Error) => void
      ) => {
        if (!isValidUsername(value)) {
          callback(new Error("请输入正确的用户名"));
        } else {
          callback();
        }
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      validator: (
        rule: any,
        value: string,
        callback: (error?: Error) => void
      ) => {
        if (value.length < 3) {
          callback(new Error("密码不能小于3位"));
        } else {
          callback();
        }
      },
    },
  ],
});

// 状态管理
const loading = ref(false);
const pwdType = ref("password");
const dialogVisible = ref(false);

// 切换密码显示
const showPwd = () => {
  pwdType.value = pwdType.value === "password" ? "text" : "password";
};

// 刷新验证码
const changeCaptcha = async () => {
  try {
    const res = await getCaptcha();
    captcha.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

// 填充演示账号
const fillDemoAccount = () => {
  loginForm.mobile = "13058318607";
  loginForm.password = "admin123";
  loginForm.captcha = "1234";
  ElMessage.success("已填充演示账号");
};

// 显示二维码弹窗
const showQrDialog = () => {
  dialogVisible.value = true;
};

// 确认二维码弹窗
const dialogConfirm = () => {
  dialogVisible.value = false;
  setSupport(true);
};

// 登录处理
const handleLogin = async () => {
  const valid = await loginFormRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  loginForm.captcha = captcha.value.captchaId;
  try {
    const loginData = await login(loginForm).finally(() => {
      loading.value = false;
    });

    const data = loginData.data;
    const store = indexStore();
    store.setUser({ ...loginData.data.userInfo, token: loginData.data.token });

    let redirect = route.query.redirect || "/";
    if (typeof redirect !== "string") {
      redirect = "/";
    }
    router.replace(redirect);
  } catch (error) {
    loading.value = false;
  }
};

onMounted(() => {
  loginForm.mobile = getCookie("mobile") || "13058318607";
  loginForm.password = getCookie("password") || "admin123";
  changeCaptcha();
});
</script>
<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(
      circle at 25% 25%,
      rgba(255, 255, 255, 0.1) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
  background-size: 100px 100px, 60px 60px;
  animation: float 20s infinite linear;
  pointer-events: none;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-50px, -50px) rotate(360deg);
  }
}

// 登录卡片
.login-card {
  width: 420px;
  max-width: 95vw;
  border-radius: 20px;
  border: none;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  animation: slideUp 0.8s ease;

  :deep(.el-card__body) {
    padding: 40px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 卡片顶部装饰条
.card-header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #67c23a, #e6a23c, #f56c6c);
}

// 登录头部
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #409eff, #5cb3ff);
  border-radius: 16px;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

// 表单样式
.login-form {
  .form-item {
    margin-bottom: 24px;

    :deep(.el-form-item__content) {
      display: flex;
    }

    :deep(.el-input__wrapper) {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &.is-focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);
      }
    }
  }
}

.input-icon {
  color: #409eff;
  font-size: 18px;
}

.password-toggle {
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff;
  }
}

// 验证码容器
.captcha-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #409eff;
    transform: scale(1.02);
  }
}

.captcha-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.captcha-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  color: #7f8c8d;
  font-size: 12px;

  .el-icon {
    margin-bottom: 4px;
  }
}

// 演示账号信息
.demo-info {
  background: linear-gradient(135deg, #e8f4fd, #f0f8ff);
  border: 1px solid #409eff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);
  }
}

.demo-icon {
  color: #409eff;
  font-size: 24px;
}

.demo-content {
  flex: 1;
}

.demo-label {
  color: #409eff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.demo-value {
  color: #2c3e50;
  font-size: 16px;
  font-family: "Monaco", "Consolas", monospace;
  font-weight: 500;
}

.demo-tip {
  color: #7f8c8d;
  font-size: 12px;
  margin-top: 2px;
}

// 登录按钮
.login-button-item {
  margin-bottom: 20px;

  .login-button {
    width: 100%;
    height: 50px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #409eff, #5cb3ff);
    border: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(64, 158, 255, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 附加操作
.additional-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.action-btn {
  color: #7f8c8d;
  font-size: 14px;

  &:hover {
    color: #409eff;
  }

  .el-icon {
    margin-right: 4px;
  }
}

// 二维码弹窗
.qr-dialog {
  :deep(.el-dialog) {
    border-radius: 15px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #409eff, #5cb3ff);
    color: white;
    padding: 20px 24px;

    .el-dialog__title {
      color: white;
      font-weight: 600;
    }
  }
}

.qr-content {
  text-align: center;
  padding: 20px 0;
}

.qr-text {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.highlight {
  color: #409eff;
  font-weight: 600;
  font-size: 18px;
}

.qr-placeholder {
  width: 160px;
  height: 160px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border: 2px dashed #409eff;
  border-radius: 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
}

.qr-icon {
  margin-bottom: 10px;
}

// 响应式设计
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    :deep(.el-card__body) {
      padding: 30px 20px;
    }
  }

  .login-title {
    font-size: 24px;
  }

  .captcha-container {
    flex-direction: column;
  }

  .captcha-image {
    width: 100%;
    height: 45px;
  }

  .demo-info {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>
