/**
 * 装修编辑器状态管理
 * 管理: 页面全局配置 + 组件数组 + 当前选中组件
 * 参照 niucloud admin 的 diy store 简化实现
 */
import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

const genId = () => Math.random().toString(36).slice(2, 12)

export const useDiyStore = defineStore('diy', {
    state: () => ({
        id: 0,
        name: '',
        title: '',
        type: '',
        mode: 'diy',
        isDefault: false,
        // 页面级全局配置
        global: {
            title: '首页',
            pageStartBgColor: '#F7F8FA',
            pageEndBgColor: '',
            pageGradientAngle: 'to bottom',
            bgUrl: '',
            bgHeightScale: 0,
            topStatusBar: {
                style: 'style-1',
                isShow: true,
                bgColor: '#FFFFFF',
                textColor: '#303133',
                textAlign: 'center',
                imgUrl: '',
            },
            popWindow: { show: false },
            bottomTabBar: { control: true, isShow: true },
            copyright: { control: true, isShow: false, textColor: '#ccc' },
        },
        // 组件数组(value)
        value: [],
        // 当前选中组件索引, -99 = 选中页面设置
        currentIndex: -99,
        // 编辑tab: content 内容 / style 样式
        editTab: 'content',
    }),
    getters: {
        // 当前选中的组件对象
        currentComponent(state) {
            if (state.currentIndex < 0 || state.currentIndex >= state.value.length) return null
            // 返回组件的 path(编辑面板名), 用于动态加载
            return state.value[state.currentIndex]?.componentName || null
        },
        // 当前编辑的组件数据(含title等)
        editComponent(state) {
            if (state.currentIndex < 0) return state.global
            const comp = state.value[state.currentIndex]
            if (!comp) return {}
            // 合并默认样式字段, 便于通用样式编辑
            return {
                componentTitle: comp.componentName,
                ...comp,
                pageStartBgColor: comp.pageStartBgColor || '',
                pageEndBgColor: comp.pageEndBgColor || '',
                componentBgUrl: comp.componentBgUrl || '',
                componentBgAlpha: comp.componentBgAlpha ?? 2,
                componentStartBgColor: comp.componentStartBgColor || '',
                componentEndBgColor: comp.componentEndBgColor || '',
                topRounded: comp.topRounded || 0,
                bottomRounded: comp.bottomRounded || 0,
                margin: comp.margin || { top: 0, bottom: 0, both: 0 },
            }
        },
    },
    actions: {
        // 重置状态
        reset() {
            this.$reset()
        },
        // 加载已有页面数据
        loadData(data) {
            this.id = data.id || 0
            this.name = data.name || ''
            this.title = data.title || ''
            this.type = data.type || ''
            this.mode = data.mode || 'diy'
            this.isDefault = data.is_default || false
            if (data.value) {
                try {
                    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
                    this.global = { ...this.global, ...(parsed.global || {}) }
                    this.value = parsed.value || []
                    this.title = parsed.global?.title || this.title
                    this.global.title = parsed.global?.title || this.title
                } catch (e) {
                    console.error('解析装修数据失败', e)
                }
            }
            this.currentIndex = -99
        },
        // 导出保存数据
        exportData() {
            return {
                id: this.id,
                name: this.name,
                title: this.title,
                type: this.type,
                mode: this.mode,
                value: JSON.stringify({
                    global: this.global,
                    value: this.value,
                }),
            }
        },
        // 添加组件
        addComponent(componentName, compConfig) {
            const newComp = cloneDeep(compConfig.value || {})
            this.value.push({
                componentName,
                id: genId(),
                pageStartBgColor: '',
                pageEndBgColor: '',
                pageGradientAngle: 'to bottom',
                componentBgUrl: '',
                componentBgAlpha: 2,
                componentStartBgColor: 'rgba(255,255,255,1)',
                componentEndBgColor: '',
                componentGradientAngle: 'to bottom',
                topRounded: 0,
                bottomRounded: 0,
                elementBgColor: '',
                topElementRounded: 0,
                bottomElementRounded: 0,
                margin: { top: 0, bottom: 0, both: 10 },
                ...newComp,
            })
            this.currentIndex = this.value.length - 1
            this.editTab = 'content'
        },
        // 选中组件
        changeCurrentIndex(index) {
            this.currentIndex = index
            this.editTab = 'content'
        },
        // 删除当前组件
        delComponent() {
            if (this.currentIndex < 0) return
            this.value.splice(this.currentIndex, 1)
            this.currentIndex = -99
        },
        // 复制当前组件
        copyComponent() {
            if (this.currentIndex < 0) return
            const comp = cloneDeep(this.value[this.currentIndex])
            comp.id = genId()
            this.value.splice(this.currentIndex + 1, 0, comp)
            this.currentIndex = this.currentIndex + 1
        },
        // 上移
        moveUp(index) {
            if (index <= 0) return
            const arr = this.value
            ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
        },
        // 下移
        moveDown(index) {
            if (index >= this.value.length - 1) return
            const arr = this.value
            ;[arr[index + 1], arr[index]] = [arr[index], arr[index + 1]]
        },
    },
})
