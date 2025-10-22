/**
 * 路由导航组合式函数
 * 提供完整的路由导航管理功能
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 * 使用路由导航
 * @param {Object} options - 配置选项
 * @returns {Object} 路由导航相关的状态和方法
 */
export function useNavigation(options = {}) {
  const {
    historyLimit = 10,
    enableHistory = true,
    enableBreadcrumb = true,
    enableTab = false
  } = options

  const router = useRouter()
  const route = useRoute()

  // 路由历史记录
  const history = ref([])
  const currentIndex = ref(-1)
  const canGoBack = ref(false)
  const canGoForward = ref(false)

  // 面包屑导航
  const breadcrumbs = ref([])
  const currentBreadcrumb = ref('')

  // 标签页导航
  const tabs = ref([])
  const activeTab = ref('')
  const tabHistory = ref({})

  // 路由状态
  const isNavigating = ref(false)
  const navigationError = ref(null)
  const previousRoute = ref(null)

  // 路由元信息
  const routeMeta = computed(() => route.meta || {})
  const routeTitle = computed(() => routeMeta.value.title || route.name || '')
  const routeIcon = computed(() => routeMeta.value.icon || '')
  const routeKeepAlive = computed(() => routeMeta.value.keepAlive || false)

  // 路由参数
  const routeParams = computed(() => route.params || {})
  const routeQuery = computed(() => route.query || {})
  const routePath = computed(() => route.path)
  const routeName = computed(() => route.name)

  /**
   * 导航到指定路由
   * @param {string|Object} to - 目标路由
   * @param {Object} options - 导航选项
   * @returns {Promise} 导航结果
   */
  const navigateTo = async (to, options = {}) => {
    const {
      replace = false,
      query = {},
      params = {},
      hash = '',
      state = {},
      onBefore = null,
      onAfter = null,
      onError = null
    } = options

    isNavigating.value = true
    navigationError.value = null

    try {
      // 导航前钩子
      if (onBefore) {
        const result = await onBefore(to)
        if (result === false) {
          isNavigating.value = false
          return { success: false, error: 'Navigation cancelled' }
        }
      }

      // 执行导航
      const navigationOptions = {
        query: { ...routeQuery.value, ...query },
        params: { ...routeParams.value, ...params },
        hash,
        state
      }

      if (replace) {
        await router.replace(to, navigationOptions)
      } else {
        await router.push(to, navigationOptions)
      }

      // 导航后钩子
      if (onAfter) {
        await onAfter(to)
      }

      return { success: true }
    } catch (error) {
      navigationError.value = error
      
      if (onError) {
        await onError(error)
      }
      
      return { success: false, error }
    } finally {
      isNavigating.value = false
    }
  }

  /**
   * 返回上一页
   * @param {number} delta - 返回步数
   * @returns {Promise} 导航结果
   */
  const goBack = async (delta = 1) => {
    if (enableHistory && history.value.length > 0) {
      const targetIndex = Math.max(0, currentIndex.value - delta)
      const targetRoute = history.value[targetIndex]
      
      if (targetRoute) {
        return await navigateTo(targetRoute, { replace: true })
      }
    }
    
    return await router.go(-delta)
  }

  /**
   * 前进到下一页
   * @param {number} delta - 前进步数
   * @returns {Promise} 导航结果
   */
  const goForward = async (delta = 1) => {
    if (enableHistory && currentIndex.value < history.value.length - 1) {
      const targetIndex = Math.min(history.value.length - 1, currentIndex.value + delta)
      const targetRoute = history.value[targetIndex]
      
      if (targetRoute) {
        return await navigateTo(targetRoute, { replace: true })
      }
    }
    
    return await router.go(delta)
  }

  /**
   * 刷新当前页面
   * @returns {Promise} 导航结果
   */
  const refresh = async () => {
    return await navigateTo(route, { replace: true })
  }

  /**
   * 替换当前路由
   * @param {string|Object} to - 目标路由
   * @param {Object} options - 导航选项
   * @returns {Promise} 导航结果
   */
  const replace = async (to, options = {}) => {
    return await navigateTo(to, { ...options, replace: true })
  }

  /**
   * 添加路由历史记录
   * @param {Object} routeInfo - 路由信息
   */
  const addToHistory = (routeInfo) => {
    if (!enableHistory) return

    const routeData = {
      path: routeInfo.path,
      name: routeInfo.name,
      query: routeInfo.query,
      params: routeInfo.params,
      meta: routeInfo.meta,
      timestamp: Date.now()
    }

    // 如果当前不在历史记录末尾，删除后面的记录
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    // 添加新记录
    history.value.push(routeData)
    currentIndex.value = history.value.length - 1

    // 限制历史记录数量
    if (history.value.length > historyLimit) {
      history.value.shift()
      currentIndex.value = history.value.length - 1
    }

    // 更新导航状态
    canGoBack.value = currentIndex.value > 0
    canGoForward.value = currentIndex.value < history.value.length - 1
  }

  /**
   * 更新面包屑导航
   * @param {Array} breadcrumbList - 面包屑列表
   */
  const updateBreadcrumbs = (breadcrumbList) => {
    if (!enableBreadcrumb) return

    breadcrumbs.value = breadcrumbList.map(item => ({
      title: item.title || item.name,
      path: item.path,
      icon: item.icon,
      disabled: item.disabled || false,
      active: item.active || false
    }))

    // 设置当前面包屑
    const activeBreadcrumb = breadcrumbs.value.find(item => item.active)
    if (activeBreadcrumb) {
      currentBreadcrumb.value = activeBreadcrumb.title
    }
  }

  /**
   * 添加标签页
   * @param {Object} tab - 标签页信息
   */
  const addTab = (tab) => {
    if (!enableTab) return

    const tabData = {
      id: tab.id || tab.name || tab.path,
      title: tab.title || tab.name,
      path: tab.path,
      icon: tab.icon,
      closable: tab.closable !== false,
      active: tab.active || false,
      timestamp: Date.now()
    }

    // 检查是否已存在
    const existingTab = tabs.value.find(t => t.id === tabData.id)
    if (existingTab) {
      // 更新现有标签页
      Object.assign(existingTab, tabData)
    } else {
      // 添加新标签页
      tabs.value.push(tabData)
    }

    // 设置活动标签页
    if (tabData.active) {
      activeTab.value = tabData.id
    }
  }

  /**
   * 移除标签页
   * @param {string} tabId - 标签页ID
   */
  const removeTab = (tabId) => {
    if (!enableTab) return

    const index = tabs.value.findIndex(tab => tab.id === tabId)
    if (index > -1) {
      const removedTab = tabs.value.splice(index, 1)[0]
      
      // 如果移除的是活动标签页，切换到其他标签页
      if (activeTab.value === tabId) {
        const nextTab = tabs.value[index] || tabs.value[index - 1]
        if (nextTab) {
          activeTab.value = nextTab.id
          navigateTo(nextTab.path)
        }
      }
    }
  }

  /**
   * 切换到指定标签页
   * @param {string} tabId - 标签页ID
   */
  const switchTab = async (tabId) => {
    if (!enableTab) return

    const tab = tabs.value.find(t => t.id === tabId)
    if (tab) {
      activeTab.value = tabId
      return await navigateTo(tab.path)
    }
  }

  /**
   * 关闭其他标签页
   * @param {string} keepTabId - 保留的标签页ID
   */
  const closeOtherTabs = (keepTabId) => {
    if (!enableTab) return

    tabs.value = tabs.value.filter(tab => tab.id === keepTabId)
    activeTab.value = keepTabId
  }

  /**
   * 关闭所有标签页
   */
  const closeAllTabs = () => {
    if (!enableTab) return

    tabs.value = []
    activeTab.value = ''
  }

  /**
   * 获取路由参数
   * @param {string} key - 参数键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 参数值
   */
  const getParam = (key, defaultValue = null) => {
    return routeParams.value[key] ?? defaultValue
  }

  /**
   * 获取查询参数
   * @param {string} key - 查询键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 查询值
   */
  const getQuery = (key, defaultValue = null) => {
    return routeQuery.value[key] ?? defaultValue
  }

  /**
   * 设置查询参数
   * @param {Object} query - 查询参数
   * @param {boolean} replace - 是否替换当前查询
   */
  const setQuery = async (query, replace = false) => {
    const newQuery = replace ? query : { ...routeQuery.value, ...query }
    return await navigateTo({ query: newQuery }, { replace: true })
  }

  /**
   * 检查路由是否匹配
   * @param {string|Object} route - 路由路径或对象
   * @returns {boolean} 是否匹配
   */
  const isRouteActive = (route) => {
    if (typeof route === 'string') {
      return routePath.value === route
    }
    
    if (route.name) {
      return routeName.value === route.name
    }
    
    if (route.path) {
      return routePath.value === route.path
    }
    
    return false
  }

  /**
   * 获取路由完整信息
   * @returns {Object} 路由信息
   */
  const getRouteInfo = () => {
    return {
      path: routePath.value,
      name: routeName.value,
      params: routeParams.value,
      query: routeQuery.value,
      meta: routeMeta.value,
      title: routeTitle.value,
      icon: routeIcon.value,
      keepAlive: routeKeepAlive.value
    }
  }

  /**
   * 清除导航历史
   */
  const clearHistory = () => {
    history.value = []
    currentIndex.value = -1
    canGoBack.value = false
    canGoForward.value = false
  }

  /**
   * 监听路由变化
   */
  const watchRouteChange = () => {
    watch(route, (newRoute, oldRoute) => {
      previousRoute.value = oldRoute
      
      // 更新历史记录
      addToHistory(newRoute)
      
      // 更新面包屑
      if (enableBreadcrumb && newRoute.meta?.breadcrumb) {
        updateBreadcrumbs(newRoute.meta.breadcrumb)
      }
      
      // 更新标签页
      if (enableTab && newRoute.meta?.tab) {
        addTab(newRoute.meta.tab)
      }
    }, { immediate: true })
  }

  // 初始化
  onMounted(() => {
    watchRouteChange()
    
    // 添加当前路由到历史记录
    addToHistory(route)
  })

  return {
    // 路由状态
    route,
    routePath,
    routeName,
    routeParams,
    routeQuery,
    routeMeta,
    routeTitle,
    routeIcon,
    routeKeepAlive,
    
    // 导航状态
    isNavigating,
    navigationError,
    previousRoute,
    
    // 历史记录
    history,
    currentIndex,
    canGoBack,
    canGoForward,
    
    // 面包屑
    breadcrumbs,
    currentBreadcrumb,
    
    // 标签页
    tabs,
    activeTab,
    
    // 导航方法
    navigateTo,
    goBack,
    goForward,
    refresh,
    replace,
    
    // 历史记录方法
    addToHistory,
    clearHistory,
    
    // 面包屑方法
    updateBreadcrumbs,
    
    // 标签页方法
    addTab,
    removeTab,
    switchTab,
    closeOtherTabs,
    closeAllTabs,
    
    // 工具方法
    getParam,
    getQuery,
    setQuery,
    isRouteActive,
    getRouteInfo
  }
}

