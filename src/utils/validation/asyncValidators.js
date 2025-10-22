/**
 * 异步验证工具
 * 提供需要后端验证的常用场景
 */

/**
 * 创建防抖异步验证器
 * @param {Function} validatorFn - 异步验证函数
 * @param {number} delay - 防抖延迟（毫秒）
 * @returns {Function} 防抖后的验证函数
 */
export function createDebouncedValidator(validatorFn, delay = 500) {
  let timeoutId = null
  
  return async (value) => {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // 返回 Promise
    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await validatorFn(value)
          resolve(result)
        } catch (error) {
          resolve({
            valid: false,
            message: error.message || '验证失败'
          })
        }
      }, delay)
    })
  }
}

/**
 * 用户名唯一性验证
 * @param {Function} checkUsernameFn - 检查用户名的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function uniqueUsername(checkUsernameFn, message = '用户名已存在') {
  const validator = createDebouncedValidator(async (value) => {
    if (!value) return { valid: true }
    
    try {
      const exists = await checkUsernameFn(value)
      return exists
        ? { valid: false, message }
        : { valid: true }
    } catch (error) {
      console.error('检查用户名时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }, 500)
  
  return {
    validator,
    async: true
  }
}

/**
 * 邮箱唯一性验证
 * @param {Function} checkEmailFn - 检查邮箱的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function uniqueEmail(checkEmailFn, message = '邮箱已被注册') {
  const validator = createDebouncedValidator(async (value) => {
    if (!value) return { valid: true }
    
    try {
      const exists = await checkEmailFn(value)
      return exists
        ? { valid: false, message }
        : { valid: true }
    } catch (error) {
      console.error('检查邮箱时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }, 500)
  
  return {
    validator,
    async: true
  }
}

/**
 * 手机号唯一性验证
 * @param {Function} checkPhoneFn - 检查手机号的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function uniquePhone(checkPhoneFn, message = '手机号已被注册') {
  const validator = createDebouncedValidator(async (value) => {
    if (!value) return { valid: true }
    
    try {
      const exists = await checkPhoneFn(value)
      return exists
        ? { valid: false, message }
        : { valid: true }
    } catch (error) {
      console.error('检查手机号时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }, 500)
  
  return {
    validator,
    async: true
  }
}

/**
 * 邀请码验证
 * @param {Function} validateInviteCodeFn - 验证邀请码的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function validInviteCode(validateInviteCodeFn, message = '邀请码无效') {
  const validator = createDebouncedValidator(async (value) => {
    if (!value) return { valid: true }
    
    try {
      const isValid = await validateInviteCodeFn(value)
      return isValid
        ? { valid: true }
        : { valid: false, message }
    } catch (error) {
      console.error('验证邀请码时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }, 500)
  
  return {
    validator,
    async: true
  }
}

/**
 * 优惠码验证
 * @param {Function} validateCouponFn - 验证优惠码的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function validCoupon(validateCouponFn, message = '优惠码无效或已过期') {
  const validator = createDebouncedValidator(async (value) => {
    if (!value) return { valid: true }
    
    try {
      const result = await validateCouponFn(value)
      return result.valid
        ? { valid: true }
        : { valid: false, message: result.message || message }
    } catch (error) {
      console.error('验证优惠码时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }, 500)
  
  return {
    validator,
    async: true
  }
}

/**
 * 银行卡验证（通过API）
 * @param {Function} validateBankCardFn - 验证银行卡的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function validBankCard(validateBankCardFn, message = '银行卡号无效') {
  const validator = createDebouncedValidator(async (value) => {
    if (!value) return { valid: true }
    
    // 移除空格
    const cardNumber = value.replace(/\s/g, '')
    
    try {
      const result = await validateBankCardFn(cardNumber)
      return result.valid
        ? { valid: true }
        : { valid: false, message: result.message || message }
    } catch (error) {
      console.error('验证银行卡时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }, 800)
  
  return {
    validator,
    async: true
  }
}

/**
 * 地址验证（通过API）
 * @param {Function} validateAddressFn - 验证地址的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function validAddress(validateAddressFn, message = '地址信息无效') {
  const validator = async (value) => {
    if (!value) return { valid: true }
    
    try {
      const result = await validateAddressFn(value)
      return result.valid
        ? { valid: true }
        : { valid: false, message: result.message || message }
    } catch (error) {
      console.error('验证地址时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }
  
  return {
    validator,
    async: true
  }
}

/**
 * 验证码验证
 * @param {Function} validateCodeFn - 验证验证码的API函数
 * @param {string} message - 错误消息
 * @returns {Object} 验证规则对象
 */
export function validVerificationCode(validateCodeFn, message = '验证码错误') {
  const validator = async (value) => {
    if (!value) return { valid: true }
    
    try {
      const isValid = await validateCodeFn(value)
      return isValid
        ? { valid: true }
        : { valid: false, message }
    } catch (error) {
      console.error('验证验证码时出错:', error)
      return { valid: false, message: '验证失败，请重试' }
    }
  }
  
  return {
    validator,
    async: true
  }
}

/**
 * 自定义异步验证
 * @param {Function} asyncValidatorFn - 异步验证函数
 * @param {Object} options - 选项
 * @param {number} options.debounce - 防抖延迟
 * @param {string} options.message - 默认错误消息
 * @returns {Object} 验证规则对象
 */
export function customAsync(asyncValidatorFn, options = {}) {
  const {
    debounce = 0,
    message = '验证失败'
  } = options
  
  let validator = async (value) => {
    try {
      const result = await asyncValidatorFn(value)
      
      // 支持多种返回格式
      if (typeof result === 'boolean') {
        return result
          ? { valid: true }
          : { valid: false, message }
      }
      
      if (typeof result === 'object' && 'valid' in result) {
        return result
      }
      
      // 如果返回字符串，视为错误消息
      if (typeof result === 'string') {
        return { valid: false, message: result }
      }
      
      return { valid: true }
    } catch (error) {
      console.error('异步验证时出错:', error)
      return { valid: false, message: error.message || message }
    }
  }
  
  // 如果需要防抖
  if (debounce > 0) {
    validator = createDebouncedValidator(validator, debounce)
  }
  
  return {
    validator,
    async: true
  }
}

/**
 * 组合多个异步验证器
 * @param {Array} validators - 验证器数组
 * @returns {Object} 组合后的验证规则对象
 */
export function combineAsyncValidators(...validators) {
  const validator = async (value) => {
    for (const v of validators) {
      const result = await v.validator(value)
      if (!result.valid) {
        return result
      }
    }
    return { valid: true }
  }
  
  return {
    validator,
    async: true
  }
}

/**
 * 模拟异步验证（用于测试）
 * @param {boolean} shouldPass - 是否通过验证
 * @param {string} message - 错误消息
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Object} 验证规则对象
 */
export function mockAsyncValidator(shouldPass = true, message = '验证失败', delay = 1000) {
  const validator = async (value) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    
    return shouldPass
      ? { valid: true }
      : { valid: false, message }
  }
  
  return {
    validator,
    async: true
  }
}

// 导出所有异步验证器
export default {
  createDebouncedValidator,
  uniqueUsername,
  uniqueEmail,
  uniquePhone,
  validInviteCode,
  validCoupon,
  validBankCard,
  validAddress,
  validVerificationCode,
  customAsync,
  combineAsyncValidators,
  mockAsyncValidator
}

