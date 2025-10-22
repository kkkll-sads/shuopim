/**
 * 移动端专用组合式函数
 * 提供移动端特有的功能和优化
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * 使用移动端适配
 * @param {Object} options - 配置选项
 * @returns {Object} 移动端适配相关的状态和方法
 */
export function useMobileAdapt(options = {}) {
  const {
    baseWidth = 375,
    baseHeight = 667,
    minWidth = 320,
    maxWidth = 768
  } = options

  const viewportWidth = ref(0)
  const viewportHeight = ref(0)
  const scale = ref(1)
  const isMobile = ref(false)
  const isTablet = ref(false)

  // 计算缩放比例
  const calculateScale = () => {
    viewportWidth.value = window.innerWidth
    viewportHeight.value = window.innerHeight
    
    const widthScale = viewportWidth.value / baseWidth
    const heightScale = viewportHeight.value / baseHeight
    scale.value = Math.min(widthScale, heightScale)
    
    // 限制缩放范围
    scale.value = Math.max(0.5, Math.min(2, scale.value))
    
    // 判断设备类型
    isMobile.value = viewportWidth.value <= 768
    isTablet.value = viewportWidth.value > 768 && viewportWidth.value <= 1024
  }

  // 应用缩放
  const applyScale = () => {
    const root = document.documentElement
    root.style.setProperty('--scale', scale.value)
    root.style.setProperty('--viewport-width', `${viewportWidth.value}px`)
    root.style.setProperty('--viewport-height', `${viewportHeight.value}px`)
  }

  // 监听窗口大小变化
  const handleResize = () => {
    calculateScale()
    applyScale()
  }

  // 获取响应式尺寸
  const getResponsiveSize = (size) => {
    return size * scale.value
  }

  // 获取视口单位
  const getVw = (value) => {
    return (value / baseWidth) * 100
  }

  const getVh = (value) => {
    return (value / baseHeight) * 100
  }

  onMounted(() => {
    calculateScale()
    applyScale()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    viewportWidth,
    viewportHeight,
    scale,
    isMobile,
    isTablet,
    getResponsiveSize,
    getVw,
    getVh
  }
}

/**
 * 使用触摸优化
 * @param {Object} options - 配置选项
 * @returns {Object} 触摸优化相关的状态和方法
 */
export function useTouchOptimization(options = {}) {
  const {
    preventDefault = true,
    passive = false,
    threshold = 10
  } = options

  const touchStartTime = ref(0)
  const touchStartPosition = ref({ x: 0, y: 0 })
  const touchEndPosition = ref({ x: 0, y: 0 })
  const touchDuration = ref(0)
  const touchDistance = ref(0)
  const isTouchActive = ref(false)

  // 触摸开始
  const handleTouchStart = (event) => {
    if (preventDefault) {
      event.preventDefault()
    }
    
    isTouchActive.value = true
    touchStartTime.value = Date.now()
    const touch = event.touches[0]
    touchStartPosition.value = { x: touch.clientX, y: touch.clientY }
  }

  // 触摸结束
  const handleTouchEnd = (event) => {
    if (!isTouchActive.value) return
    
    if (preventDefault) {
      event.preventDefault()
    }
    
    isTouchActive.value = false
    touchDuration.value = Date.now() - touchStartTime.value
    const touch = event.changedTouches[0]
    touchEndPosition.value = { x: touch.clientX, y: touch.clientY }
    
    // 计算触摸距离
    const dx = touchEndPosition.value.x - touchStartPosition.value.x
    const dy = touchEndPosition.value.y - touchStartPosition.value.y
    touchDistance.value = Math.sqrt(dx * dx + dy * dy)
  }

  // 判断是否为点击
  const isTap = () => {
    return touchDuration.value < 300 && touchDistance.value < threshold
  }

  // 判断是否为长按
  const isLongPress = () => {
    return touchDuration.value > 500 && touchDistance.value < threshold
  }

  // 判断是否为滑动
  const isSwipe = () => {
    return touchDistance.value > threshold
  }

  return {
    touchStartTime,
    touchStartPosition,
    touchEndPosition,
    touchDuration,
    touchDistance,
    isTouchActive,
    handleTouchStart,
    handleTouchEnd,
    isTap,
    isLongPress,
    isSwipe
  }
}

/**
 * 使用滚动优化
 * @param {Object} options - 配置选项
 * @returns {Object} 滚动优化相关的状态和方法
 */
export function useScrollOptimization(options = {}) {
  const {
    throttle = 16,
    passive = true
  } = options

  const scrollY = ref(0)
  const scrollX = ref(0)
  const scrollDirection = ref('down')
  const isScrolling = ref(false)
  const scrollVelocity = ref(0)

  let lastScrollY = 0
  let lastScrollTime = 0
  let scrollTimer = null

  // 处理滚动事件
  const handleScroll = (event) => {
    const currentTime = Date.now()
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
    
    // 计算滚动方向
    if (currentScrollY > lastScrollY) {
      scrollDirection.value = 'down'
    } else if (currentScrollY < lastScrollY) {
      scrollDirection.value = 'up'
    }
    
    // 计算滚动速度
    const deltaTime = currentTime - lastScrollTime
    if (deltaTime > 0) {
      scrollVelocity.value = Math.abs(currentScrollY - lastScrollY) / deltaTime
    }
    
    scrollY.value = currentScrollY
    scrollX.value = window.pageXOffset || document.documentElement.scrollLeft
    isScrolling.value = true
    
    // 清除之前的定时器
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    
    // 设置滚动结束检测
    scrollTimer = setTimeout(() => {
      isScrolling.value = false
    }, 150)
    
    lastScrollY = currentScrollY
    lastScrollTime = currentTime
  }

  // 滚动到指定位置
  const scrollTo = (x, y, behavior = 'smooth') => {
    window.scrollTo({
      left: x,
      top: y,
      behavior
    })
  }

  // 滚动到顶部
  const scrollToTop = (behavior = 'smooth') => {
    scrollTo(0, 0, behavior)
  }

  // 滚动到底部
  const scrollToBottom = (behavior = 'smooth') => {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
    scrollTo(0, maxScrollY, behavior)
  }

  // 滚动到元素
  const scrollToElement = (element, offset = 0, behavior = 'smooth') => {
    if (typeof element === 'string') {
      element = document.querySelector(element)
    }
    
    if (element) {
      const elementTop = element.offsetTop - offset
      scrollTo(0, elementTop, behavior)
    }
  }

  // 获取滚动进度
  const getScrollProgress = () => {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
    return maxScrollY > 0 ? scrollY.value / maxScrollY : 0
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
  })

  return {
    scrollY,
    scrollX,
    scrollDirection,
    isScrolling,
    scrollVelocity,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
    getScrollProgress
  }
}

