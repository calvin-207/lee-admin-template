<template>
    <div :style="{ textAlign: c.textAlign, color: c.textColor, fontSize: (c.fontSize||16)+'px', fontWeight: c.fontWeight, padding: '8px 0' }">
        {{ c.text }}
        <div v-if="c.subTitle && c.subTitle.control" :style="{ color: c.subTitle.color, fontSize: (c.subTitle.fontSize||14)+'px', marginTop:'4px' }">
            {{ c.subTitle.text }}
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
</script>
