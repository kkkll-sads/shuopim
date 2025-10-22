<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">验证消息</h1>
      <div class="w-10"></div>
    </div>

    <!-- Verification List -->
    <div v-if="verifications.length > 0" class="mt-2 bg-white">
      <div
        v-for="verification in verifications"
        :key="verification.id"
        class="px-4 py-4 border-b border-gray-100 verification-item"
      >
        <div class="flex items-start gap-3">
          <!-- Avatar -->
          <img
            :src="verification.avatar"
            :alt="verification.name"
            class="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-base font-medium text-gray-900">{{ verification.name }}</h3>
              <span
                v-if="verification.status"
                :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  verification.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  verification.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                ]"
              >
                {{ getStatusText(verification.status) }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-2">{{ verification.message || '请求添加你为好友' }}</p>
            <p class="text-xs text-gray-400">{{ verification.time }}</p>
            
            <!-- Action Buttons -->
            <div v-if="verification.status === 'pending'" class="flex gap-2 mt-3">
              <button
                @click="handleAccept(verification)"
                class="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-2 rounded-lg text-sm font-medium hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
              >
                同意
              </button>
              <button
                @click="handleReject(verification)"
                class="flex-1 bg-white text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center py-20 empty-state">
      <div class="text-center">
        <div class="relative w-32 h-32 mx-auto mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full p-6">
              <MessageSquare class="w-20 h-20 text-teal-400" />
            </div>
          </div>
          <div class="decoration decoration-1">✓</div>
          <div class="decoration decoration-2">✦</div>
          <div class="decoration decoration-3">○</div>
        </div>
        <p class="text-gray-400 text-base mb-2">暂无验证消息</p>
        <p class="text-gray-400 text-sm">好友验证请求会显示在这里～</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, MessageSquare } from 'lucide-vue-next'

const router = useRouter()

// 验证消息列表
const verifications = ref([
  // {
  //   id: 1,
  //   name: '张三',
  //   avatar: '/placeholder.svg?height=48&width=48',
  //   message: '我是张三，想加你为好友',
  //   time: '2024-01-20 10:30',
  //   status: 'pending' // pending, accepted, rejected
  // }
])

const goBack = () => {
  router.back()
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    accepted: '已同意',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const handleAccept = async (verification) => {
  console.log('同意好友请求:', verification.name)
  // TODO: 调用后端API同意好友请求
  // const response = await fetch('/api/friends/accept', {
  //   method: 'POST',
  //   body: JSON.stringify({ verificationId: verification.id })
  // })
  
  verification.status = 'accepted'
}

const handleReject = async (verification) => {
  console.log('拒绝好友请求:', verification.name)
  // TODO: 调用后端API拒绝好友请求
  // const response = await fetch('/api/friends/reject', {
  //   method: 'POST',
  //   body: JSON.stringify({ verificationId: verification.id })
  // })
  
  verification.status = 'rejected'
}
</script>

<style scoped>
.verification-item {
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
  color: #14b8a6;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 2rem;
  right: 0.5rem;
  color: #06b6d4;
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