/**
 * 使用键盘优化
 * @param {Object} options - 配置选项
 * @returns {Object} 键盘优化相关的状态和方法
 */
export function useKeyboardOptimization(options = {}) {
  const {
    preventDefault = false,
    passive = true
  } = options

  const isKeyboardVisible = ref(false)
  const keyboardHeight = ref(0)
  const isInputFocused = ref(false)
  const activeElement = ref(null)

  // 处理键盘显示
  const handleKeyboardShow = (event) => {
    isKeyboardVisible.value = true
    keyboardHeight.value = event.keyboardHeight || 0
  }

  // 处理键盘隐藏
  const handleKeyboardHide = () => {
    isKeyboardVisible.value = false
    keyboardHeight.value = 0
  }

  // 处理输入框聚焦
  const handleInputFocus = (event) => {
    isInputFocused.value = true
    activeElement.value = event.target
    
    // 延迟滚动到输入框
    nextTick(() => {
      if (activeElement.value) {
        activeElement.value.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    })
  }

  // 处理输入框失焦
  const handleInputBlur = () => {
    isInputFocused.value = false
    activeElement.value = null
  }

  // 隐藏键盘
  const hideKeyboard = () => {
    if (activeElement.value) {
      activeElement.value.blur()
    }
  }

  // 调整视口高度
  const adjustViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  onMounted(() => {
    // 监听键盘事件
    window.addEventListener('keyboardDidShow', handleKeyboardShow)
    window.addEventListener('keyboardDidHide', handleKeyboardHide)
    
    // 监听输入框事件
    document.addEventListener('focusin', handleInputFocus)
    document.addEventListener('focusout', handleInputBlur)
    
    // 初始调整视口高度
    adjustViewportHeight()
    window.addEventListener('resize', adjustViewportHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('keyboardDidShow', handleKeyboardShow)
    window.removeEventListener('keyboardDidHide', handleKeyboardHide)
    document.removeEventListener('focusin', handleInputFocus)
    document.removeEventListener('focusout', handleInputBlur)
    window.removeEventListener('resize', adjustViewportHeight)
  })

  return {
    isKeyboardVisible,
    keyboardHeight,
    isInputFocused,
    activeElement,
    hideKeyboard,
    adjustViewportHeight
  }
}

/**
 * 使用性能优化
 * @param {Object} options - 配置选项
 * @returns {Object} 性能优化相关的状态和方法
 */
export function usePerformanceOptimization(options = {}) {
  const {
    enableLazyLoading = true,
    enableImageOptimization = true,
    enableCodeSplitting = true
  } = options

  const isLowEndDevice = ref(false)
  const memoryUsage = ref(0)
  const cpuUsage = ref(0)
  const networkSpeed = ref('unknown')

  // 检测低端设备
  const detectLowEndDevice = () => {
    const userAgent = navigator.userAgent
    const isLowEnd = /Android.*Chrome\/[0-5]/.test(userAgent) || 
                     /iPhone.*OS [0-9]/.test(userAgent) ||
                     navigator.hardwareConcurrency < 4
    
    isLowEndDevice.value = isLowEnd
  }

  // 获取内存使用情况
  const getMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = performance.memory
      memoryUsage.value = memory.usedJSHeapSize / memory.jsHeapSizeLimit
    }
  }

  // 获取网络速度
  const getNetworkSpeed = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      networkSpeed.value = connection.effectiveType || 'unknown'
    }
  }

  // 图片懒加载
  const lazyLoadImage = (imgElement, src) => {
    if (!enableLazyLoading) {
      imgElement.src = src
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgElement.src = src
          observer.unobserve(imgElement)
        }
      })
    })

    observer.observe(imgElement)
  }

  // 防抖函数
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // 节流函数
  const throttle = (func, limit) => {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // 预加载资源
  const preloadResource = (url, type = 'image') => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = type
      link.onload = resolve
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  // 清理未使用的资源
  const cleanupResources = () => {
    // 清理图片缓存
    if (enableImageOptimization) {
      const images = document.querySelectorAll('img[data-lazy]')
      images.forEach(img => {
        if (!img.complete) {
          img.src = ''
        }
      })
    }
  }

  onMounted(() => {
    detectLowEndDevice()
    getMemoryUsage()
    getNetworkSpeed()
    
    // 定期检查性能
    const performanceInterval = setInterval(() => {
      getMemoryUsage()
    }, 30000)
    
    // 清理定时器
    onUnmounted(() => {
      clearInterval(performanceInterval)
    })
  })

  return {
    isLowEndDevice,
    memoryUsage,
    cpuUsage,
    networkSpeed,
    lazyLoadImage,
    debounce,
    throttle,
    preloadResource,
    cleanupResources
  }
}

/**
 * 使用移动端优化组合式函数
 * 组合所有移动端优化功能
 * @param {Object} options - 配置选项
 * @returns {Object} 所有移动端优化函数的组合
 */
export function useMobile(options = {}) {
  const mobileAdapt = useMobileAdapt(options)
  const touchOptimization = useTouchOptimization(options)
  const scrollOptimization = useScrollOptimization(options)
  const keyboardOptimization = useKeyboardOptimization(options)
  const performanceOptimization = usePerformanceOptimization(options)

  return {
    // 移动端适配
    ...mobileAdapt,
    // 触摸优化
    ...touchOptimization,
    // 滚动优化
    ...scrollOptimization,
    // 键盘优化
    ...keyboardOptimization,
    // 性能优化
    ...performanceOptimization
  }
}

export default useMobile
