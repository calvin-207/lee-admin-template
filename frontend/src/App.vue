<template>
    <el-config-provider :locale="locale" :size="siteThemeStore.elementSize" :zIndex="siteThemeStore.elementzIndex">
        <router-view></router-view>
    </el-config-provider>
</template>

<script setup>
    import {ref, onMounted,computed,watch} from 'vue'
    import {useSiteThemeStore} from "@/store/siteTheme";
    import {useUserState} from "@/store/userState";
    import config from '@/config'
    import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
    import en from 'element-plus/dist/locale/en.mjs'
    import { useLeewebsocket } from "@/store/websocket";
    import { useRoute } from 'vue-router';
    const route = useRoute()
    const leewebsocket = useLeewebsocket()
    const userState = useUserState()
    const siteThemeStore = useSiteThemeStore()
    const colorPrimary = siteThemeStore.colorPrimary
    const menuHeaderColor01 = siteThemeStore.menuHeaderColor01
    const menuHeaderColor02 = siteThemeStore.menuHeaderColor02

    const language = ref(config.LANG)
    const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

    onMounted(()=>{
        siteThemeStore.setColorPrimary(colorPrimary)
        if (siteThemeStore.siteTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
            siteThemeStore.setMenuHeaderColor01(menuHeaderColor01)
            siteThemeStore.setMenuHeaderColor02(menuHeaderColor02)
        }

    })

    watch( () => route.path, () => {
            console.log('ws check, ----------')
            if (!leewebsocket.isWebsocket()) {
                try {
                    leewebsocket.initWebSocket()
                } catch (e) {
                    console.log('websocket错误');
                }
            }
        },
        {
            deep: true,
        }
    );

    // 监听宽度变化，更新全局 CSS 变量
    watch(() => siteThemeStore.menuWidth,
        (mwidth) => {
            document.documentElement.style.setProperty('--ry-menu-width', mwidth+"px");
        },
        { immediate: true } // 立即执行以初始化
    );

</script>

<style lang="scss">
    @use '@/assets/lee/css/style.scss' as *;
</style>
