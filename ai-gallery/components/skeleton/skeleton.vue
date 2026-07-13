<template>
  <view class="skeleton-card" v-for="i in count" :key="i">
    <view class="skeleton-image" :style="{ height: randomHeight + 'rpx' }"></view>
    <view class="skeleton-info">
      <view class="skeleton-line short"></view>
      <view class="skeleton-line shorter"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    count: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      heights: []
    }
  },
  computed: {
    randomHeight() {
      const min = 300
      const max = 500
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
}
</script>

<style scoped>
.skeleton-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.skeleton-image {
  width: 100%;
  background: linear-gradient(90deg, #f0e6dc 25%, #f5f0ea 50%, #f0e6dc 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-info {
  padding: 20rpx;
}

.skeleton-line {
  height: 24rpx;
  border-radius: 8rpx;
  background: linear-gradient(90deg, #f0e6dc 25%, #f5f0ea 50%, #f0e6dc 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 12rpx;
}

.skeleton-line.short {
  width: 70%;
}

.skeleton-line.shorter {
  width: 40%;
  margin-bottom: 0;
}
</style>
