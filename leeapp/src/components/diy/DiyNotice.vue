<template>
    <div style="display:flex;align-items:center;padding:10px 12px;background:'#FFFBEB';borderRadius:'4px'">
        <span v-if="c.noticeType === 'text' && c.noticeTitle" style="color:#3a7bff;font-size:12px;background:#E6F0FF;padding:2px 8px;border-radius:4px;margin-right:8px;white-space:nowrap;">
            {{ c.noticeTitle }}
        </span>
        <div style="flex:1;overflow:hidden;">
            <div :style="{ color: c.textColor, fontSize: (c.fontSize||13)+'px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }">
                {{ list[0]?.text }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ component: { type: Object, default: () => ({}) } })
const c = computed(() => props.component)
const list = computed(() => props.component.list || [])
</script>
