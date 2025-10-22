/**
 * 设备信息组合式函数
 * 提供设备检测和移动端专用功能
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * 使用设备信息
 * @param {Object} options - 配置选项
 * @returns {Object} 设备信息相关的状态和方法
 */
export function useDevice(options = {}) {
  const {
    detectOnMount = true
  } = options

  // 设备信息
  const userAgent = ref('')
  const platform = ref('')
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isIOS = ref(false)
  const isAndroid = ref(false)
  const isWindows = ref(false)
  const isMac = ref(false)
  const isLinux = ref(false)

  // 屏幕信息
  const screenWidth = ref(0)
  const screenHeight = ref(0)
  const screenRatio = ref(0)
  const isLandscape = ref(false)
  const isPortrait = ref(false)

  // 浏览器信息
  const browserName = ref('')
  const browserVersion = ref('')
  const isChrome = ref(false)
  const isFirefox = ref(false)
  const isSafari = ref(false)
  const isEdge = ref(false)

  // 网络信息
  const connectionType = ref('')
  const isOnline = ref(navigator.onLine)
  const effectiveType = ref('')

  // 设备能力
  const hasTouch = ref(false)
  const hasGeolocation = ref(false)
  const hasCamera = ref(false)
  const hasMicrophone = ref(false)
  const hasVibration = ref(false)

  // 检测设备信息
  const detectDevice = () => {
    userAgent.value = navigator.userAgent
    platform.value = navigator.platform

    // 检测移动设备
    isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent.value)
    isTablet.value = /iPad|Android(?=.*Mobile)/i.test(userAgent.value)
    isDesktop.value = !isMobile.value && !isTablet.value

    // 检测操作系统
    isIOS.value = /iPad|iPhone|iPod/.test(userAgent.value)
    isAndroid.value = /Android/.test(userAgent.value)
    isWindows.value = /Windows/.test(userAgent.value)
    isMac.value = /Mac/.test(userAgent.value)
    isLinux.value = /Linux/.test(userAgent.value)

    // 检测屏幕信息
    screenWidth.value = window.screen.width
    screenHeight.value = window.screen.height
    screenRatio.value = window.devicePixelRatio || 1
    isLandscape.value = window.innerWidth > window.innerHeight
    isPortrait.value = !isLandscape.value

    // 检测浏览器
    if (userAgent.value.includes('Chrome')) {
      browserName.value = 'Chrome'
      isChrome.value = true
    } else if (userAgent.value.includes('Firefox')) {
      browserName.value = 'Firefox'
      isFirefox.value = true
    } else if (userAgent.value.includes('Safari')) {
      browserName.value = 'Safari'
      isSafari.value = true
    } else if (userAgent.value.includes('Edge')) {
      browserName.value = 'Edge'
      isEdge.value = true
    }

    // 检测设备能力
    hasTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    hasGeolocation.value = 'geolocation' in navigator
    hasCamera.value = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
    hasMicrophone.value = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
    hasVibration.value = 'vibrate' in navigator

    // 检测网络信息
    if ('connection' in navigator) {
      const connection = navigator.connection
      connectionType.value = connection.type || 'unknown'
      effectiveType.value = connection.effectiveType || 'unknown'
    }
  }

  // 监听屏幕方向变化
  const handleOrientationChange = () => {
    isLandscape.value = window.innerWidth > window.innerHeight
    isPortrait.value = !isLandscape.value
  }

  // 监听网络状态变化
  const handleOnline = () => {
    isOnline.value = true
  }

  const handleOffline = () => {
    isOnline.value = false
  }

  // 监听窗口大小变化
  const handleResize = () => {
    screenWidth.value = window.screen.width
    screenHeight.value = window.screen.height
    isLandscape.value = window.innerWidth > window.innerHeight
    isPortrait.value = !isLandscape.value
  }

  // 获取设备唯一标识
  const getDeviceId = () => {
    // 尝试从localStorage获取
    let deviceId = localStorage.getItem('device_id')
    
    if (!deviceId) {
      // 生成新的设备ID
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('device_id', deviceId)
    }
    
    return deviceId
  }

  // 获取设备信息摘要
  const getDeviceInfo = () => {
    return {
      userAgent: userAgent.value,
      platform: platform.value,
      isMobile: isMobile.value,
      isTablet: isTablet.value,
      isDesktop: isDesktop.value,
      isIOS: isIOS.value,
      isAndroid: isAndroid.value,
      screenWidth: screenWidth.value,
      screenHeight: screenHeight.value,
      screenRatio: screenRatio.value,
      browserName: browserName.value,
      browserVersion: browserVersion.value,
      hasTouch: hasTouch.value,
      hasGeolocation: hasGeolocation.value,
      hasCamera: hasCamera.value,
      hasMicrophone: hasMicrophone.value,
      hasVibration: hasVibration.value,
      isOnline: isOnline.value,
      connectionType: connectionType.value,
      effectiveType: effectiveType.value
    }
  }

  // 计算属性
  const deviceType = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  const isRetina = computed(() => screenRatio.value >= 2)

  const isHighDPI = computed(() => screenRatio.value > 1)

  // 生命周期
  onMounted(() => {
    if (detectOnMount) {
      detectDevice()
    }
    
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleResize)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('orientationchange', handleOrientationChange)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    // 设备信息
    userAgent,
    platform,
    isMobile,
    isTablet,
    isDesktop,
    isIOS,
    isAndroid,
    isWindows,
    isMac,
    isLinux,
    
    // 屏幕信息
    screenWidth,
    screenHeight,
    screenRatio,
    isLandscape,
    isPortrait,
    
    // 浏览器信息
    browserName,
    browserVersion,
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    
    // 网络信息
    connectionType,
    isOnline,
    effectiveType,
    
    // 设备能力
    hasTouch,
    hasGeolocation,
    hasCamera,
    hasMicrophone,
    hasVibration,
    
    // 计算属性
    deviceType,
    isRetina,
    isHighDPI,
    
    // 方法
    detectDevice,
    getDeviceId,
    getDeviceInfo
  }
}

