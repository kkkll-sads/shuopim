<template>
  <div 
    class="flex items-start gap-3"
    :class="{ 'flex-row-reverse': isOwn }"
  >
    <!-- 头像 -->
    <div 
      class="flex-shrink-0 cursor-pointer"
      @click="$emit('avatar-click', message.senderId)"
    >
      <img 
        :src="message.senderAvatar" 
        :alt="message.senderName"
        class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        @error="handleImageError"
      />
    </div>

    <!-- 消息内容 -->
    <div 
      class="flex-1 max-w-xs"
      :class="{ 'flex flex-col items-end': isOwn }"
    >
      <!-- 发送者姓名（群聊时显示） -->
      <div 
        v-if="!isOwn && showSenderName" 
        class="text-xs text-gray-500 mb-1 px-1"
      >
        {{ message.senderName }}
      </div>

      <!-- 消息气泡 -->
      <div 
        class="relative group"
        @click="$emit('message-click', message)"
      >
        <!-- 消息内容 -->
        <div 
          class="px-4 py-2 rounded-2xl shadow-sm transition-all duration-200"
          :class="messageBubbleClass"
        >
          <!-- 文本消息 -->
          <div v-if="message.type === 'text'" class="text-sm leading-relaxed">
            <span v-html="formatMessage(message.content)"></span>
          </div>

          <!-- 图片消息 -->
          <div v-else-if="message.type === 'image'" class="relative">
            <img 
              :src="message.content" 
              :alt="'图片'"
              class="max-w-full h-auto rounded-lg cursor-pointer"
              @click="previewImage(message.content)"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
              <Eye class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>

          <!-- 语音消息 -->
          <div v-else-if="message.type === 'voice'" class="flex items-center gap-2">
            <button 
              @click="playVoice(message)"
              class="flex items-center gap-2 text-sm"
              :class="isOwn ? 'text-white' : 'text-gray-700'"
            >
              <Play v-if="!isPlaying" class="w-4 h-4" />
              <Pause v-else class="w-4 h-4" />
              <span>{{ formatDuration(message.duration) }}</span>
            </button>
            <div class="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                class="bg-current rounded-full h-1 transition-all duration-200"
                :style="{ width: `${playProgress}%` }"
                :class="isOwn ? 'bg-white' : 'bg-orange-500'"
              ></div>
            </div>
          </div>

          <!-- 文件消息 -->
          <div v-else-if="message.type === 'file'" class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <FileText class="w-8 h-8 text-gray-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ message.fileName }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(message.fileSize) }}</p>
            </div>
            <button 
              @click="downloadFile(message)"
              class="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            >
              <Download class="w-4 h-4" />
            </button>
          </div>

          <!-- 系统消息 -->
          <div v-else-if="message.type === 'system'" class="text-center">
            <span class="text-xs text-gray-500">{{ message.content }}</span>
          </div>
        </div>

        <!-- 消息状态 -->
        <div 
          v-if="isOwn" 
          class="flex items-center gap-1 mt-1"
        >
          <span class="text-xs text-gray-400">{{ formatTime(message.timestamp) }}</span>
          <div class="flex items-center">
            <!-- 发送中 -->
            <div v-if="message.status === 'sending'" class="animate-spin">
              <Loader2 class="w-3 h-3 text-gray-400" />
            </div>
            <!-- 发送失败 -->
            <div v-else-if="message.status === 'failed'" class="text-red-500">
              <AlertCircle class="w-3 h-3" />
            </div>
            <!-- 已发送 -->
            <div v-else-if="message.status === 'sent'" class="text-gray-400">
              <Check class="w-3 h-3" />
            </div>
            <!-- 已读 -->
            <div v-else-if="message.status === 'read'" class="text-blue-500">
              <CheckCheck class="w-3 h-3" />
            </div>
          </div>
        </div>

        <!-- 时间戳（非自己发送的消息） -->
        <div v-else class="text-xs text-gray-400 mt-1 px-1">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Eye, 
  Play, 
  Pause, 
  FileText, 
  Download, 
  Loader2, 
  AlertCircle, 
  Check, 
  CheckCheck 
} from 'lucide-vue-next'

// Props
interface Props {
  message: {
    id: string
    type: 'text' | 'image' | 'voice' | 'file' | 'system'
    content: string
    senderId: string
    senderName: string
    senderAvatar: string
    timestamp: number
    status?: 'sending' | 'sent' | 'read' | 'failed'
    duration?: number
    fileName?: string
    fileSize?: number
  }
  isOwn: boolean
  showSenderName?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSenderName: true
})

// Emits
const emit = defineEmits<{
  'avatar-click': [userId: string]
  'message-click': [message: any]
}>()

// 响应式数据
const isPlaying = ref(false)
const playProgress = ref(0)

// 计算属性
const messageBubbleClass = computed(() => {
  if (props.message.type === 'system') {
    return 'bg-transparent px-0 py-1'
  }
  
  if (props.isOwn) {
    return 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
  } else {
    return 'bg-white text-gray-800 border border-gray-200'
  }
})

// 方法
const formatMessage = (content: string) => {
  // 简单的文本格式化，支持换行和基本表情
  return content
    .replace(/\n/g, '<br>')
    .replace(/:\)/g, '😊')
    .replace(/:\(/g, '😢')
    .replace(/:D/g, '😄')
    .replace(/<3/g, '❤️')
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 今天
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  // 昨天
  if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }
  
  // 更早
  return date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/default-avatar.png' // 默认头像
}

const previewImage = (src: string) => {
  // TODO: 实现图片预览
  console.log('预览图片:', src)
}

const playVoice = (message: any) => {
  if (isPlaying.value) {
    // 暂停播放
    isPlaying.value = false
    playProgress.value = 0
  } else {
    // 开始播放
    isPlaying.value = true
    // TODO: 实现语音播放逻辑
    console.log('播放语音:', message)
  }
}

const downloadFile = (message: any) => {
  // TODO: 实现文件下载
  console.log('下载文件:', message)
}
</script>

<style scoped>
/* 消息气泡动画 */
.group:hover .message-bubble {
  transform: scale(1.02);
}

/* 语音播放进度条 */
.voice-progress {
  transition: width 0.1s ease;
}

/* 文件下载按钮悬停效果 */
button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
