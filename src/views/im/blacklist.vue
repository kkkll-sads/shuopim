<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">黑名单</h1>
      <div class="w-10"></div>
    </div>

    <!-- Blacklist -->
    <div v-if="blacklist.length > 0" class="mt-2 bg-white">
      <div
        v-for="user in blacklist"
        :key="user.id"
        class="px-4 py-4 border-b border-gray-100 flex items-center gap-3 blacklist-item"
      >
        <!-- Avatar -->
        <img
          :src="user.avatar"
          :alt="user.name"
          class="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-medium text-gray-900 mb-1">{{ user.name }}</h3>
          <p class="text-sm text-gray-500">拉黑时间：{{ user.blockedAt }}</p>
        </div>

        <!-- Unblock Button -->
        <button
          @click="handleUnblock(user)"
          class="px-4 py-1.5 bg-white text-red-500 border border-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition-all active:scale-95"
        >
          移除
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center py-20 empty-state">
      <div class="text-center">
        <div class="relative w-32 h-32 mx-auto mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-6">
              <UserX class="w-20 h-20 text-blue-400" />
            </div>
          </div>
          <div class="decoration decoration-1">×</div>
          <div class="decoration decoration-2">✦</div>
          <div class="decoration decoration-3">○</div>
        </div>
        <p class="text-gray-400 text-base mb-2">黑名单为空</p>
        <p class="text-gray-400 text-sm">被拉黑的用户会显示在这里～</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, UserX } from 'lucide-vue-next'

const router = useRouter()

// 黑名单列表
const blacklist = ref([
  // {
  //   id: 1,
  //   name: '张三',
  //   avatar: '/placeholder.svg?height=48&width=48',
  //   blockedAt: '2024-01-15 14:30'
  // }
])

const goBack = () => {
  router.back()
}

const handleUnblock = async (user) => {
  if (!confirm(`确定要将 ${user.name} 移出黑名单吗？`)) {
    return
  }

  console.log('移出黑名单:', user.name)
  // TODO: 调用后端API移出黑名单
  // const response = await fetch('/api/blacklist/remove', {
  //   method: 'POST',
  //   body: JSON.stringify({ userId: user.id })
  // })
  
  // 移除成功后从列表中删除
  const index = blacklist.value.findIndex(item => item.id === user.id)
  if (index > -1) {
    blacklist.value.splice(index, 1)
  }
}
</script>

<style scoped>
.blacklist-item {
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
  color: #3b82f6;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 2rem;
  right: 0.5rem;
  color: #6366f1;
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

