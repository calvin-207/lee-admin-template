<template>
    <div :style="{ borderTop: (data.lineHeight||1)+'px '+ (data.lineStyle||'solid')+' '+(data.lineColor||'#E5E5E5'), margin: '0 '+(data.paddingBoth||0)+'px' }"></div>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
