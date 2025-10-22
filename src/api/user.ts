import request from '@/utils/request'

// 用户信息接口
export interface UserProfile {
  id: number
  mobile: string
  nickname: string
  avatar: string
  gender: number       // 0:未知 1:男 2:女
  motto: string        // 座右铭
  email: string
  birthday: string
}

// 获取用户详细信息
export const getUserProfile = (): Promise<UserProfile> => {
  return request({
    url: '/api/v1/users/profile',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserProfile = (data: Partial<UserProfile>): Promise<UserProfile> => {
  return request({
    url: '/api/v1/users/profile',
    method: 'put',
    data
  })
}

// 上传头像
export const uploadAvatar = (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return request({
    url: '/api/v1/users/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 修改密码
export const changePassword = (data: { old_password: string; new_password: string }): Promise<void> => {
  return request({
    url: '/api/v1/users/change-password',
    method: 'post',
    data
  })
}
