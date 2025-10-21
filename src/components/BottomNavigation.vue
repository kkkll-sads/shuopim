<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-sm">
    <div class="grid grid-cols-5 h-16">
      <button 
        v-for="nav in navItems" 
        :key="nav.id"
        @click="handleNavClick(nav.id)"
        class="flex flex-col items-center justify-center gap-0.5 transition-colors"
        :class="activeNav === nav.id ? 'text-red-500' : 'text-gray-500'"
      >
        <component 
          :is="nav.icon" 
          class="w-5 h-5"
        />
        <span class="text-sm" :class="activeNav === nav.id ? 'font-medium' : ''">{{ nav.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { 
  MapPinned, 
  ShoppingBag, 
  Video, 
  MessageSquare, 
  User 
} from 'lucide-vue-next'

// Props
const props = defineProps({
  activeNav: {
    type: String,
    default: 'home'
  }
})

// Emits
const emit = defineEmits(['nav-click'])

// 导航项配置
const navItems = [
  { id: 'home', name: '生活圈', icon: MapPinned },
  { id: 'shop', name: '选品广场', icon: ShoppingBag },
  { id: 'live', name: '直播', icon: Video },
  { id: 'message', name: '消息', icon: MessageSquare },
  { id: 'profile', name: '我的', icon: User }
]

// 处理导航点击
const handleNavClick = (navId) => {
  emit('nav-click', navId)
}
</script>
