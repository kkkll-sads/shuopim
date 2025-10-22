<template>
  <div class="friend-apply-form">
    <!-- 表单头部 -->
    <div class="form-header bg-white p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">发送好友申请</h2>
      <p class="text-sm text-gray-500 mt-1">向 {{ contactInfo.nickname }} 发送好友申请</p>
    </div>

    <!-- 联系人信息 -->
    <div class="contact-info bg-white p-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <img
          :src="contactInfo.avatar || defaultAvatar"
          :alt="contactInfo.nickname"
          class="w-12 h-12 rounded-full object-cover"
          @error="handleAvatarError"
        />
        <div>
          <h3 class="font-medium text-gray-900">{{ contactInfo.nickname }}</h3>
          <p v-if="contactInfo.motto" class="text-sm text-gray-500">{{ contactInfo.motto }}</p>
        </div>
      </div>
    </div>

    <!-- 申请表单 -->
    <div class="form-content bg-white p-4">
      <form @submit.prevent="handleSubmit">
        <!-- 申请备注 -->
        <div class="form-group mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            申请备注 <span class="text-gray-400">(可选)</span>
          </label>
          <textarea
            v-model="formData.remark"
            placeholder="请输入申请备注，让对方了解你是谁..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="3"
            maxlength="100"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-400">让对方了解你是谁</span>
            <span class="text-xs text-gray-400">{{ formData.remark.length }}/100</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions flex gap-3">
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ submitting ? '发送中...' : '发送申请' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 申请提示 -->
    <div class="apply-tips bg-blue-50 p-4">
      <div class="flex items-start gap-2">
        <Info class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div class="text-sm text-blue-700">
          <p class="font-medium mb-1">申请提示：</p>
          <ul class="space-y-1 text-blue-600">
            <li>• 申请发送后，对方会收到通知</li>
            <li>• 对方同意后，你们将成为好友</li>
            <li>• 可以随时在通讯录中管理好友</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Info } from 'lucide-vue-next'
import { useFriendManagement, useToast } from '@/composables'

// Props
interface Props {
  contactInfo: {
    id: number
    nickname: string
    avatar?: string
    motto?: string
  }
  onApplySent?: (apply: any) => void
  onCancel?: () => void
}

const props = defineProps<Props>()

// 组合式函数
const { sendFriendApply } = useFriendManagement()
const { success: showSuccess, error: showError } = useToast()

// 响应式数据
const submitting = ref(false)
const formData = reactive({
  remark: ''
})

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=ef4444&color=fff&size=200'

// 方法
const handleSubmit = async () => {
  if (submitting.value) return

  submitting.value = true
  
  try {
    const result = await sendFriendApply({
      user_id: props.contactInfo.id,
      remark: formData.remark.trim() || '申请添加为好友'
    })
    
    if (result.success) {
      showSuccess('好友申请已发送')
      props.onApplySent?.({
        userId: props.contactInfo.id,
        remark: formData.remark,
        nickname: props.contactInfo.nickname
      })
    } else {
      showError(result.error || '发送申请失败')
    }
  } catch (error) {
    console.error('发送申请失败:', error)
    showError('发送申请失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  props.onCancel?.()
}

const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = defaultAvatar
}
</script>

<style scoped>
.friend-apply-form {
  @apply min-h-screen bg-gray-50;
}

.form-group {
  @apply space-y-2;
}

.form-actions {
  @apply mt-6;
}

.apply-tips {
  @apply border-t border-blue-200;
}
</style>
