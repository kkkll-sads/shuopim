<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">收入详情</h1>
    </div>

    <!-- Tabs -->
    <div class="bg-white px-4 py-4 flex gap-3">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'flex-1 py-3 rounded-lg font-medium transition-all',
          activeTab === tab.value
            ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
            : 'bg-white border border-gray-200 text-gray-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Auto Distribution Income Section -->
    <div class="bg-white mt-3 px-4 py-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-gray-900 font-medium">自动分账收入</span>
          <HelpCircle class="w-4 h-4 text-gray-400" />
        </div>
        <span class="text-gray-500 text-sm">{{ currentDate }}</span>
      </div>
      
      <div class="text-3xl font-bold text-gray-900 mb-4">
        {{ autoDistributionIncome.toFixed(2) }}
      </div>

      <div class="text-gray-600 text-sm mb-3">自动分账明细</div>

      <div class="grid grid-cols-2 gap-4">
        <div class="border-r border-gray-100 pr-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-gray-700 text-sm">推荐商家</span>
            <HelpCircle class="w-4 h-4 text-gray-400" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-900 font-medium">{{ autoMerchantIncome.toFixed(2) }}</span>
            <button class="flex items-center gap-1 text-gray-400 text-sm" @click="viewDetails('auto-merchant')">
              <span>详情</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="pl-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-gray-700 text-sm">区域代理</span>
            <HelpCircle class="w-4 h-4 text-gray-400" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-900 font-medium">{{ autoRegionalIncome.toFixed(2) }}</span>
            <button class="flex items-center gap-1 text-gray-400 text-sm" @click="viewDetails('auto-regional')">
              <span>详情</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Withdrawal Income Section -->
    <div class="bg-white mt-3 px-4 py-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-gray-900 font-medium">手动提现收入</span>
          <HelpCircle class="w-4 h-4 text-gray-400" />
        </div>
        <span class="text-gray-500 text-sm">{{ currentDate }}</span>
      </div>
      
      <div class="text-3xl font-bold text-gray-900 mb-4">
        {{ manualWithdrawalIncome.toFixed(2) }}
      </div>

      <div class="text-gray-600 text-sm mb-3">手动提现明细</div>

      <div class="grid grid-cols-2 gap-4">
        <div class="border-r border-gray-100 pr-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-gray-700 text-sm">推荐商家</span>
            <HelpCircle class="w-4 h-4 text-gray-400" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-900 font-medium">{{ manualMerchantIncome.toFixed(2) }}</span>
            <button class="flex items-center gap-1 text-gray-400 text-sm" @click="viewDetails('manual-merchant')">
              <span>详情</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="pl-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-gray-700 text-sm">区域代理</span>
            <HelpCircle class="w-4 h-4 text-gray-400" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-900 font-medium">{{ manualRegionalIncome.toFixed(2) }}</span>
            <button class="flex items-center gap-1 text-gray-400 text-sm" @click="viewDetails('manual-regional')">
              <span>详情</span>
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-vue-next'

const router = useRouter()

const activeTab = ref('today')

const tabs = [
  { label: '今日', value: 'today' },
  { label: '昨日', value: 'yesterday' },
  { label: '总计', value: 'total' }
]

// Sample data - would come from API based on activeTab
const autoDistributionIncome = ref(0.00)
const autoMerchantIncome = ref(0.00)
const autoRegionalIncome = ref(0.00)

const manualWithdrawalIncome = ref(0.00)
const manualMerchantIncome = ref(0.00)
const manualRegionalIncome = ref(0.00)

const currentDate = computed(() => {
  const today = new Date()
  if (activeTab.value === 'yesterday') {
    today.setDate(today.getDate() - 1)
  }
  if (activeTab.value === 'total') {
    return '全部'
  }
  return today.toISOString().split('T')[0]
})

const goBack = () => {
  router.back()
}

const viewDetails = (type) => {
  // 根据类型跳转到对应的明细页面
  // type: 'auto-merchant', 'auto-regional', 'manual-merchant', 'manual-regional'
  router.push(`/transactions/${type}`)
}
</script>

<style scoped>
.bg-gradient-to-r {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
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