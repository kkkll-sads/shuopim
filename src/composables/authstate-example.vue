<template>
  <div class="authstate-example">
    <h2>认证状态管理示例</h2>
    
    <!-- 认证状态概览 -->
    <div class="auth-overview">
      <h3>认证状态概览</h3>
      <div class="status-grid">
        <div class="status-card" :class="{ active: isAuthenticated, inactive: !isAuthenticated }">
          <h4>认证状态</h4>
          <p>{{ isAuthenticated ? '已认证' : '未认证' }}</p>
        </div>
        
        <div class="status-card" :class="{ active: !isExpired, inactive: isExpired }">
          <h4>Token状态</h4>
          <p>{{ isExpired ? '已过期' : '有效' }}</p>
        </div>
        
        <div class="status-card" :class="{ active: isSessionActive, inactive: !isSessionActive }">
          <h4>会话状态</h4>
          <p>{{ isSessionActive ? '活跃' : '已过期' }}</p>
        </div>
        
        <div class="status-card" :class="{ active: !isIdle, inactive: isIdle }">
          <h4>活动状态</h4>
          <p>{{ isIdle ? '空闲' : '活跃' }}</p>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="user-info" v-if="isAuthenticated">
      <h3>用户信息</h3>
      <div class="user-details">
        <div class="user-avatar">
          <img :src="user?.avatar || '/default-avatar.png'" :alt="user?.name" />
        </div>
        <div class="user-data">
          <h4>{{ user?.name || '未知用户' }}</h4>
          <p>ID: {{ userId }}</p>
          <p>等级: {{ userLevel }}</p>
          <p>权限: {{ userPermissions.join(', ') }}</p>
        </div>
      </div>
    </div>

    <!-- 会话信息 -->
    <div class="session-info" v-if="isAuthenticated">
      <h3>会话信息</h3>
      <div class="session-details">
        <div class="session-item">
          <span class="label">会话时长:</span>
          <span class="value">{{ formatDuration(sessionDuration) }}</span>
        </div>
        <div class="session-item" v-if="timeUntilExpiry">
          <span class="label">Token剩余时间:</span>
          <span class="value">{{ formatDuration(timeUntilExpiry) }}</span>
        </div>
        <div class="session-item" v-if="timeUntilIdle">
          <span class="label">空闲超时:</span>
          <span class="value">{{ formatDuration(timeUntilIdle) }}</span>
        </div>
        <div class="session-item">
          <span class="label">最后活动:</span>
          <span class="value">{{ formatTime(lastActivity) }}</span>
        </div>
      </div>
    </div>

    <!-- 权限测试 -->
    <div class="permission-test" v-if="isAuthenticated">
      <h3>权限测试</h3>
      <div class="permission-buttons">
        <button 
          v-for="permission in testPermissions" 
          :key="permission"
          :class="{ 
            'has-permission': hasPermission(permission),
            'no-permission': !hasPermission(permission)
          }"
          @click="testPermission(permission)"
        >
          {{ permission }}
        </button>
      </div>
      
      <div class="role-test">
        <h4>角色测试</h4>
        <div class="role-buttons">
          <button 
            v-for="role in testRoles" 
            :key="role"
            :class="{ 
              'has-role': hasRole(role),
              'no-role': !hasRole(role)
            }"
            @click="testRole(role)"
          >
            {{ role }}
          </button>
        </div>
      </div>
      
      <div class="level-test">
        <h4>等级测试</h4>
        <div class="level-buttons">
          <button 
            v-for="level in testLevels" 
            :key="level"
            :class="{ 
              'has-level': hasLevel(level),
              'no-level': !hasLevel(level)
            }"
            @click="testLevel(level)"
          >
            等级 {{ level }}
          </button>
        </div>
      </div>
    </div>

    <!-- 状态控制 -->
    <div class="state-controls">
      <h3>状态控制</h3>
      <div class="control-buttons">
        <button @click="refreshAuthStatus" :disabled="isRefreshing">
          {{ isRefreshing ? '刷新中...' : '刷新认证状态' }}
        </button>
        
        <button @click="updateActivity">
          更新活动时间
        </button>
        
        <button @click="resetSession">
          重置会话
        </button>
        
        <button @click="toggleStatusCheck">
          {{ statusCheckEnabled ? '停止状态检查' : '开始状态检查' }}
        </button>
        
        <button @click="toggleAutoRefresh">
          {{ autoRefreshEnabled ? '停止自动刷新' : '开始自动刷新' }}
        </button>
        
        <button @click="toggleIdleDetection">
          {{ idleDetectionEnabled ? '停止空闲检测' : '开始空闲检测' }}
        </button>
        
        <button @click="simulateTokenExpiry" class="warning-btn">
          模拟Token过期
        </button>
        
        <button @click="simulateSessionExpiry" class="warning-btn">
          模拟会话过期
        </button>
        
        <button @click="simulateIdleTimeout" class="warning-btn">
          模拟空闲超时
        </button>
        
        <button @click="handleLogout" class="danger-btn">
          登出
        </button>
      </div>
    </div>

    <!-- 认证守卫测试 -->
    <div class="auth-guard-test">
      <h3>认证守卫测试</h3>
      <div class="guard-buttons">
        <button @click="testAuthGuard('basic')">
          基础认证检查
        </button>
        
        <button @click="testAuthGuard('permission')">
          权限检查
        </button>
        
        <button @click="testAuthGuard('role')">
          角色检查
        </button>
        
        <button @click="testAuthGuard('level')">
          等级检查
        </button>
      </div>
      
      <div v-if="guardResult" class="guard-result">
        <h4>守卫测试结果:</h4>
        <p :class="guardResult.success ? 'success' : 'error'">
          {{ guardResult.message }}
        </p>
      </div>
    </div>

    <!-- 状态日志 -->
    <div class="status-log">
      <h3>状态变化日志</h3>
      <div class="log-controls">
        <button @click="clearLog">清除日志</button>
        <button @click="exportLog">导出日志</button>
      </div>
      <div class="log-content">
        <div 
          v-for="(log, index) in statusLogs" 
          :key="index"
          :class="['log-item', log.type]"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>

    <!-- 认证状态详情 -->
    <div class="auth-details">
      <h3>认证状态详情</h3>
      <div class="details-content">
        <pre>{{ JSON.stringify(getAuthStatus(), null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthState, useAuthGuard, useAuthWatcher, useFormat } from '@/composables'

// 格式化工具
const { formatTime } = useFormat()

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
  lastActivity,
  timeUntilExpiry,
  timeUntilIdle,
  updateActivity,
  resetSession,
  refreshToken,
  refreshAuthStatus,
  hasPermission,
  hasRole,
  hasLevel,
  handleLogout,
  startStatusCheck,
  stopStatusCheck,
  startAutoRefresh,
  stopAutoRefresh,
  startIdleDetection,
  stopIdleDetection,
  getAuthStatus
} = useAuthState({
  autoCheck: true,
  checkInterval: 10000, // 10秒检查一次
  autoRefresh: true,
  refreshBeforeExpired: 5 * 60 * 1000, // 5分钟前刷新
  sessionTimeout: 24 * 60 * 60 * 1000, // 24小时
  idleTimeout: 5 * 60 * 1000, // 5分钟空闲超时
  showNotifications: true,
  onAuthChange: (authenticated, data) => {
    addLog('info', `认证状态变化: ${authenticated ? '已认证' : '未认证'}`)
  },
  onTokenExpired: () => {
    addLog('warning', 'Token已过期')
  },
  onSessionExpired: () => {
    addLog('warning', '会话已过期')
  },
  onIdleTimeout: () => {
    addLog('warning', '检测到空闲超时')
  }
})

// 认证守卫
const {
  checkAccess: checkBasicAccess
} = useAuthGuard({
  requireAuth: true,
  redirectTo: '/login'
})

const {
  checkAccess: checkPermissionAccess
} = useAuthGuard({
  requireAuth: true,
  requirePermissions: ['read'],
  redirectTo: '/login'
})

const {
  checkAccess: checkRoleAccess
} = useAuthGuard({
  requireAuth: true,
  requireRoles: ['user'],
  redirectTo: '/login'
})

const {
  checkAccess: checkLevelAccess
} = useAuthGuard({
  requireAuth: true,
  requireLevel: 1,
  redirectTo: '/login'
})

// 认证监听
useAuthWatcher({
  onLogin: (data) => {
    addLog('success', `用户登录: ${data.user?.name}`)
  },
  onLogout: () => {
    addLog('info', '用户登出')
  },
  onTokenExpired: () => {
    addLog('error', 'Token过期')
  },
  onSessionExpired: () => {
    addLog('error', '会话过期')
  },
  onPermissionChange: (permissions, oldPermissions) => {
    addLog('info', `权限变化: ${oldPermissions.join(',')} -> ${permissions.join(',')}`)
  },
  onUserInfoChange: (newUser, oldUser) => {
    addLog('info', `用户信息更新: ${oldUser?.name} -> ${newUser?.name}`)
  }
})

// 状态控制
const statusCheckEnabled = ref(true)
const autoRefreshEnabled = ref(true)
const idleDetectionEnabled = ref(true)

// 测试数据
const testPermissions = ['read', 'write', 'admin', 'delete', 'create']
const testRoles = ['user', 'vip', 'admin', 'moderator']
const testLevels = [1, 2, 3, 4, 5]

// 守卫测试结果
const guardResult = ref(null)

// 状态日志
const statusLogs = ref([])

// 方法
const addLog = (type, message) => {
  statusLogs.value.unshift({
    type,
    message,
    timestamp: Date.now()
  })
  
  // 限制日志数量
  if (statusLogs.value.length > 100) {
    statusLogs.value = statusLogs.value.slice(0, 100)
  }
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

const testPermission = (permission) => {
  const has = hasPermission(permission)
  addLog(has ? 'success' : 'warning', `权限检查 ${permission}: ${has ? '有权限' : '无权限'}`)
}

const testRole = (role) => {
  const has = hasRole(role)
  addLog(has ? 'success' : 'warning', `角色检查 ${role}: ${has ? '有角色' : '无角色'}`)
}

const testLevel = (level) => {
  const has = hasLevel(level)
  addLog(has ? 'success' : 'warning', `等级检查 ${level}: ${has ? '达到等级' : '未达到等级'}`)
}

const toggleStatusCheck = () => {
  if (statusCheckEnabled.value) {
    stopStatusCheck()
    statusCheckEnabled.value = false
    addLog('info', '停止状态检查')
  } else {
    startStatusCheck()
    statusCheckEnabled.value = true
    addLog('info', '开始状态检查')
  }
}

const toggleAutoRefresh = () => {
  if (autoRefreshEnabled.value) {
    stopAutoRefresh()
    autoRefreshEnabled.value = false
    addLog('info', '停止自动刷新')
  } else {
    startAutoRefresh()
    autoRefreshEnabled.value = true
    addLog('info', '开始自动刷新')
  }
}

const toggleIdleDetection = () => {
  if (idleDetectionEnabled.value) {
    stopIdleDetection()
    idleDetectionEnabled.value = false
    addLog('info', '停止空闲检测')
  } else {
    startIdleDetection()
    idleDetectionEnabled.value = true
    addLog('info', '开始空闲检测')
  }
}

const simulateTokenExpiry = () => {
  addLog('warning', '模拟Token过期')
  // 这里可以设置一个已过期的时间
}

const simulateSessionExpiry = () => {
  addLog('warning', '模拟会话过期')
  // 这里可以设置一个已过期的时间
}

const simulateIdleTimeout = () => {
  addLog('warning', '模拟空闲超时')
  // 这里可以设置一个空闲状态
}

const testAuthGuard = (type) => {
  let result
  
  switch (type) {
    case 'basic':
      result = checkBasicAccess()
      break
    case 'permission':
      result = checkPermissionAccess()
      break
    case 'role':
      result = checkRoleAccess()
      break
    case 'level':
      result = checkLevelAccess()
      break
    default:
      result = false
  }
  
  guardResult.value = {
    success: result,
    message: result ? '访问通过' : '访问被拒绝'
  }
  
  addLog(result ? 'success' : 'error', `守卫测试 ${type}: ${result ? '通过' : '拒绝'}`)
}

const clearLog = () => {
  statusLogs.value = []
  addLog('info', '日志已清除')
}

const exportLog = () => {
  const logText = statusLogs.value
    .map(log => `[${formatTime(log.timestamp)}] ${log.type.toUpperCase()}: ${log.message}`)
    .join('\n')
  
  const blob = new Blob([logText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `auth-status-log-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
  
  addLog('info', '日志已导出')
}

// 生命周期
onMounted(() => {
  addLog('info', '认证状态管理示例已加载')
})
</script>

<style scoped>
.authstate-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.auth-overview,
.user-info,
.session-info,
.permission-test,
.state-controls,
.auth-guard-test,
.status-log,
.auth-details {
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

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.status-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s;
}

.status-card.active {
  background: #d4edda;
  border: 2px solid #28a745;
  color: #155724;
}

.status-card.inactive {
  background: #f8d7da;
  border: 2px solid #dc3545;
  color: #721c24;
}

.status-card h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.status-card p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-data h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.user-data p {
  margin: 5px 0;
  color: #666;
}

.session-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.session-item .label {
  font-weight: bold;
  color: #333;
}

.session-item .value {
  color: #007bff;
  font-weight: bold;
}

.permission-buttons,
.role-buttons,
.level-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.permission-buttons button,
.role-buttons button,
.level-buttons button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.has-permission,
.has-role,
.has-level {
  background: #d4edda !important;
  color: #155724 !important;
  border-color: #28a745 !important;
}

.no-permission,
.no-role,
.no-level {
  background: #f8d7da !important;
  color: #721c24 !important;
  border-color: #dc3545 !important;
}

.control-buttons {
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

.warning-btn {
  background: #ffc107;
  color: #212529;
  border-color: #ffc107;
}

.warning-btn:hover {
  background: #e0a800;
  border-color: #d39e00;
}

.danger-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.danger-btn:hover {
  background: #c82333;
  border-color: #bd2130;
}

.guard-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.guard-result {
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.guard-result .success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.guard-result .error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.log-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 12px;
  color: #666;
  margin-right: 10px;
  min-width: 120px;
}

.log-message {
  flex: 1;
  font-size: 14px;
}

.log-item.info .log-message {
  color: #007bff;
}

.log-item.success .log-message {
  color: #28a745;
}

.log-item.warning .log-message {
  color: #ffc107;
}

.log-item.error .log-message {
  color: #dc3545;
}

.details-content {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  overflow-x: auto;
}

.details-content pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}
</style>
