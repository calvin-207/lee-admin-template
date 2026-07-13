// 云函数: toggleFavorite
// 切换收藏状态（收藏/取消收藏）

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { imageId } = event
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID

  if (!imageId) {
    return { code: -1, message: '缺少图片ID', data: null }
  }

  if (!userId) {
    return { code: -1, message: '未获取到用户信息', data: null }
  }

  try {
    // 检查是否已收藏
    const favCollection = db.collection('favorites')
    const existing = await favCollection.where({
      userId,
      imageId
    }).get()

    if (existing.data.length > 0) {
      // 已收藏 -> 取消收藏
      await favCollection.doc(existing.data[0]._id).remove()
      
      // 图片收藏数 -1
      await db.collection('images').doc(imageId).update({
        data: {
          likes: _.inc(-1)
        }
      })

      return {
        code: 0,
        message: '已取消收藏',
        data: { isLiked: false }
      }
    } else {
      // 未收藏 -> 添加收藏
      await favCollection.add({
        data: {
          userId,
          imageId,
          folderName: '默认收藏夹',
          createdAt: new Date()
        }
      })

      // 图片收藏数 +1
      await db.collection('images').doc(imageId).update({
        data: {
          likes: _.inc(1)
        }
      })

      return {
        code: 0,
        message: '已收藏',
        data: { isLiked: true }
      }
    }
  } catch (err) {
    console.error('toggleFavorite error:', err)
    return {
      code: -1,
      message: '操作失败',
      data: null
    }
  }
}
