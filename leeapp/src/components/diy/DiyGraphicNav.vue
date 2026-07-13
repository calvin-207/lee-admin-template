<template>
    <div style="display:flex;flex-wrap:wrap;">
        <div v-for="(item, i) in list" :key="i" :style="{ width: 100/rowCount + '%' }" style="text-align:center;padding:8px 4px;">
            <img v-if="img(item.imageUrl)" :src="img(item.imageUrl)" :style="{ width:(c.imageSize||40)+'px', height:(c.imageSize||40)+'px', borderRadius:'50%', objectFit:'cover' }" />
            <div v-else style="width:40px;height:40px;background:#f0f0f0;border-radius:50%;margin:0 auto;"></div>
            <div style="font-size:12px;color:#666;margin-top:4px;">{{ item.title }}</div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { img } from '@/utils/common'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
const list = computed(() => props.component.list || [])
const rowCount = computed(() => props.component.rowCount || 4)
</script>
