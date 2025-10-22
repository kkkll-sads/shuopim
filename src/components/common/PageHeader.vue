<template>
  <div 
    :class="[
      'px-4 py-4 flex items-center sticky top-0 z-10',
      bgClass,
      shadow ? 'shadow-sm' : ''
    ]"
  >
    <!-- Left: Back Button -->
    <button 
      v-if="showBack"
      @click="handleBack" 
      class="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
    >
      <ChevronLeft :class="['text-gray-700', iconSize]" />
    </button>

    <!-- Left Slot -->
    <div v-if="$slots.left" class="flex-shrink-0">
      <slot name="left"></slot>
    </div>

    <!-- Center: Title -->
    <div class="flex-1 text-center px-4">
      <h1 
        v-if="title"
        :class="['font-medium text-gray-800', titleSize]"
      >
        {{ title }}
      </h1>
      <slot v-else name="title"></slot>
    </div>

    <!-- Right Slot or Action -->
    <div v-if="$slots.right || showAction" class="flex-shrink-0">
      <slot name="right">
        <button
          v-if="showAction"
          @click="handleAction"
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
            actionClass
          ]"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
    <div v-else class="w-10"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  bgClass: {
    type: String,
    default: 'bg-white'
  },
  shadow: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: '完成'
  },
  actionClass: {
    type: String,
    default: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600'
  }
})

const emit = defineEmits(['back', 'action'])
const router = useRouter()

const iconSize = {
  small: 'w-5 h-5',
  medium: 'w-6 h-6',
  large: 'w-7 h-7'
}[props.size]

const titleSize = {
  small: 'text-base',
  medium: 'text-lg',
  large: 'text-xl'
}[props.size]

const handleBack = () => {
  emit('back')
  if (!emit('back').length) {
    router.back()
  }
}

const handleAction = () => {
  emit('action')
}
</script>

