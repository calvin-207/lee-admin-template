<template>
  <view class="home-page">
    <!-- 顶部筛选栏 -->
    <view class="filter-bar">
      <scroll-view scroll-x class="tag-scroll" :show-scrollbar="false">
        <view class="tag-list">
          <view 
            class="tag-chip" 
            :class="{ active: activeTag === '' }"
            @tap="switchTag('')"
          >
            <text>全部</text>
          </view>
          <view 
            v-for="tag in tags" 
            :key="tag._id"
            class="tag-chip" 
            :class="{ active: activeTag === tag.name }"
            @tap="switchTag(tag.name)"
          >
            <text>{{ tag.name }}</text>
          </view>
        </view>
      </scroll-view>
      
      <!-- 排序按钮 -->
      <view class="sort-btn" @tap="toggleSort">
        <text class="sort-text">{{ sortLabel }}</text>
        <text class="sort-arrow">▼</text>
      </view>
    </view>

    <!-- 排序下拉 -->
    <view class="sort-dropdown" v-if="showSortMenu">
      <view 
        class="sort-option" 
        v-for="item in sortOptions" 
        :key="item.value"
        :class="{ active: currentSort === item.value }"
        @tap="selectSort(item.value)"
      >
        <text>{{ item.label }}</text>
        <text v-if="currentSort === item.value" class="check">✓</text>
      </view>
    </view>

    <!-- 瀑布流画廊 -->
    <view class="gallery-container" v-if="imageList.length > 0">
      <!-- 左列 -->
      <view class="gallery-column">
        <image-card 
          v-for="item in leftColumn" 
          :key="item._id"
          :image-data="item"
          :list-width="columnWidth"
          @like="handleLike"
        />
      </view>
      <!-- 右列 -->
      <view class="gallery-column">
        <image-card 
          v-for="item in rightColumn" 
          :key="item._id"
          :image-data="item"
          :list-width="columnWidth"
          @like="handleLike"
        />
      </view>
    </view>

    <!-- 骨架屏 -->
    <view class="gallery-container" v-if="loading && imageList.length === 0">
      <view class="gallery-column">
        <skeleton :count="3" />
      </view>
      <view class="gallery-column">
        <skeleton :count="3" />
      </view>
    </view>

    <!-- 空状态 -->
    <empty-state
      v-if="!loading && imageList.length === 0"
      icon="🎨"
      text="还没有图片"
      sub-text="去上传你的第一张AI生成图片吧"
      action-text="去上传"
      @action="goUpload"
    />

    <!-- 加载更多 -->
    <view class="load-more" v-if="imageList.length > 0">
      <text class="load-text" v-if="loading">加载中...</text>
      <text class="load-text" v-else-if="!hasMore">— 已经到底了 —</text>
      <text class="load-text" v-else>上拉加载更多</text>
    </view>

    <!-- 悬浮上传按钮 -->
    <view class="fab-btn" @tap="goUpload">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script>
import { getImages, getTags } from '@/utils/api.js'

