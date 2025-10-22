<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
    <!-- 聊天头部内容 -->
    <div class="flex items-center justify-between">
      <!-- 左侧：返回按钮和聊天信息 -->
      <div class="flex items-center gap-3">
        <!-- 返回按钮 -->
        <button 
          @click="$emit('back')"
          class="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft class="w-6 h-6 text-gray-700" />
        </button>

        <!-- 聊天信息 -->
        <div class="flex items-center gap-3">
          <!-- 头像 -->
          <div class="relative">
            <img 
              :src="chatInfo.avatar" 
              :alt="chatInfo.name"
              class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              @error="handleImageError"
            />
            <!-- 在线状态指示器 -->
            <div 
              v-if="chatInfo.isOnline"
              class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
            ></div>
          </div>

          <!-- 聊天详情 -->
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-medium text-gray-800 truncate">
              {{ chatInfo.name }}
            </h1>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <!-- 在线人数（群聊时显示） -->
              <span v-if="chatInfo.type === 'group' && onlineCount > 0">
                {{ onlineCount }}人在线
              </span>
              <!-- 最后在线时间（私聊时显示） -->
              <span v-else-if="chatInfo.type === 'private' && chatInfo.lastSeen">
                {{ formatLastSeen(chatInfo.lastSeen) }}
              </span>
              <!-- 群成员数量（群聊时显示） -->
              <span v-else-if="chatInfo.type === 'group' && chatInfo.memberCount">
                {{ chatInfo.memberCount }}人
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：更多选项 -->
      <div class="flex items-center gap-2">
        <!-- 搜索按钮 -->
        <button 
          @click="handleSearch"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Search class="w-5 h-5 text-gray-600" />
        </button>

        <!-- 语音通话按钮 -->
        <button 
          v-if="chatInfo.type === 'private'"
          @click="handleVoiceCall"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Phone class="w-5 h-5 text-gray-600" />
        </button>

        <!-- 视频通话按钮 -->
        <button 
          v-if="chatInfo.type === 'private'"
          @click="handleVideoCall"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Video class="w-5 h-5 text-gray-600" />
        </button>

        <!-- 更多选项 -->
        <button 
          @click="handleMore"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- 更多选项菜单 -->
    <div 
      v-if="showMoreMenu"
      class="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 min-w-48"
    >
      <!-- 群聊选项 -->
      <template v-if="chatInfo.type === 'group'">
        <button 
          @click="handleGroupInfo"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <Users class="w-4 h-4" />
          群信息
        </button>
        <button 
          @click="handleGroupMembers"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <UserPlus class="w-4 h-4" />
          群成员
        </button>
        <button 
          @click="handleGroupSettings"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <Settings class="w-4 h-4" />
          群设置
        </button>
        <div class="border-t border-gray-200 my-1"></div>
        <button 
          @click="handleClearHistory"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <Trash2 class="w-4 h-4" />
          清空聊天记录
        </button>
        <button 
          @click="handleLeaveGroup"
          class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
        >
          <LogOut class="w-4 h-4" />
          退出群聊
        </button>
      </template>

      <!-- 私聊选项 -->
      <template v-else>
        <button 
          @click="handleUserInfo"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <User class="w-4 h-4" />
          用户信息
        </button>
        <button 
          @click="handleAddToContacts"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <UserPlus class="w-4 h-4" />
          添加到通讯录
        </button>
        <div class="border-t border-gray-200 my-1"></div>
        <button 
          @click="handleClearHistory"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
        >
          <Trash2 class="w-4 h-4" />
          清空聊天记录
        </button>
        <button 
          @click="handleBlockUser"
          class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
        >
          <Ban class="w-4 h-4" />
          拉黑用户
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ChevronLeft, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Users,
  UserPlus,
  Settings,
  Trash2,
  LogOut,
  User,
  Ban
} from 'lucide-vue-next'

// Props
interface Props {
  chatInfo: {
    id: string
    name: string
    avatar: string
    type: 'private' | 'group'
    isOnline?: boolean
    lastSeen?: number
    memberCount?: number
  }
  onlineCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  onlineCount: 0
})

// Emits
const emit = defineEmits<{
  'back': []
  'more': []
  'search': []
  'voice-call': []
  'video-call': []
  'group-info': []
  'group-members': []
  'group-settings': []
  'user-info': []
  'add-to-contacts': []
  'clear-history': []
  'leave-group': []
  'block-user': []
}>()

// 响应式数据
const showMoreMenu = ref(false)

// 方法
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/default-avatar.png'
}

const formatLastSeen = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 今天
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return `今天 ${date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }
  
  // 昨天
  if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }
  
  // 更早
  return date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}


const handleSearch = () => {
  emit('search')
}

const handleVoiceCall = () => {
  emit('voice-call')
}

const handleVideoCall = () => {
  emit('video-call')
}

const handleMore = () => {
  showMoreMenu.value = !showMoreMenu.value
}

const handleGroupInfo = () => {
  emit('group-info')
  showMoreMenu.value = false
}

const handleGroupMembers = () => {
  emit('group-members')
  showMoreMenu.value = false
}

const handleGroupSettings = () => {
  emit('group-settings')
  showMoreMenu.value = false
}

const handleUserInfo = () => {
  emit('user-info')
  showMoreMenu.value = false
}

const handleAddToContacts = () => {
  emit('add-to-contacts')
  showMoreMenu.value = false
}

const handleClearHistory = () => {
  emit('clear-history')
  showMoreMenu.value = false
}

const handleLeaveGroup = () => {
  emit('leave-group')
  showMoreMenu.value = false
}

const handleBlockUser = () => {
  emit('block-user')
  showMoreMenu.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.more-menu-container')) {
    showMoreMenu.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 更多菜单动画 */
.more-menu {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 在线状态指示器动画 */
.online-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}

</style>
