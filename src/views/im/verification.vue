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

    <!-- Friend Apply List Component -->
    <FriendApplyList @apply-processed="handleApplyProcessed" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import FriendApplyList from '@/components/im/FriendApplyList.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}

// 处理申请结果
const handleApplyProcessed = (apply, action) => {
  console.log('申请处理结果:', { apply, action })
  // 可以在这里添加其他逻辑，比如刷新未读数量等
}
</script>

<style scoped>
/* 验证消息页面样式 */
</style>

