<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">添加好友</h1>
      <button @click="handleRefresh" :disabled="loading" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <RotateCw :class="['w-5 h-5 text-gray-700', { 'animate-spin': loading }]" />
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white px-4 py-3 flex items-center gap-2">
      <div class="flex-1">
        <FormInput
          v-model="searchQuery"
          type="text"
          placeholder="搜索用户姓名或昵称"
          :prefix-icon="Search"
          container-class="mb-0"
          input-class="bg-gray-100 rounded-lg px-3 py-2 text-sm"
          @keyup.enter="handleSearch"
          @input="handleSearchInput"
        />
      </div>
      <button
        @click="handleSearch"
        :disabled="loading"
        class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !searchResults.length" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p class="text-gray-500">搜索中...</p>
      </div>
    </div>

    <!-- Search Results -->
    <div v-else-if="searchResults.length > 0" class="p-4 space-y-3">
      <div
        v-for="user in searchResults"
        :key="user.id"
        class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all user-item"
      >
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <img
              :src="user.avatar || '/default-avatar.png'"
              :alt="user.name"
              class="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-orange-200"
            />
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <UserPlus class="w-3 h-3 text-white" />
            </div>
          </div>
          
          <!-- User Info -->
          <div class="flex-1 min-w-0">
            <div class="text-base font-semibold text-gray-900 mb-1 truncate">{{ user.name }}</div>
            <div class="text-sm text-gray-500 flex items-center gap-1">
              <span class="text-xs">🆔</span>
              <span class="truncate">{{ user.nickname }}</span>
            </div>
          </div>

          <!-- Add Friend Button -->
          <button
            @click="handleAddFriend(user)"
            :disabled="user.isAdded || addingUsers.has(user.id)"
            :class="[
              'px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
              user.isAdded
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : addingUsers.has(user.id)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-sm'
            ]"
          >
            <span v-if="user.isAdded" class="flex items-center gap-1">
              <Check class="w-4 h-4" />
              已添加
            </span>
            <span v-else-if="addingUsers.has(user.id)" class="flex items-center gap-1">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              添加中
            </span>
            <span v-else>添加</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && searchQuery" class="flex items-center justify-center py-20 empty-state">
      <div class="text-center">
        <div class="relative w-32 h-32 mx-auto mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-gradient-to-br from-orange-100 to-red-100 rounded-full p-6">
              <Search class="w-20 h-20 text-orange-400" />
            </div>
          </div>
          <div class="decoration decoration-1">?</div>
          <div class="decoration decoration-2">✦</div>
          <div class="decoration decoration-3">○</div>
        </div>
        <p class="text-gray-400 text-base mb-2">暂无搜索结果</p>
        <p class="text-gray-400 text-sm">试试搜索用户名或昵称～</p>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus class="w-20 h-20 text-orange-400" />
        </div>
        <p class="text-gray-400 text-base mb-2">搜索用户</p>
        <p class="text-gray-400 text-sm">输入用户名或昵称开始搜索</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  RotateCw, 
  Search, 
  UserPlus, 
  Check 
} from 'lucide-vue-next'
import { 
  useFriendManagement, 
  useIMNavigation, 
  useToast,
  useFormat
} from '@/composables'
import FormInput from '@/components/common/FormInput.vue'

interface User {
  id: number
  name: string
  nickname: string
  avatar: string
  isAdded: boolean
}

const router = useRouter()

// 使用组合式函数
const {
  loading,
  error,
  searchUsers,
  addFriend
} = useFriendManagement({
  enableSearch: true,
  onFriendAdd: (friend) => {
    console.log('好友添加成功:', friend.name)
  }
})

const { goBack } = useIMNavigation()
const { success: showSuccess, error: showError } = useToast()
const { formatTime } = useFormat()

// 本地状态
const searchQuery = ref('')
const searchResults = ref<User[]>([])
const addingUsers = ref(new Set<number>())

// 防抖搜索
let searchTimer: NodeJS.Timeout | null = null

const handleSearchInput = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      handleSearch()
    } else {
      searchResults.value = []
    }
  }, 300)
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const result = await searchUsers(searchQuery.value)
    if (result.success) {
      searchResults.value = result.data || []
    } else {
      showError(result.error || '搜索失败')
    }
  } catch (error) {
    showError('搜索失败')
  }
}

const handleAddFriend = async (user: User) => {
  if (user.isAdded || addingUsers.value.has(user.id)) return

  addingUsers.value.add(user.id)

  try {
    const result = await addFriend(user)
    if (result.success) {
      user.isAdded = true
      showSuccess(`已添加 ${user.name} 为好友`)
      
      // 添加通知
      // addNotification({
      //   type: 'friend_added',
      //   title: '好友添加成功',
      //   message: `已添加 ${user.name} 为好友`,
      //   read: false
      // })
    } else {
      showError(result.error || '添加失败')
    }
  } catch (error) {
    showError('添加失败')
  } finally {
    addingUsers.value.delete(user.id)
  }
}

const handleRefresh = async () => {
  if (searchQuery.value.trim()) {
    await handleSearch()
  }
}

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    searchResults.value = []
  }
})

// 初始化
// 可以在这里添加一些推荐用户或热门用户
</script>

<style scoped>
/* 用户卡片动画 */
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

/* 搜索按钮悬停效果 */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 用户卡片悬停效果 */
.user-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>
