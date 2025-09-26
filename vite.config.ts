import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockServe } from 'vite-plugin-mock'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue(), vueJsx({}),
    viteMockServe({
      mockPath: "src/mock",//设置mock文件存储目录
      watchFiles: true,//设置是否监视mockPath对应的文件夹内文件中的更改
      configPath: '',
      logger: true,//是否在控制台显示请求日志
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // 指定符号 ID 格式
      symbolId: 'icon-[name]',

    }),],
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      },
    },
    css: {
      // 启用 CSS Source Map
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables.scss";',
        },
      },
    },
    envDir: path.resolve(__dirname, './env'),
    server: {
      port: 3000,
      host: '0.0.0.0',
      // open: true,
      cors: true, // 允许跨域
      /*proxy: {
        '/api': {
          target: 'http://127.0.0.1:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写
        },
      },*/
    },
    build: {
      // 设置最终构建的浏览器兼容目标
      target: 'es2015',
      // 构建后是否生成 source map 文件
      sourcemap: false,
      //  chunk 大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,
      // 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          dir: 'dist', // 确保输出路径一致
        },
      },
    }
  }
})
