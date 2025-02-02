// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' //файл маршрутизации
import { registerPlugins } from './plugins'
import store from './store/store'
import '@fontsource/nunito' // импорт шрифта Nunito

const app = createApp(App)
registerPlugins(app)
app.use(router)
app.use(store)
app.mount('#app')
