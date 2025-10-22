<template>
  <div
    :class="[
      'rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg',
      bgGradient,
      customClass
    ]"
    @click="handleClick"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div :class="['rounded-full p-2', iconBg]">
          <component :is="icon" class="w-5 h-5 text-white" />
        </div>
        <span class="text-white text-sm opacity-90">{{ label }}</span>
      </div>
      <ChevronRight class="w-5 h-5 text-white opacity-75" />
    </div>

    <div class="flex items-end justify-between">
      <div>
        <div class="text-3xl font-bold text-white mb-1">
          {{ formatValue(value) }}
        </div>
        <div v-if="subValue" class="text-xs text-white opacity-75">
          {{ subLabel }}: {{ formatValue(subValue) }}
        </div>
      </div>
      
      <div v-if="showAction" class="flex flex-col gap-1">
        <button
          v-for="(action, index) in actions"
          :key="index"
          @click.stop="handleAction(action)"
          class="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs rounded-full transition-all backdrop-blur-sm"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  subLabel: {
    type: String,
    default: ''
  },
  subValue: {
    type: [Number, String],
    default: ''
  },
  icon: {
    type: Object,
    required: true
  },
  iconBg: {
    type: String,
    default: 'bg-white bg-opacity-20'
  },
  bgGradient: {
    type: String,
    default: 'bg-gradient-to-r from-orange-400 to-orange-600'
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actions: {
    type: Array,
    default: () => []
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click', 'action'])

const formatValue = (val) => {
  if (typeof val === 'number') {
    return val.toLocaleString()
  }
  return val
}

const handleClick = () => {
  emit('click')
}

const handleAction = (action) => {
  emit('action', action)
}
</script>

