import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({
      autoImport: true,
    }),
    vueDevTools(), // Добавляем плагин vueDevTools
    createHtmlPlugin({}), // Добавляем плагин createHtmlPlugin
  ],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Проверьте этот путь
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          return 'app'
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    outDir: 'dist', // Убедитесь, что этот путь указан правильно
  },
})
