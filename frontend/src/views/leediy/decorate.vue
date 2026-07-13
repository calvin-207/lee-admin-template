<template>
    <div class="diy-decorate">
        <!-- 顶部操作栏 -->
        <div class="diy-header">
            <div class="header-left">
                <el-button :icon="ArrowLeft" text @click="goBack">返回</el-button>
                <span class="header-title">装修编辑器：{{ diyStore.title || diyStore.global.title }}</span>
            </div>
            <div class="header-right">
                <el-button @click="handlePreview">预览</el-button>
                <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
            </div>
        </div>

        <div class="diy-body">
            <!-- 左栏：组件库 -->
            <div class="diy-left">
                <div class="panel-title">组件库</div>
                <el-scrollbar class="component-list">
                    <el-collapse v-model="activeNames">
                        <el-collapse-item v-for="(group, gkey) in componentData" :key="gkey" :title="group.title" :name="gkey">
                            <div class="comp-grid">
                                <div
                                    v-for="(comp, ckey) in group.list"
                                    :key="ckey"
                                    class="comp-item"
                                    :title="comp.title"
                                    @click="diyStore.addComponent(ckey, comp)"
                                >
                                    <el-icon size="22"><Grid /></el-icon>
                                    <span>{{ comp.title }}</span>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-scrollbar>
            </div>

            <!-- 中栏：预览 -->
            <div class="diy-center">
                <el-scrollbar>
                    <div class="preview-wrap">
                        <el-button class="page-set-btn" size="small" @click="diyStore.changeCurrentIndex(-99)">页面设置</el-button>
                        <div class="phone-frame">
                            <!-- 顶部状态栏 -->
                            <div class="phone-statusbar" @click="diyStore.changeCurrentIndex(-99)">
                                <span>{{ diyStore.global.title }}</span>
                            </div>
                            <!-- 组件预览区 -->
                            <div class="phone-content">
                                <div
                                    v-for="(comp, index) in diyStore.value"
                                    :key="comp.id"
                                    class="comp-preview"
                                    :class="{ selected: diyStore.currentIndex === index }"
                                    @click.stop="diyStore.changeCurrentIndex(index)"
                                >
                                    <!-- 组件渲染(简化预览) -->
                                    <div class="comp-render" :style="compStyle(comp)">
                                        <component
                                            v-if="modules[comp.componentName]"
                                            :is="modules[comp.componentName]"
                                            :data="comp"
                                        />
                                        <div v-else class="comp-placeholder">{{ comp.componentName }}</div>
                                    </div>
                                    <!-- 操作按钮 -->
                                    <div class="comp-tools" v-if="diyStore.currentIndex === index">
                                        <el-icon title="上移" @click.stop="diyStore.moveUp(index)"><Top /></el-icon>
                                        <el-icon title="下移" @click.stop="diyStore.moveDown(index)"><Bottom /></el-icon>
                                        <el-icon title="复制" @click.stop="diyStore.copyComponent"><CopyDocument /></el-icon>
                                        <el-icon title="删除" @click.stop="diyStore.delComponent"><Delete /></el-icon>
                                    </div>
                                </div>
                                <div v-if="!diyStore.value.length" class="empty-tip">从左侧拖入或点击组件开始装修</div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>

            <!-- 右栏：属性编辑 -->
            <div class="diy-right">
                <div class="panel-title">
                    {{ diyStore.currentIndex === -99 ? '页面设置' : '组件属性' }}
                </div>
                <el-scrollbar class="attr-scroll">
                    <!-- 页面级设置 -->
                    <div v-if="diyStore.currentIndex === -99" class="attr-form">
                        <el-form label-width="90px" size="small">
                            <el-form-item label="页面标题">
                                <el-input v-model="diyStore.global.title" />
                            </el-form-item>
                            <el-form-item label="背景色">
                                <el-color-picker v-model="diyStore.global.pageStartBgColor" show-alpha />
                            </el-form-item>
                            <el-divider content-position="left">顶部状态栏</el-divider>
                            <el-form-item label="显示">
                                <el-switch v-model="diyStore.global.topStatusBar.isShow" />
                            </el-form-item>
                            <el-form-item label="背景色">
                                <el-color-picker v-model="diyStore.global.topStatusBar.bgColor" />
                            </el-form-item>
                            <el-form-item label="文字色">
                                <el-color-picker v-model="diyStore.global.topStatusBar.textColor" />
                            </el-form-item>
                            <el-divider content-position="left">底部导航</el-divider>
                            <el-form-item label="显示">
                                <el-switch v-model="diyStore.global.bottomTabBar.isShow" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 组件属性编辑 -->
                    <div v-else class="attr-form">
                        <el-tabs v-model="diyStore.editTab">
                            <el-tab-pane label="内容" name="content">
                                <component
                                    v-if="diyStore.currentComponent && editModules[diyStore.currentComponent]"
                                    :is="editModules[diyStore.currentComponent]"
                                    :data="diyStore.value[diyStore.currentIndex]"
                                />
                                <el-empty v-else description="该组件暂无专属属性编辑" :image-size="60" />
                            </el-tab-pane>
                            <el-tab-pane label="样式" name="style">
                                <common-style-edit :comp="diyStore.value[diyStore.currentIndex]" />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Grid, Top, Bottom, CopyDocument, Delete } from '@element-plus/icons-vue'
