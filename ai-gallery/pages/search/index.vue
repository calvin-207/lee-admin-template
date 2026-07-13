<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input"
          v-model="keyword"
          placeholder="搜索图片、Prompt、标签..."
          confirm-type="search"
          @confirm="doSearch"
          @input="onInput"
        />
        <text 
          class="clear-icon" 
          v-if="keyword"
          @tap="clearKeyword"
        >✕</text>
      </view>
      <view class="search-btn" @tap="doSearch">
        <text class="search-btn-text">搜索</text>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-section" v-if="!hasSearched">
      <view class="section-header" v-if="history.length > 0">
        <text class="section-title">搜索历史</text>
        <text class="clear-history" @tap="clearHistory">清空</text>
      </view>
      <view class="history-tags" v-if="history.length > 0">
        <view 
          class="history-tag" 
          v-for="(item, i) in history" 
          :key="i"
          @tap="searchFromHistory(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>

      <!-- 热门标签 -->
      <view class="hot-section">
        <view class="section-header">
          <text class="section-title">热门标签</text>
        </view>
        <view class="hot-tags">
          <view 
            class="hot-tag" 
            v-for="(tag, i) in hotTags" 
            :key="i"
            @tap="searchTag(tag)"
          >
            <text class="hot-tag-text">{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="results-section" v-if="hasSearched">
      <view class="results-header">
        <text class="results-count">{{ keyword }}的搜索结果</text>
      </view>

      <!-- 瀑布流结果 -->
      <view class="gallery-container" v-if="results.length > 0">
        <view class="gallery-column">
          <image-card 
            v-for="item in leftColumn" 
            :key="item._id"
            :image-data="item"
            :list-width="columnWidth"
          />
        </view>
        <view class="gallery-column">
          <image-card 
            v-for="item in rightColumn" 
            :key="item._id"
            :image-data="item"
            :list-width="columnWidth"
          />
        </view>
      </view>

      <!-- 骨架屏 -->
      <view class="gallery-container" v-if="loading && results.length === 0">
        <view class="gallery-column">
          <skeleton :count="3" />
        </view>
        <view class="gallery-column">
          <skeleton :count="3" />
        </view>
      </view>

      <!-- 空结果 -->
      <empty-state
        v-if="!loading && results.length === 0"
        icon="🔍"
        text="未找到相关图片"
        sub-text="试试其他关键词"
      />

      <!-- 加载更多 -->
      <view class="load-more" v-if="results.length > 0">
        <text class="load-text" v-if="loading">加载中...</text>
        <text class="load-text" v-else-if="!hasMore">— 已经到底了 —</text>
      </view>
    </view>
  </view>
</template>

<script>
import { searchImages } from '@/utils/api.js'
import { debounce } from '@/utils/util.js'

export default {
  data() {
    return {
      keyword: '',
      results: [],
      leftColumn: [],
      rightColumn: [],
      history: [],
      hotTags: ['写实', '二次元', '赛博朋克', '国风', '人像', '风景', '高清', '8K', 'Midjourney', 'Stable Diffusion'],
      page: 1,
      pageSize: 20,
      hasMore: true,
      loading: false,
      hasSearched: false,
      columnWidth: 340
    }
  },
  onLoad() {
    this.calcColumnWidth()
    this.loadHistory()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading && this.hasSearched) {
      this.loadMore()
    }
  },
  methods: {
    calcColumnWidth() {
      const sysInfo = uni.getSystemInfoSync()
      const totalGap = 16 + 24 * 2
      this.columnWidth = Math.round((750 - totalGap) / 2)
    },

    onInput: debounce(function() {
      // 输入时不自动搜索
    }, 300),

    async doSearch() {
      if (!this.keyword.trim()) return
      this.hasSearched = true
      this.page = 1
      this.hasMore = true
      this.results = []
      this.leftColumn = []
      this.rightColumn = []
      
      this.saveHistory(this.keyword.trim())
      await this.loadResults(true)
    },

    async loadResults(reset = false) {
      if (this.loading) return
      this.loading = true

      try {
        const data = await searchImages({
          keyword: this.keyword.trim(),
          page: this.page,
          pageSize: this.pageSize
        })
        
        const newResults = data.list || []
        
        if (reset) {
          this.results = newResults
          this.splitColumns(newResults)
        } else {
          this.results = [...this.results, ...newResults]
          this.appendToColumns(newResults)
        }
        
        this.hasMore = newResults.length >= this.pageSize
        this.page++
      } catch (err) {
        console.error('搜索失败:', err)
        // 模拟数据
        if (this.results.length === 0) {
          this.loadMockResults()
        }
      } finally {
        this.loading = false
      }
    },

    loadMore() {
      this.loadResults(false)
    },

    splitColumns(images) {
      this.leftColumn = []
      this.rightColumn = []
      let leftH = 0, rightH = 0
      
      images.forEach(item => {
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

    appendToColumns(newImages) {
      let leftH = this.estimateHeight(this.leftColumn)
      let rightH = this.estimateHeight(this.rightColumn)
      
      newImages.forEach(item => {
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

    loadHistory() {
      try {
        const data = uni.getStorageSync('searchHistory')
        if (data) this.history = JSON.parse(data)
      } catch (e) {
        this.history = []
      }
    },

    saveHistory(keyword) {
      let history = this.history.filter(h => h !== keyword)
      history.unshift(keyword)
      if (history.length > 10) history = history.slice(0, 10)
      this.history = history
      uni.setStorageSync('searchHistory', JSON.stringify(history))
    },

    clearHistory() {
      this.history = []
      uni.removeStorageSync('searchHistory')
    },

    clearKeyword() {
      this.keyword = ''
      this.hasSearched = false
      this.results = []
    },

    searchFromHistory(keyword) {
      this.keyword = keyword
      this.doSearch()
    },

    searchTag(tag) {
      this.keyword = tag
      this.doSearch()
    },

    loadMockResults() {
      const colors = ['#E07A5F', '#81B29A', '#F2CC8F', '#3D5A80', '#98C1D9']
      const ratios = [0.75, 1, 1.33]
      const mockData = []
      
      for (let i = 0; i < 8; i++) {
        const ratio = ratios[Math.floor(Math.random() * ratios.length)]
        const color = colors[Math.floor(Math.random() * colors.length)]
        mockData.push({
          _id: `search_mock_${i}`,
          thumbURL: `https://placehold.co/400x${Math.round(400 / ratio)}/${color.replace('#', '')}/ffffff?text=${this.keyword}+${i}`,
          title: `${this.keyword} #${i + 1}`,
          tags: [this.keyword, '搜索结果'],
          likes: Math.floor(Math.random() * 200),
          views: Math.floor(Math.random() * 5000),
          aspectRatio: ratio,
          width: 1024,
          height: Math.round(1024 / ratio)
        })
      }
      
      this.results = mockData
      this.splitColumns(mockData)
      this.hasMore = false
    }
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 0 24rpx 120rpx;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #faf8f5;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0d5c9;
  border-radius: 40rpx;
  padding: 0 24rpx;
  height: 72rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #2d2a26;
}

.clear-icon {
  font-size: 28rpx;
  color: #b0a89f;
  padding: 8rpx;
}

.search-btn {
  padding: 0 32rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  background: #e07a5f;
  border-radius: 40rpx;
}

.search-btn-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 历史和标签 */
.history-section, .hot-section {
  padding: 24rpx 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #2d2a26;
}

.clear-history {
  font-size: 24rpx;
  color: #b0a89f;
}

.history-tags, .hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag {
  padding: 12rpx 28rpx;
  background: #ffffff;
  border: 1px solid #e0d5c9;
  border-radius: 30rpx;
}

.history-tag text {
  font-size: 26rpx;
  color: #7a7168;
}

.hot-tag {
  padding: 12rpx 28rpx;
  background: rgba(224, 122, 95, 0.1);
  border: 1px solid rgba(224, 122, 95, 0.2);
  border-radius: 30rpx;
}

.hot-tag-text {
  font-size: 26rpx;
  color: #e07a5f;
}

/* 结果区域 */
.results-section {
  padding-top: 8rpx;
}

.results-header {
  padding: 16rpx 0;
}

.results-count {
  font-size: 26rpx;
  color: #7a7168;
}

/* 瀑布流 */
.gallery-container {
  display: flex;
  gap: 16rpx;
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
</style>
