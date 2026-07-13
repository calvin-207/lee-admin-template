// 云函数: getImages
// 获取图片列表，支持分页、筛选、排序

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const collection = db.collection('images')

exports.main = async (event, context) => {
  const {
    page = 1,
    pageSize = 20,
    tag = '',
    style = '',
    sort = 'latest',
    date = ''
  } = event

  const skip = (page - 1) * pageSize

  try {
    // 构建查询条件
    let query = { auditStatus: 'approved' }

    if (tag) {
      query.tags = _.in([tag])
    }
    if (style) {
      query.style = style
    }
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      query.publishDate = _.gte(start).and(_.lt(end))
    }

    // 排序
    let orderField = 'publishDate'
    let orderDir = 'desc'
    if (sort === 'views') {
      orderField = 'views'
    } else if (sort === 'likes') {
      orderField = 'likes'
    } else if (sort === 'featured') {
      query.isFeatured = true
    }

    // 查询
    const countResult = await collection.where(query).count()
    const total = countResult.total

    const listResult = await collection
      .where(query)
      .orderBy(orderField, orderDir)
      .skip(skip)
      .limit(pageSize)
      .field({
        _id: true,
        fileID: true,
        thumbURL: true,
        title: true,
        tags: true,
        style: true,
        likes: true,
        views: true,
        isFeatured: true,
        width: true,
        height: true,
        aspectRatio: true,
        publishDate: true
      })
      .get()

    // 增加浏览量（异步）
    if (page === 1) {
      // 仅第一页时增加每日浏览统计
    }

    return {
      code: 0,
      message: 'success',
      data: {
        list: listResult.data,
        total,
        page,
        pageSize,
        hasMore: skip + listResult.data.length < total
      }
    }
  } catch (err) {
    console.error('getImages error:', err)
    return {
      code: -1,
      message: '获取图片列表失败',
      data: null
    }
  }
}
