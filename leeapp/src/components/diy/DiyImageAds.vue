<template>
    <div>
        <div v-for="(item, i) in list" :key="i" style="margin-bottom:4px;">
            <img v-if="img(item.imageUrl)" :src="img(item.imageUrl)" :style="{ width:'100%', display:'block', borderRadius:'4px', maxHeight:(c.imageHeight||180)+'px', objectFit:'cover' }" />
            <div v-else :style="{ height:(c.imageHeight||180)+'px', background:'#f5f5f5', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc', fontSize:'12px' }">图片广告</div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { img } from '@/utils/common'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
const list = computed(() => props.component.list || [])
</script>
