/**
 * 数据管理组合式函数
 * 提供统一的数据获取、缓存和管理功能
 */

import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useStorage } from './useStorage'
import { useApi } from './useApi'

/**
 * 使用数据获取
 * @param {Function} fetchFn - 数据获取函数
 * @param {Object} options - 配置选项
 * @returns {Object} 数据获取相关的状态和方法
 */
export function useData(fetchFn, options = {}) {
  const {
    immediate = true,
    cache = false,
    cacheKey = null,
    cacheTime = 5 * 60 * 1000, // 5分钟
    onSuccess = null,
    onError = null,
    onFinally = null
  } = options

  const { value: cachedData, setValue: setCachedData } = useStorage(
    cacheKey || `data_${Date.now()}`,
    null,
    { ttl: cacheTime }
  )

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  // 获取数据
  const fetch = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const result = await fetchFn(params)
      data.value = result
      lastFetch.value = new Date()

      if (cache && cacheKey) {
        setCachedData(result)
      }

      if (onSuccess) {
        onSuccess(result)
      }

      return result
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

  // 刷新数据
  const refresh = (params = {}) => {
    return fetch(params)
  }

  // 重置数据
  const reset = () => {
    data.value = null
    error.value = null
    lastFetch.value = null
  }

  // 从缓存加载
  const loadFromCache = () => {
    if (cache && cachedData.value) {
      data.value = cachedData.value
      return true
    }
    return false
  }

  // 立即执行
  if (immediate) {
    nextTick(() => {
      if (!loadFromCache()) {
        fetch()
      }
    })
  }

  return {
    data,
    loading,
    error,
    lastFetch,
    fetch,
    refresh,
    reset,
    loadFromCache
  }
}

/**
 * 使用列表数据
 * @param {Function} fetchFn - 数据获取函数
 * @param {Object} options - 配置选项
 * @returns {Object} 列表数据相关的状态和方法
 */
export function useList(fetchFn, options = {}) {
  const {
    pageSize = 10,
    immediate = true,
    cache = false,
    cacheKey = null
  } = options

  const list = ref([])
  const loading = ref(false)
  const refreshing = ref(false)
  const finished = ref(false)
  const error = ref(null)
  const page = ref(1)
  const total = ref(0)

  // 获取列表数据
  const fetch = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const result = await fetchFn({
        page: page.value,
        pageSize,
        ...params
      })

      if (page.value === 1) {
        list.value = result.list || result.data || []
      } else {
        list.value.push(...(result.list || result.data || []))
      }

      total.value = result.total || 0
      finished.value = (result.list || result.data || []).length < pageSize

      if (!finished.value) {
        page.value++
      }

      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // 刷新列表
  const refresh = async (params = {}) => {
    refreshing.value = true
    page.value = 1
    finished.value = false
    
    try {
      await fetch(params)
    } finally {
      refreshing.value = false
    }
  }

  // 加载更多
  const loadMore = async (params = {}) => {
    if (loading.value || finished.value) return
    
    await fetch(params)
  }

  // 重置列表
  const reset = () => {
    list.value = []
    page.value = 1
    finished.value = false
    loading.value = false
    refreshing.value = false
    error.value = null
  }

  // 添加项目
  const addItem = (item) => {
    list.value.unshift(item)
  }

  // 更新项目
  const updateItem = (index, item) => {
    if (index >= 0 && index < list.value.length) {
      list.value[index] = item
    }
  }

  // 删除项目
  const removeItem = (index) => {
    if (index >= 0 && index < list.value.length) {
      list.value.splice(index, 1)
    }
  }

  // 查找项目
  const findItem = (predicate) => {
    return list.value.find(predicate)
  }

  // 过滤列表
  const filter = (predicate) => {
    return list.value.filter(predicate)
  }

  // 排序列表
  const sort = (compareFn) => {
    list.value.sort(compareFn)
  }

  // 立即执行
  if (immediate) {
    nextTick(() => {
      fetch()
    })
  }

  return {
    list,
    loading,
    refreshing,
    finished,
    error,
    page,
    total,
    fetch,
    refresh,
    loadMore,
    reset,
    addItem,
    updateItem,
    removeItem,
    findItem,
    filter,
    sort
  }
}

/**
 * 使用搜索
 * @param {Function} searchFn - 搜索函数
 * @param {Object} options - 配置选项
 * @returns {Object} 搜索相关的状态和方法
 */
