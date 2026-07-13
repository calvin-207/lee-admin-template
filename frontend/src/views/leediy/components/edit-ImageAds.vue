<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="图片高度">
            <el-slider v-model="data.imageHeight" :min="50" :max="400" show-input />
        </el-form-item>
        <el-divider>图片列表</el-divider>
        <div v-for="(item, i) in data.list" :key="i" style="margin-bottom:12px;padding:10px;background:#f9f9f9;border-radius:6px;">
            <el-form-item label="图片">
                <upload-image v-model="item.imageUrl" :limit="1" />
            </el-form-item>
            <el-form-item label="跳转">
                <el-input v-model="item.link.name" placeholder="链接标识" />
            </el-form-item>
            <el-button link type="danger" @click="data.list.splice(i,1)">删除</el-button>
        </div>
        <el-button type="primary" plain size="small" @click="data.list.push({ link:{name:''}, imageUrl:'', imgWidth:0, imgHeight:0 })">+ 添加图片</el-button>
    </el-form>
</template>
<script setup>
import UploadImage from '@/components/upload/single-picture.vue'
defineProps({ data: { type: Object, default: () => ({ list: [] }) } })
</script>
