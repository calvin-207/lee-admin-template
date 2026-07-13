<template>
    <div style="padding:10px;font-size:13px;color:#666;" v-html="data.content"></div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
