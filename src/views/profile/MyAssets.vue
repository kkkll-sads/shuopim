<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-semibold text-gray-900">我的数资</h1>
    </div>

    <!-- Income Card -->
    <div class="mx-4 mt-4 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <span class="text-base font-medium">今日收入(合计)</span>
          <button @click="showIncomeHelp" class="active:opacity-60 transition-opacity">
            <HelpCircle class="w-4 h-4" />
          </button>
          <button @click="toggleIncomeVisible" class="active:opacity-60 transition-opacity">
            <component :is="incomeVisible ? Eye : EyeOff" class="w-4 h-4" />
          </button>
        </div>
        <button @click="viewDetails" class="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity">
          <span>收入详情</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      
      <div class="text-4xl font-bold mb-8 tracking-wide">
        {{ incomeVisible ? '0.00' : '****' }}
      </div>
      
      <div class="flex items-center justify-between pt-4 border-t border-white/20">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm opacity-90">自动分账</span>
            <button @click="showAutoHelp" class="active:opacity-60 transition-opacity">
              <HelpCircle class="w-3 h-3" />
            </button>
          </div>
          <div class="text-2xl font-semibold">
            {{ incomeVisible ? '0.00' : '****' }}
          </div>
        </div>
        <div class="w-px h-12 bg-white/20 mx-4"></div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm opacity-90">手动提现</span>
            <button @click="showManualHelp" class="active:opacity-60 transition-opacity">
              <HelpCircle class="w-3 h-3" />
            </button>
          </div>
          <div class="text-2xl font-semibold">
            {{ incomeVisible ? '0.00' : '****' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Withdrawal Section -->
    <div class="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-gray-900 font-semibold text-base">待提现总额</span>
        <button @click="showWithdrawHelp" class="active:opacity-60 transition-opacity">
          <HelpCircle class="w-4 h-4 text-gray-400" />
        </button>
        <button @click="toggleWithdrawVisible" class="active:opacity-60 transition-opacity">
          <component :is="withdrawVisible ? Eye : EyeOff" class="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div class="text-3xl font-bold text-gray-900 mb-6 tracking-wide">
        {{ withdrawVisible ? '0' : '****' }}
      </div>
      
      <div class="border-t border-gray-100 pt-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-gray-700 font-medium">盈收分润(手动提现)</span>
            <button @click="showProfitHelp" class="active:opacity-60 transition-opacity">
              <HelpCircle class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-gray-900">
            {{ withdrawVisible ? '0.00' : '****' }}
          </span>
          <button 
            @click="viewProfitDetails" 
            class="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span class="text-sm">详情</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, HelpCircle, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()

// 可见性控制
const incomeVisible = ref<boolean>(true)
const withdrawVisible = ref<boolean>(true)

const goBack = () => {
  router.back()
}

const toggleIncomeVisible = () => {
  incomeVisible.value = !incomeVisible.value
}

const toggleWithdrawVisible = () => {
  withdrawVisible.value = !withdrawVisible.value
}

const showIncomeHelp = () => {
  console.log('显示今日收入帮助')
  // TODO: 显示帮助弹窗
}

const showAutoHelp = () => {
  console.log('显示自动分账帮助')
  // TODO: 显示帮助弹窗
}

const showManualHelp = () => {
  console.log('显示手动提现帮助')
  // TODO: 显示帮助弹窗
}

const showWithdrawHelp = () => {
  console.log('显示待提现总额帮助')
  // TODO: 显示帮助弹窗
}

const showProfitHelp = () => {
  console.log('显示盈收分润帮助')
  // TODO: 显示帮助弹窗
}

const viewDetails = () => {
  router.push('/income-details')
}

const viewProfitDetails = () => {
  router.push('/profit-sharing')
}
</script>