/**
 * 使用路由守卫
 * @param {Object} options - 配置选项
 * @returns {Object} 路由守卫相关的状态和方法
 */
export function useRouteGuard(options = {}) {
  const {
    requireAuth = false,
    redirectTo = '/login',
    onAuthRequired = null,
    onRouteChange = null
  } = options

  const isAuthenticated = ref(false)
  const hasPermission = ref(false)
  const guardError = ref(null)

  /**
   * 检查认证状态
   * @returns {boolean} 是否已认证
   */
  const checkAuth = () => {
    // 这里应该检查实际的认证状态
    // 例如从store或localStorage获取token
    const token = localStorage.getItem('token')
    isAuthenticated.value = !!token
    return isAuthenticated.value
  }

  /**
   * 检查权限
   * @param {string} permission - 权限名称
   * @returns {boolean} 是否有权限
   */
  const checkPermission = (permission) => {
    // 这里应该检查实际的权限
    // 例如从用户信息中获取权限列表
    hasPermission.value = true // 简化处理
    return hasPermission.value
  }

  /**
   * 路由前置守卫
   * @param {Object} to - 目标路由
   * @param {Object} from - 来源路由
   * @param {Function} next - 下一步函数
   */
  const beforeEach = (to, from, next) => {
    guardError.value = null

    try {
      // 检查认证
      if (requireAuth && !checkAuth()) {
        if (onAuthRequired) {
          onAuthRequired(to, from)
        }
        next(redirectTo)
        return
      }

      // 检查权限
      if (to.meta?.permission && !checkPermission(to.meta.permission)) {
        guardError.value = '权限不足'
        next('/403')
        return
      }

      // 路由变化回调
      if (onRouteChange) {
        onRouteChange(to, from)
      }

      next()
    } catch (error) {
      guardError.value = error.message
      next('/error')
    }
  }

  /**
   * 路由后置守卫
   * @param {Object} to - 目标路由
   * @param {Object} from - 来源路由
   */
  const afterEach = (to, from) => {
    // 更新页面标题
    if (to.meta?.title) {
      document.title = to.meta.title
    }

    // 滚动到顶部
    if (to.meta?.scrollToTop !== false) {
      window.scrollTo(0, 0)
    }
  }

  return {
    isAuthenticated,
    hasPermission,
    guardError,
    checkAuth,
    checkPermission,
    beforeEach,
    afterEach
  }
}

