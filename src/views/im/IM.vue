<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
      <div class="w-[72px]"></div>
      <h1 class="text-xl font-medium text-gray-900 flex-1 text-center">聊天列表</h1>
      <div class="flex items-center gap-1 relative w-[72px] justify-end">
        <button @click="handleStore" class="p-2 active:opacity-60 transition-opacity">
          <Store :size="22" class="text-gray-700" stroke-width="1.5" />
        </button>
        <button @click="handleContacts" class="p-2 active:opacity-60 transition-opacity">
          <User :size="22" class="text-gray-700" stroke-width="1.5" />
        </button>
        <button @click.stop="showMenu = !showMenu" class="p-2 active:opacity-60 transition-opacity">
          <Plus :size="22" class="text-gray-700" stroke-width="1.5" />
        </button>
        
        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div v-if="showMenu" @click.stop class="absolute top-12 right-0 bg-gray-800 text-white rounded-lg shadow-xl py-1 w-44 z-50">
            <button @click="handleAddFriend" class="w-full px-4 py-3 hover:bg-gray-700 flex items-center gap-3 text-left text-sm transition-colors">
              <UserPlus :size="20" />
              <span>加好友</span>
            </button>
            <button @click="handleJoinGroup" class="w-full px-4 py-3 hover:bg-gray-700 flex items-center gap-3 text-left text-sm transition-colors">
              <Users :size="20" />
              <span>加群</span>
            </button>
            <button @click="handleCreateGroup" class="w-full px-4 py-3 hover:bg-gray-700 flex items-center gap-3 text-left text-sm transition-colors">
              <MessageSquarePlus :size="20" />
              <span>创建群聊</span>
            </button>
          </div>
        </transition>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p class="text-gray-500">加载中...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="text-red-500 mb-2">⚠️</div>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button @click="handleRefresh" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
          重试
        </button>
      </div>
    </div>

    <!-- Chat List -->
    <div v-else class="flex-1 bg-white overflow-y-auto pb-16" :class="{'flex items-center justify-center': filteredChatList.length === 0}">
      <div
        v-for="chat in filteredChatList"
        :key="chat.id"
        @click="openChat(chat)"
        class="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b border-gray-50 transition-colors"
      >
        <!-- Avatar -->
        <div class="flex-shrink-0 relative">
          <img v-if="chat.avatar" :src="chat.avatar" :alt="chat.name" class="w-14 h-14 rounded-full object-cover" />
          <div v-else class="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-sm">
            <Flower2 :size="28" class="text-white" />
          </div>
          <!-- Unread Badge -->
          <span v-if="chat.unread" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {{ chat.unread > 99 ? '99+' : chat.unread }}
          </span>
        </div>

        <!-- Chat Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1.5">
            <h3 class="font-semibold text-gray-900 truncate text-base">{{ chat.name }}</h3>
            <span v-if="chat.badge" class="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded font-medium shadow-sm">
              {{ chat.badge }}
            </span>
          </div>
          <p class="text-sm text-gray-500 truncate">{{ chat.lastMessage }}</p>
        </div>

        <!-- Time & Status -->
        <div class="flex-shrink-0 flex flex-col items-end gap-1">
          <span class="text-xs text-gray-400">{{ formatTime(chat.time) }}</span>
          <div class="flex items-center gap-1">
            <button 
              v-if="chat.muted" 
              @click.stop="handleMuteToggle(chat)"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              title="取消免打扰"
            >
              <BellOff :size="16" />
            </button>
            <button 
              v-else
              @click.stop="handleMuteToggle(chat)"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              title="设置免打扰"
            >
              <Bell :size="16" />
            </button>
            <button 
              @click.stop="handleDeleteChat(chat)"
              class="text-gray-400 hover:text-red-500 transition-colors ml-1"
              title="删除聊天"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredChatList.length === 0" class="flex flex-col items-center justify-center text-center w-full">
        <div class="mb-4 relative">
          <div class="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center">
            <MessageSquare :size="56" class="text-gray-300" stroke-width="1.5" />
          </div>
        </div>
        <p class="text-gray-400 text-base">暂无会话</p>
        <p class="text-gray-400 text-sm mt-1">点击右上角 + 开始聊天</p>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation 
      :active-nav="activeTab" 
      @nav-click="handleNavClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { 
  Store, 
  User, 
  Plus, 
  UserPlus, 
  Users, 
  MessageSquarePlus, 
  Flower2, 
  BellOff,
  Bell,
  Trash2,
  MessageSquare
} from 'lucide-vue-next'
import { 
  useChatList, 
  useIMNavigation, 
  useToast,
  useFormat,
  useAuth
} from '@/composables'

