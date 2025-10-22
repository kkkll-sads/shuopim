<template>
  <div class="composables-example">
    <!-- 设备信息展示 -->
    <div class="device-info">
      <h3>设备信息</h3>
      <p>设备类型: {{ deviceType }}</p>
      <p>屏幕尺寸: {{ screenWidth }} x {{ screenHeight }}</p>
      <p>是否移动端: {{ isMobile ? '是' : '否' }}</p>
      <p>是否在线: {{ isOnline ? '是' : '否' }}</p>
    </div>

    <!-- 计数器示例 -->
    <div class="counter-example">
      <h3>计数器</h3>
      <p>当前值: {{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <button @click="reset">重置</button>
    </div>

    <!-- 开关示例 -->
    <div class="toggle-example">
      <h3>开关状态</h3>
      <p>状态: {{ isOn ? '开启' : '关闭' }}</p>
      <button @click="toggle">切换</button>
    </div>

    <!-- 表单示例 -->
    <div class="form-example">
      <h3>表单验证</h3>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>姓名:</label>
          <input 
            v-model="formData.name" 
            :class="{ error: errors.name }"
            @blur="() => touchField('name')"
          />
          <span v-if="errors.name" class="error-message">{{ errorMessages.name }}</span>
        </div>
        
        <div>
          <label>邮箱:</label>
          <input 
            v-model="formData.email" 
            :class="{ error: errors.email }"
            @blur="() => touchField('email')"
          />
          <span v-if="errors.email" class="error-message">{{ errorMessages.email }}</span>
        </div>
        
        <div>
          <label>手机号:</label>
          <input 
            v-model="formData.phone" 
            :class="{ error: errors.phone }"
            @blur="() => touchField('phone')"
          />
          <span v-if="errors.phone" class="error-message">{{ errorMessages.phone }}</span>
        </div>
        
        <button type="submit" :disabled="!isValid || isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
      </form>
    </div>

    <!-- 列表示例 -->
    <div class="list-example">
      <h3>数据列表</h3>
      <button @click="loadData" :disabled="loading">
        {{ loading ? '加载中...' : '加载数据' }}
      </button>
      <button @click="refreshData" :disabled="refreshing">
        {{ refreshing ? '刷新中...' : '刷新' }}
      </button>
      
      <ul v-if="list.length > 0">
        <li v-for="item in list" :key="item.id">
          {{ item.name }} - {{ item.email }}
        </li>
      </ul>
      
      <p v-if="list.length === 0 && !loading">暂无数据</p>
    </div>

    <!-- 通知示例 -->
    <div class="notification-example">
      <h3>通知示例</h3>
      <button @click="showSuccess">成功通知</button>
      <button @click="showError">错误通知</button>
      <button @click="showWarning">警告通知</button>
      <button @click="showInfo">信息通知</button>
    </div>

    <!-- 弹窗示例 -->
    <div class="modal-example">
      <h3>弹窗示例</h3>
      <button @click="showModal">显示弹窗</button>
      <button @click="showConfirmDialog">显示确认对话框</button>
    </div>

    <!-- 搜索示例 -->
    <div class="search-example">
      <h3>搜索功能</h3>
      <input 
        v-model="searchQuery" 
        placeholder="输入搜索关键词"
        @input="debouncedSearch"
      />
      <div v-if="searchResults.length > 0">
        <h4>搜索结果:</h4>
        <ul>
          <li v-for="result in searchResults" :key="result.id">
            {{ result.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 格式化示例 -->
    <div class="format-example">
      <h3>格式化示例</h3>
      <p>数字: {{ formatNumber(1234.56) }}</p>
      <p>货币: {{ formatCurrency(1234.56) }}</p>
      <p>日期: {{ formatDate(new Date()) }}</p>
      <p>手机号: {{ formatPhone('13800138000') }}</p>
    </div>

    <!-- 路由导航示例 -->
    <div class="navigation-example">
      <h3>路由导航示例</h3>
      <p>当前路径: {{ routePath }}</p>
      <p>当前名称: {{ routeName }}</p>
      <p>当前标题: {{ routeTitle }}</p>
      <div class="nav-buttons">
        <button @click="goToHome" :disabled="isNavigating">
          {{ isNavigating ? '导航中...' : '首页' }}
        </button>
        <button @click="goToProfile" :disabled="isNavigating">
          个人中心
        </button>
        <button @click="goBack" :disabled="!canGoBack">
          返回
        </button>
        <button @click="goForward" :disabled="!canGoForward">
          前进
        </button>
        <button @click="refresh" :disabled="isNavigating">
          刷新
        </button>
      </div>
      <div v-if="history.length > 0" class="history-info">
        <h4>导航历史 ({{ history.length }} 条):</h4>
        <div v-for="(item, index) in history.slice(-3)" :key="index" class="history-item">
          {{ item.meta?.title || item.name || item.path }}
        </div>
      </div>
    </div>

    <!-- 页面数据获取示例 -->
    <div class="pagedata-example">
      <h3>页面数据获取示例</h3>
      <div class="data-controls">
        <button @click="fetchPageData" :disabled="pageLoading">
          {{ pageLoading ? '加载中...' : '获取页面数据' }}
        </button>
        <button @click="refreshPageData" :disabled="pageLoading">
          刷新数据
        </button>
        <button @click="resetPageData">重置数据</button>
      </div>
      
      <div v-if="pageData" class="data-display">
        <h4>页面数据:</h4>
        <p>标题: {{ pageData.title }}</p>
        <p>描述: {{ pageData.description }}</p>
        <p>版本: {{ pageData.version }}</p>
        <p v-if="pageFromCache" class="cache-info">📦 数据来自缓存</p>
      </div>
      
      <div v-if="pageError" class="error-display">
        <h4>错误信息:</h4>
        <p class="error">{{ pageError.message }}</p>
      </div>
    </div>

    <!-- 认证状态管理示例 -->
    <div class="authstate-example">
      <h3>认证状态管理示例</h3>
      <div class="auth-status">
        <div class="status-item">
          <span class="label">认证状态:</span>
          <span :class="['value', isAuthenticated ? 'authenticated' : 'unauthenticated']">
            {{ isAuthenticated ? '已认证' : '未认证' }}
          </span>
        </div>
        <div class="status-item" v-if="isAuthenticated">
          <span class="label">用户:</span>
          <span class="value">{{ user?.name || '未知用户' }}</span>
        </div>
        <div class="status-item" v-if="isAuthenticated">
          <span class="label">等级:</span>
          <span class="value">{{ userLevel }}</span>
        </div>
        <div class="status-item" v-if="isAuthenticated">
          <span class="label">权限:</span>
          <span class="value">{{ userPermissions.join(', ') }}</span>
        </div>
      </div>
      
      <div class="auth-controls">
        <button @click="updateActivity" :disabled="!isAuthenticated">
          更新活动
        </button>
        <button @click="resetSession" :disabled="!isAuthenticated">
          重置会话
        </button>
        <button @click="refreshAuthStatus" :disabled="!isAuthenticated || isRefreshing">
          {{ isRefreshing ? '刷新中...' : '刷新认证状态' }}
        </button>
        <button @click="handleLogout" :disabled="!isAuthenticated" class="logout-btn">
          登出
        </button>
      </div>
      
      <div v-if="isAuthenticated" class="session-info">
        <h4>会话信息:</h4>
        <p>会话时长: {{ formatDuration(sessionDuration) }}</p>
        <p v-if="timeUntilExpiry">Token剩余时间: {{ formatDuration(timeUntilExpiry) }}</p>
        <p v-if="timeUntilIdle">空闲超时: {{ formatDuration(timeUntilIdle) }}</p>
      </div>
    </div>

    <!-- 弹窗 -->
    <div v-if="modalVisible" class="modal-overlay" @click="hideModal">
      <div class="modal-content" @click.stop>
        <h3>示例弹窗</h3>
        <p>这是一个示例弹窗</p>
        <button @click="hideModal">关闭</button>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="confirmVisible" class="confirm-overlay" @click="hideConfirm">
      <div class="confirm-content" @click.stop>
        <h3>{{ confirmTitle }}</h3>
        <p>{{ confirmMessage }}</p>
        <div class="confirm-buttons">
          <button @click="confirmCancel">取消</button>
          <button @click="confirmOk">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  // 核心功能
  useApi,
  useStorage,
  useState,
  useCounter,
  useToggle,
  
  // UI交互
  useModal,
  useConfirm,
  useToast,
  
  // 业务逻辑
  useAuth,
  useData,
  useList,
  useSearch,
  
  // 工具类
  useFormat,
  useValidator,
  
  // 移动端
  useDevice,
  useMobileAdapt,
  
  // 路由导航
  useNavigation,
  
  // 页面数据获取
  usePageData,
  
  // 认证状态管理
  useAuthState,
  
  // 表单验证
  useFormValidation,
  required,
  email,
  phone,
  minLength
} from '@/composables'

// 设备信息
const {
  deviceType,
  screenWidth,
  screenHeight,
  isMobile,
  isOnline
} = useDevice()

// 计数器
const { count, increment, decrement, reset } = useCounter(0, { min: 0, max: 100 })

// 开关
const { isOn, toggle } = useToggle(false)

// 表单验证
const {
  formData,
  errors,
  errorMessages,
  touched,
  isSubmitting,
  isValid,
  touchField,
  handleSubmit
} = useFormValidation(
  { name: '', email: '', phone: '' },
  {
    name: [required('请输入姓名'), minLength(2, '姓名至少2个字符')],
    email: [required('请输入邮箱'), email('请输入正确的邮箱格式')],
    phone: [required('请输入手机号'), phone('请输入正确的手机号')]
  }
)

// 列表数据
const { list, loading, refreshing, loadData, refreshData } = useList(async (params) => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    list: [
      { id: 1, name: '用户1', email: 'user1@example.com' },
      { id: 2, name: '用户2', email: 'user2@example.com' },
      { id: 3, name: '用户3', email: 'user3@example.com' }
    ],
    total: 3
  }
})

// 搜索功能
const { query: searchQuery, results: searchResults, debouncedSearch } = useSearch(async (keyword) => {
  if (!keyword) return []
  // 模拟搜索API
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { id: 1, name: `搜索结果1: ${keyword}` },
    { id: 2, name: `搜索结果2: ${keyword}` }
  ]
})

