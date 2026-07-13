import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// 挂载到全局, 供 redirect 工具使用
window.vueRouter = router
app.mount('#app')
