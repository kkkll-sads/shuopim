/**
 * 页面数据获取组合式函数
 * 提供完整的页面数据管理功能
 */

import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useApi } from './useApi'
import { useStorage } from './useStorage'

/**
 * 使用页面数据获取
 * @param {Object} options - 配置选项
 * @returns {Object} 页面数据相关的状态和方法
 */
export function usePageData(options = {}) {
  const {
    // 数据获取配置
    fetchFn = null,
    immediate = true,
    cache = false,
    cacheKey = null,
    cacheTime = 5 * 60 * 1000, // 5分钟
    
    // 分页配置
    enablePagination = false,
    pageSize = 10,
    pageKey = 'page',
    sizeKey = 'size',
    
    // 搜索配置
    enableSearch = false,
    searchKey = 'search',
    searchDebounce = 300,
    
    // 排序配置
    enableSort = false,
    sortKey = 'sort',
    defaultSort = null,
    
    // 过滤配置
    enableFilter = false,
    filterKey = 'filter',
    defaultFilter = {},
    
    // 刷新配置
    enableRefresh = true,
    refreshInterval = 0,
    
    // 错误处理
    onError = null,
    onSuccess = null,
    onFinally = null
  } = options

  // 数据状态
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)
  const fromCache = ref(false)

  // 分页状态
  const page = ref(1)
  const total = ref(0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize))
  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPrevPage = computed(() => page.value > 1)

  // 搜索状态
  const searchQuery = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)

  // 排序状态
  const sortBy = ref(defaultSort)
  const sortOrder = ref('asc')

  // 过滤状态
  const filters = reactive({ ...defaultFilter })

  // 刷新状态
  const refreshing = ref(false)
  const refreshTimer = ref(null)

  // 缓存管理
  const { value: cachedData, setValue: setCachedData } = useStorage(
    cacheKey || `page_data_${Date.now()}`,
    null,
    { ttl: cacheTime }
  )

  /**
   * 获取数据
   * @param {Object} params - 请求参数
   * @returns {Promise} 数据获取结果
   */
  const fetchData = async (params = {}) => {
    if (!fetchFn) {
      console.warn('usePageData: fetchFn is required')
      return
    }

    loading.value = true
    error.value = null
    fromCache.value = false

    try {
      // 构建请求参数
      const requestParams = {
        ...params,
        ...(enablePagination && {
          [pageKey]: page.value,
          [sizeKey]: pageSize
        }),
        ...(enableSearch && searchQuery.value && {
          [searchKey]: searchQuery.value
        }),
        ...(enableSort && sortBy.value && {
          [sortKey]: `${sortBy.value},${sortOrder.value}`
        }),
        ...(enableFilter && Object.keys(filters).length > 0 && {
          [filterKey]: filters
        })
      }

      // 检查缓存
      if (cache && cacheKey && cachedData.value) {
        data.value = cachedData.value
        fromCache.value = true
        lastFetch.value = new Date()
        
        if (onSuccess) {
          onSuccess(data.value)
        }
        
        return data.value
      }

      // 执行数据获取
      const result = await fetchFn(requestParams)
      
      // 处理分页数据
      if (enablePagination && result) {
        if (Array.isArray(result)) {
          data.value = result
          total.value = result.length
        } else if (result.data && Array.isArray(result.data)) {
          data.value = result.data
          total.value = result.total || result.data.length
        } else {
          data.value = result
          total.value = 1
        }
      } else {
        data.value = result
      }

      lastFetch.value = new Date()

      // 缓存数据
      if (cache && cacheKey) {
        setCachedData(data.value)
      }

      if (onSuccess) {
        onSuccess(data.value)
      }

      return data.value
    } catch (err) {
      error.value = err
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      loading.value = false
      
      if (onFinally) {
        onFinally()
      }
    }
  }

  /**
   * 刷新数据
   * @param {Object} params - 请求参数
   * @returns {Promise} 刷新结果
   */
  const refresh = async (params = {}) => {
    refreshing.value = true
    
    try {
      // 清除缓存
      if (cache && cacheKey) {
        setCachedData(null)
      }
      
      return await fetchData(params)
    } finally {
      refreshing.value = false
    }
  }

  /**
   * 重置数据
   */
  const reset = () => {
    data.value = null
    error.value = null
    lastFetch.value = null
    fromCache.value = false
    
    if (enablePagination) {
      page.value = 1
      total.value = 0
    }
    
    if (enableSearch) {
      searchQuery.value = ''
      searchResults.value = []
    }
    
    if (enableSort) {
      sortBy.value = defaultSort
      sortOrder.value = 'asc'
    }
    
    if (enableFilter) {
      Object.keys(filters).forEach(key => {
        delete filters[key]
      })
      Object.assign(filters, defaultFilter)
    }
  }

  /**
   * 下一页
   * @returns {Promise} 下一页数据
   */
  const nextPage = async () => {
    if (hasNextPage.value) {
      page.value++
      return await fetchData()
    }
  }

  /**
   * 上一页
   * @returns {Promise} 上一页数据
   */
  const prevPage = async () => {
    if (hasPrevPage.value) {
      page.value--
      return await fetchData()
    }
  }

  /**
   * 跳转到指定页
   * @param {number} targetPage - 目标页码
   * @returns {Promise} 跳转结果
   */
  const goToPage = async (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages.value) {
      page.value = targetPage
      return await fetchData()
    }
  }

  /**
   * 搜索数据
   * @param {string} query - 搜索关键词
   * @returns {Promise} 搜索结果
   */
  const search = async (query = searchQuery.value) => {
    if (!enableSearch) return

    searchQuery.value = query
    isSearching.value = true

    try {
      if (query.trim()) {
        const result = await fetchData({ [searchKey]: query })
        searchResults.value = result
        return result
      } else {
        searchResults.value = []
        return await fetchData()
      }
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 防抖搜索
   * @param {string} query - 搜索关键词
   */
  const debouncedSearch = (query) => {
    if (searchTimer.value) {
      clearTimeout(searchTimer.value)
    }
    
    searchTimer.value = setTimeout(() => {
      search(query)
    }, searchDebounce)
  }

  /**
   * 排序数据
   * @param {string} field - 排序字段
   * @param {string} order - 排序方向
   * @returns {Promise} 排序结果
   */
  const sort = async (field, order = 'asc') => {
    if (!enableSort) return

    sortBy.value = field
    sortOrder.value = order
    
    return await fetchData()
  }

  /**
   * 切换排序
   * @param {string} field - 排序字段
   * @returns {Promise} 排序结果
   */
  const toggleSort = async (field) => {
    if (!enableSort) return

    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
    
    return await fetchData()
  }

  /**
   * 设置过滤器
   * @param {Object} newFilters - 新的过滤器
   * @returns {Promise} 过滤结果
   */
  const setFilters = async (newFilters) => {
    if (!enableFilter) return

    Object.assign(filters, newFilters)
    return await fetchData()
  }

  /**
   * 清除过滤器
   * @param {string|Array} filterKeys - 要清除的过滤器键名
   * @returns {Promise} 清除结果
   */
  const clearFilters = async (filterKeys = null) => {
    if (!enableFilter) return

    if (filterKeys) {
      const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys]
      keys.forEach(key => delete filters[key])
    } else {
      Object.keys(filters).forEach(key => delete filters[key])
      Object.assign(filters, defaultFilter)
    }
    
    return await fetchData()
  }

  /**
   * 开始自动刷新
   */
  const startAutoRefresh = () => {
    if (refreshInterval > 0 && !refreshTimer.value) {
      refreshTimer.value = setInterval(() => {
        refresh()
      }, refreshInterval)
    }
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
   * 获取数据统计
   * @returns {Object} 数据统计信息
   */
  const getStats = () => {
    return {
      total: total.value,
      page: page.value,
      pageSize,
      totalPages: totalPages.value,
      hasNextPage: hasNextPage.value,
      hasPrevPage: hasPrevPage.value,
      loading: loading.value,
      error: error.value,
      lastFetch: lastFetch.value,
      fromCache: fromCache.value
    }
  }

  // 搜索防抖定时器
  const searchTimer = ref(null)

  // 监听搜索查询变化
  if (enableSearch) {
    watch(searchQuery, (newQuery) => {
      if (newQuery !== searchQuery.value) {
        debouncedSearch(newQuery)
      }
    })
  }

  // 监听分页变化
  if (enablePagination) {
    watch(page, () => {
      fetchData()
    })
  }

  // 监听排序变化
  if (enableSort) {
    watch([sortBy, sortOrder], () => {
      fetchData()
    })
  }

  // 监听过滤器变化
  if (enableFilter) {
    watch(filters, () => {
      fetchData()
    }, { deep: true })
  }

  // 生命周期
  onMounted(() => {
    if (immediate) {
      nextTick(() => {
        fetchData()
      })
    }
    
    if (enableRefresh && refreshInterval > 0) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
    if (searchTimer.value) {
      clearTimeout(searchTimer.value)
    }
  })

  return {
    // 数据状态
    data,
    loading,
    error,
    lastFetch,
    fromCache,
    refreshing,
    
    // 分页状态
    page,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // 搜索状态
    searchQuery,
    searchResults,
    isSearching,
    
    // 排序状态
    sortBy,
    sortOrder,
    
    // 过滤状态
    filters,
    
    // 数据方法
    fetchData,
    refresh,
    reset,
    
    // 分页方法
    nextPage,
    prevPage,
    goToPage,
    
    // 搜索方法
    search,
    debouncedSearch,
    
    // 排序方法
    sort,
    toggleSort,
    
    // 过滤方法
    setFilters,
    clearFilters,
    
    // 刷新方法
    startAutoRefresh,
    stopAutoRefresh,
    
    // 工具方法
    getStats
  }
}

/**
 * 使用列表数据
 * @param {Object} options - 配置选项
 * @returns {Object} 列表数据相关的状态和方法
 */
export function useListData(options = {}) {
  const {
    fetchFn,
    immediate = true,
    cache = false,
    cacheKey = null,
    pageSize = 10,
    enableSearch = true,
    enableSort = true,
    enableFilter = true
  } = options

  const {
    data: list,
    loading,
    error,
    page,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    searchQuery,
    isSearching,
    sortBy,
    sortOrder,
    filters,
    fetchData,
    refresh,
    reset,
    nextPage,
    prevPage,
    goToPage,
    search,
    sort,
    toggleSort,
    setFilters,
    clearFilters
  } = usePageData({
    fetchFn,
    immediate,
    cache,
    cacheKey,
    enablePagination: true,
    pageSize,
    enableSearch,
    enableSort,
    enableFilter
  })

  // 列表特有方法
  const addItem = (item) => {
    if (Array.isArray(list.value)) {
      list.value.unshift(item)
    }
  }

  const updateItem = (index, item) => {
    if (Array.isArray(list.value) && index >= 0 && index < list.value.length) {
      list.value[index] = item
    }
  }

  const removeItem = (index) => {
    if (Array.isArray(list.value) && index >= 0 && index < list.value.length) {
      list.value.splice(index, 1)
    }
  }

  const findItem = (predicate) => {
    return Array.isArray(list.value) ? list.value.find(predicate) : null
  }

  const filterItems = (predicate) => {
    return Array.isArray(list.value) ? list.value.filter(predicate) : []
  }

  const sortItems = (compareFn) => {
    if (Array.isArray(list.value)) {
      list.value.sort(compareFn)
    }
  }

  return {
    // 基础状态
    list,
    loading,
    error,
    page,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    searchQuery,
    isSearching,
    sortBy,
    sortOrder,
    filters,
    
    // 基础方法
    fetchData,
    refresh,
    reset,
    nextPage,
    prevPage,
    goToPage,
    search,
    sort,
    toggleSort,
    setFilters,
    clearFilters,
    
    // 列表特有方法
    addItem,
    updateItem,
    removeItem,
    findItem,
    filterItems,
    sortItems
  }
}

/**
 * 使用详情数据
 * @param {Object} options - 配置选项
 * @returns {Object} 详情数据相关的状态和方法
 */
export function useDetailData(options = {}) {
  const {
    fetchFn,
    immediate = true,
    cache = true,
    cacheKey = null,
    id = null
  } = options

  const {
    data: detail,
    loading,
    error,
    fetchData,
    refresh,
    reset
  } = usePageData({
    fetchFn,
    immediate,
    cache,
    cacheKey: cacheKey || (id ? `detail_${id}` : null)
  })

  // 详情特有方法
  const loadDetail = async (detailId) => {
    if (fetchFn) {
      return await fetchData({ id: detailId })
    }
  }

  const updateDetail = async (updateData) => {
    // 这里应该调用更新API
    // 模拟更新
    if (detail.value) {
      Object.assign(detail.value, updateData)
    }
  }

  const deleteDetail = async () => {
    // 这里应该调用删除API
    // 模拟删除
    detail.value = null
  }

  return {
    detail,
    loading,
    error,
    fetchData,
    refresh,
    reset,
    loadDetail,
    updateDetail,
    deleteDetail
  }
}

/**
 * 使用统计数据
 * @param {Object} options - 配置选项
 * @returns {Object} 统计数据相关的状态和方法
 */
export function useStatsData(options = {}) {
  const {
    fetchFn,
    immediate = true,
    cache = true,
    cacheKey = null,
    refreshInterval = 60000 // 1分钟
  } = options

  const {
    data: stats,
    loading,
    error,
    fetchData,
    refresh,
    startAutoRefresh,
    stopAutoRefresh
  } = usePageData({
    fetchFn,
    immediate,
    cache,
    cacheKey: cacheKey || 'stats_data',
    enableRefresh: true,
    refreshInterval
  })

  // 统计数据特有方法
  const getStatValue = (key, defaultValue = 0) => {
    return stats.value?.[key] ?? defaultValue
  }

  const formatStatValue = (key, formatter) => {
    const value = getStatValue(key)
    return formatter ? formatter(value) : value
  }

  const compareStats = (key, previousStats) => {
    const current = getStatValue(key)
    const previous = previousStats?.[key] ?? 0
    return {
      current,
      previous,
      change: current - previous,
      changePercent: previous > 0 ? ((current - previous) / previous) * 100 : 0
    }
  }

  return {
    stats,
    loading,
    error,
    fetchData,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    getStatValue,
    formatStatValue,
    compareStats
  }
}

export default usePageData
