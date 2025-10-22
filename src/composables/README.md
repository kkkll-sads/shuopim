# 组合式函数库 (Composables Library)

这是一个完整的Vue 3组合式函数库，为移动端H5应用提供丰富的功能支持。

## 📚 目录结构

```
src/composables/
├── index.js                 # 统一导出文件
├── README.md               # 使用文档
├── useApi.js              # API请求相关
├── useStorage.js          # 本地存储相关
├── useState.js            # 状态管理相关
├── useModal.js            # 弹窗交互相关
├── useToast.js            # 通知提示相关
├── useAuth.js             # 用户认证相关
├── useData.js             # 数据管理相关
├── useUtils.js            # 工具函数相关
├── useDevice.js           # 设备信息相关
├── useMobile.js           # 移动端优化相关
└── useFormValidation.js   # 表单验证相关（已存在）
```

## 🚀 快速开始

### 安装依赖

```bash
npm install dayjs
```

### 基本使用

```javascript
import { useApi, useStorage, useAuth } from '@/composables'

// 在组件中使用
export default {
  setup() {
    // API请求
    const { data, loading, error, get } = useApi()
    
    // 本地存储
    const { value: userInfo, setValue: setUserInfo } = useStorage('userInfo', {})
    
    // 用户认证
    const { isAuthenticated, user, login, logout } = useAuth()
    
    return {
      data,
      loading,
      error,
      get,
      userInfo,
      setUserInfo,
      isAuthenticated,
      user,
      login,
      logout
    }
  }
}
```

## 📖 详细文档

### 1. 核心组合式函数

#### useApi - API请求管理

```javascript
import { useApi } from '@/composables'

// 基本使用
const { data, loading, error, get, post, put, del } = useApi()

// 获取数据
const fetchUsers = async () => {
  await get('/api/users')
}

// 提交数据
const createUser = async (userData) => {
  await post('/api/users', userData)
}
```

#### useStorage - 本地存储

```javascript
import { useStorage, useSessionStorage, useCookie } from '@/composables'

// localStorage
const { value: settings, setValue: setSettings } = useStorage('settings', {})

// sessionStorage
const { value: tempData } = useSessionStorage('tempData', null)

// Cookie
const { value: theme, setValue: setTheme } = useCookie('theme', 'light', {
  expires: 7, // 7天
  secure: true
})
```

#### useState - 状态管理

```javascript
import { useState, useCounter, useToggle } from '@/composables'

// 状态管理
const { state, setState, updateField } = useState({ count: 0, name: '' })

// 计数器
const { count, increment, decrement } = useCounter(0, { min: 0, max: 100 })

// 开关状态
const { isOn, toggle, turnOn, turnOff } = useToggle(false)
```

### 2. UI交互组合式函数

#### useModal - 弹窗管理

```javascript
import { useModal, useConfirm, useAlert } from '@/composables'

// 弹窗
const { visible, show, hide } = useModal()

// 确认对话框
const { show: showConfirm } = useConfirm()
const handleDelete = async () => {
  const confirmed = await showConfirm({
    title: '确认删除',
    message: '确定要删除这个项目吗？'
  })
  if (confirmed) {
    // 执行删除
  }
}

// 提示框
const { show: showAlert } = useAlert()
const handleSuccess = () => {
  showAlert({ message: '操作成功！', type: 'success' })
}
```

#### useToast - 通知提示

```javascript
import { useToast, useMessage } from '@/composables'

// Toast通知
const { success, error, warning, info } = useToast()

// 使用示例
const handleSubmit = async () => {
  try {
    await submitForm()
    success('提交成功！')
  } catch (err) {
    error('提交失败，请重试')
  }
}

// 消息提示
const { success: showSuccess } = useMessage()
showSuccess('操作成功！', '成功')
```

### 3. 业务逻辑组合式函数

#### useAuthState - 认证状态管理

