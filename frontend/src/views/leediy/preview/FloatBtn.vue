<template>
    <div style="padding:10px;text-align:right;">
        <img v-if="data.imageUrl" :src="data.imageUrl" style="width:48px;height:48px;" />
        <div v-else style="width:48px;height:48px;background:#3a7bff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">悬浮</div>
    </div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
