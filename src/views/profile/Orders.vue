<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white sticky top-0 z-10">
      <div class="flex items-center gap-3 p-4">
        <button @click="goBack" class="text-gray-700">
          <ChevronLeft :size="24" />
        </button>
        <div class="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search :size="18" class="text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索订单"
            class="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <!-- Order Status Tabs -->
      <div class="flex items-center border-t border-gray-100">
        <button
          v-for="status in orderStatuses"
          :key="status.value"
          @click="selectedStatus = status.value"
          :class="[
            'flex-1 py-3 text-sm transition-colors',
            selectedStatus === status.value
              ? 'text-gray-900 font-semibold border-b-2 border-red-500'
              : 'text-gray-500'
          ]"
        >
          {{ status.label }}
        </button>
      </div>
    </div>

    <!-- Order List -->
    <div class="p-3 pb-20">
      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-32">
        <div class="w-32 h-32 mb-6">
          <svg viewBox="0 0 200 200" class="w-full h-full opacity-40">
            <rect x="60" y="80" width="80" height="80" fill="#E5E7EB" rx="4" />
            <rect x="50" y="70" width="80" height="10" fill="#D1D5DB" rx="2" />
            <rect x="70" y="60" width="60" height="10" fill="#9CA3AF" rx="2" />
            <circle cx="180" cy="50" r="4" fill="#FCA5A5" />
            <path d="M 165 65 L 175 75" stroke="#FCA5A5" stroke-width="3" stroke-linecap="round" />
            <circle cx="30" cy="140" r="3" fill="#D1D5DB" />
            <circle cx="170" cy="160" r="3" fill="#D1D5DB" />
          </svg>
        </div>
        <p class="text-gray-400 text-sm">暂无订单</p>
      </div>

      <!-- Order Cards -->
      <div v-else class="space-y-3">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-xl overflow-hidden shadow-sm"
        >
          <!-- Merchant Info -->
          <div class="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <Store :size="16" class="text-gray-600" />
              <span class="text-sm font-medium text-gray-900">{{ order.merchantName }}</span>
            </div>
            <span class="text-xs font-medium text-red-500">{{ getStatusLabel(order.status) }}</span>
          </div>

          <!-- Order Items -->
          <div class="p-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex gap-3 mb-3 last:mb-0"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-20 h-20 rounded-lg object-cover bg-gray-100"
              />
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium mb-1 line-clamp-1">{{ item.name }}</h4>
                <p class="text-xs text-gray-500 mb-2">{{ item.specs }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-red-500 font-semibold">¥{{ item.price }}</span>
                  <span class="text-xs text-gray-500">×{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-t border-gray-100">
            <div class="text-sm">
              <span class="text-gray-600">共{{ order.totalItems }}件 合计: </span>
              <span class="text-red-500 font-semibold text-base">¥{{ order.totalAmount }}</span>
            </div>
            <div class="flex gap-2">
              <button
                v-if="order.status === 'pending_payment'"
                @click="handleCancelOrder(order)"
                class="px-4 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
              >
                取消订单
              </button>
              <button
                v-if="order.status === 'pending_payment'"
                @click="handlePayment(order)"
                class="px-4 py-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
              >
                去支付
              </button>
              <button
                v-if="order.status === 'pending_shipment'"
                @click="handleRemindShip(order)"
                class="px-4 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
              >
                提醒发货
              </button>
              <button
                v-if="order.status === 'pending_receipt'"
                @click="handleConfirmReceipt(order)"
                class="px-4 py-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
              >
                确认收货
              </button>
              <button
                v-if="order.status === 'pending_review'"
                @click="handleReview(order)"
                class="px-4 py-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
              >
                去评价
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Search, Store } from 'lucide-vue-next'

interface OrderItem {
  id: number
  name: string
  specs: string
  price: string
  quantity: number
  image: string
}

interface Order {
  id: number
  merchantName: string
  status: string
  totalItems: number
  totalAmount: string
  items: OrderItem[]
}

const router = useRouter()
const route = useRoute()

const searchQuery = ref<string>('')
const selectedStatus = ref<string>('all')

const orderStatuses = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending_payment' },
  { label: '待发货', value: 'pending_shipment' },
  { label: '待收货', value: 'pending_receipt' },
  { label: '待评价', value: 'pending_review' }
]

const orders = ref<Order[]>([
  {
    id: 1,
    merchantName: '琼海博鳌璋晨客栈旅店',
    status: 'pending_payment',
    totalItems: 2,
    totalAmount: '158.00',
    items: [
      {
        id: 1,
        name: '新鲜水果礼盒装',
        specs: '规格: 5斤装',
        price: '88.00',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop'
      },
      {
        id: 2,
        name: '有机蔬菜组合',
        specs: '规格: 3斤装',
        price: '70.00',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 2,
    merchantName: '美食天堂餐厅',
    status: 'pending_shipment',
    totalItems: 1,
    totalAmount: '128.00',
    items: [
      {
        id: 3,
        name: '招牌烤鸭套餐',
        specs: '规格: 双人份',
        price: '128.00',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 3,
    merchantName: '时尚美发沙龙',
    status: 'pending_receipt',
    totalItems: 1,
    totalAmount: '288.00',
    items: [
      {
        id: 4,
        name: '染发护理套餐',
        specs: '服务: 染发+护理',
        price: '288.00',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 4,
    merchantName: '品质生活超市',
    status: 'pending_review',
    totalItems: 3,
    totalAmount: '256.00',
    items: [
      {
        id: 5,
        name: '进口牛奶',
        specs: '规格: 1L*12盒',
        price: '98.00',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'
      },
      {
        id: 6,
        name: '有机鸡蛋',
        specs: '规格: 30枚装',
        price: '60.00',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop'
      }
    ]
  }
])

const filteredOrders = computed(() => {
  let result = orders.value

  if (selectedStatus.value !== 'all') {
    result = result.filter(order => order.status === selectedStatus.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order =>
      order.merchantName.toLowerCase().includes(query) ||
      order.items.some(item => item.name.toLowerCase().includes(query))
    )
  }

  return result
})

const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending_payment: '待支付',
    pending_shipment: '待发货',
    pending_receipt: '待收货',
    pending_review: '待评价'
  }
  return statusMap[status] || status
}

const goBack = () => {
  router.back()
}

const handleCancelOrder = (order: Order) => {
  console.log('取消订单:', order.id)
  // TODO: 实现取消订单逻辑
}

const handlePayment = (order: Order) => {
  console.log('去支付:', order.id)
  // TODO: 跳转到支付页面
}

const handleRemindShip = (order: Order) => {
  console.log('提醒发货:', order.id)
  // TODO: 实现提醒发货逻辑
}

const handleConfirmReceipt = (order: Order) => {
  console.log('确认收货:', order.id)
  // TODO: 实现确认收货逻辑
}

const handleReview = (order: Order) => {
  console.log('去评价:', order.id)
  // TODO: 跳转到评价页面
}

onMounted(() => {
  // 从 URL 参数获取订单状态
  const status = route.query.status as string
  if (status && orderStatuses.some(s => s.value === status)) {
    selectedStatus.value = status
  }
})
</script>

