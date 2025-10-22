<template>
  <div class="pagedata-example">
    <h2>页面数据获取示例</h2>
    
    <!-- 基础数据获取 -->
    <div class="basic-data-section">
      <h3>基础数据获取</h3>
      <div class="data-controls">
        <button @click="fetchBasicData" :disabled="loading">
          {{ loading ? '加载中...' : '获取数据' }}
        </button>
        <button @click="refreshBasicData" :disabled="loading">
          {{ refreshing ? '刷新中...' : '刷新数据' }}
        </button>
        <button @click="resetBasicData">重置数据</button>
      </div>
      
      <div v-if="basicData" class="data-display">
        <h4>基础数据:</h4>
        <pre>{{ JSON.stringify(basicData, null, 2) }}</pre>
        <p v-if="fromCache" class="cache-info">📦 数据来自缓存</p>
        <p v-if="lastFetch" class="fetch-time">
          🕒 最后获取时间: {{ formatTime(lastFetch) }}
        </p>
      </div>
      
      <div v-if="error" class="error-display">
        <h4>错误信息:</h4>
        <p class="error">{{ error.message }}</p>
      </div>
    </div>

    <!-- 列表数据 -->
    <div class="list-data-section">
      <h3>列表数据管理</h3>
      
      <!-- 搜索和过滤 -->
      <div class="list-controls">
        <div class="search-controls">
          <input 
            v-model="searchQuery" 
            placeholder="搜索用户..."
            @input="debouncedSearch"
            class="search-input"
          />
          <button @click="clearSearch" v-if="searchQuery">清除</button>
        </div>
        
        <div class="filter-controls">
          <select v-model="statusFilter" @change="applyFilters">
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
          </select>
          
          <select v-model="sortField" @change="applySort">
            <option value="">排序方式</option>
            <option value="name">按姓名</option>
            <option value="email">按邮箱</option>
            <option value="created_at">按创建时间</option>
          </select>
        </div>
      </div>
      
      <!-- 列表显示 -->
      <div class="list-display">
        <div v-if="listLoading" class="loading">加载中...</div>
        <div v-else-if="listError" class="error">加载失败: {{ listError.message }}</div>
        <div v-else-if="userList.length === 0" class="empty">暂无数据</div>
        <div v-else class="user-list">
          <div 
            v-for="(user, index) in userList" 
            :key="user.id" 
            class="user-item"
          >
            <div class="user-info">
              <h4>{{ user.name }}</h4>
              <p>{{ user.email }}</p>
              <span class="user-status" :class="user.status">
                {{ user.status === 'active' ? '活跃' : '非活跃' }}
              </span>
            </div>
            <div class="user-actions">
              <button @click="editUser(index, user)">编辑</button>
              <button @click="deleteUser(index)" class="delete-btn">删除</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页控制 -->
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="!hasPrevPage || listLoading">
          上一页
        </button>
        <span class="page-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
          (总计 {{ total }} 条)
        </span>
        <button @click="nextPage" :disabled="!hasNextPage || listLoading">
          下一页
        </button>
      </div>
    </div>

    <!-- 详情数据 -->
    <div class="detail-data-section">
      <h3>详情数据管理</h3>
      
      <div class="detail-controls">
        <input 
          v-model="detailId" 
          placeholder="输入用户ID"
          type="number"
          class="detail-input"
        />
        <button @click="loadUserDetail" :disabled="detailLoading">
          {{ detailLoading ? '加载中...' : '加载详情' }}
        </button>
        <button @click="refreshDetail" :disabled="detailLoading">
          刷新详情
        </button>
      </div>
      
      <div v-if="userDetail" class="detail-display">
        <h4>用户详情:</h4>
        <div class="detail-info">
          <p><strong>ID:</strong> {{ userDetail.id }}</p>
          <p><strong>姓名:</strong> {{ userDetail.name }}</p>
          <p><strong>邮箱:</strong> {{ userDetail.email }}</p>
          <p><strong>状态:</strong> {{ userDetail.status }}</p>
          <p><strong>创建时间:</strong> {{ formatDate(userDetail.created_at) }}</p>
        </div>
        <div class="detail-actions">
          <button @click="updateUserDetail">更新详情</button>
          <button @click="deleteUserDetail" class="delete-btn">删除用户</button>
        </div>
      </div>
      
      <div v-if="detailError" class="error-display">
        <h4>详情加载错误:</h4>
        <p class="error">{{ detailError.message }}</p>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-data-section">
      <h3>统计数据展示</h3>
      
      <div class="stats-controls">
        <button @click="loadStats" :disabled="statsLoading">
          {{ statsLoading ? '加载中...' : '加载统计' }}
        </button>
        <button @click="refreshStats" :disabled="statsLoading">
          刷新统计
        </button>
        <button @click="toggleAutoRefresh">
          {{ autoRefreshEnabled ? '停止自动刷新' : '开始自动刷新' }}
        </button>
      </div>
      
      <div v-if="statsData" class="stats-display">
        <div class="stats-grid">
          <div class="stat-card">
            <h4>总用户数</h4>
            <p class="stat-value">{{ formatNumber(statsData.totalUsers) }}</p>
          </div>
          <div class="stat-card">
            <h4>活跃用户</h4>
            <p class="stat-value">{{ formatNumber(statsData.activeUsers) }}</p>
          </div>
          <div class="stat-card">
            <h4>今日新增</h4>
            <p class="stat-value">{{ formatNumber(statsData.todayNew) }}</p>
          </div>
          <div class="stat-card">
            <h4>本周新增</h4>
            <p class="stat-value">{{ formatNumber(statsData.weekNew) }}</p>
          </div>
        </div>
        
        <div class="stats-chart">
          <h4>用户增长趋势</h4>
          <div class="chart-placeholder">
            📊 这里可以集成图表组件
          </div>
        </div>
      </div>
      
      <div v-if="statsError" class="error-display">
        <h4>统计加载错误:</h4>
        <p class="error">{{ statsError.message }}</p>
      </div>
    </div>

    <!-- 数据统计信息 -->
    <div class="data-stats">
      <h3>数据统计信息</h3>
      <div class="stats-info">
        <div class="stat-item">
          <span class="stat-label">基础数据状态:</span>
          <span :class="['stat-value', loading ? 'loading' : 'success']">
            {{ loading ? '加载中' : '已加载' }}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">列表数据:</span>
          <span class="stat-value">{{ userList.length }} 条</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">当前页码:</span>
          <span class="stat-value">{{ currentPage }} / {{ totalPages }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">搜索状态:</span>
          <span class="stat-value">{{ isSearching ? '搜索中' : '空闲' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">缓存状态:</span>
          <span class="stat-value">{{ fromCache ? '来自缓存' : '实时数据' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePageData, useListData, useDetailData, useStatsData, useFormat } from '@/composables'

// 格式化工具
const { formatNumber, formatDate, formatTime } = useFormat()

// 基础数据获取
const {
  data: basicData,
  loading,
  error,
  refreshing,
  fromCache,
  lastFetch,
  fetchData: fetchBasicData,
  refresh: refreshBasicData,
  reset: resetBasicData
} = usePageData({
  fetchFn: async (params) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      message: '基础数据获取成功',
      timestamp: new Date().toISOString(),
      data: {
        version: '1.0.0',
        environment: 'development',
        features: ['search', 'filter', 'sort', 'pagination']
      }
    }
  },
  immediate: true,
  cache: true,
  cacheKey: 'basic_data'
})

// 列表数据管理
const {
  list: userList,
  loading: listLoading,
  error: listError,
  page: currentPage,
  total,
  totalPages,
  hasNextPage,
  hasPrevPage,
  searchQuery,
  isSearching,
  sortBy,
  sortOrder,
  filters,
  fetchData: fetchListData,
  refresh: refreshList,
  nextPage,
  prevPage,
  search,
  debouncedSearch,
  sort,
  setFilters,
  clearFilters,
  addItem,
  updateItem,
  removeItem
} = useListData({
  fetchFn: async (params) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockUsers = [
      { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active', created_at: '2024-01-01' },
      { id: 2, name: '李四', email: 'lisi@example.com', status: 'inactive', created_at: '2024-01-02' },
      { id: 3, name: '王五', email: 'wangwu@example.com', status: 'active', created_at: '2024-01-03' },
      { id: 4, name: '赵六', email: 'zhaoliu@example.com', status: 'active', created_at: '2024-01-04' },
      { id: 5, name: '钱七', email: 'qianqi@example.com', status: 'inactive', created_at: '2024-01-05' }
    ]
    
    // 模拟搜索
    let filteredUsers = mockUsers
    if (params.search) {
      filteredUsers = mockUsers.filter(user => 
        user.name.includes(params.search) || user.email.includes(params.search)
      )
    }
    
    // 模拟分页
    const page = params.page || 1
    const size = params.size || 10
    const start = (page - 1) * size
    const end = start + size
    
    return {
      data: filteredUsers.slice(start, end),
      total: filteredUsers.length,
      page,
      size
    }
  },
  immediate: true,
  cache: true,
  cacheKey: 'user_list',
  pageSize: 3,
  enableSearch: true,
  enableSort: true,
  enableFilter: true
})

// 详情数据管理
const {
  detail: userDetail,
  loading: detailLoading,
  error: detailError,
  fetchData: fetchDetailData,
  refresh: refreshDetail,
  loadDetail,
  updateDetail,
  deleteDetail
} = useDetailData({
  fetchFn: async (params) => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const mockDetail = {
      id: params.id,
      name: `用户${params.id}`,
      email: `user${params.id}@example.com`,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-15T10:30:00Z',
      profile: {
        avatar: '',
        bio: '这是一个示例用户',
        location: '北京'
      }
    }
    
    return mockDetail
  },
  immediate: false,
  cache: true
})

// 统计数据管理
const {
  data: statsData,
  loading: statsLoading,
  error: statsError,
  fetchData: loadStats,
  refresh: refreshStats,
  startAutoRefresh,
  stopAutoRefresh,
  getStatValue,
  formatStatValue
} = useStatsData({
  fetchFn: async () => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    return {
      totalUsers: 1250,
      activeUsers: 980,
      todayNew: 15,
      weekNew: 89,
      monthNew: 234,
      growthRate: 12.5,
      retentionRate: 85.3
    }
  },
  immediate: true,
  cache: true,
  cacheKey: 'user_stats',
  refreshInterval: 30000 // 30秒自动刷新
})

