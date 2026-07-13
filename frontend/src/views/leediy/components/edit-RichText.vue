<template>
    <el-form label-width="80px" size="small">
        <el-form-item label="内容">
            <el-input v-model="data.content" type="textarea" :rows="8" placeholder="支持HTML" />
        </el-form-item>
    </el-form>
</template>
<script setup>
defineProps({ data: { type: Object, default: () => ({}) } })
</script>
