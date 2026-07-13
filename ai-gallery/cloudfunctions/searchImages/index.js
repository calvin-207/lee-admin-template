// 云函数: searchImages
// 搜索图片（支持关键词、Prompt、标签搜索）

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command
const collection = db.collection('images')

exports.main = async (event, context) => {
  const {
    keyword = '',
    page = 1,
    pageSize = 20
  } = event

  if (!keyword.trim()) {
    return {
      code: 0,
      message: 'success',
      data: { list: [], total: 0, page, pageSize, hasMore: false }
    }
  }

  const skip = (page - 1) * pageSize

  try {
    // 构建搜索条件：标题、Prompt、标签中包含关键词
    const reg = new RegExp(keyword, 'i')
    
    const query = _.and([
      { auditStatus: 'approved' },
      _.or([
        { title: reg },
        { prompt: reg },
        { tags: _.in([keyword]) }
      ])
    ])

    // 查询总数
    const countResult = await collection.where(query).count()
    const total = countResult.total

    // 分页查询
    const listResult = await collection
      .where(query)
      .orderBy('publishDate', 'desc')
      .skip(skip)
      .limit(pageSize)
      .field({
        _id: true,
        fileID: true,
        thumbURL: true,
        title: true,
        tags: true,
        likes: true,
        views: true,
        width: true,
        height: true,
        aspectRatio: true,
        publishDate: true
      })
      .get()

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
    console.error('searchImages error:', err)
    return {
      code: -1,
      message: '搜索失败',
      data: null
    }
  }
}
