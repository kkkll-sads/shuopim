<template>
  <div
    :class="[
      'flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100',
      customClass
    ]"
    @click="handleClick"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Icon -->
      <div
        v-if="icon"
        :class="[
          'flex-shrink-0 rounded-lg flex items-center justify-center',
          iconBg,
          iconSize === 'small' ? 'w-8 h-8' : iconSize === 'large' ? 'w-12 h-12' : 'w-10 h-10'
        ]"
      >
        <component
          :is="icon"
          :class="[
            iconColor,
            iconSize === 'small' ? 'w-4 h-4' : iconSize === 'large' ? 'w-6 h-6' : 'w-5 h-5'
          ]"
        />
      </div>

      <!-- Title & Description -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 :class="['font-medium text-gray-800', titleSize]">
            {{ title }}
          </h3>
          <span
            v-if="badge"
            :class="[
              'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
              badgeClass
            ]"
          >
            {{ badge }}
          </span>
        </div>
        <p v-if="description" class="text-sm text-gray-500 mt-0.5 truncate">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Right Content -->
    <div v-if="$slots.right || value || showArrow" class="flex items-center gap-2 flex-shrink-0 ml-3">
      <slot name="right">
        <span v-if="value" class="text-sm text-gray-500">
          {{ value }}
        </span>
      </slot>
      <ChevronRight v-if="showArrow" class="w-5 h-5 text-gray-400" />
    </div>
  </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  iconColor: {
    type: String,
    default: 'text-white'
  },
  iconBg: {
    type: String,
    default: 'bg-gradient-to-br from-purple-400 to-pink-500'
  },
  iconSize: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  value: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  badgeClass: {
    type: String,
    default: 'bg-red-500 text-white'
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  titleSize: {
    type: String,
    default: 'text-base'
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

