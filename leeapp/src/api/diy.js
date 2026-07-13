/**
 * 装修相关 API
 * 对接 backend/apps/leediy 的前端读取接口
 */
import request from '@/utils/request'

// 获取装修页面数据 (供渲染)
export function getDiyInfo(params) {
  return request.get('leediy/api/diy/', params)
}

// 获取主题配色
export function getDiyTheme() {
  return request.get('leediy/api/theme/')
}
