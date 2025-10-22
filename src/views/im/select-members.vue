<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">选择群成员</h1>
      <button
        @click="handleNext"
        :disabled="selectedMembers.length === 0"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
          selectedMembers.length > 0
            ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        ]"
      >
        下一步 ({{ selectedMembers.length }})
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white px-4 py-3 shadow-sm">
      <FormInput
        v-model="searchQuery"
        type="text"
        placeholder="搜索好友"
        :prefix-icon="Search"
        container-class="mb-0"
        input-class="bg-gray-100 rounded-lg px-3 py-2 text-sm"
      />
    </div>

    <!-- Selected Members Preview -->
    <div v-if="selectedMembers.length > 0" class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <div
          v-for="member in selectedMembers"
          :key="member.id"
          class="flex-shrink-0 relative selected-member"
        >
          <img
            :src="member.avatar"
            :alt="member.name"
            class="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400"
          />
          <button
            @click="toggleMember(member)"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X class="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Friends List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="filteredFriends.length > 0" class="p-4 space-y-2">
        <div
          v-for="friend in filteredFriends"
          :key="friend.id"
          @click="toggleMember(friend)"
          class="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer friend-item"
          :class="{ 'ring-2 ring-purple-400': isSelected(friend.id) }"
        >
          <div class="flex items-center gap-3">
            <!-- Avatar with Checkbox -->
            <div class="relative flex-shrink-0">
              <img
                :src="friend.avatar"
                :alt="friend.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div
                :class="[
                  'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all',
                  isSelected(friend.id)
                    ? 'bg-gradient-to-br from-purple-400 to-pink-500'
                    : 'bg-gray-200'
                ]"
              >
                <Check v-if="isSelected(friend.id)" class="w-4 h-4 text-white" />
              </div>
            </div>
            
            <!-- Friend Info -->
            <div class="flex-1 min-w-0">
              <div class="text-base font-medium text-gray-900 truncate">{{ friend.name }}</div>
              <div class="text-sm text-gray-500 truncate">{{ friend.nickname }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center py-20 empty-state">
        <div class="text-center">
          <div class="relative w-32 h-32 mx-auto mb-6">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6">
                <Users class="w-20 h-20 text-purple-400" />
              </div>
            </div>
            <div class="decoration decoration-1">👥</div>
            <div class="decoration decoration-2">✦</div>
            <div class="decoration decoration-3">○</div>
          </div>
          <p class="text-gray-400 text-base mb-2">暂无好友</p>
          <p class="text-gray-400 text-sm">添加好友后可以创建群聊～</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Search, Check, X, Users } from 'lucide-vue-next'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()

const searchQuery = ref('')
const selectedMembers = ref([])

// 示例好友数据
const friends = ref([
  {
    id: 1,
    name: '张三',
    nickname: '13012345678',
    avatar: '/placeholder.svg?height=48&width=48'
  },
  {
    id: 2,
    name: '李四',
    nickname: '13087654321',
    avatar: '/placeholder.svg?height=48&width=48'
  },
  {
    id: 3,
    name: '王五',
    nickname: '15011112222',
    avatar: '/placeholder.svg?height=48&width=48'
  },
  {
    id: 4,
    name: '赵六',
    nickname: '15099998888',
    avatar: '/placeholder.svg?height=48&width=48'
  },
  {
    id: 5,
    name: '孙七',
    nickname: '13666667777',
    avatar: '/placeholder.svg?height=48&width=48'
  }
])

const filteredFriends = computed(() => {
  if (!searchQuery.value.trim()) {
    return friends.value
  }
  const query = searchQuery.value.toLowerCase()
  return friends.value.filter(
    friend =>
      friend.name.toLowerCase().includes(query) ||
      friend.nickname.toLowerCase().includes(query)
  )
})

const isSelected = (friendId) => {
  return selectedMembers.value.some(member => member.id === friendId)
}

const toggleMember = (friend) => {
  const index = selectedMembers.value.findIndex(member => member.id === friend.id)
  if (index > -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(friend)
  }
}

const goBack = () => {
  router.back()
}

const handleNext = () => {
  if (selectedMembers.value.length === 0) return
  
  // 将选中的成员信息传递到创建群聊页面
  router.push({
    name: 'CreateGroup',
    state: {
      members: selectedMembers.value
    }
  })
}
</script>

<style scoped>
.friend-item {
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

.selected-member {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
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
  animation: float 3s ease-in-out infinite;
}

.decoration-1 {
  top: 0.5rem;
  right: 2rem;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 2rem;
  right: 0.5rem;
  color: #a855f7;
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

