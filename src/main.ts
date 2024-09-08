import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/'
import { store } from './store/'
import i18n from './lang/index'
import ElementPlus from './plugins/element-plus'
// 重要：注册 SVG 图标组件
import 'virtual:svg-icons-register'
// 加载全局样式,只能加载非变量、mixin
import './styles/index.scss'
const app = createApp(App)
app.use(store).use(router).use(ElementPlus).use(i18n)
const modules: Record<string, any> = import.meta.glob(
  './components/**/index.ts',
  { eager: true }
)
for (let path in modules) {
  app.use(modules[path].default)
}
import ids from 'virtual:svg-icons-names'
console.log("qqqqq",ids)

app.mount('#app')
