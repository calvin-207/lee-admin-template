// 云函数: uploadImage
// 保存图片元数据到数据库

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const collection = db.collection('images')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const {
    fileID,
    title = '未命名作品',
    prompt = '',
    negativePrompt = '',
    model = '',
    sampler = '',
    steps = 0,
    cfgScale = 0,
    seed = '',
    width = 1024,
    height = 1024,
    tags = [],
    style = '',
    isFeatured = false
  } = event

  if (!fileID) {
    return { code: -1, message: '缺少图片文件', data: null }
  }

  try {
    // 计算宽高比
    const aspectRatio = width / height

    // 生成缩略图URL（通过图片处理服务）
    const thumbURL = fileID + '?imageView2/2/w/600/h/600/q/75/format/webp'

    const now = new Date()

    // 内容安全审核（可选，建议接入）
    let auditStatus = 'approved'
    try {
      const checkResult = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/jpeg',
          value: fileID
        }
      })
      if (checkResult.errCode !== 0) {
        auditStatus = 'rejected'
      }
    } catch (auditErr) {
      // 审核接口不可用时默认通过（开发阶段）
      console.log('审核跳过:', auditErr.errMsg)
    }

    // 保存到数据库
    const result = await collection.add({
      data: {
        fileID,
        thumbURL,
        title,
        prompt,
        negativePrompt,
        model,
        sampler,
        steps: Number(steps),
        cfgScale: Number(cfgScale),
        seed,
        width: Number(width),
        height: Number(height),
        aspectRatio,
        tags,
        style,
        isFeatured,
        auditStatus,
        views: 0,
        likes: 0,
        publishDate: now,
        createdAt: now,
        updatedAt: now,
        uploaderId: wxContext.OPENID || ''
      }
    })

    // 更新标签统计
    if (tags.length > 0) {
      const tagsCollection = db.collection('tags')
      for (const tagName of tags) {
        const existing = await tagsCollection.where({ name: tagName }).get()
        if (existing.data.length > 0) {
          await tagsCollection.doc(existing.data[0]._id).update({
            data: {
              count: db.command.inc(1)
            }
          })
        } else {
          await tagsCollection.add({
            data: {
              name: tagName,
              type: style || 'other',
              count: 1,
              sortOrder: 0,
              createdAt: now
            }
          })
        }
      }
    }

    return {
      code: 0,
      message: '上传成功',
      data: {
        _id: result._id,
        fileID,
        thumbURL,
        title
      }
    }
  } catch (err) {
    console.error('uploadImage error:', err)
    return {
      code: -1,
      message: '上传失败: ' + err.message,
      data: null
    }
  }
}
