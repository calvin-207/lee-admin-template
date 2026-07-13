<template>
  <view class="detail-page">
    <!-- 大图预览 -->
    <view class="image-preview" @tap="previewImage">
      <image 
        :src="imageData.fileID || imageData.thumbURL" 
        mode="widthFix" 
        class="preview-image"
        @load="onImageLoad"
      />
      <view class="image-loading" v-if="!imageLoaded">
        <text class="loading-text">加载中...</text>
      </view>
    </view>

    <!-- 操作栏 -->
    <view class="action-bar">
      <view class="action-item" @tap="handleLike">
        <text class="action-icon" :class="{ liked: isLiked }">{{ isLiked ? '♥' : '♡' }}</text>
        <text class="action-text">{{ likeCount }}</text>
      </view>
      <view class="action-item" @tap="handleShare">
        <text class="action-icon">↗</text>
        <text class="action-text">分享</text>
      </view>
      <view class="action-item" @tap="handleDownload">
        <text class="action-icon">↓</text>
        <text class="action-text">保存</text>
      </view>
      <view class="action-item" @tap="handleCopyPrompt" v-if="imageData.prompt">
        <text class="action-icon">⎘</text>
        <text class="action-text">复制Prompt</text>
      </view>
    </view>

    <!-- 标题和标签 -->
    <view class="info-section">
      <text class="detail-title">{{ imageData.title || '未命名作品' }}</text>
      <view class="meta-row">
        <text class="meta-date">{{ formatDate(imageData.publishDate) }}</text>
        <text class="meta-dot">·</text>
        <text class="meta-views">{{ formatNumber(imageData.views || 0) }} 次浏览</text>
      </view>
      <view class="tag-list" v-if="imageData.tags && imageData.tags.length">
        <text class="detail-tag" v-for="(tag, i) in imageData.tags" :key="i">{{ tag }}</text>
      </view>
    </view>

    <!-- AI参数面板 -->
    <view class="param-section" v-if="imageData.prompt">
      <view class="section-header">
        <text class="section-title">生成参数</text>
      </view>
      
      <!-- Prompt -->
      <view class="param-block" v-if="imageData.prompt">
        <view class="param-label-row">
          <text class="param-label">Prompt (正向提示词)</text>
          <text class="copy-btn" @tap="copyPrompt(imageData.prompt)">复制</text>
        </view>
        <view class="param-content">
          <text class="param-text prompt-text">{{ imageData.prompt }}</text>
        </view>
      </view>

      <!-- Negative Prompt -->
      <view class="param-block" v-if="imageData.negativePrompt">
        <text class="param-label">Negative Prompt (反向提示词)</text>
        <view class="param-content">
          <text class="param-text negative-text">{{ imageData.negativePrompt }}</text>
        </view>
      </view>

      <!-- 参数表格 -->
      <view class="param-grid">
        <view class="param-cell" v-if="imageData.model">
          <text class="cell-label">模型</text>
          <text class="cell-value">{{ imageData.model }}</text>
        </view>
        <view class="param-cell" v-if="imageData.sampler">
          <text class="cell-label">采样器</text>
          <text class="cell-value">{{ imageData.sampler }}</text>
        </view>
        <view class="param-cell" v-if="imageData.steps">
          <text class="cell-label">步数</text>
          <text class="cell-value">{{ imageData.steps }}</text>
        </view>
        <view class="param-cell" v-if="imageData.cfgScale">
          <text class="cell-label">CFG</text>
          <text class="cell-value">{{ imageData.cfgScale }}</text>
        </view>
        <view class="param-cell" v-if="imageData.seed">
          <text class="cell-label">Seed</text>
          <text class="cell-value">{{ imageData.seed }}</text>
        </view>
        <view class="param-cell" v-if="imageData.width && imageData.height">
          <text class="cell-label">尺寸</text>
          <text class="cell-value">{{ imageData.width }} × {{ imageData.height }}</text>
        </view>
      </view>

      <!-- 一键复制全部参数 -->
      <view class="copy-all-btn" @tap="copyAllParams">
        <text class="copy-all-text">复制全部参数</text>
      </view>
    </view>

    <!-- 相关推荐 -->
    <view class="recommend-section" v-if="relatedImages.length > 0">
      <view class="section-header">
        <text class="section-title">相关推荐</text>
      </view>
      <scroll-view scroll-x class="recommend-scroll" :show-scrollbar="false">
        <view class="recommend-list">
          <view 
            class="recommend-item" 
            v-for="item in relatedImages" 
            :key="item._id"
            @tap="goDetail(item._id)"
          >
            <image 
              :src="item.thumbURL || item.fileID" 
              mode="aspectFill"
              class="recommend-image"
              lazy-load
            />
            <text class="recommend-title text-ellipsis">{{ item.title || '未命名' }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getImageDetail, toggleFavorite, getImages } from '@/utils/api.js'
