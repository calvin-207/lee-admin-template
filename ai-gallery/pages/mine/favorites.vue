<template>
  <view class="favorites-page">
    <!-- 空状态 -->
    <empty-state
      v-if="!loading && favorites.length === 0"
      icon="★"
      text="还没有收藏"
      sub-text="浏览画廊时点击♥即可收藏"
      action-text="去浏览"
      @action="goHome"
    />

    <!-- 收藏列表（瀑布流） -->
    <view class="gallery-container" v-if="favorites.length > 0">
      <view class="gallery-column">
        <image-card 
          v-for="item in leftColumn" 
          :key="item._id"
          :image-data="item"
          :list-width="columnWidth"
          @like="handleUnlike"
        />
      </view>
      <view class="gallery-column">
        <image-card 
          v-for="item in rightColumn" 
          :key="item._id"
          :image-data="item"
          :list-width="columnWidth"
          @like="handleUnlike"
        />
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="favorites.length > 0">
      <text class="load-text" v-if="loading">加载中...</text>
      <text class="load-text" v-else-if="!hasMore">— 已经到底了 —</text>
    </view>
  </view>
</template>

<script>
import { getFavorites, toggleFavorite } from '@/utils/api.js'

export default {
  data() {
    return {
      favorites: [],
      leftColumn: [],
      rightColumn: [],
      page: 1,
      pageSize: 20,
      hasMore: true,
      loading: false,
      columnWidth: 340
    }
  },
  onLoad() {
    this.calcColumnWidth()
    this.loadFavorites()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadFavorites()
    }
  },
  methods: {
    calcColumnWidth() {
      const sysInfo = uni.getSystemInfoSync()
      const totalGap = 16 + 24 * 2
      this.columnWidth = Math.round((750 - totalGap) / 2)
    },

    async loadFavorites() {
      if (this.loading) return
      this.loading = true

      try {
        const data = await getFavorites({
          page: this.page,
          pageSize: this.pageSize
        })

        const newItems = data.list || []
        if (this.page === 1) {
          this.favorites = newItems
          this.splitColumns(newItems)
        } else {
          this.favorites = [...this.favorites, ...newItems]
          this.appendToColumns(newItems)
        }

        this.hasMore = newItems.length >= this.pageSize
        this.page++
      } catch (err) {
        console.error('加载收藏失败:', err)
      } finally {
        this.loading = false
      }
    },

    splitColumns(items) {
      this.leftColumn = []
      this.rightColumn = []
      let leftH = 0, rightH = 0

      items.forEach(item => {
        const ratio = item.aspectRatio || 0.75
        const cardH = this.columnWidth / ratio
        if (leftH <= rightH) {
          this.leftColumn.push(item)
          leftH += cardH
        } else {
          this.rightColumn.push(item)
          rightH += cardH
        }
      })
    },

    appendToColumns(newItems) {
      let leftH = this.estimateHeight(this.leftColumn)
      let rightH = this.estimateHeight(this.rightColumn)

      newItems.forEach(item => {
        const ratio = item.aspectRatio || 0.75
        const cardH = this.columnWidth / ratio
        if (leftH <= rightH) {
          this.leftColumn.push(item)
          leftH += cardH
        } else {
          this.rightColumn.push(item)
          rightH += cardH
        }
      })
    },

    estimateHeight(column) {
      return column.reduce((total, item) => {
        const ratio = item.aspectRatio || 0.75
        return total + this.columnWidth / ratio
      }, 0)
    },

    async handleUnlike({ id }) {
      try {
        await toggleFavorite(id)
        // 从列表中移除
        this.favorites = this.favorites.filter(i => i._id !== id)
        this.splitColumns(this.favorites)
        uni.showToast({ title: '已取消收藏', icon: 'none' })
      } catch (err) {
        console.error('取消收藏失败:', err)
      }
    },

    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  padding: 0 24rpx 40rpx;
}

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

.load-more {
  padding: 40rpx 0;
  text-align: center;
}

.load-text {
  font-size: 24rpx;
  color: #b0a89f;
}
</style>