// 通知
const { success, error, warning, info } = useToast()

// 弹窗
const { visible: modalVisible, show: showModal, hide: hideModal } = useModal()

// 确认对话框
const { visible: confirmVisible, show: showConfirm, hide: hideConfirm } = useConfirm()
const confirmTitle = ref('')
const confirmMessage = ref('')

// 格式化工具
const { formatNumber, formatCurrency, formatDate, formatPhone } = useFormat()

// 验证工具
const { isEmail, isPhone, isNumber } = useValidator()

// 路由导航
const {
  routePath,
  routeName,
  routeTitle,
  isNavigating,
  history,
  canGoBack,
  canGoForward,
  navigateTo,
  goBack,
  goForward,
  refresh
} = useNavigation({
  historyLimit: 10,
  enableHistory: true,
  enableBreadcrumb: true,
  enableTab: false
})

// 方法
const handleSubmit = async (onSubmit) => {
  const result = await handleSubmit(async (data) => {
    console.log('提交数据:', data)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  })
  
  if (result.success) {
    success('提交成功！')
  }
}

const showSuccess = () => success('这是一个成功通知')
const showError = () => error('这是一个错误通知')
const showWarning = () => warning('这是一个警告通知')
const showInfo = () => info('这是一个信息通知')

const showConfirmDialog = () => {
  confirmTitle.value = '确认操作'
  confirmMessage.value = '确定要执行此操作吗？'
  showConfirm()
}

