/**
 * API 接口封装（HTTP RESTful 模式）
 * 
 * 统一调用自建后端 HTTP API
 * 所有云函数调用已替换为 HTTP 请求
 * 
 * 配置说明：
 * 在 App.vue 的 globalData.baseUrl 中配置后端地址
 * 示例：baseUrl: 'https://api.tanchunfeng.com'
 */

const app = getApp ? getApp() : null

function getBaseUrl() {
  if (app && app.globalData && app.globalData.baseUrl) {
    return app.globalData.baseUrl
  }
  // 开发环境默认地址（可修改）
  // #ifdef H5
  return '/api'
  // #endif
  return 'https://api.example.com'
}

function getToken() {
  try {
    return uni.getStorageSync('access_token') || ''
  } catch (e) {
    return ''
  }
}

/**
 * HTTP 请求封装
 * @param {string} method - HTTP 方法
 * @param {string} path - API 路径（不含 baseUrl）
 * @param {object} data - 请求体或查询参数
 * @param {object} options - 额外配置
 */
function request(method, path, data = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const baseUrl = options.baseUrl || getBaseUrl()
    const token = options.noAuth ? '' : getToken()

    uni.request({
      url: `${baseUrl}${path}`,
      method,
      data,
      header: {
        'Content-Type': options.contentType || 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      timeout: 30000,
      success: (res) => {
        if (res.statusCode === 401) {
          // Token 过期，清除登录态并跳转登录
          uni.removeStorageSync('access_token')
          uni.removeStorageSync('userInfo')
          uni.showToast({ title: '登录已过期', icon: 'none' })
          reject(new Error('Unauthorized'))
          return
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          const body = res.data
          if (body && body.code === 0) {
            resolve(body.data)
          } else {
            const msg = body && body.message ? body.message : '请求失败'
            uni.showToast({ title: msg, icon: 'none' })
            reject(new Error(msg))
          }
        } else {
          const msg = res.data && res.data.message ? res.data.message : `请求失败 (${res.statusCode})`
          uni.showToast({ title: msg, icon: 'none' })
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请检查网络', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 文件上传（multipart/form-data）
 * @param {string} path - API 路径
 * @param {string} filePath - 本地临时文件路径
 * @param {object} formData - 额外表单数据
 */
function uploadFile(path, filePath, formData = {}) {
  return new Promise((resolve, reject) => {
    const baseUrl = getBaseUrl()
    const token = getToken()

    uni.uploadFile({
      url: `${baseUrl}${path}`,
      filePath,
      name: 'file',
      formData,
      header: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      timeout: 120000,
      success: (res) => {
        let body
        try {
          body = JSON.parse(res.data)
        } catch (e) {
          body = { code: -1, message: '解析响应失败', data: null }
        }

        if (res.statusCode === 401) {
          uni.removeStorageSync('access_token')
          uni.showToast({ title: '登录已过期', icon: 'none' })
          reject(new Error('Unauthorized'))
          return
        }

        if (body.code === 0) {
          resolve(body.data)
        } else {
          const msg = body.message || '上传失败'
          uni.showToast({ title: msg, icon: 'none' })
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '上传失败，请重试', icon: 'none' })
        reject(err)
      }
    })
  })
}

/* ========== 认证接口 ========== */

/**
 * 小程序登录
 * @param {object} params - { code, platform }
 */
export const authLogin = (params) => {
  return request('POST', '/api/auth/login', params, { noAuth: true })
}

/**
 * 获取用户信息（检查登录态）
 */
export const getUserInfo = () => {
  return request('GET', '/api/users/me')
}

/* ========== 图片相关接口 ========== */

/**
 * 获取图片列表
 * @param {object} params - { page, pageSize, tag, style, sort, date }
 */
export const getImages = (params = {}) => {
  return request('GET', '/api/images', params)
}

/**
 * 获取图片详情
 * @param {string} id - 图片ID
 */
export const getImageDetail = (id) => {
  return request('GET', `/api/images/${id}`)
}

/**
 * 搜索图片
 * @param {object} params - { keyword, page, pageSize }
 */
export const searchImages = (params = {}) => {
  return request('GET', '/api/images/search', params)
}

/**
 * 获取相关推荐图片
 * @param {string} id - 图片ID
 */
export const getRelatedImages = (id) => {
  return request('GET', `/api/images/related/${id}`)
}

/**
 * 上传图片
 * @param {object} params - { filePath, title, prompt, ... }
 */
export const uploadImage = (params = {}) => {
  const { filePath, ...formData } = params
  return uploadFile('/api/images/upload', filePath, formData)
}

/* ========== 收藏相关接口 ========== */

/**
 * 切换收藏状态
 * @param {string} imageId - 图片ID
 */
export const toggleFavorite = (imageId) => {
  return request('POST', '/api/favorites/toggle', { imageId })
}

/**
 * 获取收藏列表
 * @param {object} params - { page, pageSize }
 */
export const getFavorites = (params = {}) => {
  return request('GET', '/api/favorites', params)
}

/* ========== 标签接口 ========== */

/**
 * 获取标签列表
 */
export const getTags = () => {
  return request('GET', '/api/tags')
}

/* ========== 数据埋点接口 ========== */

/**
 * 记录浏览事件
 * @param {object} params - { imageId, source }
 */
export const trackView = (params) => {
  return request('POST', '/api/analytics/view', params).catch(() => {
    // 埋点失败静默处理
  })
}

/**
 * 记录分享事件
 * @param {object} params - { imageId, platform }
 */
export const trackShare = (params) => {
  return request('POST', '/api/analytics/share', params).catch(() => {
    // 埋点失败静默处理
  })
}

export default {
  authLogin,
  getUserInfo,
  getImages,
  getImageDetail,
  searchImages,
  getRelatedImages,
  uploadImage,
  toggleFavorite,
  getFavorites,
  getTags,
  trackView,
  trackShare
}
