// 统一导入el-icon图标
import config from "./config"
import api from "@/api/api"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import directives from '@/utils/directive.js';
import leeTable from "@/components/leeTable/index.vue";
import LeeImage from '@/components/image/leeImage.vue';
import LeeImg from '@/components/image/leeImg.vue';

export default {
    install(app) {
        app.config.globalProperties.$CONFIG = config;
        app.config.globalProperties.$API = api;
        // 注册全局elementplus icon组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
        app.use(directives)
        app.component("lee-table", leeTable);
        app.component("lee-image", LeeImage);
        app.component("lee-img", LeeImg);
    }
}
