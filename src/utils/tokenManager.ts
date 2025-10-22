import { useUserStore } from '@/store/user'
import { refreshToken } from '@/api/auth'

export class TokenManager {
  private refreshTimer: number | null = null
  private userStore = useUserStore()

  // 启动 Token 刷新监控
  startTokenRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }

    // 每5分钟检查一次 Token 状态
    this.refreshTimer = setInterval(() => {
      this.checkAndRefreshToken()
    }, 5 * 60 * 1000)
  }

  // 停止 Token 刷新监控
  stopTokenRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  // 检查并刷新 Token
  private async checkAndRefreshToken() {
    if (!this.userStore.refreshToken) {
      return
    }

    try {
      // 检查 Token 是否即将过期（提前5分钟刷新）
      const token = this.userStore.token
      if (token && this.isTokenExpiringSoon(token)) {
        await this.refreshToken()
      }
    } catch (error) {
      console.error('Token 刷新失败:', error)
      // Token 刷新失败，用户需要重新登录
      this.userStore.clearAuth()
    }
  }

  // 刷新 Token
  private async refreshToken() {
    try {
      const response = await refreshToken(this.userStore.refreshToken!)
      
      if (response.code === 200) {
        // 更新 Token
        this.userStore.setToken(response.data.access)
        this.userStore.setRefreshToken(response.data.refresh)
        
        console.log('Token 刷新成功')
      }
    } catch (error) {
      console.error('Token 刷新失败:', error)
      throw error
    }
  }

  // 检查 Token 是否即将过期
  private isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp * 1000
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000
      
      return (exp - now) < fiveMinutes
    } catch (error) {
      return true // 解析失败，认为已过期
    }
  }
}

// 创建全局 Token 管理器
export const tokenManager = new TokenManager()