import Api from '@/api/api'
import { useDiyStore } from '@/store/diy'
import CommonStyleEdit from './components/CommonStyleEdit.vue'

const route = useRoute()
const router = useRouter()
const diyStore = useDiyStore()

const activeNames = ref(['BASIC'])
const componentData = ref({})
const saving = ref(false)

// 组件预览渲染模块(动态加载)
const previewModules = import.meta.glob('./preview/*.vue', { eager: true })
// 组件属性编辑模块(动态加载)
const editModulesFiles = import.meta.glob('./components/edit-*.vue', { eager: true })

const modules = {}
for (const [key, value] of Object.entries(previewModules)) {
    const name = key.split('/').pop().replace('.vue', '')
    modules[name] = value.default
}
const editModules = {}
for (const [key, value] of Object.entries(editModulesFiles)) {
    const name = key.split('/').pop().replace('.vue', '').replace('edit-', '')
    editModules[name] = value.default
}

// 组件容器样式
const compStyle = (comp) => {
    let style = ''
    if (comp.pageStartBgColor) style += `background:${comp.pageStartBgColor};`
    if (comp.margin) {
        style += `padding:${(comp.margin.top||0)}px ${(comp.margin.both||0)}px ${(comp.margin.bottom||0)}px;`
    }
    return style
}

// 加载组件库
const loadInit = () => {
    Api.leediyInit().then(res => {
        componentData.value = res.data.component || {}
    })
}

// 加载页面数据
const loadPage = () => {
    const id = route.query.id
    if (!id) return
    Api.leediyPageDetail({ id }).then(res => {
        diyStore.loadData(res.data)
    })
}

// 保存
const handleSave = () => {
    saving.value = true
    const data = diyStore.exportData()
    Api.leediyPageEdit(data).then(() => {
        ElMessage.success('保存成功')
    }).finally(() => { saving.value = false })
}

// 预览(打开H5预览)
const handlePreview = () => {
    const url = `${window.location.origin}/h5/?name=${diyStore.name || 'DIY_INDEX'}`
    window.open(url, '_blank')
}

const goBack = () => {
    router.push('/leediy/list')
}

onMounted(() => {
    diyStore.reset()
    loadInit()
    loadPage()
})
</script>

<style lang="scss" scoped>
.diy-decorate {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 0px);
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 2000;
    background: #f0f2f5;

    .diy-header {
        height: 56px;
        background: #3a7bff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        color: #fff;
        flex-shrink: 0;
        .header-left { display: flex; align-items: center; gap: 12px;
            :deep(.el-button) { color: #fff; }
            .header-title { font-size: 15px; }
        }
    }
    .diy-body { display: flex; flex: 1; overflow: hidden; }
    .diy-left { width: 260px; background: #fff; border-right: 1px solid #e8e8e8; display: flex; flex-direction: column; }
    .diy-center { flex: 1; display: flex; justify-content: center; padding: 20px; overflow: auto; }
    .diy-right { width: 380px; background: #fff; border-left: 1px solid #e8e8e8; display: flex; flex-direction: column; }

    .panel-title { padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #f0f0f0; font-size: 14px; flex-shrink: 0; }
    .component-list { flex: 1; }
    .comp-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .comp-item {
        width: calc(33.33% - 6px);
        display: flex; flex-direction: column; align-items: center;
        padding: 10px 4px; cursor: pointer; border-radius: 6px;
        transition: all .2s; gap: 4px;
        span { font-size: 12px; }
        &:hover { background: #ecf5ff; color: #3a7bff; }
    }

    .preview-wrap { position: relative; width: 375px; margin: 0 auto; }
    .page-set-btn { position: absolute; right: 0; top: 0; z-index: 10; }
    .phone-frame {
        width: 375px; min-height: 667px; background: #fff;
        border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.1);
        border: 1px solid #e8e8e8;
    }
    .phone-statusbar {
        height: 44px; display: flex; align-items: center; justify-content: center;
        font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 1px solid #f5f5f5;
    }
    .phone-content { min-height: 600px; }

    .comp-preview {
        position: relative; cursor: pointer; border: 2px dashed transparent;
        &:hover { border-color: #a0cfff; }
        &.selected { border-color: #3a7bff; border-style: solid; }
    }
    .comp-render { min-height: 30px; }
    .comp-placeholder { padding: 20px; text-align: center; color: #999; font-size: 13px; background: #f9f9f9; }
    .comp-tools {
        position: absolute; right: 0; top: 0; display: flex; flex-direction: column;
        gap: 6px; background: rgba(0,0,0,.5); padding: 4px 2px; border-radius: 0 0 0 6px;
        .el-icon { color: #fff; padding: 4px; cursor: pointer; &:hover { color: #3a7bff; } }
    }
    .empty-tip { padding: 80px 20px; text-align: center; color: #ccc; font-size: 13px; }

    .attr-scroll { flex: 1; }
    .attr-form { padding: 12px; }
}
</style>
