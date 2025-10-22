/**
 * 弹窗组合式函数
 * 提供统一的弹窗管理功能
 */

import { ref, reactive, computed, nextTick } from 'vue'

/**
 * 使用弹窗状态
 * @param {Object} options - 配置选项
 * @returns {Object} 弹窗相关的状态和方法
 */
export function useModal(options = {}) {
  const {
    defaultVisible = false,
    closeOnOverlay = true,
    closeOnEscape = true,
    preventScroll = true
  } = options

  const visible = ref(defaultVisible)
  const loading = ref(false)
  const data = ref(null)

  // 显示弹窗
  const show = (modalData = null) => {
    visible.value = true
    data.value = modalData
    
    if (preventScroll) {
      document.body.style.overflow = 'hidden'
    }
  }

  // 隐藏弹窗
  const hide = () => {
    visible.value = false
    data.value = null
    
    if (preventScroll) {
      document.body.style.overflow = ''
    }
  }

  // 切换弹窗
  const toggle = (modalData = null) => {
    if (visible.value) {
      hide()
    } else {
      show(modalData)
    }
  }

  // 确认弹窗
  const confirm = async (confirmData) => {
    show(confirmData)
    loading.value = true
    
    try {
      // 等待用户操作
      return await new Promise((resolve, reject) => {
        // 这里需要与具体的确认组件配合
        // 实际项目中可能需要使用事件总线或其他方式
        window.__modalConfirmResolve = resolve
        window.__modalConfirmReject = reject
      })
    } finally {
      loading.value = false
      hide()
    }
  }

  // 键盘事件处理
  const handleKeydown = (event) => {
    if (closeOnEscape && event.key === 'Escape') {
      hide()
    }
  }

  // 点击遮罩层处理
  const handleOverlayClick = (event) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      hide()
    }
  }

  return {
    visible,
    loading,
    data,
    show,
    hide,
    toggle,
    confirm,
    handleKeydown,
    handleOverlayClick
  }
}

/**
 * 使用确认对话框
 * @param {Object} options - 配置选项
 * @returns {Object} 确认对话框相关的状态和方法
 */
export function useConfirm(options = {}) {
  const {
    title = '确认',
    message = '确定要执行此操作吗？',
    confirmText = '确定',
    cancelText = '取消',
    type = 'warning'
  } = options

  const visible = ref(false)
  const loading = ref(false)
  const resolve = ref(null)

  // 显示确认对话框
  const show = (customOptions = {}) => {
    const finalOptions = { ...options, ...customOptions }
    
    return new Promise((res) => {
      resolve.value = res
      visible.value = true
    })
  }

  // 确认操作
  const confirm = () => {
    loading.value = true
    
    nextTick(() => {
      if (resolve.value) {
        resolve.value(true)
        resolve.value = null
      }
      visible.value = false
      loading.value = false
    })
  }

  // 取消操作
  const cancel = () => {
    if (resolve.value) {
      resolve.value(false)
      resolve.value = null
    }
    visible.value = false
  }

  return {
    visible,
    loading,
    show,
    confirm,
    cancel,
    title,
    message,
    confirmText,
    cancelText,
    type
  }
}

/**
 * 使用提示框
 * @param {Object} options - 配置选项
 * @returns {Object} 提示框相关的状态和方法
 */
export function useAlert(options = {}) {
  const {
    title = '提示',
    message = '',
    confirmText = '确定',
    type = 'info'
  } = options

  const visible = ref(false)
  const loading = ref(false)

  // 显示提示框
  const show = (customOptions = {}) => {
    const finalOptions = { ...options, ...customOptions }
    visible.value = true
  }

  // 关闭提示框
  const close = () => {
    visible.value = false
  }

  return {
    visible,
    loading,
    show,
    close,
    title,
    message,
    confirmText,
    type
  }
}

/**
 * 使用加载状态
 * @param {Object} options - 配置选项
 * @returns {Object} 加载相关的状态和方法
 */