```javascript
import { useAuthState, useAuthGuard, useAuthWatcher } from '@/composables'

// 认证状态管理
const {
  isAuthenticated,
  isExpired,
  isRefreshing,
  user,
  token,
  userId,
  userLevel,
  userPermissions,
  isSessionActive,
  isIdle,
  sessionDuration,
  timeUntilExpiry,
  timeUntilIdle,
  updateActivity,
  resetSession,
  refreshToken,
  hasPermission,
  hasRole,
  hasLevel,
  handleLogout,
  getAuthStatus
} = useAuthState({
  autoCheck: true,
  checkInterval: 30000,
  autoRefresh: true,
  sessionTimeout: 24 * 60 * 60 * 1000,
  idleTimeout: 30 * 60 * 1000,
  onAuthChange: (authenticated, data) => {
    console.log('认证状态变化:', authenticated)
  },
  onTokenExpired: () => {
    console.log('Token已过期')
  }
})

// 认证守卫
const { checkAccess, routeGuard } = useAuthGuard({
  requireAuth: true,
  requirePermissions: ['read'],
  requireRoles: ['user'],
  requireLevel: 1,
  redirectTo: '/login'
})

// 认证监听
useAuthWatcher({
  onLogin: (data) => console.log('用户登录:', data),
  onLogout: () => console.log('用户登出'),
  onTokenExpired: () => console.log('Token过期'),
  onPermissionChange: (permissions) => console.log('权限变化:', permissions)
})
```

#### useAuth - 用户认证

```javascript
import { useAuth } from '@/composables'

const {
  isAuthenticated,
  user,
  login,
  logout,
  register,
  sendVerificationCode,
  verifyCode
} = useAuth()

// 登录
const handleLogin = async (credentials) => {
  const result = await login(credentials)
  if (result.success) {
    // 登录成功
  }
}

// 发送验证码
const handleSendCode = async (phone) => {
  await sendVerificationCode(phone, 'login')
}
```

#### usePageData - 页面数据获取

```javascript
import { usePageData, useListData, useDetailData, useStatsData } from '@/composables'

// 基础页面数据
const {
  data,
  loading,
  error,
  fetchData,
  refresh,
  reset
} = usePageData({
  fetchFn: async (params) => {
    const response = await api.get('/api/page-data', { params })
    return response.data
  },
  immediate: true,
  cache: true,
  cacheKey: 'page_data'
})

// 列表数据管理
const {
  list,
  loading,
  page,
  total,
  hasNextPage,
  hasPrevPage,
  searchQuery,
  isSearching,
  sortBy,
  sortOrder,
  filters,
  fetchData,
  nextPage,
  prevPage,
  search,
  sort,
  setFilters,
  clearFilters
} = useListData({
  fetchFn: async (params) => {
    const response = await api.get('/api/users', { params })
    return response.data
  },
  immediate: true,
  cache: true,
  pageSize: 10,
  enableSearch: true,
  enableSort: true,
  enableFilter: true
})

// 详情数据管理
const {
  detail,
  loading,
  error,
  loadDetail,
  updateDetail,
  deleteDetail
} = useDetailData({
  fetchFn: async (params) => {
    const response = await api.get(`/api/users/${params.id}`)
    return response.data
  },
  immediate: false,
  cache: true
})

// 统计数据管理
const {
  data: stats,
  loading,
  error,
  fetchData,
  refresh,
  startAutoRefresh,
  stopAutoRefresh
} = useStatsData({
  fetchFn: async () => {
    const response = await api.get('/api/stats')
    return response.data
  },
  immediate: true,
  cache: true,
  refreshInterval: 60000 // 1分钟自动刷新
})
```

#### useData - 数据管理

```javascript
import { useData, useList, useSearch } from '@/composables'

// 数据获取
const { data, loading, error, fetch } = useData(async () => {
  const response = await api.get('/api/data')
  return response.data
})

// 列表数据
const { list, loading, loadMore, refresh } = useList(async (params) => {
  const response = await api.get('/api/items', { params })
  return response.data
})

// 搜索功能
const { query, results, search } = useSearch(async (keyword) => {
  const response = await api.get('/api/search', { params: { q: keyword } })
  return response.data
})
```

### 4. 工具类组合式函数

#### useFormat - 格式化工具

```javascript
import { useFormat } from '@/composables'

const {
  formatNumber,
  formatCurrency,
  formatDate,
  formatPhone,
  formatFileSize
} = useFormat()

// 格式化数字
const formattedNumber = formatNumber(1234.56, { decimals: 2 })

// 格式化货币
const formattedCurrency = formatCurrency(1234.56, { symbol: '¥' })

// 格式化日期
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD')

// 格式化手机号
const formattedPhone = formatPhone('13800138000')
```

#### useValidator - 验证工具

