/**
 * Toast通知组合式函数
 * 提供统一的Toast通知管理功能
 */

import { ref, reactive, computed, nextTick } from 'vue'

/**
 * 使用Toast通知
 * @param {Object} options - 配置选项
 * @returns {Object} Toast相关的状态和方法
 */
export function useToast(options = {}) {
  const {
    duration = 3000,
    position = 'top',
    maxCount = 3,
    zIndex = 9999
  } = options

  const toasts = ref([])
  const queue = ref([])

  // 添加Toast
  const add = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: 'info',
      message: '',
      duration,
      position,
      show: true,
      ...toast
    }

    // 如果达到最大数量，移除最旧的
    if (toasts.value.length >= maxCount) {
      const oldest = toasts.value.shift()
      if (oldest) {
        remove(oldest.id)
      }
    }

    toasts.value.push(newToast)

    // 自动移除
    if (newToast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newToast.duration)
    }

    return id
  }

  // 移除Toast
  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // 清空所有Toast
  const clear = () => {
    toasts.value = []
  }

  // 成功Toast
  const success = (message, options = {}) => {
    return add({
      type: 'success',
      message,
      ...options
    })
  }

  // 错误Toast
  const error = (message, options = {}) => {
    return add({
      type: 'error',
      message,
      ...options
    })
  }

  // 警告Toast
  const warning = (message, options = {}) => {
    return add({
      type: 'warning',
      message,
      ...options
    })
  }

  // 信息Toast
  const info = (message, options = {}) => {
    return add({
      type: 'info',
      message,
      ...options
    })
  }

  // 加载Toast
  const loading = (message = '加载中...', options = {}) => {
    return add({
      type: 'loading',
      message,
      duration: 0, // 加载Toast不自动关闭
      ...options
    })
  }

  // 按类型获取Toast
  const getByType = (type) => {
    return toasts.value.filter(t => t.type === type)
  }

  // 按位置获取Toast
  const getByPosition = (position) => {
    return toasts.value.filter(t => t.position === position)
  }

  return {
    toasts,
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info,
    loading,
    getByType,
    getByPosition
  }
}

/**
 * 使用消息提示
 * @param {Object} options - 配置选项
 * @returns {Object} 消息提示相关的状态和方法
 */
export function useMessage(options = {}) {
  const {
    duration = 3000,
    showClose = true,
    closable = true
  } = options

  const messages = ref([])

  // 添加消息
  const add = (message) => {
    const id = Date.now() + Math.random()
    const newMessage = {
      id,
      type: 'info',
      title: '',
      content: '',
      duration,
      showClose,
      closable,
      show: true,
      ...message
    }

    messages.value.push(newMessage)

    // 自动移除
    if (newMessage.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newMessage.duration)
    }

    return id
  }

  // 移除消息
  const remove = (id) => {
    const index = messages.value.findIndex(m => m.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  // 清空所有消息
  const clear = () => {
    messages.value = []
  }

  // 成功消息
  const success = (content, title = '成功') => {
    return add({
      type: 'success',
      title,
      content
    })
  }

  // 错误消息
  const error = (content, title = '错误') => {
    return add({
      type: 'error',
      title,
      content
    })
  }

  // 警告消息
  const warning = (content, title = '警告') => {
    return add({
      type: 'warning',
      title,
      content
    })
  }

  // 信息消息
  const info = (content, title = '信息') => {
    return add({
      type: 'info',
      title,
      content
    })
  }

  return {
    messages,
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
 * 使用进度提示
 * @param {Object} options - 配置选项
 * @returns {Object} 进度提示相关的状态和方法
 */
export function useProgress(options = {}) {
  const {
    showPercentage = true,
    showText = true,
    text = '加载中...'
  } = options

  const visible = ref(false)
  const progress = ref(0)
  const progressText = ref(text)
  const percentage = computed(() => Math.round(progress.value))

  // 显示进度
  const show = (initialProgress = 0) => {
    visible.value = true
    progress.value = initialProgress
  }

  // 隐藏进度
  const hide = () => {
    visible.value = false
    progress.value = 0
  }

  // 更新进度
  const update = (value, text = progressText.value) => {
    progress.value = Math.min(100, Math.max(0, value))
    progressText.value = text
  }

  // 完成进度
  const complete = (text = '完成') => {
    progress.value = 100
    progressText.value = text
    
    setTimeout(() => {
      hide()
    }, 500)
  }

  // 设置文本
  const setText = (text) => {
    progressText.value = text
  }

  return {
    visible,
    progress,
    progressText,
    percentage,
    show,
    hide,
    update,
    complete,
    setText
  }
}

/**
 * 使用骨架屏
 * @param {Object} options - 配置选项
 * @returns {Object} 骨架屏相关的状态和方法
 */
export function useSkeleton(options = {}) {
  const {
    defaultLoading = false,
    rows = 3,
    animated = true
  } = options

  const loading = ref(defaultLoading)
  const skeletonRows = ref(rows)
  const isAnimated = ref(animated)

  // 显示骨架屏
  const show = (customRows = rows) => {
    loading.value = true
    skeletonRows.value = customRows
  }

  // 隐藏骨架屏
  const hide = () => {
    loading.value = false
  }

  // 切换骨架屏
  const toggle = (customRows = rows) => {
    if (loading.value) {
      hide()
    } else {
      show(customRows)
    }
  }

  // 设置行数
  const setRows = (rows) => {
    skeletonRows.value = rows
  }

  // 设置动画
  const setAnimated = (newAnimated) => {
    isAnimated.value = newAnimated
  }

  return {
    loading,
    skeletonRows,
    animated: isAnimated,
    show,
    hide,
    toggle,
    setRows,
    setAnimated
  }
}

/**
 * 使用空状态
 * @param {Object} options - 配置选项
 * @returns {Object} 空状态相关的状态和方法
 */
export function useEmpty(options = {}) {
  const {
    image = '',
    title = '暂无数据',
    description = '暂时没有相关内容',
    buttonText = '刷新',
    showButton = true
  } = options

  const visible = ref(false)
  const emptyImage = ref(image)
  const emptyTitle = ref(title)
  const emptyDescription = ref(description)
  const buttonTextValue = ref(buttonText)
  const showButtonValue = ref(showButton)

  // 显示空状态
  const show = (customOptions = {}) => {
    visible.value = true
    
    if (customOptions.image) emptyImage.value = customOptions.image
    if (customOptions.title) emptyTitle.value = customOptions.title
    if (customOptions.description) emptyDescription.value = customOptions.description
    if (customOptions.buttonText) buttonTextValue.value = customOptions.buttonText
    if (customOptions.showButton !== undefined) showButtonValue.value = customOptions.showButton
  }

  // 隐藏空状态
  const hide = () => {
    visible.value = false
  }

  // 设置图片
  const setImage = (image) => {
    emptyImage.value = image
  }

  // 设置标题
  const setTitle = (title) => {
    emptyTitle.value = title
  }

  // 设置描述
  const setDescription = (description) => {
    emptyDescription.value = description
  }

  return {
    visible,
    emptyImage,
    emptyTitle,
    emptyDescription,
    buttonText: buttonTextValue,
    showButton: showButtonValue,
    show,
    hide,
    setImage,
    setTitle,
    setDescription
  }
}

export default useToast
