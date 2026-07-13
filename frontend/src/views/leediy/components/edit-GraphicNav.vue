<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="每行数量">
            <el-slider v-model="data.rowCount" :min="3" :max="6" show-input />
        </el-form-item>
        <el-form-item label="图片大小">
            <el-slider v-model="data.imageSize" :min="20" :max="80" show-input />
        </el-form-item>
        <el-divider>导航项</el-divider>
        <div v-for="(item, i) in data.list" :key="i" style="margin-bottom:12px;padding:10px;background:#f9f9f9;border-radius:6px;">
            <el-form-item label="图标">
                <upload-image v-model="item.imageUrl" :limit="1" />
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="item.title" />
            </el-form-item>
            <el-form-item label="跳转">
                <el-input v-model="item.link.name" placeholder="链接标识" />
            </el-form-item>
            <el-button link type="danger" @click="data.list.splice(i,1)">删除</el-button>
        </div>
        <el-button type="primary" plain size="small" @click="data.list.push({ title:'', link:{name:''}, imageUrl:'', label:{} })">+ 添加导航</el-button>
    </el-form>
</template>
<script setup>
import UploadImage from '@/components/upload/single-picture.vue'
defineProps({ data: { type: Object, default: () => ({ list: [] }) } })
</script>