interface ChatItem {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  badge: string
  unread: number
  muted: boolean
  type?: string
}

const router = useRouter()
const activeTab = ref('message')
const showMenu = ref(false)

// 认证状态检查
const { isAuthenticated, user } = useAuth()

// 使用组合式函数
const {
  loading,
  error,
  filteredChatList,
  fetchChatList,
  refreshChatList,
  markAsRead,
  toggleMute,
  deleteChat
} = useChatList({
  autoRefresh: true,
  refreshInterval: 30000,
  onChatSelect: (chat: any) => {
    console.log('选择聊天:', chat.name)
    // TODO: 跳转到聊天详情页面
  },
  onChatUpdate: (chats: any) => {
    console.log('聊天列表更新:', chats.length)
  }
})

const {
  goToContacts,
  goToAddFriend,
  goToGroupSearch,
  goToCreateGroup,
  goToChat
} = useIMNavigation()

const { success: showSuccess, error: showError } = useToast()
const { formatTime } = useFormat()

// 方法
const handleStore = () => {
  console.log('打开商家')
  // TODO: 跳转到商家页面
}

const handleContacts = () => {
  goToContacts()
}

const handleAddFriend = () => {
  showMenu.value = false
  goToAddFriend()
}

const handleJoinGroup = () => {
  showMenu.value = false
  goToGroupSearch()
}

const handleCreateGroup = () => {
  showMenu.value = false
  goToCreateGroup()
}

const openChat = (chat: ChatItem) => {
  // 标记为已读
  markAsRead(chat.id)
  // 导航到聊天页面
  goToChat(chat)
}

const handleMuteToggle = (chat: ChatItem) => {
  toggleMute(chat.id)
  const message = chat.muted ? '已取消免打扰' : '已设置免打扰'
  showSuccess(message)
}

const handleDeleteChat = (chat: ChatItem) => {
  if (confirm(`确定要删除与 ${chat.name} 的聊天吗？`)) {
    deleteChat(chat.id)
    showSuccess('聊天已删除')
  }
}

const handleRefresh = async () => {
  try {
    await refreshChatList()
    showSuccess('聊天列表已刷新')
  } catch (error) {
    showError('刷新失败')
  }
}

const handleNavClick = (navId: string) => {
  activeTab.value = navId
  
  switch (navId) {
    case 'home':
      router.push('/home')
      break
    case 'shop':
      console.log('选品广场')
      // TODO: 跳转到选品广场
      break
    case 'message':
      // 确保在IM页面，如果不在则跳转
      if (router.currentRoute.value.path !== '/im') {
        router.push('/im')
      }
      break
    case 'profile':
      router.push('/profile')
      break
  }
}

// 认证状态调试
console.log('IM页面 - 认证状态:', isAuthenticated.value)
console.log('IM页面 - 用户信息:', user.value)
console.log('IM页面 - localStorage token:', localStorage.getItem('token'))
console.log('IM页面 - localStorage imToken:', localStorage.getItem('imToken'))
console.log('IM页面 - localStorage imUserId:', localStorage.getItem('imUserId'))

// 检查认证状态
if (!isAuthenticated.value) {
  console.log('IM页面 - 用户未认证，将重定向到登录页')
  // 显示提示信息
  alert('请先登录才能访问消息页面')
}

// 初始化
fetchChatList()
</script>

<style scoped>
/* 自定义样式 */
.user-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 空状态装饰 */
.decoration {
  position: absolute;
  color: #f3f4f6;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.decoration-1 {
  top: 10px;
  right: 20px;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 20px;
  left: 15px;
  animation-delay: 1s;
}

.decoration-3 {
  top: 50%;
  right: 10px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
