<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">盈收分润</h1>
    </div>

    <!-- Balance Card -->
    <div class="bg-gradient-to-r from-orange-400 to-red-500 mx-4 mt-4 rounded-2xl p-6 text-white shadow-lg balance-card">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-2">
          <span class="text-base">盈收分润</span>
          <HelpCircle class="w-4 h-4" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-base">冻结</span>
          <HelpCircle class="w-4 h-4" />
        </div>
        <button @click="viewFrozenDetails" class="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity">
          <span>冻结明细</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <div class="flex items-end justify-between">
        <div class="text-5xl font-bold">{{ balance }}</div>
        <div class="text-5xl font-bold">{{ frozen }}</div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="bg-white mt-4 mx-4 rounded-2xl shadow-sm overflow-hidden">
      <button
        @click="viewDetails"
        class="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors menu-item"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText class="w-5 h-5 text-blue-500" />
          </div>
          <span class="text-gray-900 font-medium">明细</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>

      <button
        @click="withdraw"
        class="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors menu-item"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Wallet class="w-5 h-5 text-orange-500" />
          </div>
          <span class="text-gray-900 font-medium">提现</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>

      <button
        @click="viewWithdrawalRecords"
        class="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors menu-item"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Briefcase class="w-5 h-5 text-purple-500" />
          </div>
          <span class="text-gray-900 font-medium">提现记录</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, HelpCircle, FileText, Wallet, Briefcase } from 'lucide-vue-next'

const router = useRouter()

const balance = ref('0.00')
const frozen = ref('0.00')

const goBack = () => {
  router.back()
}

const viewFrozenDetails = () => {
  router.push('/transactions/frozen')
}

const viewDetails = () => {
  router.push('/transactions/profit')
}

const withdraw = () => {
  console.log('Withdraw')
  // TODO: 跳转到提现页面
}

const viewWithdrawalRecords = () => {
  router.push('/transactions/withdrawal')
}
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

.menu-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>