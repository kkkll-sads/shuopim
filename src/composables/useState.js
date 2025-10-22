/**
 * 状态管理组合式函数
 * 提供统一的状态管理功能
 */

import { ref, reactive, computed, watch, nextTick } from 'vue'

/**
 * 使用状态管理
 * @param {any} initialState - 初始状态
 * @param {Object} options - 配置选项
 * @returns {Object} 状态管理相关的状态和方法
 */
export function useState(initialState = {}, options = {}) {
  const {
    deep = true,
    immediate = true,
    onStateChange = null
  } = options

  // 创建响应式状态
  const state = reactive({ ...initialState })
  
  // 状态历史记录
  const history = ref([])
  const maxHistory = options.maxHistory || 10

  // 保存状态快照
  const saveSnapshot = () => {
    const snapshot = JSON.parse(JSON.stringify(state))
    history.value.push(snapshot)
    
    // 限制历史记录数量
    if (history.value.length > maxHistory) {
      history.value.shift()
    }
  }

  // 设置状态
  const setState = (newState) => {
    if (typeof newState === 'function') {
      Object.assign(state, newState(state))
    } else {
      Object.assign(state, newState)
    }
    
    if (onStateChange) {
      onStateChange(state)
    }
  }

  // 更新单个字段
  const updateField = (field, value) => {
    if (typeof field === 'string') {
      state[field] = value
    } else if (typeof field === 'object') {
      Object.assign(state, field)
    }
    
    if (onStateChange) {
      onStateChange(state)
    }
  }

  // 重置状态
  const resetState = () => {
    Object.assign(state, initialState)
    history.value = []
    
    if (onStateChange) {
      onStateChange(state)
    }
  }

  // 撤销状态
  const undo = () => {
    if (history.value.length > 0) {
      const previousState = history.value.pop()
      Object.assign(state, previousState)
      
      if (onStateChange) {
        onStateChange(state)
      }
    }
  }

  // 监听状态变化
  if (immediate) {
    watch(state, (newState, oldState) => {
      if (onStateChange) {
        onStateChange(newState, oldState)
      }
    }, { deep })
  }

  return {
    state,
    setState,
    updateField,
    resetState,
    undo,
    history: computed(() => history.value)
  }
}

/**
 * 使用计数器
 * @param {number} initialValue - 初始值
 * @param {Object} options - 配置选项
 * @returns {Object} 计数器相关的状态和方法
 */
export function useCounter(initialValue = 0, options = {}) {
  const {
    min = -Infinity,
    max = Infinity,
    step = 1
  } = options

  const count = ref(initialValue)

  // 增加
  const increment = (amount = step) => {
    const newValue = count.value + amount
    if (newValue <= max) {
      count.value = newValue
    }
  }

  // 减少
  const decrement = (amount = step) => {
    const newValue = count.value - amount
    if (newValue >= min) {
      count.value = newValue
    }
  }

  // 设置值
  const setCount = (value) => {
    if (value >= min && value <= max) {
      count.value = value
    }
  }

  // 重置
  const reset = () => {
    count.value = initialValue
  }

  // 是否达到最小值
  const isMin = computed(() => count.value <= min)
  
  // 是否达到最大值
  const isMax = computed(() => count.value >= max)

  return {
    count,
    increment,
    decrement,
    setCount,
    reset,
    isMin,
    isMax
  }
}

/**
 * 使用开关状态
 * @param {boolean} initialValue - 初始值
 * @param {Object} options - 配置选项
 * @returns {Object} 开关相关的状态和方法
 */
export function useToggle(initialValue = false, options = {}) {
  const {
    onToggle = null
  } = options

  const isOn = ref(initialValue)

  // 切换
  const toggle = () => {
    isOn.value = !isOn.value
    if (onToggle) {
      onToggle(isOn.value)
    }
  }

  // 开启
  const turnOn = () => {
    if (!isOn.value) {
      isOn.value = true
      if (onToggle) {
        onToggle(true)
      }
    }
  }

  // 关闭
  const turnOff = () => {
    if (isOn.value) {
      isOn.value = false
      if (onToggle) {
        onToggle(false)
      }
    }
  }

  // 设置值
  const setValue = (value) => {
    isOn.value = Boolean(value)
    if (onToggle) {
      onToggle(isOn.value)
    }
  }

  return {
    isOn,
    toggle,
    turnOn,
    turnOff,
    setValue
  }
}

/**
 * 使用列表状态
 * @param {Array} initialList - 初始列表
 * @param {Object} options - 配置选项
 * @returns {Object} 列表相关的状态和方法
 */
