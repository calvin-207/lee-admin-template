<template>
  <view class="upload-page">
    <!-- 上传区域 -->
    <view class="upload-area" @tap="chooseImage">
      <view class="upload-placeholder" v-if="!selectedImage">
        <text class="upload-icon">📷</text>
        <text class="upload-text">点击选择图片</text>
        <text class="upload-hint">支持 JPG、PNG、WebP 格式</text>
      </view>
      <image 
        v-else
        :src="selectedImage" 
        mode="aspectFit" 
        class="preview-image"
      />
    </view>

    <!-- 表单 -->
    <view class="form-section" v-if="selectedImage">
      <!-- 标题 -->
      <view class="form-item">
        <text class="form-label">标题</text>
        <input 
          class="form-input"
          v-model="formData.title"
          placeholder="给作品起个名字"
          maxlength="50"
        />
      </view>

      <!-- Prompt -->
      <view class="form-item">
        <text class="form-label">Prompt (正向提示词)</text>
        <textarea 
          class="form-textarea"
          v-model="formData.prompt"
          placeholder="输入生成图片使用的正向提示词..."
          maxlength="2000"
          auto-height
        />
      </view>

      <!-- Negative Prompt -->
      <view class="form-item">
        <text class="form-label">Negative Prompt (反向提示词)</text>
        <textarea 
          class="form-textarea"
          v-model="formData.negativePrompt"
          placeholder="输入反向提示词（可选）..."
          maxlength="1000"
          auto-height
        />
      </view>

      <!-- 参数网格 -->
      <view class="param-form-grid">
        <view class="param-form-item">
          <text class="form-label">AI模型</text>
          <input 
            class="form-input"
            v-model="formData.model"
            placeholder="如 SDXL"
          />
        </view>
        <view class="param-form-item">
          <text class="form-label">采样器</text>
          <input 
            class="form-input"
            v-model="formData.sampler"
            placeholder="如 DPM++ 2M"
          />
        </view>
        <view class="param-form-item">
          <text class="form-label">步数 (Steps)</text>
          <input 
            class="form-input"
            v-model="formData.steps"
            type="number"
            placeholder="如 30"
          />
        </view>
        <view class="param-form-item">
          <text class="form-label">CFG Scale</text>
          <input 
            class="form-input"
            v-model="formData.cfgScale"
            placeholder="如 7.5"
          />
        </view>
        <view class="param-form-item">
          <text class="form-label">Seed</text>
          <input 
            class="form-input"
            v-model="formData.seed"
            placeholder="如 345678901"
          />
        </view>
        <view class="param-form-item">
          <text class="form-label">尺寸</text>
          <view class="size-inputs">
            <input 
              class="form-input small"
              v-model="formData.width"
              type="number"
              placeholder="宽"
            />
            <text class="size-x">×</text>
            <input 
              class="form-input small"
              v-model="formData.height"
              type="number"
              placeholder="高"
            />
          </view>
        </view>
      </view>

      <!-- 标签 -->
      <view class="form-item">
        <text class="form-label">标签</text>
        <view class="tag-input-area">
          <view class="selected-tags" v-if="formData.tags.length > 0">
            <view 
              class="selected-tag" 
              v-for="(tag, i) in formData.tags" 
              :key="i"
            >
              <text class="selected-tag-text">{{ tag }}</text>
              <text class="remove-tag" @tap="removeTag(i)">✕</text>
            </view>
          </view>
          <input 
            class="tag-input"
            v-model="tagInput"
            placeholder="输入标签后回车"
            confirm-type="done"
            @confirm="addTag"
          />
        </view>
      </view>

      <!-- 风格选择 -->
      <view class="form-item">
        <text class="form-label">风格分类</text>
        <view class="style-list">
          <view 
            class="style-chip" 
            v-for="style in styleOptions"
            :key="style"
            :class="{ active: formData.style === style }"
            @tap="selectStyle(style)"
          >
            <text>{{ style }}</text>
          </view>
        </view>
      </view>

      <!-- 精选 -->
      <view class="form-item switch-item">
        <text class="form-label">设为精选</text>
        <switch 
          :checked="formData.isFeatured" 
          @change="formData.isFeatured = $event.detail.value"
          color="#e07a5f"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-btn" v-if="selectedImage" @tap="submitUpload">
      <text class="submit-text">{{ uploading ? '上传中...' : '上传发布' }}</text>
    </view>
  </view>
</template>

<script>
import { uploadImage } from '@/utils/api.js'
import { contentSecurityCheck } from '@/utils/platform.js'

