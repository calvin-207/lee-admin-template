/**
 * 通用工具函数
 * 移植自 niucloud uni-app 的 common.ts, 保留装修渲染所需部分
 */

// 图片 URL 处理 (相对路径补全)
export function img(path) {
  if (!path) return ''
  const imgDomain = import.meta.env.VITE_IMG_DOMAIN || ''
  if (typeof path === 'string' && path.startsWith('/')) path = path.replace(/^\//, '')
  if (typeof imgDomain === 'string' && imgDomain.endsWith('/')) {
    return isUrl(path) ? path : `${imgDomain.slice(0, -1)}/${path}`
  }
  return isUrl(path) ? path : `${imgDomain}/${path}`
}

// 判断是否完整 URL
export function isUrl(path) {
  if (!path) return false
  return /^(https?:|\/\/)/.test(path)
}

// 页面跳转
export function redirect({ url = '', param = {}, mode = 'navigateTo' } = {}) {
  if (!url) return
  let query = Object.keys(param).map(k => `${k}=${encodeURIComponent(param[k])}`).join('&')
  if (query) url += (url.includes('?') ? '&' : '?') + query
  const router = window.vueRouter
  if (router) {
    if (mode === 'reLaunch' || mode === 'redirectTo') {
      router.replace(url)
    } else {
      router.push(url)
    }
  }
}
