<template>
    <div style="display:flex;flex-wrap:wrap;">
        <div v-for="(item, i) in data.list" :key="i" :style="{ width: (100/(data.rowCount||4)) + '%' }" style="text-align:center;padding:8px 4px;">
            <img v-if="item.imageUrl" :src="item.imageUrl" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
            <div v-else style="width:40px;height:40px;background:#f0f0f0;border-radius:50%;margin:0 auto;"></div>
            <div style="font-size:12px;color:#666;margin-top:4px;">{{ item.title }}</div>
        </div>
    </div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({ list: [], rowCount: 4 }) } })
</script>
