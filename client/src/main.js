// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' // импортируем createPinia
import App from './App.vue'
import router from './router'
import { registerPlugins } from './plugins'
import '@fontsource/nunito'

const app = createApp(App)

// Создаем и используем экземпляр Pinia
const pinia = createPinia() // создаем экземпляр Pinia
app.use(pinia) // используем Pinia

registerPlugins(app)
app.use(router)
app.mount('#app')
