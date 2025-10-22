/**
 * 本地存储组合式函数
 * 提供统一的本地存储管理功能
 */

import { ref, watch, computed } from 'vue'

/**
 * 使用本地存储
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @param {Object} options - 配置选项
 * @returns {Object} 存储相关的状态和方法
 */
export function useStorage(key, defaultValue = null, options = {}) {
  const {
    storage = localStorage,
    serializer = JSON,
    syncAcrossTabs = false
  } = options

  // 获取初始值
  const getInitialValue = () => {
    try {
      const item = storage.getItem(key)
      if (item === null) return defaultValue
      return serializer.parse(item)
    } catch (error) {
      console.warn(`读取存储项 ${key} 失败:`, error)
      return defaultValue
    }
  }

  const storedValue = ref(getInitialValue())

  // 写入存储
  const setValue = (value) => {
    try {
      if (value === null || value === undefined) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, serializer.stringify(value))
      }
      storedValue.value = value
    } catch (error) {
      console.error(`写入存储项 ${key} 失败:`, error)
    }
  }

  // 监听值变化
  watch(storedValue, (newValue) => {
    setValue(newValue)
  }, { deep: true })

  // 监听跨标签页同步
  if (syncAcrossTabs) {
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === storage) {
        storedValue.value = getInitialValue()
      }
    }

    window.addEventListener('storage', handleStorageChange)
  }

  // 清除存储
  const clear = () => {
    storage.removeItem(key)
    storedValue.value = defaultValue
  }

  // 刷新值
  const refresh = () => {
    storedValue.value = getInitialValue()
  }

  return {
    value: storedValue,
    setValue,
    clear,
    refresh
  }
}

/**
 * 使用会话存储
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @param {Object} options - 配置选项
 * @returns {Object} 会话存储相关的状态和方法
 */
export function useSessionStorage(key, defaultValue = null, options = {}) {
  return useStorage(key, defaultValue, {
    ...options,
    storage: sessionStorage
  })
}

/**
 * 使用Cookie存储
 * @param {string} key - Cookie键名
 * @param {any} defaultValue - 默认值
 * @param {Object} options - 配置选项
 * @returns {Object} Cookie相关的状态和方法
 */
export function useCookie(key, defaultValue = null, options = {}) {
  const {
    expires = null,
    path = '/',
    domain = null,
    secure = false,
    sameSite = 'Lax'
  } = options

  // 获取Cookie值
  const getCookieValue = () => {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.trim().split('=')
      if (cookieKey === key) {
        try {
          return JSON.parse(decodeURIComponent(cookieValue))
        } catch {
          return cookieValue
        }
      }
    }
    return defaultValue
  }

  const cookieValue = ref(getCookieValue())

  // 设置Cookie
  const setCookieValue = (value) => {
    let cookieString = `${key}=${encodeURIComponent(JSON.stringify(value))}`
    
    if (expires) {
      const date = new Date()
      date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000))
      cookieString += `; expires=${date.toUTCString()}`
    }
    
    if (path) cookieString += `; path=${path}`
    if (domain) cookieString += `; domain=${domain}`
    if (secure) cookieString += `; secure`
    if (sameSite) cookieString += `; samesite=${sameSite}`
    
    document.cookie = cookieString
    cookieValue.value = value
  }

  // 删除Cookie
  const clearCookie = () => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
    cookieValue.value = defaultValue
  }

  // 监听值变化
  watch(cookieValue, (newValue) => {
    if (newValue === null || newValue === undefined) {
      clearCookie()
    } else {
      setCookieValue(newValue)
    }
  }, { deep: true })

  return {
    value: cookieValue,
    setValue: setCookieValue,
    clear: clearCookie
  }
}

/**
 * 使用缓存存储
 * @param {string} key - 缓存键名
 * @param {any} defaultValue - 默认值
 * @param {Object} options - 配置选项
 * @returns {Object} 缓存相关的状态和方法
 */
export function useCache(key, defaultValue = null, options = {}) {
  const {
    ttl = 24 * 60 * 60 * 1000, // 24小时
    storage = localStorage
  } = options

  const cacheKey = `cache_${key}`
  const timestampKey = `cache_${key}_timestamp`

  // 获取缓存值
  const getCachedValue = () => {
    try {
      const timestamp = storage.getItem(timestampKey)
      if (!timestamp) return defaultValue

      const now = Date.now()
      const cacheTime = parseInt(timestamp)
      
      if (now - cacheTime > ttl) {
        // 缓存过期，清除
        storage.removeItem(cacheKey)
        storage.removeItem(timestampKey)
        return defaultValue
      }

      const cached = storage.getItem(cacheKey)
      return cached ? JSON.parse(cached) : defaultValue
    } catch (error) {
      console.warn(`读取缓存 ${key} 失败:`, error)
      return defaultValue
    }
  }

  const cachedValue = ref(getCachedValue())

  // 设置缓存值
  const setCachedValue = (value) => {
    try {
      storage.setItem(cacheKey, JSON.stringify(value))
      storage.setItem(timestampKey, Date.now().toString())
      cachedValue.value = value
    } catch (error) {
      console.error(`设置缓存 ${key} 失败:`, error)
    }
  }

  // 清除缓存
  const clearCache = () => {
    storage.removeItem(cacheKey)
    storage.removeItem(timestampKey)
    cachedValue.value = defaultValue
  }

  // 检查缓存是否过期
  const isExpired = computed(() => {
    try {
      const timestamp = storage.getItem(timestampKey)
      if (!timestamp) return true
      
      const now = Date.now()
      const cacheTime = parseInt(timestamp)
      return now - cacheTime > ttl
    } catch {
      return true
    }
  })

  // 监听值变化
  watch(cachedValue, (newValue) => {
    if (newValue !== null && newValue !== undefined) {
      setCachedValue(newValue)
    }
  }, { deep: true })

  return {
    value: cachedValue,
    setValue: setCachedValue,
    clear: clearCache,
    isExpired
  }
}

/**
 * 使用存储管理器
 * @param {Object} options - 配置选项
 * @returns {Object} 存储管理器
 */
export function useStorageManager(options = {}) {
  const {
    prefix = 'app_',
    storage = localStorage
  } = options

  // 获取所有键
  const getKeys = () => {
    const keys = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''))
      }
    }
    return keys
  }

  // 获取所有数据
  const getAll = () => {
    const data = {}
    getKeys().forEach(key => {
      try {
        const value = storage.getItem(prefix + key)
        data[key] = value ? JSON.parse(value) : null
      } catch (error) {
        console.warn(`读取存储项 ${key} 失败:`, error)
      }
    })
    return data
  }

  // 清除所有数据
  const clearAll = () => {
    getKeys().forEach(key => {
      storage.removeItem(prefix + key)
    })
  }

  // 获取存储大小
  const getSize = () => {
    let size = 0
    getKeys().forEach(key => {
      const value = storage.getItem(prefix + key)
      if (value) {
        size += value.length
      }
    })
    return size
  }

  return {
    getKeys,
    getAll,
    clearAll,
    getSize
  }
}

export default useStorage