export function useSearch(searchFn, options = {}) {
  const {
    debounce = 300,
    minLength = 1,
    immediate = false
  } = options

  const query = ref('')
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasSearched = ref(false)

  let debounceTimer = null

  // 执行搜索
  const search = async (searchQuery = query.value) => {
    if (searchQuery.length < minLength) {
      results.value = []
      return
    }

    loading.value = true
    error.value = null
    hasSearched.value = true

    try {
      const result = await searchFn(searchQuery)
      results.value = result
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // 防抖搜索
  const debouncedSearch = (searchQuery = query.value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      search(searchQuery)
    }, debounce)
  }

  // 清除搜索
  const clear = () => {
    query.value = ''
    results.value = []
    error.value = null
    hasSearched.value = false
  }

  // 重置搜索
  const reset = () => {
    clear()
    loading.value = false
  }

  // 监听查询变化
  watch(query, (newQuery) => {
    if (newQuery.trim()) {
      debouncedSearch(newQuery)
    } else {
      clear()
    }
  })

  // 立即执行
  if (immediate) {
    nextTick(() => {
      search()
    })
  }

  return {
    query,
    results,
    loading,
    error,
    hasSearched,
    search,
    debouncedSearch,
    clear,
    reset
  }
}

/**
 * 使用缓存数据
 * @param {string} key - 缓存键
 * @param {Function} fetchFn - 数据获取函数
 * @param {Object} options - 配置选项
 * @returns {Object} 缓存数据相关的状态和方法
 */
export function useCache(key, fetchFn, options = {}) {
  const {
    ttl = 5 * 60 * 1000, // 5分钟
    immediate = true,
    onCacheHit = null,
    onCacheMiss = null
  } = options

  const { value: cachedData, setValue: setCachedData, isExpired } = useStorage(
    key,
    null,
    { ttl }
  )

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const fromCache = ref(false)

  // 从缓存获取数据
  const getFromCache = () => {
    if (cachedData.value && !isExpired.value) {
      data.value = cachedData.value
      fromCache.value = true
      
      if (onCacheHit) {
        onCacheHit(cachedData.value)
      }
      
      return true
    }
    return false
  }

  // 获取数据
  const fetch = async (params = {}) => {
    // 先尝试从缓存获取
    if (getFromCache()) {
      return data.value
    }

    loading.value = true
    error.value = null
    fromCache.value = false

    try {
      const result = await fetchFn(params)
      data.value = result
      setCachedData(result)

      if (onCacheMiss) {
        onCacheMiss(result)
      }

      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = async (params = {}) => {
    // 清除缓存
    setCachedData(null)
    return fetch(params)
  }

  // 清除缓存
  const clearCache = () => {
    setCachedData(null)
    data.value = null
    fromCache.value = false
  }

  // 重置
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
    fromCache.value = false
  }

  // 立即执行
  if (immediate) {
    nextTick(() => {
      if (!getFromCache()) {
        fetch()
      }
    })
  }

  return {
    data,
    loading,
    error,
    fromCache,
    fetch,
    refresh,
    clearCache,
    reset
  }
}

/**
 * 使用数据同步
 * @param {Object} options - 配置选项
 * @returns {Object} 数据同步相关的状态和方法
 */
export function useSync(options = {}) {
  const {
    interval = 30 * 1000, // 30秒
    immediate = true,
    onSync = null,
    onError = null
  } = options

  const syncing = ref(false)
  const lastSync = ref(null)
  const error = ref(null)
  const intervalId = ref(null)

  // 执行同步
  const sync = async (syncFn) => {
    if (syncing.value) return

    syncing.value = true
    error.value = null

    try {
      const result = await syncFn()
      lastSync.value = new Date()

      if (onSync) {
        onSync(result)
      }

      return result
    } catch (err) {
      error.value = err
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      syncing.value = false
    }
  }

  // 开始自动同步
  const startAutoSync = (syncFn) => {
    if (intervalId.value) return

    intervalId.value = setInterval(() => {
      sync(syncFn)
    }, interval)
  }

  // 停止自动同步
  const stopAutoSync = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  // 重置同步
  const reset = () => {
    stopAutoSync()
    syncing.value = false
    lastSync.value = null
    error.value = null
  }

  // 立即执行
  if (immediate) {
    nextTick(() => {
      // 这里需要传入同步函数
    })
  }

  return {
    syncing,
    lastSync,
    error,
    sync,
    startAutoSync,
    stopAutoSync,
    reset
  }
}

export default useData
