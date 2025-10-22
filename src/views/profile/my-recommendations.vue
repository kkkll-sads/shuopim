<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">我的推荐</h1>
    </div>

    <!-- Merchant Management -->
    <div class="bg-white mx-4 mt-4 rounded-2xl p-4 flex items-center justify-between shadow-sm merchant-card">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg merchant-icon">
          <Store class="w-6 h-6 text-white" />
        </div>
        <span class="text-gray-800 font-medium text-base">商家管理</span>
      </div>
      <button @click="search" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Search class="w-5 h-5 text-gray-500" />
      </button>
    </div>

    <!-- Empty State -->
    <div class="flex-1 flex items-center justify-center py-20 p-4">
      <div class="text-center empty-state">
        <div class="relative w-40 h-40 mx-auto mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-8">
              <Users class="w-24 h-24 text-purple-400" />
            </div>
          </div>
          <div class="decoration decoration-1">👥</div>
          <div class="decoration decoration-2">✦</div>
          <div class="decoration decoration-3">+</div>
          <div class="decoration decoration-4">○</div>
        </div>
        <p class="text-gray-400 text-base mb-2">暂无推荐记录</p>
        <p class="text-gray-400 text-sm">推荐商家入驻，获取更多收益～</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft, Store, Search, Users } from 'lucide-vue-next'

const router = useRouter()

const goBack = () => {
  router.back()
}

const search = () => {
  console.log('Search merchants')
}
</script>

<style scoped>
.merchant-card {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.merchant-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.empty-state {
  animation: fadeIn 0.6s ease-out 0.2s both;
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
  color: #c084fc;
  animation-delay: 0.5s;
}

.decoration-3 {
  bottom: 0.5rem;
  left: 2rem;
  color: #d1d5db;
  animation-delay: 1s;
}

.decoration-4 {
  bottom: 1rem;
  right: 3rem;
  color: #d1d5db;
  animation-delay: 1.5s;
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