import { formatDate, formatNumber, copyText, downloadFile, saveImageToAlbum } from '@/utils/util.js'
import { shareApp, saveImage, setClipboardData } from '@/utils/platform.js'

export default {
  data() {
    return {
      imageId: '',
      imageData: {},
      relatedImages: [],
      isLiked: false,
      likeCount: 0,
      imageLoaded: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.imageId = options.id
      this.loadDetail(options.id)
    }
  },
  onShareAppMessage() {
    // 多端分享适配
    return shareApp({
      title: this.imageData.title || '看看这张AI生成的图片',
      path: `/pages/detail/index?id=${this.imageId}`,
      // #ifdef MP-WEIXIN
      imageUrl: this.imageData.thumbURL || this.imageData.fileID
      // #endif
    })
  },
  methods: {
    formatDate,
    formatNumber,
    
    async loadDetail(id) {
      uni.showLoading({ title: '加载中' })
      try {
        const data = await getImageDetail(id)
        this.imageData = data
        this.isLiked = data.isLiked || false
        this.likeCount = formatNumber(data.likes || 0)
        this.loadRelated(data.tags)
      } catch (err) {
        console.error('加载详情失败:', err)
        // 使用模拟数据
        this.loadMockDetail(id)
      } finally {
        uni.hideLoading()
      }
    },

    async loadRelated(tags) {
      if (!tags || tags.length === 0) return
      try {
        const data = await getImages({ page: 1, pageSize: 10, tag: tags[0] })
        this.relatedImages = (data.list || []).filter(i => i._id !== this.imageId).slice(0, 6)
      } catch (err) {
        this.relatedImages = []
      }
    },

    onImageLoad() {
      this.imageLoaded = true
    },

    previewImage() {
      const url = this.imageData.fileID || this.imageData.thumbURL
      if (url) {
        uni.previewImage({
          urls: [url],
          current: url
        })
      }
    },

    async handleLike() {
      this.isLiked = !this.isLiked
      const count = this.imageData.likes || 0
      this.likeCount = formatNumber(this.isLiked ? count + 1 : count - 1)
      
      try {
        await toggleFavorite(this.imageId)
        uni.showToast({ 
          title: this.isLiked ? '已收藏' : '已取消', 
          icon: 'none' 
        })
      } catch (err) {
        this.isLiked = !this.isLiked
        this.likeCount = formatNumber(this.isLiked ? count + 1 : count)
      }
    },

    handleShare() {
      // 触发微信原生分享
      uni.showActionSheet({
        itemList: ['分享给好友', '分享到朋友圈', '保存图片'],
        success: (res) => {
          if (res.tapIndex === 2) {
            this.handleDownload()
          } else {
            uni.showToast({ title: '请点击右上角分享', icon: 'none' })
          }
        }
      })
    },

    async handleDownload() {
      const url = this.imageData.fileID || this.imageData.thumbURL
      if (!url) return
      
      uni.showLoading({ title: '下载中' })
      try {
        const tempPath = await downloadFile(url)
        await saveImageToAlbum(tempPath)
      } catch (err) {
        console.error('下载失败:', err)
        uni.showToast({ title: '下载失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },

    handleCopyPrompt() {
      if (this.imageData.prompt) {
        copyText(this.imageData.prompt)
      }
    },

    copyPrompt(text) {
      copyText(text)
    },

    copyAllParams() {
      const d = this.imageData
      let text = ''
      if (d.prompt) text += `Prompt: ${d.prompt}\n`
      if (d.negativePrompt) text += `Negative Prompt: ${d.negativePrompt}\n`
      if (d.model) text += `Model: ${d.model}\n`
      if (d.sampler) text += `Sampler: ${d.sampler}\n`
      if (d.steps) text += `Steps: ${d.steps}\n`
      if (d.cfgScale) text += `CFG Scale: ${d.cfgScale}\n`
      if (d.seed) text += `Seed: ${d.seed}\n`
      if (d.width && d.height) text += `Size: ${d.width}x${d.height}\n`
      
      if (text) {
        copyText(text.trim())
      }
    },

    goDetail(id) {
      uni.redirectTo({ url: `/pages/detail/index?id=${id}` })
    },

    loadMockDetail(id) {
      this.imageData = {
        _id: id,
        fileID: `https://placehold.co/1024x1024/E07A5F/ffffff?text=AI+Art+Detail`,
        thumbURL: `https://placehold.co/1024x1024/E07A5F/ffffff?text=AI+Art+Detail`,
        title: '示例AI作品',
        tags: ['写实', '人像', '高清'],
        likes: 128,
        views: 3856,
        publishDate: new Date().toISOString(),
        prompt: 'a portrait of a beautiful woman, golden hour lighting, highly detailed face, 8k resolution, sharp focus, bokeh background',
        negativePrompt: 'low quality, blurry, deformed, extra fingers, bad anatomy',
        model: 'Stable Diffusion XL',
        sampler: 'DPM++ 2M Karras',
        steps: 30,
        cfgScale: 7.5,
        seed: 345678901,
        width: 1024,
        height: 1024,
        isLiked: false
      }
      this.isLiked = false
      this.likeCount = '128'
      this.relatedImages = []
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #000000;
  padding-bottom: 60rpx;
}

/* 大图 */
.image-preview {
  width: 100%;
  position: relative;
  background: #1a1a1a;
}

.preview-image {
  width: 100%;
  display: block;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 24rpx 0;
  background: #1a1a1a;
  border-bottom: 1rpx solid #333;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  font-size: 40rpx;
  color: #cccccc;
}

.action-icon.liked {
  color: #e07a5f;
}

.action-text {
  font-size: 22rpx;
  color: #999;
}

/* 信息区域 */
.info-section {
  padding: 32rpx;
  background: #1a1a1a;
}

.detail-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  display: block;
  margin-bottom: 12rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.meta-date, .meta-views {
  font-size: 24rpx;
  color: #888;
}

.meta-dot {
  font-size: 24rpx;
  color: #555;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.detail-tag {
  font-size: 22rpx;
  color: #81b29a;
  background: rgba(129, 178, 154, 0.15);
  padding: 6rpx 20rpx;
  border-radius: 8rpx;
}

/* AI参数 */
.param-section {
  padding: 32rpx;
  background: #1a1a1a;
  margin-top: 8rpx;
}

.section-header {
  margin-bottom: 24rpx;
  border-bottom: 1rpx solid #333;
  padding-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.param-block {
  margin-bottom: 32rpx;
}

.param-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.param-label {
  font-size: 26rpx;
  color: #e07a5f;
  font-weight: 600;
}

.copy-btn {
  font-size: 22rpx;
  color: #81b29a;
  padding: 4rpx 16rpx;
  border: 1rpx solid #81b29a;
  border-radius: 8rpx;
}

.param-content {
  background: #222;
  border-radius: 16rpx;
  padding: 20rpx;
}

.param-text {
  font-size: 26rpx;
  color: #ddd;
  line-height: 1.8;
  word-break: break-all;
}

.negative-text {
  color: #888;
}

/* 参数网格 */
.param-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.param-cell {
  flex: 1;
  min-width: 40%;
  background: #222;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.cell-label {
  font-size: 22rpx;
  color: #888;
  display: block;
  margin-bottom: 6rpx;
}

.cell-value {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.copy-all-btn {
  background: linear-gradient(135deg, #e07a5f, #d4694f);
  border-radius: 40rpx;
  padding: 20rpx 0;
  text-align: center;
}

.copy-all-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
}

/* 相关推荐 */
.recommend-section {
  padding: 32rpx;
  background: #1a1a1a;
  margin-top: 8rpx;
}

.recommend-scroll {
  white-space: nowrap;
}

.recommend-list {
  display: inline-flex;
  gap: 16rpx;
  padding-right: 16rpx;
}

.recommend-item {
  width: 200rpx;
  display: inline-block;
}

.recommend-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background: #222;
}

.recommend-title {
  font-size: 24rpx;
  color: #ccc;
  margin-top: 8rpx;
  display: block;
  max-width: 200rpx;
}

/* #ifdef MP-TOUTIAO */
/* 抖音 fixed 定位兼容 */
.action-bar, .copy-all-btn {
  transform: translateZ(0);
}
/* #endif */
</style>
