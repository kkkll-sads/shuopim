<template>
  <div class="bg-white border-t border-gray-200 p-3">
    <!-- 工具栏 - 移到输入框上方 -->
    <div class="flex items-center justify-between mb-3">
      <!-- 左侧工具 -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- 语音输入 -->
        <button
          @click="handleVoice"
          :disabled="disabled"
          class="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Mic class="w-4 h-4" />
          <span class="text-xs whitespace-nowrap">语音</span>
        </button>

        <!-- 表情 -->
        <button
          @click="handleEmoji"
          :disabled="disabled"
          class="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Smile class="w-4 h-4" />
          <span class="text-xs whitespace-nowrap">表情</span>
        </button>

        <!-- 图片 -->
        <button
          @click="handleImage"
          :disabled="disabled"
          class="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Image class="w-4 h-4" />
          <span class="text-xs whitespace-nowrap">图片</span>
        </button>

        <!-- 更多选项 -->
        <button
          @click="handleMore"
          :disabled="disabled"
          class="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Plus class="w-4 h-4" />
          <span class="text-xs whitespace-nowrap">更多</span>
        </button>
      </div>

      <!-- 右侧状态 -->
      <div class="flex items-center gap-2 flex-shrink-0 ml-2">
        <!-- 输入状态指示器 -->
        <div v-if="isTyping" class="flex items-center gap-1">
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-gray-500 whitespace-nowrap">正在输入...</span>
        </div>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="flex items-end gap-3">
      <!-- 文本输入框 -->
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full min-h-[40px] max-h-32 px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          @input="handleInput"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        
        <!-- 输入框右侧按钮 -->
        <div class="absolute right-2 bottom-2 flex items-center gap-1">
          <!-- 展开按钮 -->
          <button
            v-if="!isExpanded"
            @click="expandInput"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Maximize2 class="w-4 h-4 text-gray-500" />
          </button>
          
          <!-- 收起按钮 -->
          <button
            v-else
            @click="collapseInput"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Minimize2 class="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- 发送按钮 -->
      <button
        v-if="inputValue.trim()"
        @click="handleSend"
        :disabled="disabled || !inputValue.trim()"
        class="bg-gradient-to-r from-orange-400 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send class="w-5 h-5" />
      </button>

      <!-- 语音按钮 -->
      <button
        v-else
        @mousedown="startVoiceInput"
        @mouseup="stopVoiceInput"
        @touchstart="startVoiceInput"
        @touchend="stopVoiceInput"
        :disabled="disabled"
        class="bg-gray-100 text-gray-600 p-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Mic class="w-5 h-5" />
      </button>
    </div>


    <!-- 表情选择器 -->
    <div v-if="showEmojiPicker" class="mt-3 p-3 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-8 gap-2">
        <button
          v-for="emoji in commonEmojis"
          :key="emoji"
          @click="insertEmoji(emoji)"
          class="p-2 hover:bg-gray-200 rounded text-lg"
        >
          {{ emoji }}
        </button>
      </div>
    </div>

    <!-- 更多选项面板 -->
    <div v-if="showMoreOptions" class="mt-3 p-3 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-4 gap-4">
        <button
          v-for="option in moreOptions"
          :key="option.name"
          @click="handleMoreOption(option)"
          class="flex flex-col items-center gap-2 p-3 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <component :is="option.icon" class="w-6 h-6 text-gray-600" />
          <span class="text-xs text-gray-600">{{ option.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { 
  Send, 
  Mic, 
  Smile, 
  Image, 
  Plus, 
  Maximize2, 
  Minimize2,
  FileText,
  MapPin,
  Camera,
  Paperclip
} from 'lucide-vue-next'

// Props
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入消息...',
  disabled: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': [content: string]
  'voice': []
  'emoji': [emoji: string]
  'image': [file: File]
  'more': []
}>()

// 响应式数据
const textareaRef = ref<HTMLTextAreaElement>()
const isExpanded = ref(false)
const isTyping = ref(false)
const showEmojiPicker = ref(false)
const showMoreOptions = ref(false)
const typingTimer = ref<NodeJS.Timeout>()

// 计算属性
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 常用表情
const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
  '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
  '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
  '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
  '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
  '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
  '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
]

// 更多选项
const moreOptions = [
  { name: '文件', icon: FileText, action: 'file' },
  { name: '位置', icon: MapPin, action: 'location' },
  { name: '拍照', icon: Camera, action: 'camera' },
  { name: '附件', icon: Paperclip, action: 'attachment' }
]

// 方法
const handleInput = () => {
  // 自动调整高度
  adjustTextareaHeight()
  
  // 设置输入状态
  isTyping.value = true
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
  typingTimer.value = setTimeout(() => {
    isTyping.value = false
  }, 1000)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

const handleFocus = () => {
  // 输入框获得焦点时的处理
}

const handleBlur = () => {
  // 输入框失去焦点时的处理
  isTyping.value = false
}

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

const expandInput = () => {
  isExpanded.value = true
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.style.height = '128px'
    }
  })
}

const collapseInput = () => {
  isExpanded.value = false
  nextTick(() => {
    adjustTextareaHeight()
  })
}

const handleSend = () => {
  if (inputValue.value.trim()) {
    emit('send', inputValue.value.trim())
    inputValue.value = ''
    adjustTextareaHeight()
    showEmojiPicker.value = false
    showMoreOptions.value = false
  }
}

const startVoiceInput = () => {
  emit('voice')
}

const stopVoiceInput = () => {
  // 语音输入结束处理
}

const handleVoice = () => {
  emit('voice')
}

const handleEmoji = () => {
  showEmojiPicker.value = !showEmojiPicker.value
  showMoreOptions.value = false
}

const handleImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      emit('image', file)
    }
  }
  input.click()
}

const handleMore = () => {
  showMoreOptions.value = !showMoreOptions.value
  showEmojiPicker.value = false
}

const insertEmoji = (emoji: string) => {
  inputValue.value += emoji
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      adjustTextareaHeight()
    }
  })
}

const handleMoreOption = (option: any) => {
  switch (option.action) {
    case 'file':
      handleFile()
      break
    case 'location':
      handleLocation()
      break
    case 'camera':
      handleCamera()
      break
    case 'attachment':
      handleAttachment()
      break
  }
  showMoreOptions.value = false
}

const handleFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      // TODO: 处理文件发送
      console.log('选择文件:', file)
    }
  }
  input.click()
}

const handleLocation = () => {
  // TODO: 实现位置发送
  console.log('发送位置')
}

const handleCamera = () => {
  // TODO: 实现拍照功能
  console.log('拍照')
}

const handleAttachment = () => {
  // TODO: 实现附件功能
  console.log('附件')
}

// 生命周期
onMounted(() => {
  adjustTextareaHeight()
})

onUnmounted(() => {
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
})
</script>

<style scoped>
/* 输入框动画 */
textarea {
  transition: height 0.2s ease;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}

/* 表情选择器动画 */
.emoji-picker {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 更多选项动画 */
.more-options {
  animation: slideUp 0.3s ease-out;
}

/* 输入状态指示器动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
