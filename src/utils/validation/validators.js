/**
 * 表单验证规则库
 * 提供常用的验证规则函数
 */

/**
 * 必填验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const required = (message = '此字段为必填项') => {
  return (value) => {
    if (value === null || value === undefined) {
      return { valid: false, message }
    }
    
    if (typeof value === 'string' && !value.trim()) {
      return { valid: false, message }
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return { valid: false, message }
    }
    
    return { valid: true }
  }
}

/**
 * 最小长度验证
 * @param {number} min - 最小长度
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const minLength = (min, message) => {
  return (value) => {
    if (!value) return { valid: true } // 不验证空值
    
    const length = typeof value === 'string' ? value.length : String(value).length
    const defaultMessage = message || `长度不能少于${min}个字符`
    
    return length >= min
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 最大长度验证
 * @param {number} max - 最大长度
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const maxLength = (max, message) => {
  return (value) => {
    if (!value) return { valid: true }
    
    const length = typeof value === 'string' ? value.length : String(value).length
    const defaultMessage = message || `长度不能超过${max}个字符`
    
    return length <= max
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 长度范围验证
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const lengthBetween = (min, max, message) => {
  return (value) => {
    if (!value) return { valid: true }
    
    const length = typeof value === 'string' ? value.length : String(value).length
    const defaultMessage = message || `长度必须在${min}到${max}个字符之间`
    
    return length >= min && length <= max
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 邮箱格式验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const email = (message = '请输入正确的邮箱格式') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 手机号格式验证（中国大陆）
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const phone = (message = '请输入正确的手机号') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 座机号码验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const telPhone = (message = '请输入正确的座机号码') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const telRegex = /^(\d{3,4}-)?\d{7,8}$/
    return telRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 身份证号验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const idCard = (message = '请输入正确的身份证号') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return idCardRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 银行卡号验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const bankCard = (message = '请输入正确的银行卡号') => {
  return (value) => {
    if (!value) return { valid: true }
    
    // 移除空格
    const cardNumber = value.replace(/\s/g, '')
    const bankCardRegex = /^\d{16,19}$/
    
    return bankCardRegex.test(cardNumber)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * URL格式验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const url = (message = '请输入正确的URL格式') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return urlRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 数字验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const numeric = (message = '请输入数字') => {
  return (value) => {
    if (!value && value !== 0) return { valid: true }
    
    return !isNaN(value) && !isNaN(parseFloat(value))
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 整数验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const integer = (message = '请输入整数') => {
  return (value) => {
    if (!value && value !== 0) return { valid: true }
    
    return Number.isInteger(Number(value))
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 最小值验证
 * @param {number} min - 最小值
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const minValue = (min, message) => {
  return (value) => {
    if (!value && value !== 0) return { valid: true }
    
    const defaultMessage = message || `值不能小于${min}`
    return Number(value) >= min
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 最大值验证
 * @param {number} max - 最大值
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const maxValue = (max, message) => {
  return (value) => {
    if (!value && value !== 0) return { valid: true }
    
    const defaultMessage = message || `值不能大于${max}`
    return Number(value) <= max
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 值范围验证
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const between = (min, max, message) => {
  return (value) => {
    if (!value && value !== 0) return { valid: true }
    
    const num = Number(value)
    const defaultMessage = message || `值必须在${min}到${max}之间`
    
    return num >= min && num <= max
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 正则表达式验证
 * @param {RegExp} regex - 正则表达式
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const pattern = (regex, message = '格式不正确') => {
  return (value) => {
    if (!value) return { valid: true }
    
    return regex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 字段匹配验证（如密码确认）
 * @param {string} targetField - 目标字段名
 * @param {Function} getFieldValue - 获取字段值的函数
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const sameAs = (targetField, getFieldValue, message) => {
  return (value) => {
    const targetValue = getFieldValue(targetField)
    const defaultMessage = message || `两次输入不一致`
    
    return value === targetValue
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 密码强度验证
 * @param {Object} options - 选项
 * @param {number} options.minLength - 最小长度
 * @param {boolean} options.requireLowercase - 需要小写字母
 * @param {boolean} options.requireUppercase - 需要大写字母
 * @param {boolean} options.requireNumber - 需要数字
 * @param {boolean} options.requireSpecial - 需要特殊字符
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const passwordStrength = (options = {}, message) => {
  const {
    minLength = 6,
    requireLowercase = false,
    requireUppercase = false,
    requireNumber = false,
    requireSpecial = false
  } = options
  
  return (value) => {
    if (!value) return { valid: true }
    
    const errors = []
    
    if (value.length < minLength) {
      errors.push(`至少${minLength}位`)
    }
    
    if (requireLowercase && !/[a-z]/.test(value)) {
      errors.push('包含小写字母')
    }
    
    if (requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('包含大写字母')
    }
    
    if (requireNumber && !/\d/.test(value)) {
      errors.push('包含数字')
    }
    
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('包含特殊字符')
    }
    
    if (errors.length > 0) {
      const defaultMessage = message || `密码必须${errors.join('、')}`
      return { valid: false, message: defaultMessage }
    }
    
    return { valid: true }
  }
}

/**
 * 中文验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const chinese = (message = '请输入中文') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const chineseRegex = /^[\u4e00-\u9fa5]+$/
    return chineseRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 英文验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const english = (message = '请输入英文') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const englishRegex = /^[a-zA-Z]+$/
    return englishRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 字母数字验证
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const alphaNumeric = (message = '只能包含字母和数字') => {
  return (value) => {
    if (!value) return { valid: true }
    
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/
    return alphaNumericRegex.test(value)
      ? { valid: true }
      : { valid: false, message }
  }
}

/**
 * 日期格式验证
 * @param {string} format - 日期格式（如 'YYYY-MM-DD'）
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const dateFormat = (format = 'YYYY-MM-DD', message) => {
  return (value) => {
    if (!value) return { valid: true }
    
    let regex
    switch (format) {
      case 'YYYY-MM-DD':
        regex = /^\d{4}-\d{2}-\d{2}$/
        break
      case 'YYYY/MM/DD':
        regex = /^\d{4}\/\d{2}\/\d{2}$/
        break
      case 'DD-MM-YYYY':
        regex = /^\d{2}-\d{2}-\d{4}$/
        break
      default:
        regex = /^\d{4}-\d{2}-\d{2}$/
    }
    
    const defaultMessage = message || `请输入正确的日期格式（${format}）`
    
    if (!regex.test(value)) {
      return { valid: false, message: defaultMessage }
    }
    
    // 验证日期是否有效
    const date = new Date(value)
    return date instanceof Date && !isNaN(date)
      ? { valid: true }
      : { valid: false, message: defaultMessage }
  }
}

/**
 * 自定义验证函数
 * @param {Function} validatorFn - 自定义验证函数
 * @param {string} message - 错误消息
 * @returns {Function} 验证函数
 */
export const custom = (validatorFn, message = '验证失败') => {
  return (value) => {
    try {
      const result = validatorFn(value)
      return result === true
        ? { valid: true }
        : { valid: false, message: result || message }
    } catch (error) {
      return { valid: false, message: error.message || message }
    }
  }
}

/**
 * 条件验证
 * @param {Function} condition - 条件函数
 * @param {Function} validator - 验证函数
 * @returns {Function} 验证函数
 */
export const when = (condition, validator) => {
  return (value, formData) => {
    if (condition(formData)) {
      return validator(value)
    }
    return { valid: true }
  }
}

// 导出所有验证器
export default {
  required,
  minLength,
  maxLength,
  lengthBetween,
  email,
  phone,
  telPhone,
  idCard,
  bankCard,
  url,
  numeric,
  integer,
  minValue,
  maxValue,
  between,
  pattern,
  sameAs,
  passwordStrength,
  chinese,
  english,
  alphaNumeric,
  dateFormat,
  custom,
  when
}

