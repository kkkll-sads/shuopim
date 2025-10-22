/**
 * 表单验证错误处理工具
 * 提供统一的错误处理和展示机制
 */

/**
 * 错误类型枚举
 */
export const ErrorType = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  UNKNOWN: 'unknown'
}

/**
 * 错误处理类
 */
export class ValidationError extends Error {
  constructor(message, field = null, type = ErrorType.VALIDATION) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.type = type
    this.timestamp = new Date()
  }
}

/**
 * 格式化验证错误
 * @param {Object} errors - 错误对象
 * @param {Object} fieldLabels - 字段标签映射
 * @returns {Array} 格式化后的错误列表
 */
export function formatValidationErrors(errors, fieldLabels = {}) {
  return Object.entries(errors)
    .filter(([_, message]) => message)
    .map(([field, message]) => ({
      field,
      label: fieldLabels[field] || field,
      message,
      displayText: `${fieldLabels[field] || field}: ${message}`
    }))
}

/**
 * 获取第一个错误
 * @param {Object} errors - 错误对象
 * @param {Object} fieldLabels - 字段标签映射
 * @returns {Object|null} 第一个错误
 */
export function getFirstError(errors, fieldLabels = {}) {
  const errorList = formatValidationErrors(errors, fieldLabels)
  return errorList.length > 0 ? errorList[0] : null
}

/**
 * 将服务器错误转换为表单错误
 * @param {Object} serverError - 服务器返回的错误
 * @param {Object} fieldMapping - 字段映射关系
 * @returns {Object} 表单错误对象
 */
export function mapServerErrors(serverError, fieldMapping = {}) {
  const formErrors = {}
  
  // 处理不同格式的服务器错误
  if (serverError.errors && typeof serverError.errors === 'object') {
    // Laravel风格: { errors: { field: ['message1', 'message2'] } }
    Object.entries(serverError.errors).forEach(([field, messages]) => {
      const mappedField = fieldMapping[field] || field
      formErrors[mappedField] = Array.isArray(messages) ? messages[0] : messages
    })
  } else if (serverError.data && typeof serverError.data === 'object') {
    // 其他风格: { data: { field: 'message' } }
    Object.entries(serverError.data).forEach(([field, message]) => {
      const mappedField = fieldMapping[field] || field
      formErrors[mappedField] = message
    })
  } else if (serverError.message) {
    // 通用错误消息
    formErrors._general = serverError.message
  }
  
  return formErrors
}

/**
 * 错误消息格式化器
 */
export const ErrorFormatter = {
  /**
   * 格式化为提示文本
   * @param {Object} errors - 错误对象
   * @param {Object} fieldLabels - 字段标签映射
   * @returns {string} 格式化后的文本
   */
  toText(errors, fieldLabels = {}) {
    const errorList = formatValidationErrors(errors, fieldLabels)
    return errorList.map(e => e.displayText).join('\n')
  },
  
  /**
   * 格式化为HTML
   * @param {Object} errors - 错误对象
   * @param {Object} fieldLabels - 字段标签映射
   * @returns {string} 格式化后的HTML
   */
  toHTML(errors, fieldLabels = {}) {
    const errorList = formatValidationErrors(errors, fieldLabels)
    if (errorList.length === 0) return ''
    
    const items = errorList
      .map(e => `<li>${e.displayText}</li>`)
      .join('')
    
    return `<ul class="error-list">${items}</ul>`
  },
  
  /**
   * 格式化为列表
   * @param {Object} errors - 错误对象
   * @param {Object} fieldLabels - 字段标签映射
   * @returns {Array} 错误列表
   */
  toList(errors, fieldLabels = {}) {
    return formatValidationErrors(errors, fieldLabels)
  }
}

/**
 * 错误收集器
 */
export class ErrorCollector {
  constructor() {
    this.errors = {}
    this.errorCount = 0
  }
  
  /**
   * 添加错误
   * @param {string} field - 字段名
   * @param {string} message - 错误消息
   */
  add(field, message) {
    if (!this.errors[field]) {
      this.errorCount++
    }
    this.errors[field] = message
  }
  
  /**
   * 移除错误
   * @param {string} field - 字段名
   */
  remove(field) {
    if (this.errors[field]) {
      delete this.errors[field]
      this.errorCount--
    }
  }
  
  /**
   * 清空所有错误
   */
  clear() {
    this.errors = {}
    this.errorCount = 0
  }
  
  /**
   * 是否有错误
   * @returns {boolean}
   */
  hasErrors() {
    return this.errorCount > 0
  }
  
  /**
   * 获取指定字段的错误
   * @param {string} field - 字段名
   * @returns {string|null}
   */
  get(field) {
    return this.errors[field] || null
  }
  
  /**
   * 获取所有错误
   * @returns {Object}
   */
  getAll() {
    return { ...this.errors }
  }
  
