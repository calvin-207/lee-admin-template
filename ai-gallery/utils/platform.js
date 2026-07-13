/**
 * 多平台适配层
 * 统一封装微信、抖音、QQ 小程序的差异 API
 */

/**
 * 获取当前平台信息
 * @returns {object} { platform, isWeixin, isDouyin, isQQ, isMP }
 */
export function getPlatformInfo() {
  const systemInfo = uni.getSystemInfoSync()
  const platform = systemInfo.uniPlatform || 'unknown'
  return {
    platform,
    isWeixin: platform === 'mp-weixin',
    isDouyin: platform === 'mp-toutiao',
    isQQ: platform === 'mp-qq',
    isMP: ['mp-weixin', 'mp-toutiao', 'mp-qq', 'mp-alipay', 'mp-baidu', 'mp-lark'].includes(platform),
    isApp: platform === 'app',
    isH5: platform === 'h5'
  }
}

/**
 * 获取用户登录凭证（多端适配）
 * @returns {Promise<string>} code
 */
export function login() {
  return new Promise((resolve, reject) => {
    // uni.login 已由 uni-app 封装为跨端 API
    uni.login({
      provider: getPlatformInfo().isWeixin ? 'weixin' : undefined,
      success: (res) => resolve(res.code),
      fail: (err) => reject(err)
    })
  })
}

/**
 * 分享功能（多端适配）
 * @param {object} params - { title, path, imageUrl }
 */
export function shareApp(params) {
  const { title = '探春风 - AI图片欣赏', path = '/pages/index/index', imageUrl = '' } = params

  // #ifdef MP-WEIXIN
  return {
    title,
    path,
    imageUrl,
    success() {
      // 微信分享回调
    }
  }
  // #endif

  // #ifdef MP-TOUTIAO
  return {
    title,
    path,
    imageUrl,
    templateId: '', // 抖音可选模板ID
    success() {}
  }
  // #endif

  // #ifdef MP-QQ
  return {
    title,
    path,
    imageUrl,
    success() {}
  }
  // #endif

  // H5 fallback
  return { title, path }
}

/**
 * 内容安全审核（HTTP 后端 API）
 * 调用自建后端的内容安全审核接口
 * @param {string} filePath - 本地临时文件路径
 * @returns {Promise<boolean>} true = 安全, false = 不安全
 */
export function contentSecurityCheck(filePath) {
  return new Promise((resolve, reject) => {
    const app = getApp ? getApp() : null
    const baseUrl = (app && app.globalData && app.globalData.baseUrl) || ''

    if (!baseUrl) {
      // 未配置后端地址时默认通过（开发阶段）
      console.warn('[contentSecurityCheck] 未配置 baseUrl，跳过审核')
      resolve(true)
      return
    }

    uni.uploadFile({
      url: `${baseUrl}/api/content/check`,
      filePath,
      name: 'file',
      timeout: 30000,
      success: (res) => {
        let body
        try {
          body = JSON.parse(res.data)
        } catch (e) {
          body = { code: -1, safe: true }
        }
        if (body.code === 0 && typeof body.data === 'object') {
          resolve(body.data.safe !== false)
        } else {
          // 审核接口异常时默认通过，但记录日志
          console.warn('[contentSecurityCheck] 审核接口返回异常:', body)
          resolve(true)
        }
      },
      fail: (err) => {
        console.warn('[contentSecurityCheck] 审核请求失败:', err)
        // 网络异常时默认通过（避免阻塞用户体验）
        resolve(true)
      }
    })
  })
}

/**
 * 保存图片到相册（多端适配）
 * @param {string} filePath - 图片临时路径
 */
export function saveImage(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        uni.showToast({ title: '已保存', icon: 'success' })
        resolve()
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          // #ifdef MP-WEIXIN
          uni.showModal({
            title: '提示',
            content: '需要授权保存图片到相册',
            confirmText: '去设置',
            success: (res) => { if (res.confirm) uni.openSetting() }
          })
          // #endif

          // #ifdef MP-TOUTIAO || MP-QQ
          uni.showToast({ title: '请先授权相册权限', icon: 'none' })
          // #endif

          // #ifdef H5
          // H5 浏览器提示用户长按保存
          uni.showToast({ title: '请长按图片保存', icon: 'none' })
          // #endif
        }
        reject(err)
      }
    })
  })
}

/**
 * 获取系统信息并缓存
 */
let _systemInfo = null
export function getSystemInfo() {
  if (_systemInfo) return _systemInfo
  _systemInfo = uni.getSystemInfoSync()
  return _systemInfo
}

/**
 * 获取状态栏高度
 */
export function getStatusBarHeight() {
  return getSystemInfo().statusBarHeight || 0
}

/**
 * 获取导航栏高度（状态栏 + 标题栏）
 */
export function getNavBarHeight() {
  const sysInfo = getSystemInfo()
  // #ifdef MP-TOUTIAO
  // 抖音导航栏可能略有不同
  const menuBtn = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null
  if (menuBtn) {
    return (menuBtn.top - sysInfo.statusBarHeight) * 2 + menuBtn.height + sysInfo.statusBarHeight
  }
  // #endif
  return (sysInfo.statusBarHeight || 0) + 44
}

/**
 * 设置剪贴板（多端适配）
 */
export function setClipboardData(text) {
  // #ifdef MP-WEIXIN
  uni.setClipboardData({ data: text })
  // #endif

  // #ifdef MP-TOUTIAO
  uni.setClipboardData({ text })
  // #endif

  // #ifdef MP-QQ
  uni.setClipboardData({ data: text })
  // #endif

  // #ifdef H5
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
  } else {
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy')
    document.body.removeChild(ta)
  }
  // #endif

  uni.showToast({ title: '已复制', icon: 'success' })
}

export default {
  getPlatformInfo,
  login,
  shareApp,
  contentSecurityCheck,
  saveImage,
  getSystemInfo,
  getStatusBarHeight,
  getNavBarHeight,
  setClipboardData
}
