<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="图标">
            <upload-image v-model="data.imageUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="跳转">
            <el-input v-model="data.link.name" placeholder="链接标识" />
        </el-form-item>
        <el-form-item label="显示">
            <el-switch v-model="data.isShow" />
        </el-form-item>
    </el-form>
</template>
<script setup>
import UploadImage from '@/components/upload/single-picture.vue'
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
