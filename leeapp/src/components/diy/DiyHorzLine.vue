<template>
    <div :style="{ borderTop: (c.lineHeight||1)+'px '+(c.lineStyle||'solid')+' '+(c.lineColor||'#E5E5E5'), margin: '0 '+(c.paddingBoth||0)+'px' }"></div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
</script>
