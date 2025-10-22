/**
 * 用户认证组合式函数
 * 提供统一的用户认证管理功能
 */

import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { useStorage } from './useStorage'
import { useToast } from './useToast'
import { useRouter } from 'vue-router'

/**
 * 使用用户认证
 * @param {Object} options - 配置选项
 * @returns {Object} 认证相关的状态和方法
 */
export function useAuth(options = {}) {
  const {
    autoLogin = true,
    redirectAfterLogin = '/home',
    redirectAfterLogout = '/login',
    tokenKey = 'token',
    userInfoKey = 'userInfo'
  } = options

  const userStore = useUserStore()
  const router = useRouter()
  const { success: showSuccess, error: showError } = useToast()

  // 认证状态
  const isAuthenticated = computed(() => userStore.isLoggedIn)
  const user = computed(() => userStore.userInfo)
  const token = computed(() => userStore.token)

  // 登录状态
  const logging = ref(false)
  const loginError = ref(null)

  // 注册状态
  const registering = ref(false)
  const registerError = ref(null)

  // 登出状态
  const loggingOut = ref(false)

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @returns {Promise} 登录结果
   */
  const login = async (credentials) => {
    logging.value = true
    loginError.value = null

    try {
      // 调用真实的登录API
      console.log('useAuth: 开始调用登录API，凭据:', credentials)
      
      const { login: loginAPI } = await import('@/api/auth')
      console.log('useAuth: 登录API函数已导入')
      
      console.log('useAuth: 准备发送请求到后端API')
      const response = await loginAPI(credentials)
      console.log('useAuth: 登录API响应:', response)
      
      // 响应拦截器已经处理了响应，直接使用返回的数据
      if (response) {
        console.log('useAuth: 登录成功，保存认证信息')
        // 保存认证信息（包含双Token和IM用户信息）
        userStore.setAuthData(response)

        showSuccess('登录成功')
        
        // 跳转到指定页面
        if (redirectAfterLogin) {
          router.push(redirectAfterLogin)
        }

        return { success: true, data: response }
      } else {
        console.error('useAuth: 登录失败，响应为空')
        throw new Error('登录失败')
      }
    } catch (error) {
      console.error('useAuth: 登录API调用失败，详细错误:', error)
      console.error('useAuth: 错误类型:', error.constructor.name)
      console.error('useAuth: 错误消息:', error.message)
      console.error('useAuth: 错误响应:', error.response)
      console.error('useAuth: 错误状态码:', error.response?.status)
      console.error('useAuth: 错误数据:', error.response?.data)
      
      loginError.value = error.message || '登录失败'
      showError(loginError.value)
      return { success: false, error: loginError.value }
    } finally {
      logging.value = false
    }
  }

  /**
   * 用户注册
   * @param {Object} userData - 用户数据
   * @returns {Promise} 注册结果
   */
  const register = async (userData) => {
    registering.value = true
    registerError.value = null

    try {
      // 调用真实的注册API
      console.log('useAuth: 开始调用注册API，用户数据:', userData)
      
      const { register: registerAPI } = await import('@/api/auth')
      console.log('useAuth: 注册API函数已导入')
      
      console.log('useAuth: 准备发送请求到后端API')
      const response = await registerAPI(userData)
      console.log('useAuth: 注册API响应:', response)
      
      // 响应拦截器已经处理了响应，直接使用返回的数据
      if (response) {
        console.log('useAuth: 注册成功，保存认证信息')
        // 保存认证信息（包含双Token和IM用户信息）
        userStore.setAuthData(response)

        showSuccess('注册成功')
        
        // 跳转到指定页面
        if (redirectAfterLogin) {
          router.push(redirectAfterLogin)
        }

        return { success: true, data: response }
      } else {
        console.error('useAuth: 注册失败，响应为空')
        throw new Error('注册失败')
      }
    } catch (error) {
      console.error('useAuth: 注册API调用失败，详细错误:', error)
      console.error('useAuth: 错误类型:', error.constructor.name)
      console.error('useAuth: 错误消息:', error.message)
      console.error('useAuth: 错误响应:', error.response)
      console.error('useAuth: 错误状态码:', error.response?.status)
      console.error('useAuth: 错误数据:', error.response?.data)
      
      registerError.value = error.message || '注册失败'
      showError(registerError.value)
      return { success: false, error: registerError.value }
    } finally {
      registering.value = false
    }
  }

  /**
   * 用户登出
   * @returns {Promise} 登出结果
   */
  const logout = async () => {
    loggingOut.value = true

    try {
      // 这里应该调用实际的登出API
      // await api.post('/auth/logout')
      
      // 清除本地认证信息
      userStore.clearAuth()
      
      showSuccess('已退出登录')
      
      // 跳转到登录页
      if (redirectAfterLogout) {
        router.push(redirectAfterLogout)
      }

      return { success: true }
    } catch (error) {
      console.error('登出失败:', error)
      // 即使API调用失败，也要清除本地状态
      userStore.clearAuth()
      return { success: true }
    } finally {
      loggingOut.value = false
    }
  }

  /**
   * 刷新用户信息
   * @returns {Promise} 刷新结果
   */
  const refreshUserInfo = async () => {
    if (!isAuthenticated.value) return { success: false }

    try {
      // 这里应该调用实际的用户信息API
      // const response = await api.get('/user/info')
      
      // 模拟刷新用户信息
      const updatedUserInfo = {
        ...user.value,
        lastLoginTime: new Date().toISOString()
      }
      
      userStore.setUserInfo(updatedUserInfo)
      return { success: true, data: updatedUserInfo }
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 检查认证状态
   * @returns {boolean} 是否已认证
   */
  const checkAuth = () => {
    return isAuthenticated.value
  }

  /**
   * 获取用户权限
   * @returns {Array} 权限列表
   */
  const getUserPermissions = () => {
    if (!user.value) return []
    
    // 根据用户等级返回权限
    const permissions = {
      1: ['read'], // 普通用户
      2: ['read', 'write'], // VIP用户
      3: ['read', 'write', 'admin'] // 管理员
    }
    
    return permissions[user.value.level] || permissions[1]
  }

  /**
   * 检查用户权限
   * @param {string} permission - 权限名称
   * @returns {boolean} 是否有权限
   */
  const hasPermission = (permission) => {
    const permissions = getUserPermissions()
    return permissions.includes(permission)
  }

  /**
   * 更新用户信息
   * @param {Object} userData - 用户数据
   * @returns {Promise} 更新结果
   */
  const updateUserInfo = async (userData) => {
    try {
      // 这里应该调用实际的更新用户信息API
      // const response = await api.put('/user/info', userData)
      
      // 模拟更新用户信息
      const updatedUserInfo = { ...user.value, ...userData }
      userStore.setUserInfo(updatedUserInfo)
      
      showSuccess('用户信息更新成功')
      return { success: true, data: updatedUserInfo }
    } catch (error) {
      showError('更新用户信息失败')
      return { success: false, error: error.message }
    }
  }

  /**
   * 修改密码
   * @param {Object} passwordData - 密码数据
   * @returns {Promise} 修改结果
   */
  const changePassword = async (passwordData) => {
    try {
      // 这里应该调用实际的修改密码API
      // const response = await api.put('/user/password', passwordData)
      
      // 模拟修改密码
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showSuccess('密码修改成功')
      return { success: true }
    } catch (error) {
      showError('密码修改失败')
      return { success: false, error: error.message }
    }
  }

  /**
   * 发送验证码
   * @param {string} phone - 手机号
   * @param {string} type - 验证码类型
   * @returns {Promise} 发送结果
   */
  const sendVerificationCode = async (phone, type = 'login') => {
    try {
      // 这里应该调用实际的发送验证码API
      // const response = await api.post('/auth/send-code', { phone, type })
      
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 500))
      
      showSuccess('验证码已发送')
      return { success: true }
    } catch (error) {
      showError('验证码发送失败')
      return { success: false, error: error.message }
    }
  }

  /**
   * 验证验证码
   * @param {string} phone - 手机号
   * @param {string} code - 验证码
   * @returns {Promise} 验证结果
   */
  const verifyCode = async (phone, code) => {
    try {
      // 这里应该调用实际的验证验证码API
      // const response = await api.post('/auth/verify-code', { phone, code })
      
      // 模拟验证验证码
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟验证成功（实际项目中应该根据API返回结果判断）
      const isValid = code === '123456' // 模拟验证码
      
      if (isValid) {
        return { success: true }
      } else {
        return { success: false, error: '验证码错误' }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 自动登录检查
  if (autoLogin) {
    watch(isAuthenticated, (authenticated) => {
      const currentPath = router.currentRoute.value.path
      console.log('useAuth: 自动登录检查 - 认证状态:', authenticated)
      console.log('useAuth: 自动登录检查 - 当前路径:', currentPath)
      
      // 只有在非认证页面且未认证时才跳转到登录页
      if (!authenticated && 
          currentPath !== '/login' && 
          currentPath !== '/register' && 
          currentPath !== '/forgot') {
        console.log('useAuth: 自动跳转到登录页，原因：未认证且不在认证页面')
        router.push('/login')
      } else {
        console.log('useAuth: 允许访问当前页面')
      }
    }, { immediate: true })
  }

  return {
    // 状态
    isAuthenticated,
    user,
    token,
    logging,
    loginError,
    registering,
    registerError,
    loggingOut,
    
    // 方法
    login,
    register,
    logout,
    refreshUserInfo,
    checkAuth,
    getUserPermissions,
    hasPermission,
    updateUserInfo,
    changePassword,
    sendVerificationCode,
    verifyCode
  }
}

/**
 * 使用权限管理
 * @param {Object} options - 配置选项
 * @returns {Object} 权限管理相关的状态和方法
 */
export function usePermission(options = {}) {
  const {
    defaultPermissions = []
  } = options

  const permissions = ref([...defaultPermissions])
  const roles = ref([])

  // 添加权限
  const addPermission = (permission) => {
    if (!permissions.value.includes(permission)) {
      permissions.value.push(permission)
    }
  }

  // 移除权限
  const removePermission = (permission) => {
    const index = permissions.value.indexOf(permission)
    if (index > -1) {
      permissions.value.splice(index, 1)
    }
  }

  // 检查权限
  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  // 检查多个权限（需要全部拥有）
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => hasPermission(permission))
  }

  // 检查多个权限（拥有任意一个）
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => hasPermission(permission))
  }

  // 设置权限
  const setPermissions = (permissionList) => {
    permissions.value = [...permissionList]
  }

  // 清空权限
  const clearPermissions = () => {
    permissions.value = []
  }

  // 添加角色
  const addRole = (role) => {
    if (!roles.value.includes(role)) {
      roles.value.push(role)
    }
  }

  // 移除角色
  const removeRole = (role) => {
    const index = roles.value.indexOf(role)
    if (index > -1) {
      roles.value.splice(index, 1)
    }
  }

  // 检查角色
  const hasRole = (role) => {
    return roles.value.includes(role)
  }

  // 设置角色
  const setRoles = (roleList) => {
    roles.value = [...roleList]
  }

  return {
    permissions,
    roles,
    addPermission,
    removePermission,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    setPermissions,
    clearPermissions,
    addRole,
    removeRole,
    hasRole,
    setRoles
  }
}

export default useAuth