/**
 * 使用手势识别
 * @param {Object} options - 配置选项
 * @returns {Object} 手势识别相关的状态和方法
 */
export function useGesture(options = {}) {
  const {
    threshold = 10,
    preventDefault = true,
    passive = false
  } = options

  const gestures = ref([])
  const isGesturing = ref(false)
  const startPosition = ref({ x: 0, y: 0 })
  const currentPosition = ref({ x: 0, y: 0 })
  const deltaX = ref(0)
  const deltaY = ref(0)
  const velocity = ref({ x: 0, y: 0 })

  // 触摸开始
  const handleTouchStart = (event) => {
    if (preventDefault) {
      event.preventDefault()
    }
    
    isGesturing.value = true
    const touch = event.touches[0]
    startPosition.value = { x: touch.clientX, y: touch.clientY }
    currentPosition.value = { x: touch.clientX, y: touch.clientY }
    deltaX.value = 0
    deltaY.value = 0
    velocity.value = { x: 0, y: 0 }
  }

  // 触摸移动
  const handleTouchMove = (event) => {
    if (!isGesturing.value) return
    
    if (preventDefault) {
      event.preventDefault()
    }
    
    const touch = event.touches[0]
    const previousPosition = { ...currentPosition.value }
    currentPosition.value = { x: touch.clientX, y: touch.clientY }
    
    deltaX.value = currentPosition.value.x - startPosition.value.x
    deltaY.value = currentPosition.value.y - startPosition.value.y
    
    // 计算速度
    const deltaTime = Date.now() - (event.timeStamp || Date.now())
    if (deltaTime > 0) {
      velocity.value = {
        x: (currentPosition.value.x - previousPosition.x) / deltaTime,
        y: (currentPosition.value.y - previousPosition.y) / deltaTime
      }
    }
  }

  // 触摸结束
  const handleTouchEnd = (event) => {
    if (!isGesturing.value) return
    
    if (preventDefault) {
      event.preventDefault()
    }
    
    isGesturing.value = false
    
    // 识别手势
    const gesture = recognizeGesture()
    if (gesture) {
      gestures.value.push(gesture)
    }
  }

  // 识别手势
  const recognizeGesture = () => {
    const absDeltaX = Math.abs(deltaX.value)
    const absDeltaY = Math.abs(deltaY.value)
    const absVelocityX = Math.abs(velocity.value.x)
    const absVelocityY = Math.abs(velocity.value.y)

    // 点击
    if (absDeltaX < threshold && absDeltaY < threshold) {
      return {
        type: 'tap',
        position: { ...currentPosition.value },
        timestamp: Date.now()
      }
    }

    // 滑动
    if (absDeltaX > threshold || absDeltaY > threshold) {
      let direction = ''
      
      if (absDeltaX > absDeltaY) {
        direction = deltaX.value > 0 ? 'right' : 'left'
      } else {
        direction = deltaY.value > 0 ? 'down' : 'up'
      }

      return {
        type: 'swipe',
        direction,
        delta: { x: deltaX.value, y: deltaY.value },
        velocity: { ...velocity.value },
        position: { ...currentPosition.value },
        timestamp: Date.now()
      }
    }

    return null
  }

  // 清除手势历史
  const clearGestures = () => {
    gestures.value = []
  }

  // 获取最近的手势
  const getLastGesture = () => {
    return gestures.value[gestures.value.length - 1] || null
  }

  // 获取指定类型的手势
  const getGesturesByType = (type) => {
    return gestures.value.filter(gesture => gesture.type === type)
  }

  return {
    gestures,
    isGesturing,
    startPosition,
    currentPosition,
    deltaX,
    deltaY,
    velocity,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    clearGestures,
    getLastGesture,
    getGesturesByType
  }
}