```javascript
import { useValidator } from '@/composables'

const {
  isEmail,
  isPhone,
  isIdCard,
  isUrl,
  isNumber,
  isEmpty
} = useValidator()

// 验证邮箱
const isValidEmail = isEmail('user@example.com')

// 验证手机号
const isValidPhone = isPhone('13800138000')

// 验证身份证
const isValidIdCard = isIdCard('110101199001011234')
```

### 5. 路由导航组合式函数

#### useNavigation - 路由导航管理

```javascript
import { useNavigation } from '@/composables'

const {
  // 路由状态
  routePath,
  routeName,
  routeParams,
  routeQuery,
  routeTitle,
  
  // 导航状态
  isNavigating,
  navigationError,
  
  // 历史记录
  history,
  canGoBack,
  canGoForward,
  
  // 面包屑
  breadcrumbs,
  
  // 标签页
  tabs,
  activeTab,
  
  // 导航方法
  navigateTo,
  goBack,
  goForward,
  refresh,
  replace,
  
  // 标签页方法
  addTab,
  removeTab,
  switchTab,
  
  // 工具方法
  getParam,
  getQuery,
  setQuery,
  isRouteActive
} = useNavigation({
  historyLimit: 10,
  enableHistory: true,
  enableBreadcrumb: true,
  enableTab: true
})

// 导航到指定页面
const goToProfile = () => navigateTo('/profile')

// 带参数的导航
const goToUser = (userId) => navigateTo('/user', { params: { id: userId } })

// 带查询参数的导航
const goToSearch = (keyword) => navigateTo('/search', { query: { q: keyword } })

// 返回上一页
const handleGoBack = () => goBack()

// 添加标签页
const openNewTab = () => addTab({
  id: 'new-tab',
  title: '新标签页',
  path: '/new-page',
  icon: 'plus',
  active: true
})
```

#### useRouteGuard - 路由守卫

```javascript
import { useRouteGuard } from '@/composables'

const {
  isAuthenticated,
  hasPermission,
  guardError,
  checkAuth,
  checkPermission,
  beforeEach,
  afterEach
} = useRouteGuard({
  requireAuth: true,
  redirectTo: '/login',
  onAuthRequired: (to, from) => {
    console.log('需要认证:', to.path)
  },
  onRouteChange: (to, from) => {
    console.log('路由变化:', from.path, '->', to.path)
  }
})

// 在路由配置中使用
router.beforeEach(beforeEach)
router.afterEach(afterEach)
```

#### useRouteCache - 路由缓存

```javascript
import { useRouteCache } from '@/composables'

const {
  cacheKeys,
  setCache,
  getCache,
  clearCache,
  hasCache
} = useRouteCache({
  maxCacheSize: 10,
  enableCache: true
})

// 设置缓存
const savePageData = (pageId, data) => {
  setCache(`page_${pageId}`, data)
}

// 获取缓存
const loadPageData = (pageId) => {
  return getCache(`page_${pageId}`)
}

// 清除缓存
const clearPageCache = (pageId) => {
  clearCache(`page_${pageId}`)
}
```

### 6. 移动端专用组合式函数

#### useDevice - 设备信息

```javascript
import { useDevice, useGeolocation, useVibration } from '@/composables'

// 设备信息
const {
  isMobile,
  isIOS,
  isAndroid,
  screenWidth,
  screenHeight,
  hasTouch,
  hasGeolocation
} = useDevice()

// 定位服务
const {
  position,
  getCurrentPosition,
  watchPosition,
  stopWatchingPosition
} = useGeolocation()

// 震动反馈
const { vibrate, vibrateShort, vibrateLong } = useVibration()

// 获取当前位置
const getLocation = async () => {
  try {
    const pos = await getCurrentPosition()
    console.log('当前位置:', pos)
  } catch (error) {
    console.error('获取位置失败:', error)
  }
}
```

#### useMobile - 移动端优化

```javascript
import { useMobileAdapt, useTouchOptimization, useScrollOptimization } from '@/composables'

// 移动端适配
const { scale, isMobile, getResponsiveSize } = useMobileAdapt()

// 触摸优化
const { isTap, isLongPress, isSwipe } = useTouchOptimization()

// 滚动优化
const { scrollY, scrollDirection, scrollToTop, scrollToBottom } = useScrollOptimization()
```

