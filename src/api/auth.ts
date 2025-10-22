import request from '@/utils/request'

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  mobile: string
  password: string
  password_confirm: string
  email: string
  verification_code?: string
  invitation_code?: string
}

export interface AuthResponse {
  code: number
  message: string
  data: {
    user: {
      id: number
      username: string
      mobile: string
      email: string
      avatar: string
      im_user_id: number
      im_synced: boolean
    }
    business_token: string
    refresh_token: string
    im_token: string
    im_user_id: number
  }
}

// 用户注册
export const register = (data: RegisterData): Promise<AuthResponse> => {
  console.log('auth.ts: 准备发送注册请求')
  console.log('auth.ts: 请求数据:', data)
  console.log('auth.ts: 请求URL: /api/v1/auth/register')
  console.log('auth.ts: 请求方法: POST')
  
  return request.post('/api/v1/auth/register', data)
    .then(response => {
      console.log('auth.ts: 注册API成功响应:', response)
      return response
    })
    .catch(error => {
      console.error('auth.ts: 注册API失败，详细错误:', error)
      console.error('auth.ts: 错误类型:', error.constructor.name)
      console.error('auth.ts: 错误消息:', error.message)
      console.error('auth.ts: 错误响应:', error.response)
      console.error('auth.ts: 错误状态码:', error.response?.status)
      console.error('auth.ts: 错误数据:', error.response?.data)
      console.error('auth.ts: 错误配置:', error.config)
      throw error
    })
}

// 用户登录
export const login = (data: LoginData): Promise<AuthResponse> => {
  return request.post('/api/v1/auth/login', data)
}

// 用户登出
export const logout = (): Promise<any> => {
  return request.post('/api/v1/auth/logout')
}

// 刷新 Token
export const refreshToken = (refreshToken: string): Promise<any> => {
  return request.post('/api/v1/auth/refresh', { refresh: refreshToken })
}

// 获取用户信息
export const getUserProfile = (): Promise<any> => {
  return request.get('/api/v1/auth/profile')
}
