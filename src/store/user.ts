import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  username: string
  mobile: string
  email: string
  avatar: string
  nickname?: string
  gender?: number       // 0:未知 1:男 2:女
  motto?: string        // 座右铭
  birthday?: string
  im_user_id?: number
  im_synced?: boolean
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const imToken = ref<string | null>(localStorage.getItem('imToken'))
  const imUserId = ref<number | null>(localStorage.getItem('imUserId') ? parseInt(localStorage.getItem('imUserId')!) : null)
  const userInfo = ref<UserInfo | null>(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isIMSynced = computed(() => !!imToken.value && !!imUserId.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  const setIMToken = (newIMToken: string) => {
    imToken.value = newIMToken
    localStorage.setItem('imToken', newIMToken)
  }

  const setIMUserId = (newIMUserId: number) => {
    imUserId.value = newIMUserId
    localStorage.setItem('imUserId', newIMUserId.toString())
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const setAuthData = (data: {
    user: UserInfo
    business_token: string
    refresh_token: string
    im_token: string
    im_user_id: number
  }) => {
    setToken(data.business_token)
    setRefreshToken(data.refresh_token)
    setIMToken(data.im_token)
    setIMUserId(data.im_user_id)
    setUserInfo(data.user)
  }

  const clearAuth = () => {
    token.value = null
    refreshToken.value = null
    imToken.value = null
    imUserId.value = null
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('imToken')
    localStorage.removeItem('imUserId')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    refreshToken,
    imToken,
    imUserId,
    userInfo,
    isLoggedIn,
    isIMSynced,
    setToken,
    setRefreshToken,
    setIMToken,
    setIMUserId,
    setUserInfo,
    setAuthData,
    clearAuth
  }
})
