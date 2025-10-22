/**
 * 工具类组合式函数
 * 提供常用的工具函数和格式化功能
 */

import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

/**
 * 使用格式化
 * @param {Object} options - 配置选项
 * @returns {Object} 格式化相关的工具函数
 */
export function useFormat(options = {}) {
  const {
    locale = 'zh-CN',
    currency = 'CNY',
    dateFormat = 'YYYY-MM-DD',
    timeFormat = 'HH:mm:ss',
    datetimeFormat = 'YYYY-MM-DD HH:mm:ss'
  } = options

  // 格式化数字
  const formatNumber = (value, options = {}) => {
    const {
      decimals = 2,
      thousandsSeparator = ',',
      decimalSeparator = '.',
      prefix = '',
      suffix = ''
    } = options

    if (value === null || value === undefined || isNaN(value)) {
      return '0'
    }

    const num = Number(value)
    const fixed = num.toFixed(decimals)
    const parts = fixed.split('.')
    
    // 添加千分位分隔符
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
    
    return prefix + parts.join(decimalSeparator) + suffix
  }

  // 格式化货币
  const formatCurrency = (value, options = {}) => {
    const {
      symbol = currency === 'CNY' ? '¥' : '$',
      decimals = 2,
      ...formatOptions
    } = options

    return formatNumber(value, {
      ...formatOptions,
      prefix: symbol,
      decimals
    })
  }

  // 格式化百分比
  const formatPercent = (value, options = {}) => {
    const {
      decimals = 2,
      ...formatOptions
    } = options

    return formatNumber(value * 100, {
      ...formatOptions,
      suffix: '%',
      decimals
    })
  }

  // 格式化文件大小
  const formatFileSize = (bytes, options = {}) => {
    const {
      decimals = 2,
      binary = false
    } = options

    if (bytes === 0) return '0 B'

    const k = binary ? 1024 : 1000
    const sizes = binary 
      ? ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      : ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = bytes / Math.pow(k, i)

    return formatNumber(size, { decimals }) + ' ' + sizes[i]
  }

  // 格式化日期
  const formatDate = (date, format = dateFormat) => {
    if (!date) return ''
    return dayjs(date).format(format)
  }

  // 格式化时间
  const formatTime = (date, format = timeFormat) => {
    if (!date) return ''
    return dayjs(date).format(format)
  }

  // 格式化日期时间
  const formatDateTime = (date, format = datetimeFormat) => {
    if (!date) return ''
    return dayjs(date).format(format)
  }

  // 格式化相对时间
  const formatRelativeTime = (date) => {
    if (!date) return ''
    return dayjs(date).fromNow()
  }

  // 格式化手机号
  const formatPhone = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    }
    return phone
  }

  // 格式化身份证号
  const formatIdCard = (idCard) => {
    if (!idCard) return ''
    const cleaned = idCard.replace(/\D/g, '')
    if (cleaned.length === 18) {
      return cleaned.replace(/(\d{6})(\d{8})(\d{4})/, '$1-$2-$3')
    }
    return idCard
  }

  // 格式化银行卡号
  const formatBankCard = (cardNumber) => {
    if (!cardNumber) return ''
    const cleaned = cardNumber.replace(/\D/g, '')
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  return {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatFileSize,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    formatPhone,
    formatIdCard,
    formatBankCard
  }
}

/**
 * 使用计算器
 * @param {Object} options - 配置选项
 * @returns {Object} 计算器相关的状态和方法
 */
export function useCalculator(options = {}) {
  const {
    precision = 2
  } = options

  const result = ref(0)
  const history = ref([])

  // 加法
  const add = (a, b) => {
    const sum = Number(a) + Number(b)
    result.value = Number(sum.toFixed(precision))
    addToHistory('+', a, b, result.value)
    return result.value
  }

  // 减法
  const subtract = (a, b) => {
    const diff = Number(a) - Number(b)
    result.value = Number(diff.toFixed(precision))
    addToHistory('-', a, b, result.value)
    return result.value
  }

  // 乘法
  const multiply = (a, b) => {
    const product = Number(a) * Number(b)
    result.value = Number(product.toFixed(precision))
    addToHistory('×', a, b, result.value)
    return result.value
  }

  // 除法
  const divide = (a, b) => {
    if (Number(b) === 0) {
      throw new Error('除数不能为零')
    }
    const quotient = Number(a) / Number(b)
    result.value = Number(quotient.toFixed(precision))
    addToHistory('÷', a, b, result.value)
    return result.value
  }

  // 幂运算
  const power = (a, b) => {
    const pow = Math.pow(Number(a), Number(b))
    result.value = Number(pow.toFixed(precision))
    addToHistory('^', a, b, result.value)
    return result.value
  }

  // 开方
  const sqrt = (a) => {
    if (Number(a) < 0) {
      throw new Error('负数不能开方')
    }
    const sqrtResult = Math.sqrt(Number(a))
    result.value = Number(sqrtResult.toFixed(precision))
    addToHistory('√', a, null, result.value)
    return result.value
  }

  // 百分比
  const percentage = (a, b) => {
    const percent = (Number(a) / Number(b)) * 100
    result.value = Number(percent.toFixed(precision))
    addToHistory('%', a, b, result.value)
    return result.value
  }

  // 添加到历史记录
  const addToHistory = (operation, a, b, result) => {
    history.value.push({
      operation,
      a,
      b,
      result,
      timestamp: new Date()
    })
  }

  // 清空历史记录
  const clearHistory = () => {
    history.value = []
  }

  // 重置
  const reset = () => {
    result.value = 0
  }

  return {
    result,
    history,
    add,
    subtract,
    multiply,
    divide,
    power,
    sqrt,
    percentage,
    clearHistory,
    reset
  }
}

