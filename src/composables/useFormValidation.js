/**
 * 表单验证 Composable
 * 提供完整的表单验证功能，包括同步和异步验证
 */

import { reactive, ref, computed, watch } from 'vue'

/**
 * 使用表单验证
 * @param {Object} initialValues - 初始表单值
 * @param {Object} validationRules - 验证规则配置
 * @returns {Object} 验证相关的状态和方法
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  // 表单数据
  const formData = reactive({ ...initialValues })
  
  // 错误状态
  const errors = reactive({})
  
  // 错误消息
  const errorMessages = reactive({})
  
  // 触摸状态（字段是否被触碰过）
  const touched = reactive({})
  
  // 验证状态
  const validating = reactive({})
  
  // 是否正在提交
  const isSubmitting = ref(false)
  
  // 是否已验证过
  const isValidated = ref(false)
  
  /**
   * 初始化字段状态
   */
  const initializeFieldStates = () => {
    Object.keys(validationRules).forEach(field => {
      if (!(field in errors)) {
        errors[field] = false
      }
      if (!(field in errorMessages)) {
        errorMessages[field] = ''
      }
      if (!(field in touched)) {
        touched[field] = false
      }
      if (!(field in validating)) {
        validating[field] = false
      }
    })
  }
  
  initializeFieldStates()
  
  /**
   * 验证单个字段
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   * @returns {Promise<boolean>} 验证结果
   */
  const validateField = async (field, value = formData[field]) => {
    const rules = validationRules[field]
    if (!rules || rules.length === 0) {
      return true
    }
    
    // 重置该字段的错误状态
    errors[field] = false
    errorMessages[field] = ''
    validating[field] = true
    
    try {
      // 按顺序执行所有验证规则
      for (const rule of rules) {
        let result
        
        // 检查是否是异步验证
        if (rule.async) {
          result = await rule.validator(value, formData)
        } else {
          result = rule.validator(value, formData)
        }
        
        // 如果验证失败，设置错误并停止验证
        if (!result.valid) {
          errors[field] = true
          errorMessages[field] = result.message || '验证失败'
          validating[field] = false
          return false
        }
      }
      
      validating[field] = false
      return true
    } catch (error) {
      console.error(`验证字段 ${field} 时出错:`, error)
      errors[field] = true
      errorMessages[field] = '验证过程出错'
      validating[field] = false
      return false
    }
  }
  
  /**
   * 验证所有字段
   * @returns {Promise<boolean>} 验证结果
   */
  const validateAll = async () => {
    isValidated.value = true
    
    // 标记所有字段为已触摸
    Object.keys(validationRules).forEach(field => {
      touched[field] = true
    })
    
    // 并行验证所有字段
    const validationPromises = Object.keys(validationRules).map(field =>
      validateField(field, formData[field])
    )
    
    const results = await Promise.all(validationPromises)
    
    // 所有字段都通过验证才返回 true
    return results.every(result => result === true)
  }
  
  /**
   * 重置验证状态
   * @param {string[]} fields - 要重置的字段（可选，不传则重置所有）
   */
  const resetValidation = (fields = null) => {
    const fieldsToReset = fields || Object.keys(validationRules)
    
    fieldsToReset.forEach(field => {
      errors[field] = false
      errorMessages[field] = ''
      touched[field] = false
      validating[field] = false
    })
    
    if (!fields) {
      isValidated.value = false
    }
  }
  
  /**
   * 重置表单
   * @param {Object} values - 新的表单值（可选）
   */
  const resetForm = (values = initialValues) => {
    Object.keys(formData).forEach(key => {
      formData[key] = values[key] ?? initialValues[key]
    })
    resetValidation()
  }
  
  /**
   * 设置字段值
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   * @param {boolean} validate - 是否立即验证
   */
  const setFieldValue = async (field, value, validate = false) => {
    formData[field] = value
    
    if (validate && touched[field]) {
      await validateField(field, value)
    }
  }
  
  /**
   * 设置字段错误
   * @param {string} field - 字段名
   * @param {string} message - 错误消息
   */
  const setFieldError = (field, message) => {
    errors[field] = true
    errorMessages[field] = message
    touched[field] = true
  }
  
  /**
   * 标记字段为已触摸
   * @param {string} field - 字段名
   * @param {boolean} validate - 是否立即验证
   */
  const touchField = async (field, validate = true) => {
    touched[field] = true
    
    if (validate) {
      await validateField(field, formData[field])
    }
  }
  
  /**
   * 处理字段失焦
   * @param {string} field - 字段名
   */
  const handleBlur = async (field) => {
    await touchField(field, true)
  }
  
  /**
   * 处理字段输入
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   */
  const handleInput = async (field, value) => {
    formData[field] = value
    
    // 只有在字段已被触摸或已经过验证时才进行实时验证
    if (touched[field] || isValidated.value) {
      await validateField(field, value)
    }
  }
  
  /**
   * 批量设置错误
   * @param {Object} errorMap - 错误映射 { field: message }
   */
  const setErrors = (errorMap) => {
    Object.entries(errorMap).forEach(([field, message]) => {
      setFieldError(field, message)
    })
  }
  
  // 计算属性：表单是否有效
  const isValid = computed(() => {
    return Object.values(errors).every(error => !error)
  })
  
  // 计算属性：是否有任何字段被触摸
  const isDirty = computed(() => {
    return Object.values(touched).some(t => t === true)
  })
  
  // 计算属性：是否正在验证
  const isValidatingAny = computed(() => {
    return Object.values(validating).some(v => v === true)
  })
  
  // 计算属性：获取所有错误
  const allErrors = computed(() => {
    return Object.entries(errorMessages)
      .filter(([field, _]) => errors[field])
      .reduce((acc, [field, message]) => {
        acc[field] = message
        return acc
      }, {})
  })
  
  /**
   * 提交表单
   * @param {Function} onSubmit - 提交回调函数
   * @returns {Promise<any>} 提交结果
   */
  const handleSubmit = async (onSubmit) => {
    if (isSubmitting.value) return
    
    isSubmitting.value = true
    
    try {
      // 验证所有字段
      const isValid = await validateAll()
      
      if (!isValid) {
        isSubmitting.value = false
        return { success: false, errors: allErrors.value }
      }
      
      // 执行提交回调
      const result = await onSubmit(formData)
      
      isSubmitting.value = false
      return { success: true, data: result }
    } catch (error) {
      isSubmitting.value = false
      console.error('表单提交失败:', error)
      return { success: false, error }
    }
  }
  
  return {
    // 表单数据
    formData,
    
    // 错误状态
    errors,
    errorMessages,
    touched,
    validating,
    
    // 提交状态
    isSubmitting,
    isValidated,
    
    // 计算属性
    isValid,
    isDirty,
    isValidatingAny,
    allErrors,
    
    // 方法
    validateField,
    validateAll,
    resetValidation,
    resetForm,
    setFieldValue,
    setFieldError,
    setErrors,
    touchField,
    handleBlur,
    handleInput,
    handleSubmit
  }
}

