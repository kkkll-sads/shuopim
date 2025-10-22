<template>
  <div class="navigation-example">
    <h2>路由导航示例</h2>
    
    <!-- 当前路由信息 -->
    <div class="current-route">
      <h3>当前路由信息</h3>
      <p>路径: {{ routePath }}</p>
      <p>名称: {{ routeName }}</p>
      <p>标题: {{ routeTitle }}</p>
      <p>参数: {{ JSON.stringify(routeParams) }}</p>
      <p>查询: {{ JSON.stringify(routeQuery) }}</p>
    </div>

    <!-- 导航控制 -->
    <div class="navigation-controls">
      <h3>导航控制</h3>
      <div class="button-group">
        <button @click="goToHome" :disabled="isNavigating">
          {{ isNavigating ? '导航中...' : '首页' }}
        </button>
        <button @click="goToProfile" :disabled="isNavigating">
          个人中心
        </button>
        <button @click="goToSettings" :disabled="isNavigating">
          设置
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
    </div>

    <!-- 历史记录 -->
    <div class="history-section" v-if="history.length > 0">
      <h3>导航历史</h3>
      <div class="history-list">
        <div 
          v-for="(item, index) in history" 
          :key="index"
          :class="['history-item', { active: index === currentIndex }"
          @click="goToHistory(index)"
        >
          <span class="history-title">{{ item.meta?.title || item.name || item.path }}</span>
          <span class="history-path">{{ item.path }}</span>
          <span class="history-time">{{ formatTime(item.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div class="breadcrumb-section" v-if="breadcrumbs.length > 0">
      <h3>面包屑导航</h3>
      <nav class="breadcrumb">
        <span 
          v-for="(crumb, index) in breadcrumbs" 
          :key="index"
          :class="['breadcrumb-item', { active: crumb.active, disabled: crumb.disabled }]"
          @click="!crumb.disabled && navigateTo(crumb.path)"
        >
          <i v-if="crumb.icon" :class="crumb.icon"></i>
          {{ crumb.title }}
          <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
        </span>
      </nav>
    </div>

    <!-- 标签页导航 -->
    <div class="tab-section" v-if="tabs.length > 0">
      <h3>标签页导航</h3>
      <div class="tab-list">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-item', { active: tab.id === activeTab }]"
          @click="switchTab(tab.id)"
        >
          <i v-if="tab.icon" :class="tab.icon"></i>
          <span>{{ tab.title }}</span>
          <button 
            v-if="tab.closable" 
            @click.stop="removeTab(tab.id)"
            class="close-btn"
          >
            ×
          </button>
        </div>
      </div>
      <div class="tab-actions">
        <button @click="closeOtherTabs">关闭其他</button>
        <button @click="closeAllTabs">关闭所有</button>
      </div>
    </div>

    <!-- 查询参数控制 -->
    <div class="query-controls">
      <h3>查询参数控制</h3>
      <div class="query-inputs">
        <input 
          v-model="newQueryKey" 
          placeholder="参数名"
          @keyup.enter="addQueryParam"
        />
        <input 
          v-model="newQueryValue" 
          placeholder="参数值"
          @keyup.enter="addQueryParam"
        />
        <button @click="addQueryParam">添加参数</button>
      </div>
      <div class="current-query">
        <h4>当前查询参数:</h4>
        <div v-for="(value, key) in routeQuery" :key="key" class="query-item">
          <span class="query-key">{{ key }}:</span>
          <span class="query-value">{{ value }}</span>
          <button @click="removeQueryParam(key)" class="remove-btn">×</button>
        </div>
      </div>
    </div>

    <!-- 路由守卫状态 -->
    <div class="guard-status">
      <h3>路由守卫状态</h3>
      <p>认证状态: {{ isAuthenticated ? '已认证' : '未认证' }}</p>
      <p>权限状态: {{ hasPermission ? '有权限' : '无权限' }}</p>
      <p v-if="guardError" class="error">守卫错误: {{ guardError }}</p>
    </div>

    <!-- 路由缓存状态 -->
    <div class="cache-status">
      <h3>路由缓存状态</h3>
      <p>缓存数量: {{ cacheKeys.length }}</p>
      <div class="cache-actions">
        <button @click="testCache">测试缓存</button>
        <button @click="clearAllCache">清除所有缓存</button>
      </div>
      <div v-if="cacheKeys.length > 0" class="cache-list">
        <h4>缓存列表:</h4>
        <div v-for="key in cacheKeys" :key="key" class="cache-item">
          <span>{{ key }}</span>
          <button @click="clearCache(key)">清除</button>
        </div>
      </div>
    </div>

    <!-- 导航错误 -->
    <div v-if="navigationError" class="error-section">
      <h3>导航错误</h3>
      <p class="error">{{ navigationError.message }}</p>
      <button @click="navigationError = null">清除错误</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNavigation, useRouteGuard, useRouteCache, useFormat } from '@/composables'

// 路由导航
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
  currentIndex,
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
  closeOtherTabs,
  closeAllTabs,
  
  // 工具方法
  getParam,
  getQuery,
  setQuery
} = useNavigation({
  historyLimit: 10,
  enableHistory: true,
  enableBreadcrumb: true,
  enableTab: true
})

// 路由守卫
const {
  isAuthenticated,
  hasPermission,
  guardError
} = useRouteGuard({
  requireAuth: false,
  redirectTo: '/login'
})

// 路由缓存
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

// 格式化工具
const { formatTime } = useFormat()

// 查询参数控制
const newQueryKey = ref('')
const newQueryValue = ref('')

// 添加查询参数
const addQueryParam = async () => {
  if (newQueryKey.value && newQueryValue.value) {
    await setQuery({ [newQueryKey.value]: newQueryValue.value })
    newQueryKey.value = ''
    newQueryValue.value = ''
  }
}

// 移除查询参数
const removeQueryParam = async (key) => {
  const newQuery = { ...routeQuery.value }
  delete newQuery[key]
  await setQuery(newQuery, true)
}

// 导航到历史记录
const goToHistory = async (index) => {
  if (index >= 0 && index < history.value.length) {
    const targetRoute = history.value[index]
    await navigateTo(targetRoute, { replace: true })
  }
}

// 测试缓存
const testCache = () => {
  const testKey = 'test_' + Date.now()
  const testData = { message: '测试数据', timestamp: Date.now() }
  setCache(testKey, testData)
  console.log('缓存已设置:', testKey, testData)
}

// 清除所有缓存
const clearAllCache = () => {
  clearCache()
  console.log('所有缓存已清除')
}

// 导航方法
const goToHome = () => navigateTo('/home')
const goToProfile = () => navigateTo('/profile')
const goToSettings = () => navigateTo('/settings')

// 生命周期
onMounted(() => {
  // 添加一些示例标签页
  addTab({
    id: 'home',
    title: '首页',
    path: '/home',
    icon: 'home',
    active: true
  })
  
  addTab({
    id: 'profile',
    title: '个人中心',
    path: '/profile',
    icon: 'user',
    active: false
  })
  
  // 设置面包屑
  updateBreadcrumbs([
    { title: '首页', path: '/home', icon: 'home' },
    { title: '示例页面', path: '/example', active: true }
  ])
})

// 更新面包屑的方法（需要在组件中定义）
const updateBreadcrumbs = (breadcrumbList) => {
  // 这个方法应该由 useNavigation 提供
  console.log('更新面包屑:', breadcrumbList)
}
</script>

<style scoped>
.navigation-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.current-route,
.navigation-controls,
.history-section,
.breadcrumb-section,
.tab-section,
.query-controls,
.guard-status,
.cache-status,
.error-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background: #f0f0f0;
}