export default {
  data() {
    return {
      selectedImage: '',
      uploading: false,
      tagInput: '',
      formData: {
        title: '',
        prompt: '',
        negativePrompt: '',
        model: '',
        sampler: '',
        steps: '',
        cfgScale: '',
        seed: '',
        width: '',
        height: '',
        tags: [],
        style: '',
        isFeatured: false
      },
      styleOptions: [
        '写实', '二次元', '赛博朋克', '国风', '抽象',
        '摄影', '插画', '3D渲染', '水彩', '油画'
      ]
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed', 'original'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.selectedImage = res.tempFilePaths[0]
          
          // 自动获取图片尺寸
          uni.getImageInfo({
            src: this.selectedImage,
            success: (info) => {
              this.formData.width = String(info.width)
              this.formData.height = String(info.height)
            }
          })
        }
      })
    },

    addTag() {
      const tag = this.tagInput.trim()
      if (tag && !this.formData.tags.includes(tag)) {
        this.formData.tags.push(tag)
      }
      this.tagInput = ''
    },

    removeTag(index) {
      this.formData.tags.splice(index, 1)
    },

    selectStyle(style) {
      this.formData.style = this.formData.style === style ? '' : style
    },

    async submitUpload() {
      if (!this.selectedImage) {
        uni.showToast({ title: '请先选择图片', icon: 'none' })
        return
      }

      this.uploading = true

      try {
        uni.showLoading({ title: '安全审核中...' })

        // 1. 内容安全审核（调用后端审核接口）
        const isSafe = await contentSecurityCheck(this.selectedImage)
        if (!isSafe) {
          uni.hideLoading()
          uni.showModal({
            title: '审核未通过',
            content: '图片内容不符合规范，请更换图片后重试。',
            showCancel: false
          })
          this.uploading = false
          return
        }

        uni.showLoading({ title: '上传中...' })

        // 2. HTTP 上传图片到后端（multipart/form-data）
        const uploadResult = await uploadImage({
          filePath: this.selectedImage,
          title: this.formData.title || '未命名作品',
          prompt: this.formData.prompt,
          negativePrompt: this.formData.negativePrompt,
          model: this.formData.model,
          sampler: this.formData.sampler,
          steps: String(this.formData.steps || ''),
          cfgScale: String(this.formData.cfgScale || ''),
          seed: this.formData.seed,
          width: String(this.formData.width || '1024'),
          height: String(this.formData.height || '1024'),
          tags: this.formData.tags.join(','),
          style: this.formData.style,
          isFeatured: this.formData.isFeatured ? 'true' : 'false'
        })

        uni.hideLoading()
        uni.showToast({ title: '上传成功，等待审核', icon: 'success' })
        
        // 返回首页
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)

      } catch (err) {
        console.error('上传失败:', err)
        uni.hideLoading()
        uni.showToast({ title: err.message || '上传失败，请重试', icon: 'none' })
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>

<style scoped>
.upload-page {
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: 160rpx;
}

/* 上传区域 */
.upload-area {
  width: 100%;
  min-height: 400rpx;
  background: #ffffff;
  border: 2rpx dashed #e0d5c9;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.upload-icon {
  font-size: 80rpx;
}

.upload-text {
  font-size: 32rpx;
  color: #7a7168;
  font-weight: 500;
}

.upload-hint {
  font-size: 24rpx;
  color: #b0a89f;
}

.preview-image {
  max-width: 100%;
  max-height: 600rpx;
  border-radius: 18rpx;
}

/* 表单 */
.form-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.form-item {
  margin-bottom: 28rpx;
}

.form-label {
  font-size: 26rpx;
  color: #2d2a26;
  font-weight: 600;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: #faf8f5;
  border: 1rpx solid #e0d5c9;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #2d2a26;
}

.form-textarea {
  width: 100%;
  padding: 20rpx 24rpx;
  background: #faf8f5;
  border: 1rpx solid #e0d5c9;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #2d2a26;
  min-height: 120rpx;
  line-height: 1.6;
}

/* 参数网格 */
.param-form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.param-form-item {
  flex: 1;
  min-width: 40%;
}

.size-inputs {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.form-input.small {
  flex: 1;
  height: 72rpx;
  text-align: center;
}

.size-x {
  font-size: 28rpx;
  color: #b0a89f;
}

/* 标签输入 */
.tag-input-area {
  background: #faf8f5;
  border: 1rpx solid #e0d5c9;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  min-height: 80rpx;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(129, 178, 154, 0.15);
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.selected-tag-text {
  font-size: 24rpx;
  color: #81b29a;
}

.remove-tag {
  font-size: 22rpx;
  color: #b0a89f;
}

.tag-input {
  width: 100%;
  height: 60rpx;
  font-size: 28rpx;
  color: #2d2a26;
}

/* 风格 */
.style-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.style-chip {
  padding: 12rpx 28rpx;
  background: #faf8f5;
  border: 1rpx solid #e0d5c9;
  border-radius: 30rpx;
}

.style-chip text {
  font-size: 26rpx;
  color: #7a7168;
}

.style-chip.active {
  background: #e07a5f;
  border-color: #e07a5f;
}

.style-chip.active text {
  color: #ffffff;
  font-weight: 600;
}

/* 开关 */
.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-item .form-label {
  margin-bottom: 0;
}

/* 提交按钮 */
.submit-btn {
  position: fixed;
  bottom: 40rpx;
  left: 24rpx;
  right: 24rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #e07a5f, #d4694f);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(224, 122, 95, 0.4);
}

/* #ifdef MP-TOUTIAO */
.submit-btn {
  transform: translateZ(0);
}
/* #endif */

.submit-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}
</style>