/**
 * 使用字段验证（单个字段的验证钩子）
 * @param {string} fieldName - 字段名
 * @param {any} initialValue - 初始值
 * @param {Array} rules - 验证规则
 * @returns {Object} 字段验证相关的状态和方法
 */
export function useFieldValidation(fieldName, initialValue = '', rules = []) {
  const value = ref(initialValue)
  const error = ref(false)
  const errorMessage = ref('')
  const touched = ref(false)
  const validating = ref(false)
  
  const validate = async () => {
    if (rules.length === 0) return true
    
    error.value = false
    errorMessage.value = ''
    validating.value = true
    
    try {
      for (const rule of rules) {
        let result
        
        if (rule.async) {
          result = await rule.validator(value.value)
        } else {
          result = rule.validator(value.value)
        }
        
        if (!result.valid) {
          error.value = true
          errorMessage.value = result.message || '验证失败'
          validating.value = false
          return false
        }
      }
      
      validating.value = false
      return true
    } catch (err) {
      console.error(`验证字段 ${fieldName} 时出错:`, err)
      error.value = true
      errorMessage.value = '验证过程出错'
      validating.value = false
      return false
    }
  }
  
  const reset = () => {
    value.value = initialValue
    error.value = false
    errorMessage.value = ''
    touched.value = false
    validating.value = false
  }
  
  const touch = async (shouldValidate = true) => {
    touched.value = true
    if (shouldValidate) {
      await validate()
    }
  }
  
  // 监听值变化，在已触摸时自动验证
  watch(value, async () => {
    if (touched.value) {
      await validate()
    }
  })
  
  return {
    value,
    error,
    errorMessage,
    touched,
    validating,
    validate,
    reset,
    touch
  }
}

export default useFormValidation

