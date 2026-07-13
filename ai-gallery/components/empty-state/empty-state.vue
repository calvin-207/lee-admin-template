<template>
  <view class="empty-state">
    <view class="empty-icon">{{ icon }}</view>
    <text class="empty-text">{{ text }}</text>
    <text class="empty-sub" v-if="subText">{{ subText }}</text>
    <view class="empty-action" v-if="actionText" @tap="$emit('action')">
      <text class="action-text">{{ actionText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: '📭'
    },
    text: {
      type: String,
      default: '暂无数据'
    },
    subText: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 30rpx;
  color: #7a7168;
  margin-bottom: 8rpx;
}

.empty-sub {
  font-size: 24rpx;
  color: #b0a89f;
}

.empty-action {
  margin-top: 32rpx;
  padding: 16rpx 48rpx;
  background: #e07a5f;
  border-radius: 40rpx;
}

.action-text {
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 500;
}
</style>
