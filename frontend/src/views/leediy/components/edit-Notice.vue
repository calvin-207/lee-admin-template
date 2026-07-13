<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="标题">
            <el-input v-model="data.noticeTitle" />
        </el-form-item>
        <el-form-item label="滚动方式">
            <el-radio-group v-model="data.scrollWay">
                <el-radio label="horizontal">横向滚动</el-radio>
                <el-radio label="upDown">上下滚动</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="文字色">
            <el-color-picker v-model="data.textColor" />
        </el-form-item>
        <el-divider>公告内容</el-divider>
        <div v-for="(item, i) in data.list" :key="i" style="display:flex;gap:8px;margin-bottom:8px;">
            <el-input v-model="item.text" placeholder="公告文字" />
            <el-button link type="danger" @click="data.list.splice(i,1)">删</el-button>
        </div>
        <el-button type="primary" plain size="small" @click="data.list.push({ text:'', link:{name:''} })">+ 添加</el-button>
    </el-form>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({ list: [] }) } })
</script>
