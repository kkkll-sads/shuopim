import axios from 'axios'
import { showToast } from 'vant'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    console.log('request.ts: 请求拦截器 - 准备发送请求')
    console.log('request.ts: 请求URL:', config.url)
    console.log('request.ts: 请求方法:', config.method)
    console.log('request.ts: 请求头:', config.headers)
    console.log('request.ts: 请求数据:', config.data)
    
    // 检查是否为IM API请求
    const isIMRequest = config.url?.includes('/api/v1/talk/') || 
                       config.url?.includes('/api/v1/user/') ||
                       config.url?.includes('/api/v1/contact/') ||
                       config.url?.includes('/api/v1/group/') ||
                       config.url?.includes('/api/v1/message/')
    
    if (isIMRequest) {
      // 使用IM Token
      const imToken = localStorage.getItem('imToken')
      if (imToken) {
        config.headers.Authorization = `Bearer ${imToken}`
        console.log('request.ts: 已添加IM Token Authorization头')
      } else {
        console.log('request.ts: 未找到IM Token，跳过Authorization头')
      }
    } else {
      // 使用Django Token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('request.ts: 已添加Django Token Authorization头')
      } else {
        console.log('request.ts: 未找到Django Token，跳过Authorization头')
      }
    }
    
    return config
  },
  (error) => {
    console.error('request.ts: 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    console.log('request.ts: 响应拦截器 - 收到响应')
    console.log('request.ts: 响应状态码:', response.status)
    console.log('request.ts: 响应头:', response.headers)
    console.log('request.ts: 响应数据:', response.data)
    
    const { code, data, message } = response.data
    
    if (code === 200 || code === 201) {
      console.log('request.ts: 响应成功，返回数据:', data)
      return data
    } else {
      console.error('request.ts: 响应失败，错误码:', code, '错误消息:', message)
      showToast(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    console.error('request.ts: 响应拦截器 - 请求失败')
    console.error('request.ts: 错误对象:', error)
    console.error('request.ts: 错误响应:', error.response)
    console.error('request.ts: 错误状态码:', error.response?.status)
    console.error('request.ts: 错误数据:', error.response?.data)
    console.error('request.ts: 错误配置:', error.config)
    
    if (error.response?.status === 401) {
      console.log('request.ts: 401错误，检查是否为IM API错误')
      
      // 检查是否为 IM API 错误
      const isIMApiError = error.config?.url?.includes('127.0.0.1:8501') || 
                         error.config?.url?.includes('localhost:8501')
      
      if (isIMApiError) {
        console.log('request.ts: IM API 401错误，不清除登录状态')
        // IM API 错误时不清除登录状态，只显示错误
        showToast('IM 服务连接失败，请检查 IM 服务是否运行')
      } else {
        console.log('request.ts: 业务API 401错误，清除登录状态并跳转')
        // 清除登录状态
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('imToken')
        localStorage.removeItem('imUserId')
        localStorage.removeItem('userInfo')
        
        // 跳转到登录页
        window.location.href = '/login'
      }
    } else {
      console.error('request.ts: 其他错误，显示错误提示')
      showToast(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
