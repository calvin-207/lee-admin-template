<template>
    <div :style="{ height: (data.height||20)+'px', background: data.bgColor }"></div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
