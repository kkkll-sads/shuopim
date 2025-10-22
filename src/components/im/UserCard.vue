<template>
  <div
    class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer user-card"
    :class="{ 'ring-2': selected, [ringColor]: selected }"
    @click="handleClick"
  >
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <img
          :src="user.avatar || '/placeholder.svg?height=48&width=48'"
          :alt="user.name"
          :class="[
            'rounded-full object-cover',
            size === 'small' ? 'w-10 h-10' : size === 'large' ? 'w-14 h-14' : 'w-12 h-12'
          ]"
        />
        
        <!-- Badge/Icon -->
        <div
          v-if="showBadge"
          :class="[
            'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center border-2 border-white',
            size === 'small' ? 'w-5 h-5' : 'w-6 h-6',
            badgeClass
          ]"
        >
          <component :is="badgeIcon" :class="size === 'small' ? 'w-3 h-3' : 'w-4 h-4'" class="text-white" />
        </div>

        <!-- Status Indicator -->
        <div
          v-if="showStatus"
          :class="[
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            size === 'small' ? 'w-3 h-3' : 'w-4 h-4',
            user.online ? 'bg-green-500' : 'bg-gray-400'
          ]"
        ></div>
      </div>

      <!-- User Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3
            :class="[
              'font-semibold text-gray-900 truncate',
              size === 'small' ? 'text-sm' : 'text-base'
            ]"
          >
            {{ user.name }}
          </h3>
          <span
            v-if="user.badge"
            class="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex-shrink-0"
          >
            {{ user.badge }}
          </span>
        </div>
        <p
          :class="[
            'text-gray-500 truncate flex items-center gap-1',
            size === 'small' ? 'text-xs' : 'text-sm'
          ]"
        >
          <span v-if="showIdPrefix" class="text-xs">🆔</span>
          {{ user.nickname || user.id }}
        </p>
      </div>

      <!-- Action Slot -->
      <div v-if="$slots.action" class="flex-shrink-0">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { UserPlus, Check, X, MessageCircle } from 'lucide-vue-next'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  selected: {
    type: Boolean,
    default: false
  },
  showBadge: {
    type: Boolean,
    default: false
  },
  badgeType: {
    type: String,
    default: 'add', // 'add', 'check', 'message', 'remove'
    validator: (value) => ['add', 'check', 'message', 'remove'].includes(value)
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  showIdPrefix: {
    type: Boolean,
    default: true
  },
  ringColor: {
    type: String,
    default: 'ring-purple-400'
  }
})

const emit = defineEmits(['click'])

const badgeIcon = computed(() => {
  const icons = {
    add: UserPlus,
    check: Check,
    message: MessageCircle,
    remove: X
  }
  return icons[props.badgeType] || UserPlus
})

const badgeClass = computed(() => {
  const classes = {
    add: 'bg-gradient-to-br from-orange-400 to-red-500',
    check: 'bg-gradient-to-br from-green-400 to-green-500',
    message: 'bg-gradient-to-br from-blue-400 to-blue-500',
    remove: 'bg-gradient-to-br from-red-400 to-red-500'
  }
  return classes[props.badgeType] || classes.add
})

const handleClick = () => {
  emit('click', props.user)
}
</script>

<style scoped>
.user-card {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

