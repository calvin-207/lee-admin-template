/**
 * 装修页面数据 Hook
 * 移植自 niucloud uni-app 的 hooks/useDiy.ts
 * 核心逻辑: 调用接口拉取装修 JSON → 解析 → 返回 reactive 数据供渲染
 */
import { ref, reactive, computed } from 'vue'
import { getDiyInfo } from '@/api/diy'

export function useDiy(params = {}) {
  const loading = ref(true)
  const id = ref(params.id || 0)
  const name = ref(params.name || '')

  const diyData = reactive({
    pageMode: 'diy',
    title: '',
    global: {},
    value: []
  })

  const getLoading = () => loading.value
  const data = computed(() => diyData)

  const pageStyle = computed(() => {
    let style = ''
    const g = diyData.global
    if (g.pageStartBgColor) {
      if (g.pageStartBgColor && g.pageEndBgColor) {
        style += `background:linear-gradient(${g.pageGradientAngle || 'to bottom'},${g.pageStartBgColor},${g.pageEndBgColor});`
      } else {
        style += 'background-color:' + g.pageStartBgColor + ';'
      }
    }
    if (g.bottomTabBar && g.bottomTabBar.isShow) {
      style += 'min-height:calc(100vh - 50px);'
    } else {
      style += 'min-height:100vh;'
    }
    if (g.bgUrl) style += `background-image:url('${g.bgUrl}');`
    return style
  })

  const fetchData = (callback) => {
    loading.value = true
    const reqParams = { name: name.value }
        if (id.value && Number(id.value) > 0) reqParams.id = id.value
        getDiyInfo(reqParams).then(res => {
      const requestData = res.data
      if (requestData && requestData.value) {
        diyData.pageMode = requestData.mode
        diyData.title = requestData.title

        let sources = typeof requestData.value === 'string'
          ? JSON.parse(requestData.value)
          : requestData.value

        diyData.global = sources.global || {}
        diyData.global.id = requestData.id
        diyData.global.type = requestData.type

        diyData.value = (sources.value || []).map(item => {
          item.pageStyle = ''
          item.componentIsShow = true
          if (item.pageStartBgColor) {
            if (item.pageStartBgColor && item.pageEndBgColor) {
              item.pageStyle += `background:linear-gradient(${item.pageGradientAngle || 'to bottom'},${item.pageStartBgColor},${item.pageEndBgColor});`
            } else {
              item.pageStyle += 'background-color:' + item.pageStartBgColor + ';'
            }
          }
          if (item.margin) {
            if (item.margin.top > 0) item.pageStyle += 'padding-top:' + item.margin.top + 'px;'
            item.pageStyle += 'padding-bottom:' + (item.margin.bottom || 0) + 'px;'
            item.pageStyle += 'padding-right:' + (item.margin.both || 0) + 'px;'
            item.pageStyle += 'padding-left:' + (item.margin.both || 0) + 'px;'
          }
          return item
        })

        document.title = diyData.title || ''
      }
      loading.value = false
      if (callback) callback(requestData)
    }).catch(err => {
      console.error('获取装修数据失败', err)
      loading.value = false
    })
  }

  return { getLoading, data, pageStyle, fetchData }
}
