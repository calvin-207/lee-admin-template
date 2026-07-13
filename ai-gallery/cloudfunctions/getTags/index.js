// 云函数: getTags
// 获取标签列表

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const collection = db.collection('tags')

exports.main = async (event, context) => {
  try {
    const result = await collection
      .orderBy('count', 'desc')
      .orderBy('sortOrder', 'asc')
      .limit(50)
      .get()

    return {
      code: 0,
      message: 'success',
      data: result.data
    }
  } catch (err) {
    console.error('getTags error:', err)
    return {
      code: 0,
      message: 'success',
      data: [
        { _id: 'default_1', name: '写实', type: 'style', count: 0 },
        { _id: 'default_2', name: '二次元', type: 'style', count: 0 },
        { _id: 'default_3', name: '赛博朋克', type: 'style', count: 0 },
        { _id: 'default_4', name: '人像', type: 'subject', count: 0 },
        { _id: 'default_5', name: '风景', type: 'subject', count: 0 },
        { _id: 'default_6', name: '国风', type: 'style', count: 0 }
      ]
    }
  }
}
