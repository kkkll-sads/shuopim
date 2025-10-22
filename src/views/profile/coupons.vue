<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">我的优惠券</h1>
    </div>

    <!-- Tabs -->
    <div class="bg-white px-4 py-3 flex items-center gap-8 shadow-sm">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'text-base transition-all relative pb-1',
          activeTab === tab.value ? 'text-gray-900 font-medium' : 'text-gray-500'
        ]"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === tab.value"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full tab-indicator"
        ></div>
      </button>
    </div>

    <!-- Empty State -->
    <div class="flex-1 flex items-center justify-center py-20 empty-state">
      <div class="text-center">
        <div class="mb-6">
          <div class="relative w-32 h-32 mx-auto">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl p-6 transform rotate-12">
                <Ticket class="w-20 h-20 text-orange-400" />
              </div>
            </div>
          </div>
        </div>
        <p class="text-gray-400 text-base mb-2">暂无优惠券</p>
        <p class="text-gray-400 text-sm">快去购物领取优惠券吧～</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Ticket } from 'lucide-vue-next'

const router = useRouter()

const activeTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待使用', value: 'unused' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' }
]

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.tab-indicator {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
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
</style>