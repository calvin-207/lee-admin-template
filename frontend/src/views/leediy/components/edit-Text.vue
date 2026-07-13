<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="标题">
            <el-input v-model="data.text" />
        </el-form-item>
        <el-form-item label="文字颜色">
            <el-color-picker v-model="data.textColor" />
        </el-form-item>
        <el-form-item label="字号">
            <el-slider v-model="data.fontSize" :min="12" :max="30" show-input />
        </el-form-item>
        <el-form-item label="粗细">
            <el-radio-group v-model="data.fontWeight">
                <el-radio label="normal">常规</el-radio>
                <el-radio label="bold">加粗</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="对齐">
            <el-radio-group v-model="data.textAlign">
                <el-radio label="left">左</el-radio>
                <el-radio label="center">中</el-radio>
                <el-radio label="right">右</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="副标题">
            <el-switch v-model="data.subTitle.control" />
        </el-form-item>
        <template v-if="data.subTitle.control">
            <el-form-item label="副标题文">
                <el-input v-model="data.subTitle.text" />
            </el-form-item>
            <el-form-item label="副标题色">
                <el-color-picker v-model="data.subTitle.color" />
            </el-form-item>
        </template>
    </el-form>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({ subTitle: {} }) } })
</script>