## 🎯 使用场景

### 1. 表单处理

```javascript
import { useFormValidation, useForm } from '@/composables'

export default {
  setup() {
    // 表单验证
    const { formData, errors, validateAll, handleSubmit } = useFormValidation(
      { name: '', email: '', phone: '' },
      {
        name: [required(), minLength(2)],
        email: [required(), email()],
        phone: [required(), phone()]
      }
    )

    // 表单状态
    const { form, setField, validateForm } = useForm({
      name: '',
      email: '',
      phone: ''
    })

    const handleSubmit = async () => {
      const isValid = await validateAll()
      if (isValid) {
        // 提交表单
      }
    }

    return {
      formData,
      errors,
      handleSubmit
    }
  }
}
```

### 2. 数据列表

```javascript
import { useList, usePagination } from '@/composables'

export default {
  setup() {
    // 列表数据
    const { list, loading, loadMore, refresh } = useList(async (params) => {
      const response = await api.get('/api/items', { params })
      return response.data
    })

    // 分页数据
    const { data, loading, page, total, load } = usePagination({
      pageSize: 10,
      immediate: true
    })

    const fetchData = async () => {
      await load(async (params) => {
        const response = await api.get('/api/items', { params })
        return response.data
      })
    }

    return {
      list,
      loading,
      loadMore,
      refresh,
      fetchData
    }
  }
}
```

### 3. 用户认证

```javascript
import { useAuth, usePermission } from '@/composables'

export default {
  setup() {
    const {
      isAuthenticated,
      user,
      login,
      logout,
      sendVerificationCode,
      verifyCode
    } = useAuth()

    const { hasPermission, hasRole } = usePermission()

    const handleLogin = async (credentials) => {
      const result = await login(credentials)
      if (result.success) {
        // 登录成功，跳转到首页
        router.push('/home')
      }
    }

    const handleLogout = async () => {
      await logout()
      router.push('/login')
    }

    return {
      isAuthenticated,
      user,
      handleLogin,
      handleLogout,
      hasPermission,
      hasRole
    }
  }
}
```

## 🔧 配置选项

### 全局配置

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局配置
app.config.globalProperties.$composables = {
  // API配置
  api: {
    baseURL: process.env.VITE_API_BASE || 'http://localhost:8000',
    timeout: 10000
  },
  
  // 存储配置
  storage: {
    prefix: 'app_',
    ttl: 24 * 60 * 60 * 1000 // 24小时
  },
  
  // 移动端配置
  mobile: {
    baseWidth: 375,
    baseHeight: 667,
    enableTouchOptimization: true
  }
}

app.mount('#app')
```

## 📱 移动端优化

### 1. 触摸优化

```javascript
import { useTouchOptimization } from '@/composables'

const { isTap, isLongPress, isSwipe } = useTouchOptimization({
  threshold: 10,
  preventDefault: true
})
```

### 2. 滚动优化

```javascript
import { useScrollOptimization } from '@/composables'

const { scrollY, scrollDirection, scrollToTop } = useScrollOptimization({
  throttle: 16,
  passive: true
})
```

### 3. 键盘优化

```javascript
import { useKeyboardOptimization } from '@/composables'

const { isKeyboardVisible, keyboardHeight, hideKeyboard } = useKeyboardOptimization()
```

## 🧪 测试

```javascript
import { describe, it, expect } from 'vitest'
import { useCounter, useToggle } from '@/composables'

describe('组合式函数测试', () => {
  it('计数器功能', () => {
    const { count, increment, decrement } = useCounter(0)
    
    expect(count.value).toBe(0)
    
    increment()
    expect(count.value).toBe(1)
    
    decrement()
    expect(count.value).toBe(0)
  })
  
  it('开关功能', () => {
    const { isOn, toggle } = useToggle(false)
    
    expect(isOn.value).toBe(false)
    
    toggle()
    expect(isOn.value).toBe(true)
  })
})
```

## 📝 注意事项

1. **性能优化**: 在移动端使用时，注意避免过度使用响应式数据
2. **内存管理**: 及时清理不需要的监听器和定时器
3. **错误处理**: 始终处理异步操作的错误情况
4. **兼容性**: 某些功能需要现代浏览器支持
5. **安全性**: 敏感数据不要存储在localStorage中

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个组合式函数库！

## 📄 许可证

MIT License
