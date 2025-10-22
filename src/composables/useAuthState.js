/**
 * 认证状态管理组合式函数
 * 提供完整的认证状态监控和管理功能
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useStorage } from './useStorage'
import { useToast } from './useToast'
import { useRouter } from 'vue-router'

/**
 * 使用认证状态管理
 * @param {Object} options - 配置选项
 * @returns {Object} 认证状态相关的状态和方法
 */
export function useAuthState(options = {}) {
  const {
    // 基础配置
    autoCheck = true,
    checkInterval = 30000, // 30秒检查一次
    tokenKey = 'token',
    userInfoKey = 'userInfo',
    
    // 重定向配置
    redirectOnExpired = true,
    redirectTo = '/login',
    
    // 通知配置
    showNotifications = true,
    notifyOnExpired = true,
    notifyOnRefresh = false,
    
    // 自动刷新配置
    autoRefresh = true,
    refreshBeforeExpired = 5 * 60 * 1000, // 过期前5分钟刷新
    
    // 会话管理
    sessionTimeout = 24 * 60 * 60 * 1000, // 24小时
    idleTimeout = 30 * 60 * 1000, // 30分钟无操作超时
    
    // 回调函数
    onAuthChange = null,
    onTokenExpired = null,
    onSessionExpired = null,
    onIdleTimeout = null
  } = options

  const userStore = useUserStore()
  const router = useRouter()
  const { success: showSuccess, warning: showWarning, error: showError } = useToast()

  // 认证状态
  const isAuthenticated = ref(false)
  const isExpired = ref(false)
  const isRefreshing = ref(false)
  const lastActivity = ref(Date.now())
  const sessionStartTime = ref(null)
  const tokenExpiryTime = ref(null)

  // 用户信息
  const user = computed(() => userStore.userInfo)
  const token = computed(() => userStore.token)
  const userId = computed(() => user?.value?.id || null)
  const userLevel = computed(() => user?.value?.level || 0)
  const userPermissions = computed(() => getUserPermissions())

  // 会话状态
  const isSessionActive = ref(true)
  const isIdle = ref(false)
  const sessionDuration = computed(() => {
    if (!sessionStartTime.value) return 0
    return Date.now() - sessionStartTime.value
  })

  // 剩余时间
  const timeUntilExpiry = computed(() => {
    if (!tokenExpiryTime.value) return null
    return Math.max(0, tokenExpiryTime.value - Date.now())
  })

  const timeUntilIdle = computed(() => {
    const idleTime = idleTimeout - (Date.now() - lastActivity.value)
    return Math.max(0, idleTime)
  })

  // 状态检查定时器
  const checkTimer = ref(null)
  const refreshTimer = ref(null)
  const idleTimer = ref(null)

  /**
   * 检查认证状态
   * @returns {boolean} 是否已认证
   */
  const checkAuthStatus = () => {
    const hasToken = !!token.value
    const hasUser = !!user.value
    
    const wasAuthenticated = isAuthenticated.value
    isAuthenticated.value = hasToken && hasUser
    
    // 如果认证状态发生变化，触发回调
    if (wasAuthenticated !== isAuthenticated.value) {
      if (onAuthChange) {
        onAuthChange(isAuthenticated.value, { user: user.value, token: token.value })
      }
    }
    
    return isAuthenticated.value
  }

  /**
   * 检查token是否过期
   * @returns {boolean} 是否过期
   */
  const checkTokenExpiry = () => {
    if (!token.value || !tokenExpiryTime.value) {
      isExpired.value = false
      return false
    }
    
    const now = Date.now()
    const expired = now >= tokenExpiryTime.value
    
    if (expired && !isExpired.value) {
      isExpired.value = true
      
      if (showNotifications && notifyOnExpired) {
        showWarning('登录已过期，请重新登录')
      }
      
      if (onTokenExpired) {
        onTokenExpired()
      }
      
      if (redirectOnExpired) {
        router.push(redirectTo)
      }
    }
    
    return expired
  }

  /**
   * 检查会话是否过期
   * @returns {boolean} 是否过期
   */
  const checkSessionExpiry = () => {
    if (!sessionStartTime.value) {
      sessionStartTime.value = Date.now()
      return false
    }
    
    const now = Date.now()
    const expired = (now - sessionStartTime.value) >= sessionTimeout
    
    if (expired && isSessionActive.value) {
      isSessionActive.value = false
      
      if (showNotifications) {
        showWarning('会话已过期，请重新登录')
      }
      
      if (onSessionExpired) {
        onSessionExpired()
      }
      
      if (redirectOnExpired) {
        router.push(redirectTo)
      }
    }
    
    return expired
  }

  /**
   * 检查是否空闲超时
   * @returns {boolean} 是否空闲超时
   */
  const checkIdleTimeout = () => {
    const now = Date.now()
    const idleTime = now - lastActivity.value
    
    if (idleTime >= idleTimeout && !isIdle.value) {
      isIdle.value = true
      
      if (showNotifications) {
        showWarning('检测到长时间无操作，即将自动登出')
      }
      
      if (onIdleTimeout) {
        onIdleTimeout()
      }
      
      // 可以选择自动登出或显示确认对话框
      setTimeout(() => {
        if (isIdle.value) {
          handleLogout()
        }
      }, 60000) // 1分钟后自动登出
    }
    
    return isIdle.value
  }

  /**
   * 更新活动时间
   */
  const updateActivity = () => {
    lastActivity.value = Date.now()
    isIdle.value = false
  }

  /**
   * 刷新token
   * @returns {Promise} 刷新结果
   */
  const refreshToken = async () => {
    if (!isAuthenticated.value || isRefreshing.value) {
      return { success: false, error: '未认证或正在刷新' }
    }

    isRefreshing.value = true

    try {
      // 这里应该调用实际的刷新token API
      // const response = await api.post('/auth/refresh')
      
      // 模拟刷新token
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newToken = `token_${Date.now()}`
      const newExpiryTime = Date.now() + (2 * 60 * 60 * 1000) // 2小时后过期
      
      userStore.setToken(newToken)
      tokenExpiryTime.value = newExpiryTime
      isExpired.value = false
      
      if (showNotifications && notifyOnRefresh) {
        showSuccess('登录状态已刷新')
      }
      
      return { success: true, token: newToken }
    } catch (error) {
      console.error('刷新token失败:', error)
      
      if (showNotifications) {
        showError('刷新登录状态失败')
      }
      
      return { success: false, error: error.message }
    } finally {
      isRefreshing.value = false
    }
  }

  /**
   * 处理登出
   */
  const handleLogout = async () => {
    try {
      // 清除所有状态
      userStore.clearAuth()
      isAuthenticated.value = false
      isExpired.value = false
      isSessionActive.value = false
      isIdle.value = false
      sessionStartTime.value = null
      tokenExpiryTime.value = null
      lastActivity.value = Date.now()
      
      // 清除定时器
      clearAllTimers()
      
      if (showNotifications) {
        showSuccess('已安全退出登录')
      }
      
      // 跳转到登录页
      if (redirectOnExpired) {
        router.push(redirectTo)
      }
    } catch (error) {
      console.error('登出处理失败:', error)
    }
  }

  /**
   * 获取用户权限
   * @returns {Array} 权限列表
   */
  const getUserPermissions = () => {
    if (!user.value) return []
    
    const permissions = {
      1: ['read'], // 普通用户
      2: ['read', 'write'], // VIP用户
      3: ['read', 'write', 'admin'] // 管理员
    }
    
    return permissions[userLevel.value] || permissions[1]
  }

  /**
   * 检查用户权限
   * @param {string} permission - 权限名称
   * @returns {boolean} 是否有权限
   */
  const hasPermission = (permission) => {
    return userPermissions.value.includes(permission)
  }

  /**
   * 检查用户角色
   * @param {string} role - 角色名称
   * @returns {boolean} 是否有角色
   */
  const hasRole = (role) => {
    if (!user.value) return false
    
    const roles = {
      1: ['user'],
      2: ['user', 'vip'],
      3: ['user', 'vip', 'admin']
    }
    
    return roles[userLevel.value]?.includes(role) || false
  }

  /**
   * 检查用户等级
   * @param {number} level - 等级
   * @returns {boolean} 是否达到等级
   */
  const hasLevel = (level) => {
    return userLevel.value >= level
  }

  /**
   * 开始状态检查
   */
  const startStatusCheck = () => {
    if (checkTimer.value) return
    
    checkTimer.value = setInterval(() => {
      checkAuthStatus()
      checkTokenExpiry()
      checkSessionExpiry()
      checkIdleTimeout()
    }, checkInterval)
  }

  /**
   * 停止状态检查
   */
  const stopStatusCheck = () => {
    if (checkTimer.value) {
      clearInterval(checkTimer.value)
      checkTimer.value = null
    }
  }

  /**
   * 开始自动刷新
   */
  const startAutoRefresh = () => {
    if (!autoRefresh || refreshTimer.value) return
    
    refreshTimer.value = setInterval(async () => {
      if (timeUntilExpiry.value && timeUntilExpiry.value <= refreshBeforeExpired) {
        await refreshToken()
      }
    }, checkInterval)
  }

  /**
   * 停止自动刷新
   */
  const stopAutoRefresh = () => {
    if (refreshTimer.value) {
      clearInterval(refreshTimer.value)
      refreshTimer.value = null
    }
  }

  /**
   * 开始空闲检测
   */
  const startIdleDetection = () => {
    if (idleTimer.value) return
    
    // 监听用户活动
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const resetIdleTimer = () => {
      updateActivity()
    }
    
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true)
    })
    
    idleTimer.value = setInterval(checkIdleTimeout, 10000) // 每10秒检查一次
  }

  /**
   * 停止空闲检测
   */
  const stopIdleDetection = () => {
    if (idleTimer.value) {
      clearInterval(idleTimer.value)
      idleTimer.value = null
    }
  }

  /**
   * 清除所有定时器
   */
  const clearAllTimers = () => {
    stopStatusCheck()
    stopAutoRefresh()
    stopIdleDetection()
  }

  /**
   * 重置会话
   */
  const resetSession = () => {
    sessionStartTime.value = Date.now()
    isSessionActive.value = true
    updateActivity()
  }

  /**
   * 获取认证状态信息
   * @returns {Object} 状态信息
   */
  const getAuthStatus = () => {
    return {
      isAuthenticated: isAuthenticated.value,
      isExpired: isExpired.value,
      isRefreshing: isRefreshing.value,
      isSessionActive: isSessionActive.value,
      isIdle: isIdle.value,
      userId: userId.value,
      userLevel: userLevel.value,
      userPermissions: userPermissions.value,
      sessionDuration: sessionDuration.value,
      timeUntilExpiry: timeUntilExpiry.value,
      timeUntilIdle: timeUntilIdle.value,
      lastActivity: lastActivity.value,
      sessionStartTime: sessionStartTime.value,
      tokenExpiryTime: tokenExpiryTime.value
    }
  }

  /**
   * 设置token过期时间
   * @param {number} expiryTime - 过期时间戳
   */
  const setTokenExpiry = (expiryTime) => {
    tokenExpiryTime.value = expiryTime
  }

  /**
   * 手动刷新认证状态
   */
  const refreshAuthStatus = async () => {
    await refreshToken()
    checkAuthStatus()
  }

  // 监听认证状态变化
  watch(isAuthenticated, (authenticated) => {
    if (authenticated) {
      resetSession()
      if (autoCheck) {
        startStatusCheck()
        startAutoRefresh()
        startIdleDetection()
      }
    } else {
      clearAllTimers()
    }
  }, { immediate: true })

  // 生命周期
  onMounted(() => {
    // 初始化认证状态
    checkAuthStatus()
    
    if (isAuthenticated.value) {
      resetSession()
      if (autoCheck) {
        startStatusCheck()
        startAutoRefresh()
        startIdleDetection()
      }
    }
  })

  onUnmounted(() => {
    clearAllTimers()
  })

  return {
    // 认证状态
    isAuthenticated,
    isExpired,
    isRefreshing,
    user,
    token,
    userId,
    userLevel,
    userPermissions,
    
    // 会话状态
    isSessionActive,
    isIdle,
    sessionDuration,
    lastActivity,
    sessionStartTime,
    tokenExpiryTime,
    
    // 时间计算
    timeUntilExpiry,
    timeUntilIdle,
    
    // 状态检查方法
    checkAuthStatus,
    checkTokenExpiry,
    checkSessionExpiry,
    checkIdleTimeout,
    
    // 活动管理
    updateActivity,
    resetSession,
    
    // Token管理
    refreshToken,
    setTokenExpiry,
    refreshAuthStatus,
    
    // 权限检查
    hasPermission,
    hasRole,
    hasLevel,
    getUserPermissions,
    
    // 登出处理
    handleLogout,
    
    // 定时器管理
    startStatusCheck,
    stopStatusCheck,
    startAutoRefresh,
    stopAutoRefresh,
    startIdleDetection,
    stopIdleDetection,
    clearAllTimers,
    
    // 工具方法
    getAuthStatus
  }
}

