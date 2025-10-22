<template>
  <div
    class="bg-white px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 chat-item"
    @click="handleClick"
  >
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <img
        :src="chat.avatar || '/placeholder.svg?height=48&width=48'"
        :alt="chat.name"
        :class="[
          'object-cover',
          isGroup ? 'w-12 h-12 rounded-xl' : 'w-12 h-12 rounded-full'
        ]"
      />
      
      <!-- Muted Badge -->
      <div
        v-if="chat.muted"
        class="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center"
      >
        <BellOff class="w-3 h-3 text-white" />
      </div>
    </div>

    <!-- Chat Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <h3 class="text-base font-medium text-gray-900 truncate">
            {{ chat.name }}
          </h3>
          <span
            v-if="chat.badge"
            class="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex-shrink-0"
          >
            {{ chat.badge }}
          </span>
        </div>
        <span class="text-xs text-gray-400 flex-shrink-0 ml-2">
          {{ chat.time }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500 truncate flex-1">
          {{ chat.lastMessage }}
        </p>
        <span
          v-if="chat.unread && !chat.muted"
          class="ml-2 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0"
        >
          {{ chat.unread > 99 ? '99+' : chat.unread }}
        </span>
        <span
          v-else-if="chat.unread && chat.muted"
          class="ml-2 w-2 h-2 bg-red-500 rounded-full flex-shrink-0"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BellOff } from 'lucide-vue-next'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const isGroup = computed(() => {
  return props.chat.type === 'group'
})

const handleClick = () => {
  emit('click', props.chat)
}
</script>

<style scoped>
.chat-item {
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

