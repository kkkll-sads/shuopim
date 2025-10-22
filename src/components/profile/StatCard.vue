<template>
  <div
    :class="[
      'bg-white rounded-xl p-4 cursor-pointer transition-all',
      clickable ? 'hover:shadow-md' : '',
      customClass
    ]"
    @click="handleClick"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <component
            v-if="icon"
            :is="icon"
            :class="['flex-shrink-0', iconColor, iconSize]"
          />
          <span :class="['text-gray-600', labelSize]">
            {{ label }}
          </span>
        </div>
        
        <div class="flex items-end gap-2">
          <span :class="['font-bold', valueColor, valueSize]">
            {{ formatValue(value) }}
          </span>
          <span v-if="unit" :class="['text-gray-500 mb-0.5', unitSize]">
            {{ unit }}
          </span>
        </div>

        <div v-if="trend" class="flex items-center gap-1 mt-2">
          <component
            :is="trendIcon"
            :class="['w-4 h-4', trendColor]"
          />
          <span :class="['text-xs', trendColor]">
            {{ trendText }}
          </span>
        </div>
      </div>

      <ChevronRight v-if="showArrow" class="w-5 h-5 text-gray-400 ml-3" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  iconColor: {
    type: String,
    default: 'text-purple-500'
  },
  iconSize: {
    type: String,
    default: 'w-5 h-5'
  },
  valueColor: {
    type: String,
    default: 'text-gray-800'
  },
  trend: {
    type: String,
    default: '',
    validator: (value) => ['', 'up', 'down'].includes(value)
  },
  trendText: {
    type: String,
    default: ''
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const labelSize = computed(() => {
  const sizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }
  return sizes[props.size]
})

const valueSize = computed(() => {
  const sizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  }
  return sizes[props.size]
})

const unitSize = computed(() => {
  const sizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }
  return sizes[props.size]
})

const trendIcon = computed(() => {
  return props.trend === 'up' ? TrendingUp : TrendingDown
})

const trendColor = computed(() => {
  return props.trend === 'up' ? 'text-green-500' : 'text-red-500'
})

const formatValue = (val) => {
  if (typeof val === 'number') {
    return val.toLocaleString()
  }
  return val
}

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

