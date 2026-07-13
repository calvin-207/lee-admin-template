<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="高度">
            <el-slider v-model="data.height" :min="5" :max="100" show-input />
        </el-form-item>
        <el-form-item label="背景色">
            <el-color-picker v-model="data.bgColor" />
        </el-form-item>
    </el-form>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