// 详情ID
const detailId = ref('')

// 过滤和排序状态
const statusFilter = ref('')
const sortField = ref('')

// 自动刷新状态
const autoRefreshEnabled = ref(false)

// 方法
const loadUserDetail = async () => {
  if (detailId.value) {
    await loadDetail(detailId.value)
  }
}

const editUser = (index, user) => {
  console.log('编辑用户:', user)
  // 这里可以打开编辑对话框
}

const deleteUser = (index) => {
  if (confirm('确定要删除这个用户吗？')) {
    removeItem(index)
  }
}

const updateUserDetail = async () => {
  if (userDetail.value) {
    await updateDetail({
      name: userDetail.value.name + ' (已更新)',
      updated_at: new Date().toISOString()
    })
  }
}

const deleteUserDetail = async () => {
  if (confirm('确定要删除这个用户吗？')) {
    await deleteDetail()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  search('')
}

const applyFilters = () => {
  setFilters({ status: statusFilter.value })
}

const applySort = () => {
  if (sortField.value) {
    sort(sortField.value, sortOrder.value)
  }
}

const toggleAutoRefresh = () => {
  if (autoRefreshEnabled.value) {
    stopAutoRefresh()
    autoRefreshEnabled.value = false
  } else {
    startAutoRefresh()
    autoRefreshEnabled.value = true
  }
}

// 生命周期
onMounted(() => {
  console.log('页面数据示例组件已挂载')
})
</script>

<style scoped>
.pagedata-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.basic-data-section,
.list-data-section,
.detail-data-section,
.stats-data-section,
.data-stats {
  margin-bottom: 40px;
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

.data-controls,
.list-controls,
.detail-controls,
.stats-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
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

.delete-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.delete-btn:hover {
  background: #c82333;
}

.search-input,
.detail-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
}

.data-display,
.detail-display {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-top: 15px;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

.cache-info,
.fetch-time {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.error-display {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.user-info p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.user-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.user-status.active {
  background: #d4edda;
  color: #155724;
}

.user-status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.user-actions {
  display: flex;
  gap: 5px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.stat-card h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.stats-chart {
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 18px;
}

.stats-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stat-label {
  font-weight: bold;
  color: #333;
}

.stat-value {
  color: #007bff;
  font-weight: bold;
}

.stat-value.loading {
  color: #ffc107;
}

.stat-value.success {
  color: #28a745;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.error {
  color: #dc3545;
  font-weight: bold;
}
</style>
