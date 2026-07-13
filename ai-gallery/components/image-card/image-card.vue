<template>
  <view class="image-card" @tap="handleTap">
    <!-- 图片 -->
    <view class="image-wrapper" :style="{ height: cardHeight + 'rpx' }">
      <image
        :src="imageData.thumbURL || imageData.fileID"
        mode="aspectFill"
        class="card-image"
        lazy-load
        @load="onImageLoad"
        @error="onImageError"
      />
      <!-- 加载骨架 -->
      <view v-if="!loaded" class="skeleton-bg"></view>
      <!-- 加载失败 -->
      <view v-if="error" class="error-bg">
        <text class="error-text">加载失败</text>
      </view>
      <!-- 精选标签 -->
      <view v-if="imageData.isFeatured" class="featured-badge">
        <text class="featured-text">精选</text>
      </view>
    </view>
    
    <!-- 底部信息 -->
    <view class="card-info" v-if="showInfo">
      <view class="info-row">
        <text class="card-title text-ellipsis">{{ imageData.title || '未命名作品' }}</text>
        <view class="like-btn" @tap.stop="handleLike">
          <text class="like-icon" :class="{ liked: isLiked }">{{ isLiked ? '♥' : '♡' }}</text>
          <text class="like-count">{{ likeCount }}</text>
        </view>
      </view>
      <view class="tag-row" v-if="imageData.tags && imageData.tags.length">
        <text class="tag-item" v-for="(tag, i) in displayTags" :key="i">{{ tag }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { formatNumber } from '@/utils/util.js'

export default {
  name: 'ImageCard',
  props: {
    imageData: {
      type: Object,
      default: () => ({})
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    // 列表宽度 (rpx)
    listWidth: {
      type: Number,
      default: 340
    }
  },
  data() {
    return {
      loaded: false,
      error: false,
      isLiked: false,
      likeCount: 0
    }
  },
  computed: {
    cardHeight() {
      // 根据图片宽高比计算高度，默认 4:3
      const ratio = this.imageData.aspectRatio || (this.imageData.width && this.imageData.height 
        ? this.imageData.width / this.imageData.height 
        : 0.75)
      // 卡片宽度 - padding，估算实际图片宽度
      const imgWidth = this.listWidth - 16
      let height = imgWidth / ratio
      // 限制最小和最大高度
      height = Math.max(200, Math.min(height, 600))
      return Math.round(height)
    },
    displayTags() {
      if (!this.imageData.tags) return []
      return this.imageData.tags.slice(0, 3)
    }
  },
  watch: {
    'imageData.likes'(val) {
      this.likeCount = formatNumber(val || 0)
    },
    'imageData.isLiked'(val) {
      this.isLiked = val
    }
  },
  created() {
    this.likeCount = formatNumber(this.imageData.likes || 0)
    this.isLiked = this.imageData.isLiked || false
  },
  methods: {
    onImageLoad() {
      this.loaded = true
      this.error = false
    },
    onImageError() {
      this.loaded = true
      this.error = true
    },
    handleTap() {
      const id = this.imageData._id
      if (id) {
        uni.navigateTo({
          url: `/pages/detail/index?id=${id}`
        })
      }
    },
    handleLike() {
      this.isLiked = !this.isLiked
      let count = this.imageData.likes || 0
      this.likeCount = formatNumber(this.isLiked ? count + 1 : count - 1)
      this.$emit('like', { id: this.imageData._id, isLiked: this.isLiked })
    }
  }
}
</script>

<style scoped>
.image-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f5f0ea;
}

.card-image {
  width: 100%;
  height: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.image-card:active .card-image {
  transform: scale(1.02);
}

.skeleton-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #f0e6dc 25%, #f5f0ea 50%, #f0e6dc 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f0ea;
}

.error-text {
  font-size: 24rpx;
  color: #b0a89f;
}

.featured-badge {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  background: rgba(224, 122, 95, 0.9);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.featured-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 600;
}

.card-info {
  padding: 16rpx 20rpx 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 26rpx;
  color: #2d2a26;
  font-weight: 500;
  flex: 1;
  margin-right: 12rpx;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.like-icon {
  font-size: 32rpx;
  color: #b0a89f;
  transition: all 0.2s;
}

.like-icon.liked {
  color: #e07a5f;
}

.like-count {
  font-size: 22rpx;
  color: #7a7168;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 10rpx;
}

.tag-item {
  font-size: 20rpx;
  color: #81b29a;
  background: rgba(129, 178, 154, 0.12);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
</style>