/**
 * 使用路由缓存
 * @param {Object} options - 配置选项
 * @returns {Object} 路由缓存相关的状态和方法
 */
export function useRouteCache(options = {}) {
  const {
    maxCacheSize = 10,
    enableCache = true
  } = options

  const cache = ref(new Map())
  const cacheKeys = ref([])

  /**
   * 添加路由缓存
   * @param {string} key - 缓存键
   * @param {any} data - 缓存数据
   */
  const setCache = (key, data) => {
    if (!enableCache) return

    cache.value.set(key, {
      data,
      timestamp: Date.now()
    })

    // 更新缓存键列表
    if (!cacheKeys.value.includes(key)) {
      cacheKeys.value.push(key)
    }

    // 限制缓存大小
    if (cacheKeys.value.length > maxCacheSize) {
      const oldestKey = cacheKeys.value.shift()
      cache.value.delete(oldestKey)
    }
  }

  /**
   * 获取路由缓存
   * @param {string} key - 缓存键
   * @returns {any} 缓存数据
   */
  const getCache = (key) => {
    if (!enableCache) return null

    const cached = cache.value.get(key)
    return cached ? cached.data : null
  }

  /**
   * 清除路由缓存
   * @param {string} key - 缓存键
   */
  const clearCache = (key) => {
    if (key) {
      cache.value.delete(key)
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
      }
    } else {
      cache.value.clear()
      cacheKeys.value = []
    }
  }

  /**
   * 检查缓存是否存在
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在
   */
  const hasCache = (key) => {
    return cache.value.has(key)
  }

  return {
    cache,
    cacheKeys,
    setCache,
    getCache,
    clearCache,
    hasCache
  }
}

export default useNavigation
