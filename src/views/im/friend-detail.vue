<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button 
        @click="handleGoBack" 
        class="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        style="z-index: 1000; position: relative;"
      >
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">联系人详情</h1>
      <button @click="handleMore" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <MoreHorizontal class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <!-- Contact Detail Component -->
    <ContactDetail 
      :user-id="userId" 
      @contact-added="handleContactAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, MoreHorizontal } from 'lucide-vue-next'
import ContactDetail from '@/components/im/ContactDetail.vue'
import { useToast } from '@/composables/useToast'

// 路由参数
const route = useRoute()
const router = useRouter()
const userId = ref(Number(route.params.id))

const { success: showSuccess, error: showError } = useToast()

// 方法
const handleGoBack = () => {
  router.back()
}

const handleMore = () => {
  // TODO: 实现更多操作菜单
  showSuccess('更多功能开发中...')
}

const handleContactAdded = (contact: any) => {
  showSuccess(`已添加 ${contact.nickname} 为好友`)
  // 可以在这里添加其他逻辑，比如刷新联系人列表等
}

// 生命周期
onMounted(() => {
  if (!userId.value || isNaN(userId.value)) {
    showError('无效的联系人ID')
    router.back()
  }
})
</script>

<style scoped>
/* 可以添加页面特定的样式 */
</style>
