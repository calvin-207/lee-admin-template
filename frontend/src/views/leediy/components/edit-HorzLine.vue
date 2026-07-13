<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="样式">
            <el-radio-group v-model="data.lineStyle">
                <el-radio label="solid">实线</el-radio>
                <el-radio label="dashed">虚线</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="data.lineColor" />
        </el-form-item>
        <el-form-item label="粗细">
            <el-slider v-model="data.lineHeight" :min="1" :max="10" show-input />
        </el-form-item>
    </el-form>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
