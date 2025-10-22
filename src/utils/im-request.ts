import axios from 'axios'
import { showToast } from 'vant'

// 创建IM专用的axios实例
const imRequest = axios.create({
  baseURL: import.meta.env.VITE_IM_API_BASE || 'http://127.0.0.1:8501',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// IM请求拦截器
imRequest.interceptors.request.use(
  (config) => {
    console.log('im-request.ts: IM请求拦截器 - 准备发送请求')
    console.log('im-request.ts: 请求URL:', config.url)
    console.log('im-request.ts: 请求方法:', config.method)
    console.log('im-request.ts: 请求头:', config.headers)
    console.log('im-request.ts: 请求数据:', config.data)
    
    // 使用IM Token
    const imToken = localStorage.getItem('imToken')
    if (imToken) {
      config.headers.Authorization = `Bearer ${imToken}`
      console.log('im-request.ts: 已添加IM Token Authorization头')
    } else {
      console.log('im-request.ts: 未找到IM Token，跳过Authorization头')
    }
    
    return config
  },
  (error) => {
    console.error('im-request.ts: IM请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// IM响应拦截器
imRequest.interceptors.response.use(
  (response) => {
    console.log('im-request.ts: IM响应拦截器 - 收到响应')
    console.log('im-request.ts: 响应状态码:', response.status)
    console.log('im-request.ts: 响应头:', response.headers)
    console.log('im-request.ts: 响应数据:', response.data)
    
    // 检查响应状态码
    if (response.status === 200 || response.status === 201) {
      console.log('im-request.ts: IM响应成功，返回数据:', response.data)
      return response.data
    } else {
      console.error('im-request.ts: IM响应失败，状态码:', response.status)
      showToast('IM请求失败')
      return Promise.reject(new Error('IM请求失败'))
    }
  },
  (error) => {
    console.error('im-request.ts: IM响应拦截器 - 请求失败')
    console.error('im-request.ts: 错误对象:', error)
    console.error('im-request.ts: 错误响应:', error.response)
    console.error('im-request.ts: 错误状态码:', error.response?.status)
    console.error('im-request.ts: 错误数据:', error.response?.data)
    console.error('im-request.ts: 错误配置:', error.config)
    
    if (error.response?.status === 401) {
      console.log('im-request.ts: IM Token过期，清除IM相关数据')
      // IM Token过期，清除IM相关数据
      localStorage.removeItem('imToken')
      localStorage.removeItem('imUserId')
      showToast('IM Token已过期，请重新登录')
    } else {
      console.error('im-request.ts: IM其他错误，显示错误提示')
      showToast(error.message || 'IM网络错误')
    }
    return Promise.reject(error)
  }
)

export default imRequest
