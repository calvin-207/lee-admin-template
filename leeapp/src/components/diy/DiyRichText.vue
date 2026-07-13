<template>
    <div style="padding:10px;font-size:13px;color:#666;line-height:1.6;" v-html="c.content"></div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
</script>
