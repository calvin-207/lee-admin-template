/**
 * HTTP 请求工具
 * 适配 lee-admin-template 后端的响应格式:
 * 成功: { code: 2000, data: ..., msg: '...' }
 * 失败: { code: 400, data: null, msg: '...' }
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

const instance = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截: 携带 token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('lee_token')
  if (token) {
    config.headers['Authorization'] = 'JWT ' + token
  }
  return config
})

// 响应拦截: 统一处理
instance.interceptors.response.use(
  response => {
    const res = response.data
    // lee-admin 后端成功 code 为 2000
    if (res.code === 2000) {
      return res
    }
    console.error('请求失败:', res.msg)
    return Promise.reject(res)
  },
  error => {
    console.error('网络错误:', error.message)
    return Promise.reject(error)
  }
)

class Request {
  get(url, params = {}) {
    return instance.get(url, { params })
  }
  post(url, data = {}) {
    return instance.post(url, data)
  }
  put(url, data = {}) {
    return instance.put(url, data)
  }
  delete(url, params = {}) {
    return instance.delete(url, { params })
  }
}

export default new Request()
