<template>
    <div :style="{ textAlign: data.textAlign, color: data.textColor, fontSize: (data.fontSize||16) + 'px', fontWeight: data.fontWeight }">
        {{ data.text }}
        <div v-if="data.subTitle && data.subTitle.control" :style="{ color: data.subTitle.color, fontSize: (data.subTitle.fontSize||14)+'px' }">
            {{ data.subTitle.text }}
        </div>
    </div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