/**
 * 使用转换器
 * @param {Object} options - 配置选项
 * @returns {Object} 转换器相关的工具函数
 */
export function useConverter(options = {}) {
  // 温度转换
  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32
  }

  const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5/9
  }

  // 长度转换
  const metersToFeet = (meters) => {
    return meters * 3.28084
  }

  const feetToMeters = (feet) => {
    return feet / 3.28084
  }

  // 重量转换
  const kilogramsToPounds = (kg) => {
    return kg * 2.20462
  }

  const poundsToKilograms = (pounds) => {
    return pounds / 2.20462
  }

  // 体积转换
  const litersToGallons = (liters) => {
    return liters * 0.264172
  }

  const gallonsToLiters = (gallons) => {
    return gallons / 0.264172
  }

  // 角度转换
  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180)
  }

  const radiansToDegrees = (radians) => {
    return radians * (180 / Math.PI)
  }

  // 进制转换
  const decimalToBinary = (decimal) => {
    return decimal.toString(2)
  }

  const binaryToDecimal = (binary) => {
    return parseInt(binary, 2)
  }

  const decimalToHex = (decimal) => {
    return decimal.toString(16).toUpperCase()
  }

  const hexToDecimal = (hex) => {
    return parseInt(hex, 16)
  }

  // 颜色转换
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  return {
    // 温度
    celsiusToFahrenheit,
    fahrenheitToCelsius,
    // 长度
    metersToFeet,
    feetToMeters,
    // 重量
    kilogramsToPounds,
    poundsToKilograms,
    // 体积
    litersToGallons,
    gallonsToLiters,
    // 角度
    degreesToRadians,
    radiansToDegrees,
    // 进制
    decimalToBinary,
    binaryToDecimal,
    decimalToHex,
    hexToDecimal,
    // 颜色
    rgbToHex,
    hexToRgb
  }
}

/**
 * 使用验证器
 * @param {Object} options - 配置选项
 * @returns {Object} 验证器相关的工具函数
 */
export function useValidator(options = {}) {
  // 邮箱验证
  const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 手机号验证
  const isPhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // 身份证号验证
  const isIdCard = (idCard) => {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return idCardRegex.test(idCard)
  }

  // URL验证
  const isUrl = (url) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return urlRegex.test(url)
  }

  // 数字验证
  const isNumber = (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value))
  }

  // 整数验证
  const isInteger = (value) => {
    return Number.isInteger(Number(value))
  }

  // 正数验证
  const isPositive = (value) => {
    return Number(value) > 0
  }

  // 负数验证
  const isNegative = (value) => {
    return Number(value) < 0
  }

  // 范围验证
  const isInRange = (value, min, max) => {
    const num = Number(value)
    return num >= min && num <= max
  }

  // 长度验证
  const isLength = (value, min, max) => {
    const length = String(value).length
    return length >= min && length <= max
  }

  // 正则验证
  const isMatch = (value, regex) => {
    return regex.test(value)
  }

  // 空值验证
  const isEmpty = (value) => {
    return value === null || value === undefined || value === ''
  }

  // 非空验证
  const isNotEmpty = (value) => {
    return !isEmpty(value)
  }

  // 数组验证
  const isArray = (value) => {
    return Array.isArray(value)
  }

  // 对象验证
  const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  // 函数验证
  const isFunction = (value) => {
    return typeof value === 'function'
  }

  // 字符串验证
  const isString = (value) => {
    return typeof value === 'string'
  }

  // 布尔值验证
  const isBoolean = (value) => {
    return typeof value === 'boolean'
  }

  return {
    isEmail,
    isPhone,
    isIdCard,
    isUrl,
    isNumber,
    isInteger,
    isPositive,
    isNegative,
    isInRange,
    isLength,
    isMatch,
    isEmpty,
    isNotEmpty,
    isArray,
    isObject,
    isFunction,
    isString,
    isBoolean
  }
}

/**
 * 使用生成器
 * @param {Object} options - 配置选项
 * @returns {Object} 生成器相关的工具函数
 */
export function useGenerator(options = {}) {
  // 生成随机字符串
  const generateRandomString = (length = 8, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }

  // 生成UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // 生成随机数字
  const generateRandomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // 生成随机颜色
  const generateRandomColor = (alpha = 1) => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // 生成随机十六进制颜色
  const generateRandomHexColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  // 生成序列号
  const generateSequence = (prefix = '', length = 6) => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substr(2, length)
    return prefix + timestamp + random
  }

  // 生成密码
  const generatePassword = (length = 12, options = {}) => {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true
    } = options

    let charset = ''
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    return generateRandomString(length, charset)
  }

  return {
    generateRandomString,
    generateUUID,
    generateRandomNumber,
    generateRandomColor,
    generateRandomHexColor,
    generateSequence,
    generatePassword
  }
}

/**
 * 使用工具类组合式函数
 * 组合所有工具函数
 * @param {Object} options - 配置选项
 * @returns {Object} 所有工具函数的组合
 */
export function useUtils(options = {}) {
  const format = useFormat(options)
  const calculator = useCalculator(options)
  const converter = useConverter(options)
  const validator = useValidator(options)
  const generator = useGenerator(options)

  return {
    // 格式化相关
    ...format,
    // 计算器相关
    ...calculator,
    // 转换器相关
    ...converter,
    // 验证器相关
    ...validator,
    // 生成器相关
    ...generator
  }
}

export default useUtils
