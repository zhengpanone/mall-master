import { createApp } from 'vue'
import { ElMessage } from 'element-plus'
import './style.css'
import App from './App.vue'
import router from './router/'
import { store } from './store/'
import i18n from './lang/index'
import ElementPlus from './plugins/element-plus'
// 重要：注册 SVG 图标组件
import 'virtual:svg-icons-register'

// 引入 normalize.css
import 'normalize.css/normalize.css'

// 加载全局样式,只能加载非变量、mixin
import './styles/index.scss'
const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('捕获到全局错误:', err, instance, info);

  let errorMessage = '发生未知错误';
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  } else if (err && typeof err === 'object' && 'msg' in err) {
    errorMessage = (err as any).msg;
  }

  ElMessage({
    message: errorMessage,
    type: 'error',
    duration: 1000
  });
};

app.use(store).use(router).use(ElementPlus).use(i18n)
const modules: Record<string, any> = import.meta.glob(
  './components/**/index.ts',
  { eager: true }
)
for (let path in modules) {
  app.use(modules[path].default)
}



app.mount('#app')
