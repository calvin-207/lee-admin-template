<script>
import { getPlatformInfo } from '@/utils/platform.js'

export default {
  onLaunch() {
    console.log('探春风 App Launch')

    // 获取平台信息
    const platformInfo = getPlatformInfo()
    this.globalData.platform = platformInfo
    console.log('当前平台:', platformInfo.platform)

    // 全局系统信息
    uni.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.windowWidth = res.windowWidth
        this.globalData.windowHeight = res.windowHeight
        this.globalData.navBarHeight = (res.statusBarHeight || 0) + 44
        this.globalData.pixelRatio = res.pixelRatio
      }
    })
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    platform: null,
    cloudType: '',
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 44,
    windowWidth: 375,
    windowHeight: 667,
    pixelRatio: 2,
    userInfo: null,
    themeColor: '#E07A5F',
    themeColorGreen: '#81B29A',
    // 后端 API 基础地址（必填：请替换为你的后端域名）
    // 开发环境示例: 'http://localhost:3000'
    // 生产环境示例: 'https://api.tanchunfeng.com'
    baseUrl: ''
  }
}
</script>

<style>
/* 全局样式 */
@import './uni.scss';

page {
  background-color: #faf8f5;
  font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #2d2a26;
  font-size: 28rpx;
  line-height: 1.6;
}

/* #ifdef MP-TOUTIAO */
/* 抖音小程序：修复默认边距和字体问题 */
page {
  margin: 0 !important;
  padding: 0 !important;
}
/* #endif */

/* 全局滚动优化 */
::-webkit-scrollbar {
  display: none;
}

/* 通用动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 文字溢出 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* 安全区域 */
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* #ifdef MP-TOUTIAO */
/* 抖音 fixed 定位修复 */
.fixed-bottom {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
/* #endif */
</style>