const confirmOk = () => {
  success('操作已确认')
  hideConfirm()
}

const confirmCancel = () => {
  info('操作已取消')
  hideConfirm()
}

// 路由导航方法
const goToHome = () => navigateTo('/home')
const goToProfile = () => navigateTo('/profile')

// 认证状态管理方法
const refreshAuthStatus = async () => {
  await refreshToken()
}

const formatDuration = (ms) => {
  if (!ms) return '0秒'
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天${hours % 24}小时`
  if (hours > 0) return `${hours}小时${minutes % 60}分钟`
  if (minutes > 0) return `${minutes}分钟${seconds % 60}秒`
  return `${seconds}秒`
}

// 页面数据获取
const {
  data: pageData,
  loading: pageLoading,
  error: pageError,
  fromCache: pageFromCache,
  fetchData: fetchPageData,
  refresh: refreshPageData,
  reset: resetPageData
} = usePageData({
  fetchFn: async (params) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      title: '示例页面',
      description: '这是一个页面数据获取示例',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  },
  immediate: false,
  cache: true,
  cacheKey: 'example_page_data'
})

// 认证状态管理
const {
  isAuthenticated,
  isExpired,
  isRefreshing,
  user,
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
  showNotifications: true
})

// 生命周期
onMounted(() => {
  console.log('组合式函数示例组件已挂载')
})
</script>

<style scoped>
.composables-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.device-info,
.counter-example,
.toggle-example,
.form-example,
.list-example,
.notification-example,
.modal-example,
.search-example,
.format-example {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

h3 {
  margin-top: 0;
  color: #333;
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
}

button:hover {
  background: #e0e0e0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input {
  margin: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input.error {
  border-color: #f56565;
}

.error-message {
  color: #f56565;
  font-size: 12px;
}

.modal-overlay,
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content,
.confirm-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.confirm-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.navigation-example {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.history-info {
  margin-top: 15px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
}

.history-item {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #666;
}

.history-item:last-child {
  border-bottom: none;
}

.pagedata-example {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.data-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.data-display {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-top: 15px;
}

.cache-info {
  margin-top: 10px;
  font-size: 14px;
  color: #28a745;
  font-weight: bold;
}

.error-display {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.authstate-example {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.auth-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-item .label {
  font-weight: bold;
  color: #333;
}

.status-item .value {
  color: #007bff;
  font-weight: bold;
}

.value.authenticated {
  color: #28a745;
}

.value.unauthenticated {
  color: #dc3545;
}

.auth-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.logout-btn:hover {
  background: #c82333;
  border-color: #bd2130;
}

.session-info {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.session-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.session-info p {
  margin: 5px 0;
  color: #666;
}
</style>
