<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">{{ pageConfig.title }}</h1>
    </div>

    <!-- Transactions List -->
    <div v-if="transactions.length > 0" class="p-4 space-y-3">
      <div
        v-for="(transaction, index) in transactions"
        :key="index"
        class="bg-white rounded-xl p-4 shadow-sm transaction-item"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-800 font-medium">{{ transaction.title }}</span>
          <div class="flex items-center gap-2">
            <span
              :class="[
                'font-semibold text-lg',
                transaction.type === 'income' ? 'text-green-500' : 'text-gray-800'
              ]"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount }}
            </span>
            <!-- 提现记录显示状态 -->
            <span
              v-if="type === 'withdrawal' && transaction.status"
              :class="[
                'text-xs px-2 py-1 rounded-full',
                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                transaction.status === 'success' ? 'bg-green-100 text-green-700' :
                transaction.status === 'failed' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              ]"
            >
              {{ getStatusText(transaction.status) }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>{{ transaction.description }}</span>
          <span>{{ transaction.date }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center py-20">
      <div class="text-center empty-state">
        <div class="mb-6">
          <div class="relative w-32 h-32 mx-auto">
            <div class="absolute inset-0 flex items-center justify-center">
              <div :class="['rounded-full p-6', pageConfig.bgGradient]">
                <component :is="pageConfig.icon" class="w-20 h-20" :class="pageConfig.iconColor" />
              </div>
            </div>
          </div>
        </div>
        <p class="text-gray-400 text-base mb-2">{{ pageConfig.emptyTitle }}</p>
        <p class="text-gray-400 text-sm">{{ pageConfig.emptyDesc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, FileText, Coins, Ticket, Award } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 获取类型参数
const type = computed(() => route.params.type || 'beans')

// 根据类型配置页面信息
const pageConfig = computed(() => {
  const configs = {
    beans: {
      title: '树豆明细',
      icon: Coins,
      iconColor: 'text-orange-400',
      bgGradient: 'bg-gradient-to-br from-orange-100 to-red-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '您的树豆交易记录会显示在这里～'
    },
    vouchers: {
      title: '消费券明细',
      icon: Ticket,
      iconColor: 'text-red-400',
      bgGradient: 'bg-gradient-to-br from-red-100 to-pink-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '您的消费券交易记录会显示在这里～'
    },
    rights: {
      title: '树权明细',
      icon: Award,
      iconColor: 'text-red-500',
      bgGradient: 'bg-gradient-to-br from-red-100 to-orange-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '您的树权交易记录会显示在这里～'
    },
    profit: {
      title: '盈收分润明细',
      icon: FileText,
      iconColor: 'text-blue-400',
      bgGradient: 'bg-gradient-to-br from-blue-100 to-purple-100',
      emptyTitle: '暂无分润记录',
      emptyDesc: '您的盈收分润记录会显示在这里～'
    },
    withdrawal: {
      title: '提现记录',
      icon: FileText,
      iconColor: 'text-purple-400',
      bgGradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
      emptyTitle: '暂无提现记录',
      emptyDesc: '您的提现记录会显示在这里～'
    },
    'auto-merchant': {
      title: '推荐商家明细（自动分账）',
      icon: FileText,
      iconColor: 'text-green-400',
      bgGradient: 'bg-gradient-to-br from-green-100 to-teal-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '推荐商家的自动分账记录会显示在这里～'
    },
    'auto-regional': {
      title: '区域代理明细（自动分账）',
      icon: FileText,
      iconColor: 'text-teal-400',
      bgGradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '区域代理的自动分账记录会显示在这里～'
    },
    'manual-merchant': {
      title: '推荐商家明细（手动提现）',
      icon: FileText,
      iconColor: 'text-blue-400',
      bgGradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '推荐商家的手动提现记录会显示在这里～'
    },
    'manual-regional': {
      title: '区域代理明细（手动提现）',
      icon: FileText,
      iconColor: 'text-indigo-400',
      bgGradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
      emptyTitle: '暂无明细记录',
      emptyDesc: '区域代理的手动提现记录会显示在这里～'
    },
    frozen: {
      title: '冻结明细',
      icon: FileText,
      iconColor: 'text-gray-400',
      bgGradient: 'bg-gradient-to-br from-gray-100 to-slate-100',
      emptyTitle: '暂无冻结记录',
      emptyDesc: '您的冻结记录会显示在这里～'
    }
  }
  return configs[type.value] || configs.beans
})

// 交易记录数据（根据type从后端获取）
const transactions = ref([])

// 可以在这里根据type加载对应的数据
// const loadTransactions = async () => {
//   const response = await fetchTransactions(type.value)
//   transactions.value = response.data
// }

const goBack = () => {
  router.back()
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    success: '已到账',
    failed: '已拒绝',
    processing: '处理中'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.transaction-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
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
</style>

