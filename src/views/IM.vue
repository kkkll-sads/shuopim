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
        <button @click="showMenu = !showMenu" class="p-2 active:opacity-60 transition-opacity">
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
          <div v-if="showMenu" class="absolute top-12 right-0 bg-gray-800 text-white rounded-lg shadow-xl py-1 w-44 z-50">
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

    <!-- Chat List -->
    <div class="flex-1 bg-white overflow-y-auto pb-16" :class="{'flex items-center justify-center': chatList.length === 0}">
      <div
        v-for="chat in chatList"
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
          <span class="text-xs text-gray-400">{{ chat.time }}</span>
          <div v-if="chat.muted" class="text-gray-400">
            <BellOff :size="16" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="chatList.length === 0" class="flex flex-col items-center justify-center text-center w-full">
        <div class="mb-4 relative">
          <div class="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center">
            <MessageSquare :size="56" class="text-gray-300" stroke-width="1.5" />
          </div>
        </div>
        <p class="text-gray-400 text-base">暂无会话</p>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-sm">
      <div class="grid grid-cols-5 h-16">
        <button 
          v-for="nav in bottomNav" 
          :key="nav.id"
          @click="handleNavClick(nav.id)"
          class="flex flex-col items-center justify-center gap-0.5 transition-colors"
          :class="activeTab === nav.id ? 'text-red-500' : 'text-gray-500'"
        >
          <component 
            :is="nav.icon" 
            class="w-5 h-5"
          />
          <span class="text-xs" :class="activeTab === nav.id ? 'font-medium' : ''">{{ nav.name }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Store, 
  User, 
  Plus, 
  UserPlus, 
  Users, 
  MessageSquarePlus, 
  Flower2, 
  BellOff,
  MessageSquare,
  MapPinned,
  ShoppingBag,
  Video,
  User as UserIcon
} from 'lucide-vue-next'

interface ChatItem {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  badge: string
  unread: number
  muted: boolean
}

const router = useRouter()
const activeTab = ref('message')
const showMenu = ref(false)

// 示例数据 - 可以设置为空数组以显示空状态
const chatList = ref<ChatItem[]>([
  // {
  //   id: 1,
  //   name: '文企通一群',
  //   avatar: '',
  //   lastMessage: '[通知消息]',
  //   time: '昨天',
  //   badge: '',
  //   unread: 0,
  //   muted: false
  // },
  // {
  //   id: 2,
  //   name: '689556630',
  //   avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0do4MHEpvfKutyMVeytROXyrB2YC2A.png',
  //   lastMessage: '你好',
  //   time: '13:25',
  //   badge: '商家',
  //   unread: 0,
  //   muted: false
  // }
])

const bottomNav = [
  { id: 'home', name: '生活圈', icon: MapPinned },
  { id: 'shop', name: '选品广场', icon: ShoppingBag },
  { id: 'live', name: '直播', icon: Video },
  { id: 'message', name: '消息', icon: MessageSquare },
  { id: 'profile', name: '我的', icon: UserIcon }
]

const handleStore = () => {
  console.log('打开商家')
  // TODO: 跳转到商家页面
}

const handleContacts = () => {
  console.log('打开通讯录')
  // TODO: 跳转到通讯录页面
}

const handleAddFriend = () => {
  console.log('加好友')
  showMenu.value = false
  // TODO: 跳转到添加好友页面
}

const handleJoinGroup = () => {
  console.log('加群')
  showMenu.value = false
  // TODO: 跳转到加群页面
}

const handleCreateGroup = () => {
  console.log('创建群聊')
  showMenu.value = false
  // TODO: 跳转到创建群聊页面
}

const openChat = (chat: ChatItem) => {
  console.log('打开聊天:', chat.name)
  // TODO: 跳转到聊天详情页面
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
    case 'live':
      console.log('直播')
      // TODO: 跳转到直播页面
      break
    case 'message':
      // 已在当前页面
      break
    case 'profile':
      router.push('/profile')
      break
  }
}

// 点击外部关闭菜单
const handleClickOutside = () => {
  if (showMenu.value) {
    showMenu.value = false
  }
}

// 监听点击事件
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}
</script>
