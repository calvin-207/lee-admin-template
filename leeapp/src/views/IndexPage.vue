<template>
    <div class="diy-page-wrap" :style="diy.pageStyle.value">
        <div v-if="diy.getLoading()" class="loading-wrap">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
        </div>
        <DiyGroup v-else :data="diy.data.value" />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDiy } from '@/hooks/useDiy'
import DiyGroup from '@/components/DiyGroup.vue'

const route = useRoute()
const diy = useDiy({ name: route.query.name || 'DIY_INDEX', id: route.query.id || 0 })

onMounted(() => {
    diy.fetchData()
})
</script>
