<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">{{ pageConfig.title }}</h1>
    </div>

    <!-- Balance Card -->
    <div :class="['mx-4 mt-4 p-6 rounded-2xl shadow-lg balance-card', pageConfig.bgGradient]">
      <div class="text-white mb-2 opacity-90">{{ pageConfig.title }}</div>
      <div class="text-white text-4xl font-bold mb-4">{{ balance }}</div>
    </div>

    <!-- Detail Entry -->
    <div class="bg-white mx-4 mt-4 rounded-2xl shadow-sm">
      <button
        @click="viewTransactions"
        class="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', pageConfig.iconBg]">
            <List class="w-5 h-5 text-white" />
          </div>
          <span class="text-gray-800 font-medium">{{ pageConfig.detailLabel }}</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <!-- Empty Transactions -->
    <div v-if="transactions.length === 0" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center empty-state">
        <div class="mb-4">
          <component :is="pageConfig.icon" class="w-20 h-20 text-gray-300 mx-auto" />
        </div>
        <p class="text-gray-400 text-base">暂无交易记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, List, Coins, Ticket, Award } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 获取类型参数
const type = computed(() => route.params.type || 'beans')

// 根据类型配置页面信息
const pageConfig = computed(() => {
  const configs = {
    beans: {
      title: '树豆',
      detailLabel: '树豆明细',
      icon: Coins,
      bgGradient: 'bg-gradient-to-r from-orange-400 to-orange-600',
      iconBg: 'bg-gradient-to-br from-orange-400 to-red-500'
    },
    vouchers: {
      title: '消费券',
      detailLabel: '消费券明细',
      icon: Ticket,
      bgGradient: 'bg-gradient-to-r from-orange-500 to-red-500',
      iconBg: 'bg-gradient-to-br from-red-400 to-red-600'
    },
    rights: {
      title: '树权',
      detailLabel: '树权明细',
      icon: Award,
      bgGradient: 'bg-gradient-to-r from-red-500 to-red-700',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-700'
    }
  }
  return configs[type.value] || configs.beans
})

const balance = ref('0.0000')
const transactions = ref([])

const goBack = () => {
  router.back()
}

const viewTransactions = () => {
  router.push(`/transactions/${type.value}`)
}

// 可以在这里根据type加载对应的余额数据
// const loadBalance = async () => {
//   const response = await fetchBalance(type.value)
//   balance.value = response.data.balance
// }
</script>

<style scoped>
.balance-card {
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
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
</style>

