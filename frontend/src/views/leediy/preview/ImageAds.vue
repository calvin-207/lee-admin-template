<template>
    <div>
        <div v-for="(item, i) in data.list" :key="i" style="margin-bottom:6px;">
            <img v-if="item.imageUrl" :src="item.imageUrl" style="width:100%;display:block;border-radius:4px;" />
            <div v-else style="height:120px;background:#f5f5f5;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:12px;">图片广告</div>
        </div>
    </div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({ list: [] }) } })
</script>
