<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white px-4 py-3 flex items-center justify-between">
      <div class="w-8"></div>
      <h1 class="text-lg font-medium text-gray-800">我的</h1>
      <button @click="handleSettings" class="p-1">
        <Settings class="w-6 h-6 text-gray-700" />
      </button>
    </header>

    <!-- User Profile Section -->
    <div class="bg-white px-4 py-4 flex items-center gap-4">
      <!-- Avatar Image -->
      <img 
        :src="userAvatar" 
        alt="用户头像"
        class="w-20 h-20 rounded-full object-cover flex-shrink-0 bg-gray-200"
        @error="handleAvatarError"
      />
      
      <!-- User Info -->
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-lg font-medium text-gray-800">{{ maskedPhone }}</span>
          <button @click="handleLogout" class="text-sm text-gray-500">切换账号</button>
        </div>
        <div class="inline-flex items-center gap-1 bg-gradient-to-r from-orange-400 to-red-400 px-2 py-0.5 rounded-full">
          <Crown class="w-3 h-3 text-white" />
          <span class="text-xs text-white">冠购用户</span>
        </div>
      </div>
    </div>

    <!-- Balance Cards -->
    <div class="balance-cards-container px-1 py-4">
      <div class="grid grid-cols-3 gap-1">
        <!-- Tree Beans Card -->
        <div class="balance-card balance-card-beans">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-medium whitespace-nowrap">树豆</span>
            <button @click="viewDetail('beans')" class="text-xs opacity-80 flex items-center gap-0.5 whitespace-nowrap">
              <span>查看明细</span>
              <ChevronRight class="w-2.5 h-2.5" />
            </button>
          </div>
          <div class="text-2xl font-bold">{{ balances.beans }}</div>
        </div>

        <!-- Vouchers Card -->
        <div class="balance-card balance-card-vouchers">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-medium whitespace-nowrap">消费券</span>
            <button @click="viewDetail('vouchers')" class="text-xs opacity-80 flex items-center gap-0.5 whitespace-nowrap">
              <span>查看明细</span>
              <ChevronRight class="w-2.5 h-2.5" />
            </button>
          </div>
          <div class="text-2xl font-bold">{{ balances.vouchers }}</div>
        </div>

        <!-- Tree Rights Card -->
        <div class="balance-card balance-card-rights">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-medium whitespace-nowrap">树权</span>
            <button @click="viewDetail('rights')" class="text-xs opacity-80 flex items-center gap-0.5 whitespace-nowrap">
              <span>查看明细</span>
              <ChevronRight class="w-2.5 h-2.5" />
            </button>
          </div>
          <div class="text-2xl font-bold">{{ balances.rights }}</div>
        </div>
      </div>
    </div>

    <!-- My Orders Section -->
    <div class="mt-4 bg-white rounded-2xl mx-4 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-medium text-gray-800">我的订单</h2>
        <button @click="handleAllOrders" class="flex items-center gap-1 text-sm text-gray-500">
          全部订单
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Order Status Icons -->
      <div class="grid grid-cols-5 gap-4">
        <button 
          v-for="(status, index) in orderStatuses" 
          :key="status.label"
          @click="handleOrderStatus(orderStatusKeys[index])"
          class="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
        >
          <div class="relative">
            <component :is="status.icon" class="w-8 h-8 text-gray-800" :stroke-width="1.5" />
            <span v-if="orderCounts[orderStatusKeys[index]] > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ orderCounts[orderStatusKeys[index]] }}
            </span>
          </div>
          <span class="text-xs text-gray-600">{{ status.label }}</span>
        </button>
      </div>
    </div>

    <!-- Menu Grid -->
    <div class="mt-4 bg-white rounded-2xl mx-4 p-4">
      <div class="grid grid-cols-4 gap-6">
        <button 
          v-for="(item, index) in menuItems" 
          :key="item.label"
          @click="handleMenuClick(menuItemKeys[index])"
          class="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
        >
          <component :is="item.icon" class="w-10 h-10 text-orange-500" :stroke-width="1.5" />
          <span class="text-xs text-gray-700">{{ item.label }}</span>
        </button>
      </div>

      <!-- Settings (separate row) -->
      <div class="mt-6 pt-4 border-t border-gray-100">
        <button @click="handleSettings" class="flex flex-col items-center gap-2 hover:scale-105 transition-transform">
          <Settings class="w-10 h-10 text-orange-500" :stroke-width="1.5" />
          <span class="text-xs text-gray-700">设置</span>
        </button>
      </div>
    </div>

    <!-- ICP Filing Info -->
    <div class="mt-6 pb-4 flex items-center justify-center gap-1 text-xs text-gray-400">
      <Shield class="w-3 h-3" />
      <span>ICP备案信息:鲁ICP备2024090586号-5A</span>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation 
      :active-nav="activeTab" 
      @nav-click="handleTabClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { 
  Settings, 
  Crown, 
  ChevronRight, 
  Wallet, 
  Package, 
  Box, 
  FileEdit,
  RotateCcw,
  CreditCard,
  Calendar,
  Ticket,
  UserPlus,
  UserCheck,
  ThumbsUp,
  MapPin,
  Shield
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('profile')

