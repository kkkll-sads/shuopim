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
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data
    
    if (code === 200) {
      return data
    } else {
      showToast(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除登录状态
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // 跳转到登录页
      window.location.href = '/login'
    } else {
      showToast(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
