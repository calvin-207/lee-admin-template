<!--
description：自定义svg图标组件
-->
<template>
    <!-- <span v-if="isEleIcon === -1"></span> -->
    <el-icon v-if="isEleIcon" :style="style" class="lybbnfixlag">
        <component :is="iconName" :class="svgClass"/>
    </el-icon>
    <i v-else class="el-icon" :style="style">
        <svg :class="svgClass" aria-hidden="true">
            <use :xlink:href="iconName" />
        </svg>
    </i>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    iconClass: {
        type: String,
        required: false,
        default: ''
    },
    className: {
        type: String,
        default: ''
    },
    style: Object
})

// 使用缓存的计算属性
const isEleIcon = computed(() => {
    if (!props.iconClass) return -1
    return props.iconClass.includes('lyicon-') ? 0 : 1
})

const iconName = computed(() => {
    if (!props.iconClass) return ''
    return isEleIcon.value === 1
        ? props.iconClass
        : `#icon-${props.iconClass.replace(/lyicon-/g, '')}`
})

const svgClass = computed(() => {
    return props.className || (isEleIcon.value === 0 ? 'svg-icon-lyicon' : 'svg-icon')
})
</script>

<style scoped>
.svg-icon-lyicon {
    height: 1em;
    width: 1em;
}
.lybbnfixlag {
    /* transform: translateZ(0);
    will-change: transform; */
    font-size: 1.28em !important;
}
</style>
