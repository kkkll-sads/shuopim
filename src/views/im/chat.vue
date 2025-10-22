<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- 聊天头部 -->
    <ChatHeader 
      :chat-info="chatInfo"
      :online-count="onlineCount"
      @back="handleBack"
      @more="handleMore"
    />

    <!-- 消息列表 -->
    <div 
      ref="messageContainer"
      class="flex-1 overflow-y-auto px-4 py-4 pb-4 space-y-4"
      @scroll="handleScroll"
    >
      <!-- 加载更多消息 -->
      <div v-if="loadingMore" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
      </div>

      <!-- 消息列表 -->
      <div v-for="message in messages" :key="message.id" class="message-item">
        <Message 
          :message="message"
          :is-own="message.senderId === currentUserId"
          @avatar-click="handleAvatarClick"
          @message-click="handleMessageClick"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="!messages.length && !loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare class="w-20 h-20 text-orange-400" />
          </div>
          <p class="text-gray-400 text-base mb-2">开始聊天吧</p>
          <p class="text-gray-400 text-sm">发送第一条消息</p>
        </div>
      </div>
    </div>

    <!-- 消息输入 - 固定在底部 -->
    <div class="flex-shrink-0 bg-white border-t border-gray-200">
      <MessageInput 
        v-model="inputMessage"
        :disabled="sending"
        :placeholder="`发送给 ${chatInfo.name}`"
        @send="handleSendMessage"
        @voice="handleVoiceInput"
        @emoji="handleEmojiInput"
        @image="handleImageInput"
        @more="handleMoreInput"
      />
    </div>

    <!-- 语音录制弹窗 -->
    <div v-if="isRecording" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 text-center">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mic class="w-12 h-12 text-red-500" />
        </div>
        <p class="text-lg font-medium text-gray-800 mb-2">正在录音...</p>
        <p class="text-sm text-gray-500">松开结束录音</p>
        <div class="mt-4">
          <button 
            @touchstart="startRecording"
            @touchend="stopRecording"
            @mousedown="startRecording"
            @mouseup="stopRecording"
            class="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-medium"
          >
            按住录音
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessageSquare, Mic } from 'lucide-vue-next'
import ChatHeader from '@/components/im/ChatHeader.vue'
import Message from '@/components/im/Message.vue'
import MessageInput from '@/components/im/MessageInput.vue'
import { useChat, useToast } from '@/composables'

// 路由参数
const route = useRoute()
const router = useRouter()
const chatId = computed(() => route.params.id as string)
const chatType = computed(() => route.query.type as string || 'group')

// 使用聊天组合式函数
const {
  messages,
  chatInfo,
  currentUserId,
  onlineCount,
  loading,
  loadingMore,
  sending,
  inputMessage,
  isRecording,
  fetchMessages,
  sendMessage,
  loadMoreMessages,
  startRecording,
  stopRecording,
  markAsRead,
  refreshMessages
} = useChat({
  chatId: chatId.value,
  chatType: chatType.value,
  autoRefresh: true,
  refreshInterval: 5000
})

// 消息容器引用
const messageContainer = ref<HTMLElement>()

// 处理返回
const handleBack = () => {
  console.log('返回按钮被点击，准备跳转到 /im')
  
  // 方法1: 使用 router.push
  try {
    router.push('/im')
    console.log('路由跳转成功')
    return
  } catch (error) {
    console.error('router.push 失败:', error)
  }
  
  // 方法2: 使用 router.replace
  try {
    router.replace('/im')
    console.log('router.replace 成功')
    return
  } catch (error) {
    console.error('router.replace 失败:', error)
  }
  
  // 方法3: 使用浏览器历史记录
  if (window.history.length > 1) {
    console.log('使用浏览器历史记录返回')
    window.history.back()
    return
  }
  
  // 方法4: 直接修改 location
  console.log('使用 location.href 跳转')
  window.location.href = '/im'
}

// 处理更多选项
const handleMore = () => {
  console.log('更多选项')
  // TODO: 实现更多选项功能
}

// 处理头像点击
const handleAvatarClick = (userId: string) => {
  console.log('点击头像:', userId)
  // TODO: 跳转到用户详情页面
}

// 处理消息点击
const handleMessageClick = (message: any) => {
  console.log('点击消息:', message)
  // TODO: 实现消息操作（复制、转发、删除等）
}

// 处理发送消息
const handleSendMessage = async (content: string) => {
  if (!content.trim()) return
  
  try {
    await sendMessage({
      type: 'text',
      content: content.trim()
    })
    
    // 清空输入框
    inputMessage.value = ''
    
    // 滚动到底部
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 处理语音输入
const handleVoiceInput = () => {
  console.log('语音输入')
  // 语音输入逻辑已在 useChat 中处理
}

// 处理表情输入
const handleEmojiInput = (emoji: string) => {
  inputMessage.value += emoji
}

// 处理图片输入
const handleImageInput = (file: File) => {
  console.log('选择图片:', file)
  // TODO: 实现图片发送
}

// 处理更多输入选项
const handleMoreInput = () => {
  console.log('更多输入选项')
  // TODO: 实现更多输入选项（文件、位置等）
}

// 处理滚动
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.scrollTop === 0 && !loadingMore.value) {
    loadMoreMessages()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 自动滚动到底部
const autoScrollToBottom = () => {
  nextTick(() => {
    scrollToBottom()
  })
}

// 监听消息变化，自动滚动到底部
watch(() => messages.value.length, () => {
  autoScrollToBottom()
})

// 组件挂载时
onMounted(async () => {
  try {
    // useChat 组合式函数会自动调用 fetchMessages，这里不需要重复调用
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('初始化失败:', error)
  }
})

// 组件卸载时
onUnmounted(() => {
  // 标记为已读
  markAsRead()
})
</script>

<style scoped>
.message-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.message-container::-webkit-scrollbar {
  width: 4px;
}

.message-container::-webkit-scrollbar-track {
  background: transparent;
}

.message-container::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

.message-container::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
