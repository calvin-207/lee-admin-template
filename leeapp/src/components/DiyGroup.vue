<template>
    <div class="diy-group">
        <!-- 顶部状态栏 -->
        <div
            v-if="data.global && data.global.topStatusBar && data.global.topStatusBar.isShow"
            class="top-status-bar"
            :style="{ background: data.global.topStatusBar.bgColor || '#fff', color: data.global.topStatusBar.textColor || '#333' }"
        >
            <span :style="{ textAlign: data.global.topStatusBar.textAlign || 'center' }">
                {{ data.global.title }}
            </span>
        </div>

        <!-- 组件列表渲染 -->
        <template v-for="(component, index) in data.value" :key="component.id || index">
            <div
                v-show="component.componentIsShow !== false"
                class="diy-component-wrap"
                :style="component.pageStyle"
            >
                <!-- 根据 componentName 动态渲染组件 -->
                <DiyText v-if="component.componentName === 'Text'" :component="component" />
                <DiyImageAds v-else-if="component.componentName === 'ImageAds'" :component="component" />
                <DiyGraphicNav v-else-if="component.componentName === 'GraphicNav'" :component="component" />
                <DiyNotice v-else-if="component.componentName === 'Notice'" :component="component" />
                <DiyRichText v-else-if="component.componentName === 'RichText'" :component="component" />
                <DiyHorzBlank v-else-if="component.componentName === 'HorzBlank'" :component="component" />
                <DiyHorzLine v-else-if="component.componentName === 'HorzLine'" :component="component" />
                <DiyFloatBtn v-else-if="component.componentName === 'FloatBtn'" :component="component" />
                <!-- 未知组件占位 -->
                <div v-else class="diy-unknown">未知组件: {{ component.componentName }}</div>
            </div>
        </template>
    </div>
</template>

<script setup>
import DiyText from './diy/DiyText.vue'
import DiyImageAds from './diy/DiyImageAds.vue'
import DiyGraphicNav from './diy/DiyGraphicNav.vue'
import DiyNotice from './diy/DiyNotice.vue'
import DiyRichText from './diy/DiyRichText.vue'
import DiyHorzBlank from './diy/DiyHorzBlank.vue'
import DiyHorzLine from './diy/DiyHorzLine.vue'
import DiyFloatBtn from './diy/DiyFloatBtn.vue'

defineProps({
    data: { type: Object, default: () => ({ global: {}, value: [] }) }
})
</script>

<style scoped>
.diy-group {
    width: 100%;
    min-height: 100vh;
}
.top-status-bar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 500;
}
.diy-component-wrap {
    position: relative;
}
.diy-unknown {
    padding: 16px;
    text-align: center;
    color: #999;
    font-size: 13px;
    background: #f9f9f9;
}
</style>
