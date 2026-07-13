<template>
    <div v-if="c.isShow" style="position:fixed;right:12px;bottom:80px;z-index:100;">
        <img v-if="img(c.imageUrl)" :src="img(c.imageUrl)" style="width:48px;height:48px;" />
        <div v-else style="width:48px;height:48px;background:#3a7bff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.2);">客服</div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { img } from '@/utils/common'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
</script>
