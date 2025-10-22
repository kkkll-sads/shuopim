<template>
  <div class="flex items-center justify-center py-20 empty-state">
    <div class="text-center">
      <div class="relative w-32 h-32 mx-auto mb-6">
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            :class="[
              'rounded-full p-6',
              bgGradient
            ]"
          >
            <component
              :is="iconComponent"
              :class="[
                iconColor,
                size === 'small' ? 'w-16 h-16' : size === 'large' ? 'w-24 h-24' : 'w-20 h-20'
              ]"
            />
          </div>
        </div>
        <div v-if="showDecorations" class="decoration decoration-1">{{ decorations[0] }}</div>
        <div v-if="showDecorations" class="decoration decoration-2">{{ decorations[1] }}</div>
        <div v-if="showDecorations" class="decoration decoration-3">{{ decorations[2] }}</div>
      </div>
      <p :class="['text-gray-400 mb-2', size === 'small' ? 'text-sm' : 'text-base']">
        {{ title }}
      </p>
      <p :class="['text-gray-400', size === 'small' ? 'text-xs' : 'text-sm']">
        {{ description }}
      </p>
      
      <!-- Action Button -->
      <button
        v-if="showAction"
        @click="handleAction"
        :class="[
          'mt-6 px-6 py-2 rounded-full font-medium transition-all hover:shadow-lg active:scale-95',
          actionClass
        ]"
      >
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Search,
  Users,
  MessageSquare,
  UserX,
  Inbox,
  FileText,
  Package,
  UserPlus
} from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: String,
    default: 'search',
    validator: (value) => ['search', 'users', 'message', 'userX', 'inbox', 'file', 'package', 'userPlus'].includes(value)
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: '暂时没有内容～'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  theme: {
    type: String,
    default: 'gray',
    validator: (value) => ['gray', 'orange', 'purple', 'blue', 'teal', 'red'].includes(value)
  },
  showDecorations: {
    type: Boolean,
    default: true
  },
  decorations: {
    type: Array,
    default: () => ['?', '✦', '○']
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: '操作'
  },
  actionClass: {
    type: String,
    default: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600'
  }
})

const emit = defineEmits(['action'])

const iconMap = {
  search: Search,
  users: Users,
  message: MessageSquare,
  userX: UserX,
  inbox: Inbox,
  file: FileText,
  package: Package,
  userPlus: UserPlus
}

const themeConfig = {
  gray: {
    bgGradient: 'bg-gradient-to-br from-gray-100 to-slate-100',
    iconColor: 'text-gray-400'
  },
  orange: {
    bgGradient: 'bg-gradient-to-br from-orange-100 to-red-100',
    iconColor: 'text-orange-400'
  },
  purple: {
    bgGradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    iconColor: 'text-purple-400'
  },
  blue: {
    bgGradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    iconColor: 'text-blue-400'
  },
  teal: {
    bgGradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    iconColor: 'text-teal-400'
  },
  red: {
    bgGradient: 'bg-gradient-to-br from-red-100 to-pink-100',
    iconColor: 'text-red-400'
  }
}

const iconComponent = computed(() => iconMap[props.icon] || Search)

const bgGradient = computed(() => themeConfig[props.theme]?.bgGradient || themeConfig.gray.bgGradient)

const iconColor = computed(() => themeConfig[props.theme]?.iconColor || themeConfig.gray.iconColor)

const handleAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-state {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.decoration {
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  animation: float 3s ease-in-out infinite;
}

.decoration-1 {
  top: 0.5rem;
  right: 2rem;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 2rem;
  right: 0.5rem;
  animation-delay: 0.5s;
}

.decoration-3 {
  bottom: 0.5rem;
  left: 2rem;
  color: #d1d5db;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>

