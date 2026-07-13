import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '@/views/IndexPage.vue'

const routes = [
    // 首页 (装修默认页)
    { path: '/', redirect: '/index' },
    // 装修页面: /index?name=DIY_INDEX 或 /index?id=1
    { path: '/index', name: 'index', component: IndexPage },
    // 微页面入口 (同样使用 IndexPage, 通过 query 区分)
    { path: '/diy', name: 'diy', component: IndexPage }
]

const router = createRouter({
    history: createWebHistory('/leeapp/'),
    routes
})

export default router
