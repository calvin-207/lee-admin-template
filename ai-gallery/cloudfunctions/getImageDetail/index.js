// 云函数: getImageDetail
// 获取单张图片详情

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const collection = db.collection('images')

exports.main = async (event, context) => {
  const { id } = event
  const wxContext = cloud.getWXContext()

  if (!id) {
    return { code: -1, message: '缺少图片ID', data: null }
  }

  try {
    // 获取详情
    const result = await collection.doc(id).get()
    const imageData = result.data

    if (!imageData) {
      return { code: -1, message: '图片不存在', data: null }
    }

    // 增加浏览量
    await collection.doc(id).update({
      data: {
        views: _.inc(1)
      }
    })

    // 检查是否已收藏
    let isLiked = false
    if (wxContext.OPENID) {
      const favResult = await db.collection('favorites').where({
        userId: wxContext.OPENID,
        imageId: id
      }).get()
      isLiked = favResult.data.length > 0
    }

    return {
      code: 0,
      message: 'success',
      data: {
        ...imageData,
        isLiked
      }
    }
  } catch (err) {
    console.error('getImageDetail error:', err)
    return {
      code: -1,
      message: '获取图片详情失败',
      data: null
    }
  }
}