  /**
   * 批量添加错误
   * @param {Object} errors - 错误对象
   */
  addMultiple(errors) {
    Object.entries(errors).forEach(([field, message]) => {
      this.add(field, message)
    })
  }
}

/**
 * 显示错误通知
 * @param {Object} errors - 错误对象
 * @param {Object} options - 选项
 * @returns {void}
 */
export function showErrorNotification(errors, options = {}) {
  const {
    fieldLabels = {},
    showFirst = true,
    duration = 3000,
    type = 'alert' // 'alert', 'toast', 'console'
  } = options
  
  const errorList = formatValidationErrors(errors, fieldLabels)
  if (errorList.length === 0) return
  
  const message = showFirst
    ? errorList[0].displayText
    : errorList.map(e => e.displayText).join('\n')
  
  switch (type) {
    case 'alert':
      alert(message)
      break
    case 'toast':
      // 如果项目中有 toast 组件，可以在这里调用
      console.log('Toast:', message)
      break
    case 'console':
    default:
      console.error('表单验证错误:', message)
      break
  }
}

/**
 * 滚动到第一个错误字段
 * @param {Object} errors - 错误对象
 * @param {Object} options - 选项
 * @returns {void}
 */
export function scrollToFirstError(errors, options = {}) {
  const {
    offset = 100,
    behavior = 'smooth'
  } = options
  
  const firstErrorField = Object.keys(errors)[0]
  if (!firstErrorField) return
  
  // 查找对应的DOM元素
  const fieldElement = document.querySelector(
    `[name="${firstErrorField}"], #${firstErrorField}, [data-field="${firstErrorField}"]`
  )
  
  if (fieldElement) {
    const elementPosition = fieldElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior
    })
    
    // 聚焦到错误字段
    setTimeout(() => {
      fieldElement.focus()
    }, 300)
  }
}

/**
 * 错误重试机制
 * @param {Function} validationFn - 验证函数
 * @param {Object} options - 选项
 * @returns {Function} 包装后的函数
 */
export function withRetry(validationFn, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetry = null
  } = options
  
  return async function(...args) {
    let lastError
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await validationFn(...args)
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          if (onRetry) {
            onRetry(attempt, error)
          }
          
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
    }
    
    throw new ValidationError(
      `验证失败，已重试${maxRetries}次: ${lastError.message}`,
      null,
      ErrorType.NETWORK
    )
  }
}

/**
 * 错误日志记录
 * @param {Object} error - 错误对象
 * @param {Object} context - 上下文信息
 * @returns {void}
 */
export function logValidationError(error, context = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      field: error.field,
      type: error.type,
      stack: error.stack
    },
    context: {
      ...context,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }
  
  // 开发环境输出到控制台
  if (process.env.NODE_ENV === 'development') {
    console.error('验证错误日志:', logEntry)
  }
  
  // 生产环境可以发送到日志服务
  // sendToLogService(logEntry)
}

/**
 * 创建错误处理中间件
 * @param {Object} options - 选项
 * @returns {Function} 中间件函数
 */
export function createErrorMiddleware(options = {}) {
  const {
    onError = null,
    log = true,
    showNotification = false,
    scrollToError = false
  } = options
  
  return async function errorMiddleware(validationFn, ...args) {
    try {
      return await validationFn(...args)
    } catch (error) {
      // 记录日志
      if (log) {
        logValidationError(error, { args })
      }
      
      // 显示通知
      if (showNotification && error.field) {
        showErrorNotification({ [error.field]: error.message })
      }
      
      // 滚动到错误
      if (scrollToError && error.field) {
        scrollToFirstError({ [error.field]: error.message })
      }
      
      // 自定义错误处理
      if (onError) {
        onError(error)
      }
      
      throw error
    }
  }
}

/**
 * 批量验证错误处理
 * @param {Array} validationResults - 验证结果数组
 * @returns {Object} 处理后的结果
 */
export function handleBatchValidation(validationResults) {
  const errors = {}
  const warnings = {}
  let hasErrors = false
  
  validationResults.forEach(result => {
    if (result.error) {
      errors[result.field] = result.message
      hasErrors = true
    } else if (result.warning) {
      warnings[result.field] = result.message
    }
  })
  
  return {
    isValid: !hasErrors,
    errors,
    warnings,
    hasErrors,
    hasWarnings: Object.keys(warnings).length > 0
  }
}

// 导出所有工具
export default {
  ErrorType,
  ValidationError,
  formatValidationErrors,
  getFirstError,
  mapServerErrors,
  ErrorFormatter,
  ErrorCollector,
  showErrorNotification,
  scrollToFirstError,
  withRetry,
  logValidationError,
  createErrorMiddleware,
  handleBatchValidation
}

