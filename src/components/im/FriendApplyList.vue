<template>
  <div class="friend-apply-list">
    <!-- 头部统计 -->
    <div class="apply-header bg-white p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">好友申请</h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">共 {{ applyList.length }} 条申请</span>
          <button
            @click="handleRefresh"
            :disabled="loading"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RotateCw :class="['w-4 h-4 text-gray-500', { 'animate-spin': loading }]" />
          </button>
        </div>
      </div>
    </div>

    <!-- 申请列表 -->
    <div v-if="applyList.length > 0" class="apply-list">
      <div
        v-for="apply in applyList"
        :key="apply.id"
        class="apply-item bg-white border-b border-gray-100 p-4"
      >
        <div class="flex items-start gap-3">
          <!-- 头像 -->
          <img
            :src="apply.avatar || defaultAvatar"
            :alt="apply.nickname"
            class="w-12 h-12 rounded-full object-cover flex-shrink-0"
            @error="handleAvatarError"
          />
          
          <!-- 申请信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium text-gray-900 truncate">{{ apply.nickname }}</h3>
              <span class="text-xs text-gray-500">{{ formatTime(apply.createdAt) }}</span>
            </div>
            
            <p v-if="apply.remark" class="text-sm text-gray-600 mb-2">
              <span class="text-gray-500">申请备注：</span>{{ apply.remark }}
            </p>
            
            <div class="flex items-center gap-2">
              <button
                @click="handleAccept(apply)"
                :disabled="processingIds.has(apply.id)"
                class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ processingIds.has(apply.id) ? '处理中...' : '接受' }}
              </button>
              <button
                @click="handleDecline(apply)"
                :disabled="processingIds.has(apply.id)"
                class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                拒绝
              </button>
              <button
                @click="handleViewProfile(apply)"
                class="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-200"
              >
                查看资料
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="empty-state">
      <div class="text-center py-12">
        <UserCheck class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无好友申请</h3>
        <p class="text-gray-500">当前没有收到任何好友申请</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-gray-600">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { RotateCw, UserCheck } from 'lucide-vue-next'
import { useFriendManagement, useToast } from '@/composables'

// Props
interface Props {
  onApplyProcessed?: (apply: any, action: 'accept' | 'decline') => void
}

const props = withDefaults(defineProps<Props>(), {
  onApplyProcessed: () => {}
})

// 组合式函数
const { fetchFriendApplyList, acceptApply, declineApply } = useFriendManagement()
const { success: showSuccess, error: showError } = useToast()
const router = useRouter()

// 简单的格式化函数
const formatTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// 响应式数据
const applyList = ref([])
const loading = ref(false)
const processingIds = ref(new Set<number>())

// 计算属性
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=ef4444&color=fff&size=200'

// 方法
const loadApplyList = async () => {
  loading.value = true
  
  try {
    const result = await fetchFriendApplyList()
    
    if (result.success) {
      applyList.value = result.data
    } else {
      showError(result.error || '获取申请列表失败')
    }
  } catch (error) {
    console.error('获取申请列表失败:', error)
    showError('获取申请列表失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleAccept = async (apply: any) => {
  processingIds.value.add(apply.id)
  
  try {
    const result = await acceptApply({
      apply_id: apply.id,
      remark: apply.nickname // 使用昵称作为默认备注
    })
    
    if (result.success) {
      showSuccess('已接受好友申请')
      // 从列表中移除
      applyList.value = applyList.value.filter(item => item.id !== apply.id)
      props.onApplyProcessed?.(apply, 'accept')
    } else {
      showError(result.error || '接受申请失败')
    }
  } catch (error) {
    console.error('接受申请失败:', error)
    showError('接受申请失败，请重试')
  } finally {
    processingIds.value.delete(apply.id)
  }
}

const handleDecline = async (apply: any) => {
  processingIds.value.add(apply.id)
  
  try {
    const result = await declineApply({
      apply_id: apply.id
    })
    
    if (result.success) {
      showSuccess('已拒绝好友申请')
      // 从列表中移除
      applyList.value = applyList.value.filter(item => item.id !== apply.id)
      props.onApplyProcessed?.(apply, 'decline')
    } else {
      showError(result.error || '拒绝申请失败')
    }
  } catch (error) {
    console.error('拒绝申请失败:', error)
    showError('拒绝申请失败，请重试')
  } finally {
    processingIds.value.delete(apply.id)
  }
}

const handleViewProfile = (apply: any) => {
  router.push(`/im/friend/${apply.userId}`)
}

const handleRefresh = () => {
  loadApplyList()
}

const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = defaultAvatar
}

// 生命周期
onMounted(() => {
  loadApplyList()
})
</script>

<style scoped>
.friend-apply-list {
  @apply min-h-screen bg-gray-50;
}

.apply-item {
  @apply transition-colors hover:bg-gray-50;
}

.empty-state {
  @apply bg-white;
}

.loading-state {
  @apply bg-white;
}
</style>
