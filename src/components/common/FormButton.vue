<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative font-medium rounded-lg transition-all active:scale-95',
      sizeClasses,
      variantClasses,
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
      block ? 'w-full' : '',
      customClass
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>

    <!-- Content -->
    <span :class="loading ? 'opacity-0' : 'flex items-center justify-center gap-2'">
      <component v-if="prefixIcon" :is="prefixIcon" :class="iconSizeClass" />
      <slot>{{ text }}</slot>
      <component v-if="suffixIcon" :is="suffixIcon" :class="iconSizeClass" />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: Object,
    default: null
  },
  suffixIcon: {
    type: Object,
    default: null
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const sizeClasses = computed(() => {
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }
  return sizes[props.size]
})

const iconSizeClass = computed(() => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm',
    outline: 'border-2 border-purple-400 text-purple-600 hover:bg-purple-50',
    ghost: 'text-purple-600 hover:bg-purple-50',
    danger: 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 shadow-sm',
    success: 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-sm'
  }
  return variants[props.variant]
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