.history-item.active {
  background: #007bff;
  color: white;
}

.history-title {
  font-weight: bold;
  margin-right: 10px;
}

.history-path {
  color: #666;
  margin-right: 10px;
  font-family: monospace;
}

.history-time {
  color: #999;
  font-size: 12px;
  margin-left: auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-item:hover:not(.disabled) {
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #333;
  font-weight: bold;
}

.breadcrumb-item.disabled {
  color: #999;
  cursor: not-allowed;
}

.separator {
  margin: 0 5px;
  color: #999;
}

.tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
}

.tab-item:hover {
  background: #f0f0f0;
}

.tab-item.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.close-btn {
  margin-left: 5px;
  padding: 2px 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.tab-actions {
  display: flex;
  gap: 10px;
}

.query-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.query-inputs input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.current-query {
  margin-top: 15px;
}

.query-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.query-key {
  font-weight: bold;
  margin-right: 10px;
  min-width: 100px;
}

.query-value {
  flex: 1;
  margin-right: 10px;
}

.remove-btn {
  padding: 2px 6px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}

.cache-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.cache-list {
  margin-top: 15px;
}

.cache-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.error {
  color: #dc3545;
  font-weight: bold;
}

.error-section {
  background: #f8d7da;
  border-color: #f5c6cb;
}
</style>
