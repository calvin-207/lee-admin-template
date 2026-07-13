<template>
    <div style="display:flex;align-items:center;padding:10px 12px;background:#FFFBEB;border-radius:4px;">
        <span v-if="data.noticeType === 'text'" style="color:#3a7bff;font-size:12px;background:#E6F0FF;padding:2px 8px;border-radius:4px;margin-right:8px;">{{ data.noticeTitle }}</span>
        <span :style="{ color: data.textColor, fontSize: (data.fontSize||13)+'px' }">{{ data.list?.[0]?.text }}</span>
    </div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({ list: [] }) } })
</script>
