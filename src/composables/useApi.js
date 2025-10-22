/**
 * API请求组合式函数
 * 提供统一的API请求管理功能
 */

import { ref, reactive } from 'vue'
import request from '@/utils/request'

/**
 * 使用API请求
 * @param {Object} options - 配置选项
 * @returns {Object} API请求相关的状态和方法
 */
export function useApi(options = {}) {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    onFinally = null
  } = options

  // 请求状态
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  const response = ref(null)

  /**
   * 执行API请求
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  const execute = async (config) => {
    loading.value = true
    error.value = null

    try {
      const result = await request(config)
      data.value = result
      response.value = result

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

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - 查询参数
   * @param {Object} config - 额外配置
   */
  const get = async (url, params = {}, config = {}) => {
    return execute({
      method: 'GET',
      url,
      params,
      ...config
    })
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 额外配置
   */
  const post = async (url, data = {}, config = {}) => {
    return execute({
      method: 'POST',
      url,
      data,
      ...config
    })
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 额外配置
   */
  const put = async (url, data = {}, config = {}) => {
    return execute({
      method: 'PUT',
      url,
      data,
      ...config
    })
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} config - 额外配置
   */
  const del = async (url, config = {}) => {
    return execute({
      method: 'DELETE',
      url,
      ...config
    })
  }

  /**
   * 重置状态
   */
  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
    response.value = null
  }

  return {
    // 状态
    loading,
    error,
    data,
    response,
    
    // 方法
    execute,
    get,
    post,
    put,
    del,
    reset
  }
}

/**
 * 使用分页数据
 * @param {Object} options - 配置选项
 * @returns {Object} 分页相关的状态和方法
 */
export function usePagination(options = {}) {
  const {
    pageSize = 10,
    immediate = false,
    onLoad = null
  } = options

  const loading = ref(false)
  const refreshing = ref(false)
  const finished = ref(false)
  const list = ref([])
  const page = ref(1)
  const total = ref(0)

  /**
   * 加载数据
   * @param {Function} loadFn - 加载函数
   * @param {boolean} isRefresh - 是否刷新
   */
  const load = async (loadFn, isRefresh = false) => {
    if (loading.value || (finished.value && !isRefresh)) return

    loading.value = true
    if (isRefresh) {
      refreshing.value = true
      page.value = 1
      finished.value = false
    }

    try {
      const result = await loadFn({
        page: page.value,
        pageSize,
        ...options.params
      })

      if (isRefresh) {
        list.value = result.list || result.data || []
      } else {
        list.value.push(...(result.list || result.data || []))
      }

      total.value = result.total || 0
      finished.value = (result.list || result.data || []).length < pageSize

      if (!finished.value) {
        page.value++
      }

      if (onLoad) {
        onLoad(result)
      }
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      loading.value = false
      refreshing.value = false
    }
  }

  /**
   * 刷新数据
   * @param {Function} loadFn - 加载函数
   */
  const refresh = (loadFn) => {
    load(loadFn, true)
  }

  /**
   * 重置分页
   */
  const reset = () => {
    page.value = 1
    list.value = []
    finished.value = false
    loading.value = false
    refreshing.value = false
  }

  return {
    // 状态
    loading,
    refreshing,
    finished,
    list,
    page,
    total,
    
    // 方法
    load,
    refresh,
    reset
  }
}

/**
 * 使用无限滚动
 * @param {Object} options - 配置选项
 * @returns {Object} 无限滚动相关的状态和方法
 */
export function useInfiniteScroll(options = {}) {
  const {
    threshold = 100,
    immediate = false
  } = options

  const { load, refresh, reset, ...paginationState } = usePagination(options)

  /**
   * 检查是否应该加载更多
   */
  const checkLoadMore = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const distance = scrollHeight - scrollTop - clientHeight
    
    if (distance < threshold && !paginationState.loading.value && !paginationState.finished.value) {
      load(options.loadFn)
    }
  }

  /**
   * 绑定滚动事件
   */
  const bindScroll = () => {
    window.addEventListener('scroll', checkLoadMore)
  }

  /**
   * 解绑滚动事件
   */
  const unbindScroll = () => {
    window.removeEventListener('scroll', checkLoadMore)
  }

  return {
    ...paginationState,
    load,
    refresh,
    reset,
    bindScroll,
    unbindScroll
  }
}

export default useApi
