<template>
    <div :style="{ height: (c.height||20)+'px', background: c.bgColor || 'transparent' }"></div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
</script>
