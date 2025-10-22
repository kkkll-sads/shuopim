<template>
  <div class="contact-detail">
    <!-- 头部信息 -->
    <div class="contact-header bg-white p-6 text-center">
      <!-- 头像 -->
      <div class="relative inline-block">
        <img
          :src="contact.avatar || defaultAvatar"
          :alt="contact.nickname"
          class="w-20 h-20 rounded-full object-cover mx-auto"
          @error="handleAvatarError"
        />
        <!-- 在线状态 -->
        <div
          v-if="contact.isOnline"
          class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"
        ></div>
      </div>
      
      <!-- 基本信息 -->
      <div class="mt-4">
        <h2 class="text-xl font-semibold text-gray-900">{{ contact.nickname }}</h2>
        <p v-if="contact.motto" class="text-gray-600 mt-1">{{ contact.motto }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ contact.mobile }}</p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3 mt-6">
        <button
          v-if="!isFriend"
          @click="handleAddFriend"
          :disabled="adding"
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ adding ? '添加中...' : '添加好友' }}
        </button>
        <button
          v-else
          @click="handleStartChat"
          class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          发消息
        </button>
        <button
          @click="handleMore"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          更多
        </button>
      </div>
    </div>

    <!-- 详细信息 -->
    <div class="contact-info bg-white mt-4">
      <div class="info-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">昵称</span>
            <span class="info-value">{{ contact.nickname }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">{{ contact.mobile }}</span>
          </div>
          <div v-if="contact.email" class="info-item">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ contact.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">性别</span>
            <span class="info-value">
              <span v-if="contact.gender === 1" class="text-blue-500">男</span>
              <span v-else-if="contact.gender === 2" class="text-pink-500">女</span>
              <span v-else class="text-gray-500">未知</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">在线状态</span>
            <span class="info-value">
              <span v-if="contact.isOnline" class="text-green-500">在线</span>
              <span v-else class="text-gray-500">离线</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 好友信息 -->
      <div v-if="isFriend" class="info-section">
        <h3 class="section-title">好友信息</h3>
        <div class="info-list">
          <div v-if="contact.remark" class="info-item">
            <span class="info-label">备注名</span>
            <span class="info-value">{{ contact.remark }}</span>
          </div>
          <div v-if="contact.groupId" class="info-item">
            <span class="info-label">分组</span>
            <span class="info-value">{{ getGroupName(contact.groupId) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关系</span>
            <span class="info-value text-green-500">好友</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-gray-600">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFriendManagement } from '@/composables/useIM'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

// Props
interface Props {
  userId: number
}

const props = defineProps<Props>()

// 组合式函数
const { getContactInfo, addFriend } = useFriendManagement()
const { showToast } = useToast()
const router = useRouter()

// 响应式数据
const contact = ref({
  id: 0,
  nickname: '',
  avatar: '',
  mobile: '',
  email: '',
  gender: 0,
  motto: '',
  relation: 0,
  remark: '',
  groupId: 0,
  onlineStatus: 'N',
  isOnline: false
})
const loading = ref(false)
const adding = ref(false)

// 计算属性
const isFriend = computed(() => contact.value.relation === 1)

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=ef4444&color=fff&size=200'

// 方法
const fetchContactDetail = async () => {
  loading.value = true
  
  try {
    const result = await getContactInfo(props.userId)
    
    if (result.success) {
      contact.value = result.data
    } else {
      showToast(result.error || '获取联系人详情失败')
    }
  } catch (error) {
    console.error('获取联系人详情失败:', error)
    showToast('获取联系人详情失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleAddFriend = async () => {
  adding.value = true
  
  try {
    const result = await addFriend(contact.value)
    
    if (result.success) {
      showToast('添加好友成功')
      // 重新获取联系人详情
      await fetchContactDetail()
    } else {
      showToast(result.error || '添加好友失败')
    }
  } catch (error) {
    console.error('添加好友失败:', error)
    showToast('添加好友失败，请重试')
  } finally {
    adding.value = false
  }
}

const handleStartChat = () => {
  router.push(`/im/chat/${contact.value.id}`)
}

const handleMore = () => {
  // TODO: 实现更多操作
  showToast('更多功能开发中...')
}

const getGroupName = (groupId: number) => {
  // TODO: 根据分组ID获取分组名称
  return `分组 ${groupId}`
}

const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = defaultAvatar
}

// 生命周期
onMounted(() => {
  fetchContactDetail()
})
</script>

<style scoped>
.contact-detail {
  @apply min-h-screen bg-gray-50;
}

.contact-header {
  @apply border-b border-gray-200;
}

.info-section {
  @apply p-4 border-b border-gray-100 last:border-b-0;
}

.section-title {
  @apply text-sm font-medium text-gray-500 mb-3;
}

.info-list {
  @apply space-y-3;
}

.info-item {
  @apply flex justify-between items-center;
}

.info-label {
  @apply text-sm text-gray-600;
}

.info-value {
  @apply text-sm text-gray-900;
}

.loading-overlay {
  @apply absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center;
}
</style>
