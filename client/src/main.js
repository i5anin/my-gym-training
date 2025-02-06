// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // файл маршрутизации
import { registerPlugins } from './plugins'
import store from './store/store'
import '@fontsource/nunito' // импорт шрифта Nunito

const app = createApp(App)
const pinia = createPinia()

registerPlugins(app)
app.use(router)
app.use(store)
app.use(pinia)
app.mount('#app')