/**
 * 使用认证守卫
 * @param {Object} options - 配置选项
 * @returns {Object} 认证守卫相关的状态和方法
 */
export function useAuthGuard(options = {}) {
  const {
    requireAuth = true,
    requirePermissions = [],
    requireRoles = [],
    requireLevel = 0,
    redirectTo = '/login',
    onUnauthorized = null
  } = options

  const {
    isAuthenticated,
    userPermissions,
    userLevel,
    hasPermission,
    hasRole,
    hasLevel
  } = useAuthState()

  /**
   * 检查访问权限
   * @returns {boolean} 是否有权限访问
   */
  const checkAccess = () => {
    // 检查认证状态
    if (requireAuth && !isAuthenticated.value) {
      if (onUnauthorized) {
        onUnauthorized('未认证')
      }
      return false
    }

    // 检查权限
    if (requirePermissions.length > 0) {
      const hasAllPermissions = requirePermissions.every(permission => 
        hasPermission(permission)
      )
      if (!hasAllPermissions) {
        if (onUnauthorized) {
          onUnauthorized('权限不足')
        }
        return false
      }
    }

    // 检查角色
    if (requireRoles.length > 0) {
      const hasAnyRole = requireRoles.some(role => hasRole(role))
      if (!hasAnyRole) {
        if (onUnauthorized) {
          onUnauthorized('角色不符')
        }
        return false
      }
    }

    // 检查等级
    if (requireLevel > 0 && !hasLevel(requireLevel)) {
      if (onUnauthorized) {
        onUnauthorized('等级不足')
      }
      return false
    }

    return true
  }

  /**
   * 路由守卫函数
   * @param {Object} to - 目标路由
   * @param {Object} from - 来源路由
   * @param {Function} next - 下一步函数
   */
  const routeGuard = (to, from, next) => {
    if (checkAccess()) {
      next()
    } else {
      next(redirectTo)
    }
  }

  return {
    checkAccess,
    routeGuard,
    isAuthenticated,
    userPermissions,
    userLevel,
    hasPermission,
    hasRole,
    hasLevel
  }
}

