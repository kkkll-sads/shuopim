<template>
  <div class="relative inline-block">
    <img
      :src="src || '/placeholder.svg?height=48&width=48'"
      :alt="alt"
      :class="[
        'object-cover',
        shapeClass,
        sizeClass,
        borderClass,
        'transition-all'
      ]"
      @error="handleError"
    />
    
    <!-- Badge -->
    <div
      v-if="badge"
      :class="[
        'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center border-2 border-white',
        badgeSizeClass,
        badgeColorClass
      ]"
    >
      <component
        v-if="badgeIcon"
        :is="badgeIcon"
        :class="badgeIconSizeClass"
        class="text-white"
      />
      <span v-else-if="badgeText" class="text-white font-medium text-xs">
        {{ badgeText }}
      </span>
    </div>

    <!-- Status Indicator -->
    <div
      v-if="showStatus"
      :class="[
        'absolute bottom-0 right-0 rounded-full border-2 border-white',
        statusSizeClass,
        online ? 'bg-green-500' : 'bg-gray-400'
      ]"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UserPlus, Check, X, Users } from 'lucide-vue-next'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['xs', 'small', 'medium', 'large', 'xl'].includes(value)
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (value) => ['circle', 'square', 'rounded'].includes(value)
  },
  border: {
    type: Boolean,
    default: false
  },
  borderColor: {
    type: String,
    default: 'ring-purple-400'
  },
  badge: {
    type: Boolean,
    default: false
  },
  badgeType: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'check', 'remove', 'group', 'custom'].includes(value)
  },
  badgeText: {
    type: String,
    default: ''
  },
  badgeColor: {
    type: String,
    default: 'orange'
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  online: {
    type: Boolean,
    default: false
  }
})

const hasError = ref(false)

const sizeClasses = {
  xs: 'w-8 h-8',
  small: 'w-10 h-10',
  medium: 'w-12 h-12',
  large: 'w-14 h-14',
  xl: 'w-16 h-16'
}

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl'
}

const badgeSizeClasses = {
  xs: 'w-4 h-4',
  small: 'w-5 h-5',
  medium: 'w-6 h-6',
  large: 'w-7 h-7',
  xl: 'w-8 h-8'
}

const badgeIconSizeClasses = {
  xs: 'w-2 h-2',
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-4 h-4',
  xl: 'w-5 h-5'
}

const statusSizeClasses = {
  xs: 'w-2 h-2',
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-4 h-4',
  xl: 'w-5 h-5'
}

const badgeColorClasses = {
  orange: 'bg-gradient-to-br from-orange-400 to-red-500',
  green: 'bg-gradient-to-br from-green-400 to-green-500',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-500',
  purple: 'bg-gradient-to-br from-purple-400 to-pink-500',
  red: 'bg-gradient-to-br from-red-400 to-red-500'
}

const badgeIcons = {
  add: UserPlus,
  check: Check,
  remove: X,
  group: Users
}

const sizeClass = computed(() => sizeClasses[props.size] || sizeClasses.medium)
const shapeClass = computed(() => shapeClasses[props.shape] || shapeClasses.circle)
const badgeSizeClass = computed(() => badgeSizeClasses[props.size] || badgeSizeClasses.medium)
const badgeIconSizeClass = computed(() => badgeIconSizeClasses[props.size] || badgeIconSizeClasses.medium)
const statusSizeClass = computed(() => statusSizeClasses[props.size] || statusSizeClasses.medium)
const badgeColorClass = computed(() => badgeColorClasses[props.badgeColor] || badgeColorClasses.orange)

const borderClass = computed(() => {
  return props.border ? `ring-2 ring-offset-2 ${props.borderColor}` : ''
})

const badgeIcon = computed(() => {
  if (props.badgeType === 'custom' || props.badgeText) return null
  return badgeIcons[props.badgeType]
})

const handleError = () => {
  hasError.value = true
}
</script>

