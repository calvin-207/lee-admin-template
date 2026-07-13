<template>
  <view class="mine-page">
    <!-- 用户信息卡 -->
    <view class="user-card">
      <view class="user-avatar">
        <text class="avatar-text">{{ userInfo.avatar || '🎨' }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo.name || 'AI艺术爱好者' }}</text>
        <text class="user-desc">{{ userInfo.desc || '欣赏每一幅AI作品的美' }}</text>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-value">{{ stats.uploaded }}</text>
        <text class="stat-label">已上传</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.favorites }}</text>
        <text class="stat-label">已收藏</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.views }}</text>
        <text class="stat-label">总浏览</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @tap="goFavorites">
        <text class="menu-icon">★</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goUpload">
        <text class="menu-icon">↑</text>
        <text class="menu-text">上传图片</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goHistory">
        <text class="menu-icon">⏱</text>
        <text class="menu-text">浏览历史</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @tap="goAbout">
        <text class="menu-icon">ℹ</text>
        <text class="menu-text">关于</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="clearCache">
        <text class="menu-icon">⌫</text>
        <text class="menu-text">清除缓存</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 最近收藏预览 -->
    <view class="recent-section" v-if="recentFavorites.length > 0">
      <view class="section-header">
        <text class="section-title">最近收藏</text>
        <text class="view-all" @tap="goFavorites">查看全部 ›</text>
      </view>
      <scroll-view scroll-x class="recent-scroll" :show-scrollbar="false">
        <view class="recent-list">
          <view 
            class="recent-item" 
            v-for="item in recentFavorites" 
            :key="item._id"
            @tap="goDetail(item._id)"
          >
            <image 
              :src="item.thumbURL || item.fileID" 
              mode="aspectFill"
              class="recent-image"
              lazy-load
            />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getFavorites } from '@/utils/api.js'
import { formatNumber } from '@/utils/util.js'

export default {
  data() {
    return {
      userInfo: {
        name: 'AI艺术爱好者',
        desc: '欣赏每一幅AI作品的美',
        avatar: '🎨'
      },
      stats: {
        uploaded: 0,
        favorites: 0,
        views: 0
      },
      recentFavorites: []
    }
  },
  onShow() {
    this.loadStats()
    this.loadRecentFavorites()
  },
  methods: {
    formatNumber,
    
    loadStats() {
      // 从本地读取
      try {
        const data = uni.getStorageSync('userStats')
        if (data) {
          this.stats = JSON.parse(data)
        }
      } catch (e) {
        // 使用默认值
        this.stats = { uploaded: 0, favorites: 0, views: 0 }
      }
    },

    async loadRecentFavorites() {
      try {
        const data = await getFavorites({ page: 1, pageSize: 6 })
        this.recentFavorites = data.list || []
        this.stats.favorites = data.total || this.recentFavorites.length
      } catch (err) {
        // 从本地读取
        try {
          const data = uni.getStorageSync('favorites')
          if (data) {
            this.recentFavorites = JSON.parse(data).slice(0, 6)
            this.stats.favorites = this.recentFavorites.length
          }
        } catch (e) {
          this.recentFavorites = []
        }
      }
    },

    goFavorites() {
      // 弹出收藏列表
      uni.navigateTo({ url: '/pages/mine/favorites' })
    },

    goUpload() {
      uni.navigateTo({ url: '/pages/upload/index' })
    },

    goHistory() {
      uni.showToast({ title: '功能开发中', icon: 'none' })
    },

    goAbout() {
      uni.showModal({
        title: '关于',
        content: '探春风 v1.0.0\n\n每天用AI生成图片，在这里欣赏和收藏美好的AI艺术作品。',
        showCancel: false
      })
    },

    goDetail(id) {
      uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
    },

    clearCache() {
      uni.showModal({
        title: '提示',
        content: '确定清除所有缓存数据吗？',
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync()
            this.stats = { uploaded: 0, favorites: 0, views: 0 }
            this.recentFavorites = []
            uni.showToast({ title: '已清除', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  padding: 0 24rpx 60rpx;
}

/* 用户卡 */
.user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 40rpx 32rpx;
  background: linear-gradient(135deg, #e07a5f, #d4694f);
  border-radius: 24rpx;
  margin-top: 24rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 56rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 统计 */
.stats-row {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx 0;
  margin-top: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #2d2a26;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #7a7168;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: #e0d5c9;
}

/* 菜单 */
.menu-section {
  background: #ffffff;
  border-radius: 20rpx;
  margin-top: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0e6dc;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #faf8f5;
}

.menu-icon {
  width: 48rpx;
  font-size: 36rpx;
  text-align: center;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #2d2a26;
}

.menu-arrow {
  font-size: 36rpx;
  color: #b0a89f;
}

/* 最近收藏 */
.recent-section {
  margin-top: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2d2a26;
}

.view-all {
  font-size: 24rpx;
  color: #e07a5f;
}

.recent-scroll {
  white-space: nowrap;
}

.recent-list {
  display: inline-flex;
  gap: 16rpx;
  padding-right: 16rpx;
}

.recent-item {
  display: inline-block;
}

.recent-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
  background: #f0e6dc;
}
</style>
