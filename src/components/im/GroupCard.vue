<template>
  <div
    class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group-card"
    :class="{ 'ring-2 ring-purple-400': selected }"
    @click="handleClick"
  >
    <div class="flex items-center gap-3">
      <!-- Group Avatar -->
      <div class="relative flex-shrink-0">
        <img
          :src="group.avatar || '/placeholder.svg?height=48&width=48'"
          :alt="group.name"
          :class="[
            'rounded-xl object-cover',
            size === 'small' ? 'w-10 h-10' : size === 'large' ? 'w-14 h-14' : 'w-12 h-12'
          ]"
        />
        
        <!-- Badge -->
        <div
          v-if="showBadge"
          :class="[
            'absolute -bottom-1 -right-1 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center border-2 border-white',
            size === 'small' ? 'w-5 h-5' : 'w-6 h-6'
          ]"
        >
          <Users :class="size === 'small' ? 'w-3 h-3' : 'w-4 h-4'" class="text-white" />
        </div>
      </div>

      <!-- Group Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3
            :class="[
              'font-semibold text-gray-900 truncate',
              size === 'small' ? 'text-sm' : 'text-base'
            ]"
          >
            {{ group.name }}
          </h3>
          <span
            v-if="isFull"
            class="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 flex-shrink-0"
          >
            已满
          </span>
        </div>
        <div
          :class="[
            'text-gray-500 flex items-center gap-2',
            size === 'small' ? 'text-xs' : 'text-sm'
          ]"
        >
          <!-- Group ID -->
          <span v-if="showGroupId" class="truncate">
            群号: {{ group.groupId }}
          </span>
          
          <!-- Member Count -->
          <span v-if="showMemberCount" class="flex items-center gap-1 flex-shrink-0">
            <Users class="w-3 h-3" />
            {{ group.memberCount || 0 }}{{ group.maxMembers ? `/${group.maxMembers}` : '' }}
          </span>
        </div>
      </div>

      <!-- Action Slot -->
      <div v-if="$slots.action" class="flex-shrink-0">
        <slot name="action"></slot>
      </div>

      <!-- Default Action Button -->
      <div v-else-if="showDefaultAction" class="flex-shrink-0">
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  group: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  selected: {
    type: Boolean,
    default: false
  },
  showBadge: {
    type: Boolean,
    default: true
  },
  showGroupId: {
    type: Boolean,
    default: false
  },
  showMemberCount: {
    type: Boolean,
    default: true
  },
  showDefaultAction: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const isFull = computed(() => {
  if (!props.group.maxMembers) return false
  return props.group.memberCount >= props.group.maxMembers
})

const handleClick = () => {
  emit('click', props.group)
}
</script>

<style scoped>
.group-card {
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