export default {
  data() {
    return {
      imageList: [],
      leftColumn: [],
      rightColumn: [],
      tags: [],
      activeTag: '',
      page: 1,
      pageSize: 20,
      hasMore: true,
      loading: false,
      showSortMenu: false,
      currentSort: 'latest',
      columnWidth: 340,
      sortOptions: [
        { label: '最新发布', value: 'latest' },
        { label: '最多浏览', value: 'views' },
        { label: '最多收藏', value: 'likes' },
        { label: '精选推荐', value: 'featured' }
      ]
    }
  },
  computed: {
    sortLabel() {
      const item = this.sortOptions.find(s => s.value === this.currentSort)
      return item ? item.label : '排序'
    }
  },
  onLoad() {
    this.calcColumnWidth()
    this.loadTags()
    this.loadImages(true)
  },
  onPullDownRefresh() {
    this.refresh()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadImages(false)
    }
  },
  methods: {
    calcColumnWidth() {
      const sysInfo = uni.getSystemInfoSync()
      const screenWidth = sysInfo.windowWidth
      // rpx to px: 750rpx = screenWidth
      // 间距 16rpx 左右各 24rpx padding
      const totalGap = 16 + 24 * 2
      const colWidth = (750 - totalGap) / 2
      this.columnWidth = Math.round(colWidth)
    },

    async loadImages(reset = false) {
      if (this.loading) return
      this.loading = true
      
      if (reset) {
        this.page = 1
        this.hasMore = true
      }

      try {
        const data = await getImages({
          page: this.page,
          pageSize: this.pageSize,
          tag: this.activeTag,
          sort: this.currentSort
        })
        
        const newImages = data.list || []
        
        if (reset) {
          this.imageList = newImages
          this.splitColumns(newImages)
        } else {
          this.imageList = [...this.imageList, ...newImages]
          this.appendToColumns(newImages)
        }
        
        this.hasMore = newImages.length >= this.pageSize
        this.page++
      } catch (err) {
        console.error('加载图片失败:', err)
        // 使用模拟数据（开发阶段）
        if (this.imageList.length === 0) {
          this.loadMockData()
        }
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },

    // 双列分配：按高度均衡分配
    splitColumns(images) {
      this.leftColumn = []
      this.rightColumn = []
      let leftHeight = 0
      let rightHeight = 0
      
      images.forEach(item => {
        const ratio = item.aspectRatio || (item.width && item.height 
          ? item.width / item.height 
          : 0.75)
        const cardH = this.columnWidth / ratio
        
        if (leftHeight <= rightHeight) {
          this.leftColumn.push(item)
          leftHeight += cardH
        } else {
          this.rightColumn.push(item)
          rightHeight += cardH
        }
      })
    },

    appendToColumns(newImages) {
      // 重新计算所有列的高度
      let leftHeight = this.estimateColumnHeight(this.leftColumn)
      let rightHeight = this.estimateColumnHeight(this.rightColumn)
      
      newImages.forEach(item => {
        const ratio = item.aspectRatio || (item.width && item.height 
          ? item.width / item.height 
          : 0.75)
        const cardH = this.columnWidth / ratio
        
        if (leftHeight <= rightHeight) {
          this.leftColumn.push(item)
          leftHeight += cardH
        } else {
          this.rightColumn.push(item)
          rightHeight += cardH
        }
      })
    },

    estimateColumnHeight(column) {
      let total = 0
      column.forEach(item => {
        const ratio = item.aspectRatio || (item.width && item.height 
          ? item.width / item.height 
          : 0.75)
        total += this.columnWidth / ratio
      })
      return total
    },

    async loadTags() {
      try {
        const data = await getTags()
        this.tags = data || []
      } catch (err) {
        // 使用默认标签
        this.tags = [
          { _id: '1', name: '写实' },
          { _id: '2', name: '二次元' },
          { _id: '3', name: '赛博朋克' },
          { _id: '4', name: '人像' },
          { _id: '5', name: '风景' },
          { _id: '6', name: '国风' }
        ]
      }
    },

    switchTag(tag) {
      if (this.activeTag === tag) return
      this.activeTag = tag
      this.loadImages(true)
    },

    toggleSort() {
      this.showSortMenu = !this.showSortMenu
    },

    selectSort(value) {
      this.currentSort = value
      this.showSortMenu = false
      this.loadImages(true)
    },

    handleLike({ id, isLiked }) {
      // 更新本地数据
      const item = this.imageList.find(i => i._id === id)
      if (item) {
        item.isLiked = isLiked
        item.likes = isLiked ? (item.likes || 0) + 1 : (item.likes || 1) - 1
      }
    },

    refresh() {
      this.loadImages(true)
    },

    goUpload() {
      uni.navigateTo({ url: '/pages/upload/index' })
    },

    // 开发阶段模拟数据
    loadMockData() {
      const mockColors = [
        '#E07A5F', '#81B29A', '#F2CC8F', '#3D5A80', '#98C1D9',
        '#EE6C4D', '#293241', '#E0A458', '#8AB17D', '#6A994E'
      ]
      const mockTags = [
        ['写实', '人像'], ['二次元', '风景'], ['赛博朋克', '城市'],
        ['国风', '山水'], ['抽象', '艺术'], ['摄影', '自然']
      ]
      const mockRatios = [0.75, 1, 1.33, 0.56, 0.8]
      
      const mockData = []
      for (let i = 0; i < 10; i++) {
        const ratio = mockRatios[Math.floor(Math.random() * mockRatios.length)]
        const color = mockColors[Math.floor(Math.random() * mockColors.length)]
        mockData.push({
          _id: `mock_${i}_${Date.now()}`,
          fileID: '',
          thumbURL: `https://placehold.co/400x${Math.round(400 / ratio)}/${color.replace('#', '')}/ffffff?text=AI+Art+${i + 1}`,
          title: `AI作品 #${i + 1}`,
          tags: mockTags[Math.floor(Math.random() * mockTags.length)],
          likes: Math.floor(Math.random() * 999),
          views: Math.floor(Math.random() * 9999),
          isFeatured: Math.random() > 0.7,
          aspectRatio: ratio,
          width: 1024,
          height: Math.round(1024 / ratio),
          prompt: 'a beautiful AI generated artwork, highly detailed, 8k',
          model: 'Stable Diffusion XL',
          sampler: 'DPM++ 2M Karras',
          seed: Math.floor(Math.random() * 999999),
          steps: 30,
          cfgScale: 7.5,
          publishDate: new Date(Date.now() - i * 3600000).toISOString()
        })
      }
      
      this.imageList = mockData
      this.splitColumns(mockData)
      this.hasMore = false
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 0 24rpx 120rpx;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #faf8f5;
}

.tag-scroll {
  flex: 1;
  white-space: nowrap;
}

.tag-list {
  display: inline-flex;
  gap: 12rpx;
  padding-right: 16rpx;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 28rpx;
  border-radius: 30rpx;
  background: #ffffff;
  border: 1px solid #e0d5c9;
  transition: all 0.2s;
}

.tag-chip text {
  font-size: 24rpx;
  color: #7a7168;
  white-space: nowrap;
}

.tag-chip.active {
  background: #e07a5f;
  border-color: #e07a5f;
}

.tag-chip.active text {
  color: #ffffff;
  font-weight: 600;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 20rpx;
  margin-left: 12rpx;
  background: #ffffff;
  border: 1px solid #e0d5c9;
  border-radius: 30rpx;
}

.sort-text {
  font-size: 24rpx;
  color: #7a7168;
}

.sort-arrow {
  font-size: 18rpx;
  color: #b0a89f;
}

/* 排序下拉 */
.sort-dropdown {
  position: absolute;
  top: 80rpx;
  right: 24rpx;
  background: #ffffff;
  border: 1px solid #e0d5c9;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  z-index: 101;
  overflow: hidden;
}

.sort-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 32rpx;
  min-width: 200rpx;
}

.sort-option text {
  font-size: 26rpx;
  color: #2d2a26;
}

.sort-option.active text {
  color: #e07a5f;
  font-weight: 600;
}

.sort-option .check {
  color: #e07a5f;
  font-weight: 700;
}

.sort-option:active {
  background: #faf8f5;
}

/* 瀑布流 */
.gallery-container {
  display: flex;
  gap: 16rpx;
  padding-top: 8rpx;
}

.gallery-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 加载更多 */
.load-more {
  padding: 40rpx 0;
  text-align: center;
}

.load-text {
  font-size: 24rpx;
  color: #b0a89f;
}

/* 悬浮按钮 */
.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #e07a5f, #d4694f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(224, 122, 95, 0.4);
  z-index: 99;
  transition: transform 0.2s;
}

.fab-btn:active {
  transform: scale(0.9);
}

/* #ifdef MP-TOUTIAO */
.fab-btn {
  transform: translateZ(0);
}
/* #endif */

.fab-icon {
  font-size: 56rpx;
  color: #ffffff;
  font-weight: 300;
  margin-top: -4rpx;
}
</style>
