/**
 * 通用工具函数
 */

/**
 * 格式化日期
 * @param {Date|string|number} date
 * @param {string} format - 格式如 'YYYY-MM-DD HH:mm'
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const pad = (n) => (n < 10 ? '0' + n : '' + n)
  
  const map = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds())
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => map[m])
}

/**
 * 相对时间（如"3小时前"）
 * @param {Date|string|number} date
 */
export function timeAgo(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const now = Date.now()
  const diff = now - d.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return formatDate(date)
}

/**
 * 格式化数字（如 1200 -> 1.2k）
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return 0
  if (num < 1000) return num
  if (num < 10000) return (num / 1000).toFixed(1) + 'k'
  return (num / 10000).toFixed(1) + 'w'
}

/**
 * 节流函数
 */
export function throttle(fn, delay = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 防抖函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 复制文本到剪贴板
 */
export function copyText(text) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        uni.showToast({ title: '已复制', icon: 'success' })
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 保存图片到相册
 */
export function saveImageToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        uni.showToast({ title: '已保存到相册', icon: 'success' })
        resolve()
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          uni.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting()
              }
            }
          })
        }
        reject(err)
      }
    })
  })
}

/**
 * 下载文件
 */
export function downloadFile(url) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error('下载失败'))
        }
      },
      fail: reject
    })
  })
}

/**
 * 获取图片宽高比
 */
export function getAspectRatio(width, height) {
  if (!width || !height) return 1
  return width / height
}

/**
 * 生成唯一ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export default {
  formatDate,
  timeAgo,
  formatNumber,
  throttle,
  debounce,
  copyText,
  saveImageToAlbum,
  downloadFile,
  getAspectRatio,
  generateId
}
