<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">添加好友</h1>
      <button @click="refreshList" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <RotateCw class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white px-4 py-3 flex items-center gap-2">
      <div class="flex-1">
        <FormInput
          v-model="searchQuery"
          type="text"
          placeholder="搜索"
          :prefix-icon="Search"
          container-class="mb-0"
          input-class="bg-gray-100 rounded-lg px-3 py-2 text-sm"
          @keyup.enter="handleSearch"
        />
      </div>
      <button
        @click="handleSearch"
        class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium"
      >
        搜索
      </button>
    </div>

    <!-- User List -->
    <div v-if="filteredUsers.length > 0" class="p-4 space-y-3">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all user-item"
      >
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <img
              :src="user.avatar"
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
            @click="addFriend(user)"
            :disabled="user.isAdded"
            :class="[
              'px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
              user.isAdded
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-sm'
            ]"
          >
            <span v-if="user.isAdded" class="flex items-center gap-1">
              <Check class="w-4 h-4" />
              已添加
            </span>
            <span v-else>添加</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center py-20 empty-state">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Search, RotateCw, UserPlus, Check } from 'lucide-vue-next'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()

const searchQuery = ref('')
const users = ref([
  {
    id: 1,
    name: '树拍小树',
    nickname: '13031643064',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 2,
    name: '俺是李😂',
    nickname: '15000608065',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 3,
    name: '技术测试直播间请勿参与',
    nickname: '202411011234',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 4,
    name: '日用百货',
    nickname: '18242955122',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 5,
    name: '伟旭士特产商行',
    nickname: '13843920798781105',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 6,
    name: '768852168',
    nickname: '768852168',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 7,
    name: '铸星龙王',
    nickname: '18667155303',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  },
  {
    id: 8,
    name: '689239109',
    nickname: '689239109',
    avatar: '/placeholder.svg?height=48&width=48',
    isAdded: false
  }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value
  }
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    user =>
      user.name.toLowerCase().includes(query) ||
      user.nickname.toLowerCase().includes(query)
  )
})

const goBack = () => {
  router.back()
}

const refreshList = async () => {
  console.log('Refreshing user list')
  // TODO: 调用后端API刷新用户列表
  // const response = await fetch('/api/users/search')
  // users.value = await response.json()
}

const handleSearch = async () => {
  console.log('Searching for:', searchQuery.value)
  // TODO: 调用后端API搜索用户
  // const response = await fetch(`/api/users/search?q=${searchQuery.value}`)
  // users.value = await response.json()
}

const addFriend = async (user) => {
  console.log('Adding friend:', user)
  // TODO: 调用后端API添加好友
  // const response = await fetch('/api/friends/add', {
  //   method: 'POST',
  //   body: JSON.stringify({ userId: user.id })
  // })
  // if (response.ok) {
  user.isAdded = true
  // }
}
</script>

<style scoped>
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

.empty-state {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.decoration {
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  animation: float 3s ease-in-out infinite;
}

.decoration-1 {
  top: 0.5rem;
  right: 2rem;
  color: #fb923c;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 2rem;
  right: 0.5rem;
  color: #f97316;
  animation-delay: 0.5s;
}

.decoration-3 {
  bottom: 0.5rem;
  left: 2rem;
  color: #d1d5db;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>