/**
 * 使用认证监听
 * @param {Object} options - 配置选项
 * @returns {Object} 认证监听相关的状态和方法
 */
export function useAuthWatcher(options = {}) {
  const {
    onLogin = null,
    onLogout = null,
    onTokenExpired = null,
    onSessionExpired = null,
    onPermissionChange = null,
    onUserInfoChange = null
  } = options

  const {
    isAuthenticated,
    user,
    token,
    userPermissions,
    isExpired,
    isSessionActive
  } = useAuthState()

  // 监听认证状态变化
  watch(isAuthenticated, (authenticated, wasAuthenticated) => {
    if (authenticated && !wasAuthenticated && onLogin) {
      onLogin({ user: user.value, token: token.value })
    } else if (!authenticated && wasAuthenticated && onLogout) {
      onLogout()
    }
  })

  // 监听token过期
  watch(isExpired, (expired) => {
    if (expired && onTokenExpired) {
      onTokenExpired()
    }
  })

  // 监听会话过期
  watch(isSessionActive, (active) => {
    if (!active && onSessionExpired) {
      onSessionExpired()
    }
  })

  // 监听权限变化
  watch(userPermissions, (permissions, oldPermissions) => {
    if (onPermissionChange && JSON.stringify(permissions) !== JSON.stringify(oldPermissions)) {
      onPermissionChange(permissions, oldPermissions)
    }
  })

  // 监听用户信息变化
  watch(user, (newUser, oldUser) => {
    if (onUserInfoChange && JSON.stringify(newUser) !== JSON.stringify(oldUser)) {
      onUserInfoChange(newUser, oldUser)
    }
  })

  return {
    isAuthenticated,
    user,
    token,
    userPermissions,
    isExpired,
    isSessionActive
  }
}

export default useAuthState
