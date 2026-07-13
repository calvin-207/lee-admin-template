// 云函数: getFavorites
// 获取用户收藏列表

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { page = 1, pageSize = 20 } = event
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID

  if (!userId) {
    return {
      code: 0,
      message: 'success',
      data: { list: [], total: 0, page, pageSize }
    }
  }

  const skip = (page - 1) * pageSize

  try {
    // 查询用户收藏
    const favCollection = db.collection('favorites')
    const countResult = await favCollection.where({ userId }).count()
    const total = countResult.total

    const favResult = await favCollection
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    if (favResult.data.length === 0) {
      return {
        code: 0,
        message: 'success',
        data: { list: [], total, page, pageSize }
      }
    }

    // 获取对应的图片信息
    const imageIds = favResult.data.map(f => f.imageId)
    const imagesResult = await db.collection('images')
      .where({ _id: _.in(imageIds) })
      .get()

    // 合并数据
    const list = imagesResult.data.map(img => {
      const fav = favResult.data.find(f => f.imageId === img._id)
      return {
        ...img,
        isLiked: true,
        favoriteDate: fav ? fav.createdAt : null
      }
    })

    return {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
        hasMore: skip + list.length < total
      }
    }
  } catch (err) {
    console.error('getFavorites error:', err)
    return {
      code: -1,
      message: '获取收藏列表失败',
      data: null
    }
  }
}
