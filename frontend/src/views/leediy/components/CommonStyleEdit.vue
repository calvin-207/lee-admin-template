<template>
    <el-form label-width="90px" size="small">
        <el-form-item label="背景色(始)">
            <el-color-picker v-model="comp.pageStartBgColor" show-alpha />
        </el-form-item>
        <el-form-item label="背景色(终)">
            <el-color-picker v-model="comp.pageEndBgColor" show-alpha />
        </el-form-item>
        <el-form-item label="渐变方向" v-if="comp.pageStartBgColor">
            <el-radio-group v-model="comp.pageGradientAngle">
                <el-radio label="to bottom">上→下</el-radio>
                <el-radio label="to right">左→右</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="组件背景">
            <upload-image v-model="comp.componentBgUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="背景透明度" v-if="comp.componentBgUrl">
            <el-slider v-model="comp.componentBgAlpha" :min="0" :max="10" show-input />
        </el-form-item>
        <el-form-item label="上边距">
            <el-slider v-model="comp.margin.top" :min="-100" :max="100" show-input />
        </el-form-item>
        <el-form-item label="下边距">
            <el-slider v-model="comp.margin.bottom" :min="-100" :max="100" show-input />
        </el-form-item>
        <el-form-item label="左右边距">
            <el-slider v-model="comp.margin.both" :min="0" :max="50" show-input />
        </el-form-item>
        <el-form-item label="上圆角">
            <el-slider v-model="comp.topRounded" :min="0" :max="100" show-input />
        </el-form-item>
        <el-form-item label="下圆角">
            <el-slider v-model="comp.bottomRounded" :min="0" :max="100" show-input />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { computed } from 'vue'
import UploadImage from '@/components/upload/single-picture.vue'

const props = defineProps({
    comp: { type: Object, default: () => ({ margin: {} }) }
})
</script>