export function useLoading(options = {}) {
  const {
    defaultLoading = false,
    text = '加载中...',
    overlay = true
  } = options

  const loading = ref(defaultLoading)
  const loadingText = ref(text)
  const loadingOverlay = ref(overlay)

  // 开始加载
  const start = (customText = text) => {
    loading.value = true
    loadingText.value = customText
  }

  // 停止加载
  const stop = () => {
    loading.value = false
  }

  // 设置加载文本
  const setText = (text) => {
    loadingText.value = text
  }

  // 执行异步操作并显示加载状态
  const withLoading = async (asyncFn, customText = text) => {
    start(customText)
    
    try {
      const result = await asyncFn()
      return result
    } finally {
      stop()
    }
  }

  return {
    loading,
    loadingText,
    loadingOverlay,
    start,
    stop,
    setText,
    withLoading
  }
}

/**
 * 使用通知
 * @param {Object} options - 配置选项
 * @returns {Object} 通知相关的状态和方法
 */
export function useNotification(options = {}) {
  const {
    duration = 3000,
    position = 'top-right',
    maxCount = 5
  } = options

  const notifications = ref([])

  // 添加通知
  const add = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration,
      ...notification
    }

    notifications.value.push(newNotification)

    // 限制通知数量
    if (notifications.value.length > maxCount) {
      notifications.value.shift()
    }

    // 自动移除
    if (newNotification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }

    return id
  }

  // 移除通知
  const remove = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // 清空所有通知
  const clear = () => {
    notifications.value = []
  }

  // 成功通知
  const success = (message, title = '成功') => {
    return add({ type: 'success', title, message })
  }

  // 错误通知
  const error = (message, title = '错误') => {
    return add({ type: 'error', title, message })
  }

  // 警告通知
  const warning = (message, title = '警告') => {
    return add({ type: 'warning', title, message })
  }

  // 信息通知
  const info = (message, title = '信息') => {
    return add({ type: 'info', title, message })
  }

  return {
    notifications,
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
}

/**
 * 使用抽屉
 * @param {Object} options - 配置选项
 * @returns {Object} 抽屉相关的状态和方法
 */
export function useDrawer(options = {}) {
  const {
    defaultVisible = false,
    position = 'right',
    size = '300px',
    closeOnOverlay = true
  } = options

  const visible = ref(defaultVisible)
  const data = ref(null)

  // 显示抽屉
  const show = (drawerData = null) => {
    visible.value = true
    data.value = drawerData
  }

  // 隐藏抽屉
  const hide = () => {
    visible.value = false
    data.value = null
  }

  // 切换抽屉
  const toggle = (drawerData = null) => {
    if (visible.value) {
      hide()
    } else {
      show(drawerData)
    }
  }

  // 点击遮罩层处理
  const handleOverlayClick = (event) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      hide()
    }
  }

  return {
    visible,
    data,
    show,
    hide,
    toggle,
    handleOverlayClick,
    position,
    size
  }
}

/**
 * 使用弹出层
 * @param {Object} options - 配置选项
 * @returns {Object} 弹出层相关的状态和方法
 */
export function usePopover(options = {}) {
  const {
    defaultVisible = false,
    trigger = 'click',
    placement = 'bottom',
    offset = 8
  } = options

  const visible = ref(defaultVisible)
  const triggerRef = ref(null)
  const contentRef = ref(null)

  // 显示弹出层
  const show = () => {
    visible.value = true
  }

  // 隐藏弹出层
  const hide = () => {
    visible.value = false
  }

  // 切换弹出层
  const toggle = () => {
    visible.value = !visible.value
  }

  // 更新位置
  const updatePosition = () => {
    if (!triggerRef.value || !contentRef.value) return

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const contentRect = contentRef.value.getBoundingClientRect()
    
    // 根据placement计算位置
    // 这里需要根据具体的UI库来实现位置计算
  }

  return {
    visible,
    triggerRef,
    contentRef,
    show,
    hide,
    toggle,
    updatePosition,
    trigger,
    placement,
    offset
  }
}

export default useModal
