<template>
  <div
    :class="[
      'bg-white rounded-xl p-4 shadow-sm transition-all',
      clickable ? 'cursor-pointer hover:shadow-md' : '',
      customClass
    ]"
    @click="handleClick"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <component
          v-if="icon"
          :is="icon"
          :class="['flex-shrink-0', iconColor, iconSize]"
        />
        <span class="text-gray-800 font-medium truncate">{{ title }}</span>
      </div>
      
      <div class="flex items-center gap-2 flex-shrink-0">
        <span
          :class="[
            'font-semibold text-lg',
            amountColor
          ]"
        >
          {{ formatAmount(amount, type) }}
        </span>
        
        <span
          v-if="status"
          :class="[
            'text-xs px-2 py-1 rounded-full whitespace-nowrap',
            statusClass
          ]"
        >
          {{ statusText }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-500">
      <span class="truncate">{{ description }}</span>
      <span class="flex-shrink-0 ml-2">{{ date }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    default: 'expense',
    validator: (value) => ['income', 'expense'].includes(value)
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: '',
    validator: (value) => ['', 'pending', 'success', 'failed', 'cancelled'].includes(value)
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
  clickable: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const amountColor = computed(() => {
  if (props.type === 'income') {
    return 'text-green-500'
  }
  return 'text-gray-800'
})

const statusClass = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    success: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700'
  }
  return classes[props.status] || 'bg-gray-100 text-gray-700'
})

const statusText = computed(() => {
  const texts = {
    pending: '处理中',
    success: '成功',
    failed: '失败',
    cancelled: '已取消'
  }
  return texts[props.status] || props.status
})

const formatAmount = (amount, type) => {
  const prefix = type === 'income' ? '+' : '-'
  if (typeof amount === 'number') {
    return `${prefix}${amount.toLocaleString()}`
  }
  return `${prefix}${amount}`
}

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

