<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button 
        @click="handleGoBack" 
        class="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        style="z-index: 1000; position: relative;"
      >
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">通讯录</h1>
      <div class="flex items-center gap-2">
        <button @click="handleSearch" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <Search class="w-5 h-5 text-gray-700" />
        </button>
        <button @click="goToAddFriend" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <UserPlus class="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>

    <!-- Search Bar (when searching) -->
    <div v-if="isSearching" class="bg-white px-4 py-3 border-b border-gray-100">
      <FormInput
        v-model="searchQuery"
        type="text"
        placeholder="搜索联系人"
        :prefix-icon="Search"
        container-class="mb-0"
        input-class="bg-gray-100 rounded-lg px-3 py-2 text-sm"
        @keyup.enter="handleSearchSubmit"
        @input="handleSearchInput"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p class="text-gray-500">加载中...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="text-red-500 mb-2">⚠️</div>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button @click="handleRefresh" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
          重试
        </button>
      </div>
    </div>

    <!-- Contact List -->
    <div v-else class="flex-1">
      <!-- Special Functions -->
      <div class="bg-white mb-2">
        <div class="px-4 py-3 border-b border-gray-100">
          <h3 class="text-sm font-medium text-gray-500 mb-3">特殊功能</h3>
          <div class="space-y-2">
            <button 
              @click="goToVerification" 
              class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell class="w-5 h-5 text-blue-600" />
              </div>
              <div class="flex-1 text-left">
                <div class="font-medium text-gray-900">验证消息</div>
                <div class="text-sm text-gray-500">好友申请和验证</div>
              </div>
              <ChevronRight class="w-5 h-5 text-gray-400" />
            </button>
            
            <button 
              @click="goToBlacklist" 
              class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Ban class="w-5 h-5 text-red-600" />
              </div>
              <div class="flex-1 text-left">
                <div class="font-medium text-gray-900">黑名单</div>
                <div class="text-sm text-gray-500">已屏蔽的联系人</div>
              </div>
              <ChevronRight class="w-5 h-5 text-gray-400" />
            </button>
            
            <button 
              @click="goToMyGroups" 
              class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users class="w-5 h-5 text-green-600" />
              </div>
              <div class="flex-1 text-left">
                <div class="font-medium text-gray-900">我的群聊</div>
                <div class="text-sm text-gray-500">我加入的群组</div>
              </div>
              <ChevronRight class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- Contact List -->
      <div v-if="filteredFriends.length > 0" class="bg-white">
        <div v-for="(group, letter) in groupedFriends" :key="letter" class="border-b border-gray-100 last:border-b-0">
          <!-- Group Header -->
          <div class="px-4 py-2 bg-gray-50">
            <h3 class="text-sm font-medium text-gray-700">{{ letter }}</h3>
          </div>
          
          <!-- Group Contacts -->
          <div class="divide-y divide-gray-100">
            <div
              v-for="friend in group"
              :key="friend.id"
              @click="goToFriend(friend)"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <img
                  :src="friend.avatar || '/default-avatar.png'"
                  :alt="friend.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div v-if="friend.isOnline" class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <!-- Friend Info -->
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-900 truncate">{{ friend.name }}</div>
                <div class="text-sm text-gray-500 truncate">{{ friend.nickname }}</div>
              </div>
              
              <!-- Online Status -->
              <div class="flex-shrink-0">
                <span v-if="friend.isOnline" class="text-xs text-green-600">在线</span>
                <span v-else class="text-xs text-gray-400">离线</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users class="w-20 h-20 text-blue-400" />
          </div>
          <p class="text-gray-400 text-base mb-2">暂无联系人</p>
          <p class="text-gray-400 text-sm">点击右上角 + 添加好友</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  ChevronRight,
  Search, 
  UserPlus, 
  Bell,
  Ban,
  Users
} from 'lucide-vue-next'
import { 
  useFriendManagement, 
  useIMNavigation, 
  useToast,
  useFormat
} from '@/composables'
import FormInput from '@/components/common/FormInput.vue'

interface Friend {
  id: number
  name: string
  nickname: string
  avatar: string
  pinyin: string
  phone: string
  isOnline: boolean
}

const router = useRouter()

// 使用组合式函数
const {
  friendList,
  loading,
  error,
  searchQuery,
  groupedFriends,
  filteredFriends,
  fetchFriendList,
  searchFriends
} = useFriendManagement({
  enableSearch: true,
  enablePinyin: true,
  enableGrouping: true
})

const { 
  goToAddFriend, 
  goToFriend,
  goToVerification,
  goToBlacklist,
  goToMyGroups
} = useIMNavigation()

// 自定义返回方法，确保返回到消息页面
const handleGoBack = () => {
  // 直接跳转到消息页面
  router.push('/im')
}

const { success: showSuccess, error: showError } = useToast()
const { formatTime } = useFormat()

// 本地状态
const isSearching = ref(false)

// 计算属性
const hasFriends = computed(() => filteredFriends.value.length > 0)

// 方法
const handleSearch = () => {
  isSearching.value = !isSearching.value
  if (!isSearching.value) {
    searchQuery.value = ''
  }
}

const handleSearchInput = () => {
  searchFriends(searchQuery.value)
}

const handleSearchSubmit = () => {
  // 搜索逻辑已在 handleSearchInput 中处理
}

const handleRefresh = async () => {
  try {
    await fetchFriendList()
    showSuccess('联系人列表已刷新')
  } catch (error) {
    showError('刷新失败')
  }
}

// 初始化
onMounted(() => {
  fetchFriendList()
})
</script>

<style scoped>
/* 联系人卡片动画 */
.contact-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 在线状态指示器 */
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

/* 特殊功能按钮悬停效果 */
.special-function:hover {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}

/* 联系人卡片悬停效果 */
.contact-card:hover {
  background-color: #f9fafb;
  transform: translateX(2px);
  transition: all 0.2s ease;
}

/* 搜索框动画 */
.search-bar {
  animation: slideDown 0.3s ease-out;
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
</style>