export function useList(initialList = [], options = {}) {
  const {
    unique = false,
    maxLength = Infinity
  } = options

  const list = ref([...initialList])

  // 添加项目
  const addItem = (item) => {
    if (unique && list.value.includes(item)) {
      return false
    }
    
    if (list.value.length >= maxLength) {
      return false
    }
    
    list.value.push(item)
    return true
  }

  // 移除项目
  const removeItem = (item) => {
    const index = list.value.indexOf(item)
    if (index > -1) {
      list.value.splice(index, 1)
      return true
    }
    return false
  }

  // 移除指定索引的项目
  const removeAt = (index) => {
    if (index >= 0 && index < list.value.length) {
      list.value.splice(index, 1)
      return true
    }
    return false
  }

  // 更新项目
  const updateItem = (index, newItem) => {
    if (index >= 0 && index < list.value.length) {
      list.value[index] = newItem
      return true
    }
    return false
  }

  // 清空列表
  const clear = () => {
    list.value = []
  }

  // 重置列表
  const reset = () => {
    list.value = [...initialList]
  }

  // 查找项目
  const findItem = (predicate) => {
    return list.value.find(predicate)
  }

  // 查找项目索引
  const findIndex = (predicate) => {
    return list.value.findIndex(predicate)
  }

  // 过滤列表
  const filter = (predicate) => {
    return list.value.filter(predicate)
  }

  // 排序列表
  const sort = (compareFn) => {
    list.value.sort(compareFn)
  }

  // 列表长度
  const length = computed(() => list.value.length)
  
  // 是否为空
  const isEmpty = computed(() => list.value.length === 0)
  
  // 是否已满
  const isFull = computed(() => list.value.length >= maxLength)

  return {
    list,
    addItem,
    removeItem,
    removeAt,
    updateItem,
    clear,
    reset,
    findItem,
    findIndex,
    filter,
    sort,
    length,
    isEmpty,
    isFull
  }
}

/**
 * 使用表单状态
 * @param {Object} initialForm - 初始表单数据
 * @param {Object} options - 配置选项
 * @returns {Object} 表单相关的状态和方法
 */
export function useForm(initialForm = {}, options = {}) {
  const {
    validateOnChange = false,
    onFormChange = null
  } = options

  const form = reactive({ ...initialForm })
  const errors = reactive({})
  const touched = reactive({})

  // 设置字段值
  const setField = (field, value) => {
    form[field] = value
    touched[field] = true
    
    if (onFormChange) {
      onFormChange(form, field, value)
    }
  }

  // 设置多个字段
  const setFields = (fields) => {
    Object.entries(fields).forEach(([field, value]) => {
      setField(field, value)
    })
  }

  // 设置字段错误
  const setFieldError = (field, error) => {
    errors[field] = error
  }

  // 清除字段错误
  const clearFieldError = (field) => {
    delete errors[field]
  }

  // 清除所有错误
  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(form, initialForm)
    clearErrors()
    Object.keys(touched).forEach(key => delete touched[key])
  }

  // 验证表单
  const validateForm = (rules) => {
    clearErrors()
    let isValid = true

    Object.entries(rules).forEach(([field, rule]) => {
      const value = form[field]
      const result = rule(value)
      
      if (!result.valid) {
        errors[field] = result.message
        isValid = false
      }
    })

    return isValid
  }

  // 获取表单数据
  const getFormData = () => {
    return { ...form }
  }

  // 是否有错误
  const hasErrors = computed(() => Object.keys(errors).length > 0)
  
  // 是否已触摸
  const isTouched = computed(() => Object.values(touched).some(t => t))

  return {
    form,
    errors,
    touched,
    setField,
    setFields,
    setFieldError,
    clearFieldError,
    clearErrors,
    resetForm,
    validateForm,
    getFormData,
    hasErrors,
    isTouched
  }
}

/**
 * 使用异步状态
 * @param {Function} asyncFn - 异步函数
 * @param {Object} options - 配置选项
 * @returns {Object} 异步状态相关的状态和方法
 */
export function useAsyncState(asyncFn, options = {}) {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    onFinally = null
  } = options

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 执行异步函数
  const execute = async (...args) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn(...args)
      data.value = result
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      error.value = err
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      loading.value = false
      
      if (onFinally) {
        onFinally()
      }
    }
  }

  // 重置状态
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // 立即执行
  if (immediate) {
    nextTick(() => {
      execute()
    })
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

export default useState