/**
 * 使用定位服务
 * @param {Object} options - 配置选项
 * @returns {Object} 定位服务相关的状态和方法
 */
export function useGeolocation(options = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000
  } = options

  const position = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const watchId = ref(null)

  // 获取当前位置
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported')
        reject(error)
        return
      }

      loading.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          position.value = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            timestamp: pos.timestamp
          }
          loading.value = false
          resolve(position.value)
        },
        (err) => {
          error.value = err
          loading.value = false
          reject(err)
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      )
    })
  }

  // 开始监听位置变化
  const watchPosition = () => {
    if (!navigator.geolocation) {
      error.value = new Error('Geolocation is not supported')
      return
    }

    if (watchId.value) {
      stopWatchingPosition()
    }

    loading.value = true
    error.value = null

    watchId.value = navigator.geolocation.watchPosition(
      (pos) => {
        position.value = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp
        }
        loading.value = false
      },
      (err) => {
        error.value = err
        loading.value = false
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    )
  }

  // 停止监听位置变化
  const stopWatchingPosition = () => {
    if (watchId.value) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
  }

  // 计算两点间距离
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // 获取地址信息（需要地理编码服务）
  const getAddress = async (lat, lon) => {
    try {
      // 这里需要集成地理编码服务，如高德地图、百度地图等
      // const response = await fetch(`https://api.example.com/geocode?lat=${lat}&lon=${lon}`)
      // const data = await response.json()
      // return data.address
      
      // 模拟返回
      return `地址信息: ${lat}, ${lon}`
    } catch (err) {
      console.error('获取地址信息失败:', err)
      return null
    }
  }

  return {
    position,
    error,
    loading,
    getCurrentPosition,
    watchPosition,
    stopWatchingPosition,
    calculateDistance,
    getAddress
  }
}

/**
 * 使用震动反馈
 * @param {Object} options - 配置选项
 * @returns {Object} 震动反馈相关的状态和方法
 */
export function useVibration(options = {}) {
  const {
    defaultPattern = [100],
    enabled = true
  } = options

  const isSupported = ref('vibrate' in navigator)
  const isEnabled = ref(enabled)

  // 震动
  const vibrate = (pattern = defaultPattern) => {
    if (!isSupported.value || !isEnabled.value) return false
    
    try {
      navigator.vibrate(pattern)
      return true
    } catch (error) {
      console.error('震动失败:', error)
      return false
    }
  }

  // 短震动
  const vibrateShort = () => {
    return vibrate([50])
  }

  // 长震动
  const vibrateLong = () => {
    return vibrate([200])
  }

  // 连续震动
  const vibratePattern = (pattern = [100, 50, 100]) => {
    return vibrate(pattern)
  }

  // 停止震动
  const stopVibration = () => {
    if (isSupported.value) {
      navigator.vibrate(0)
    }
  }

  // 启用/禁用震动
  const setEnabled = (enabled) => {
    isEnabled.value = enabled
  }

  return {
    isSupported,
    isEnabled,
    vibrate,
    vibrateShort,
    vibrateLong,
    vibratePattern,
    stopVibration,
    setEnabled
  }
}

export default useDevice