// 用户信息
const userInfo = computed(() => userStore.userInfo)
const maskedPhone = computed(() => {
  const phone = userInfo.value?.phone || '170****2021'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

// 用户头像（可以从 userInfo 中获取，或使用默认头像）
const userAvatar = computed(() => {
  return userInfo.value?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
})

// 头像加载错误时的处理
const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://ui-avatars.com/api/?name=User&background=ef4444&color=fff&size=200'
}

// 余额信息
const balances = ref({
  beans: '0.0000',
  vouchers: '0.0000',
  rights: '0.0000'
})

// 订单状态
const orderStatuses = [
  { icon: Wallet, label: '待支付' },
  { icon: Package, label: '待发货' },
  { icon: Box, label: '待收货' },
  { icon: FileEdit, label: '待评价' },
  { icon: RotateCcw, label: '退款/售后' }
]

const orderStatusKeys = ['payment', 'shipment', 'receipt', 'review', 'refund']

// 订单数量统计
const orderCounts = ref<Record<string, number>>({
  payment: 0,
  shipment: 0,
  receipt: 0,
  review: 0,
  refund: 0
})

// 菜单项
const menuItems = [
  { icon: CreditCard, label: '我的数资' },
  { icon: Calendar, label: '线下订单' },
  { icon: CreditCard, label: '银行卡' },
  { icon: Ticket, label: '优惠券' },
  { icon: UserPlus, label: '选品官' },
  { icon: UserCheck, label: '商家登录' },
  { icon: ThumbsUp, label: '我的推荐' },
  { icon: MapPin, label: '我的地址' }
]

const menuItemKeys = ['assets', 'offline', 'card', 'coupons', 'selector', 'merchant', 'recommend', 'address']


// 处理退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.clearAuth()
    router.push('/login')
  }
}

// 查看余额明细
const viewDetail = (type: string) => {
  console.log('查看明细:', type)
  // TODO: 跳转到明细页面
}

// 查看全部订单
const handleAllOrders = () => {
  console.log('查看全部订单')
  // TODO: 跳转到订单列表页面
}

// 处理订单状态点击
const handleOrderStatus = (status: string) => {
  console.log('查看订单状态:', status)
  // TODO: 跳转到对应状态的订单列表
}

// 处理菜单点击
const handleMenuClick = (menu: string) => {
  console.log('菜单点击:', menu)
  // TODO: 跳转到对应功能页面
}

// 处理设置点击
const handleSettings = () => {
  console.log('打开设置')
  // TODO: 跳转到设置页面
}

// 处理底部导航点击
const handleTabClick = (tabId: string) => {
  activeTab.value = tabId
  
  switch (tabId) {
    case 'home':
      router.push('/home')
      break
    case 'shop':
      console.log('选品广场')
      // TODO: 跳转到选品广场
      break
    case 'live':
      console.log('直播')
      // TODO: 跳转到直播页面
      break
    case 'message':
      router.push('/im')
      break
    case 'profile':
      // 已在当前页面
      break
  }
}

// 页面加载时获取数据
onMounted(() => {
  // TODO: 获取用户余额
  // TODO: 获取订单数量统计
})
</script>

<style scoped>
.text-2xl {
  font-size: 1.5rem;
  line-height: 7rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.balance-cards-container {
  background: linear-gradient(135deg, #fb923c, #f97316, #ef4444, #dc2626);
  border-radius: 1rem;
  margin: 0 1rem;
}

.balance-card {
  border-radius: 0.75rem;
  padding: 0.5rem;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  min-height: 138px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 1 0px 8px rgba(0, 0, 0, 0.1);
}

.balance-card-beans {
  background: linear-gradient(135deg, #fb923c, #f97316);
}

.balance-card-vouchers {
  background: linear-gradient(135deg, #f97316, #ef4444);
}

.balance-card-rights {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
</style>
