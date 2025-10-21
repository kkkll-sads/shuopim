<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Hero Section with Search -->
    <div class="relative h-96 overflow-hidden">
      <img 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-39QvXzEvxZfF6qLNkHwsiuhYsmcH46.png" 
        alt="Hero Background" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 flex flex-col">
        <div class="w-full max-w-2xl mx-auto px-3 pt-2.5">
          <!-- Location and Search Bar -->
          <div class="flex items-center gap-2">
            <div class="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 flex-shrink-0">
              <MapPin class="w-4 h-4 text-white" />
              <span class="text-white text-sm">未知</span>
            </div>
            <div class="flex-1 bg-white/95 backdrop-blur-sm rounded-full shadow-md flex items-center overflow-hidden">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="请输入商家名称"
                class="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm px-4 py-2.5"
              />
              <button class="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all flex-shrink-0">
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Icons -->
    <div class="bg-white mx-3 -mt-24 relative z-10 rounded-2xl shadow-md p-5">
      <div class="grid grid-cols-5 gap-1">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="handleCategoryClick(category)"
          class="flex flex-col items-center gap-1.5 group py-2"
        >
          <div 
            class="w-11 h-11 rounded-full flex items-center justify-center transition-all"
            :class="selectedCategory === category.id ? 'bg-red-50' : 'bg-gray-50 group-hover:bg-red-50'"
          >
            <component 
              :is="category.icon" 
              :class="selectedCategory === category.id ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'"
              class="w-5 h-5 transition-colors"
            />
          </div>
          <span 
            class="text-xs transition-colors whitespace-nowrap text-center leading-tight"
            :class="selectedCategory === category.id ? 'text-gray-900 font-medium' : 'text-gray-600'"
          >
            {{ category.name }}
          </span>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-6 px-4 mt-6 mb-4 overflow-x-auto">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.id"
        @click="selectedTab = tab.id"
        class="relative pb-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
        :class="selectedTab === tab.id ? 'text-gray-900' : 'text-gray-500'"
      >
        {{ tab.name }}
        <div 
          v-if="selectedTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400 rounded-full"
        ></div>
      </button>
    </div>

    <!-- Merchant List -->
    <div class="px-4 space-y-3">
      <div 
        v-for="merchant in merchants" 
        :key="merchant.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-3">
          <div class="flex gap-3">
            <!-- Merchant Image -->
            <div class="relative flex-shrink-0">
              <img 
                :src="merchant.image" 
                :alt="merchant.name"
                class="w-20 h-20 rounded-lg object-cover"
              />
              <div class="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 py-0.5 rounded-tl-lg rounded-br-lg flex items-center gap-0.5 whitespace-nowrap shadow-sm text-xs">
                <Award class="w-2.5 h-2.5 flex-shrink-0" />
                <span>优质商家</span>
              </div>
            </div>

            <!-- Merchant Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-1.5 truncate">
                  {{ merchant.name }}
                </h3>
                
                <!-- Rating -->
                <div class="flex items-center gap-1 mb-1.5">
                  <Star 
                    v-for="i in 5" 
                    :key="i"
                    class="w-3.5 h-3.5 fill-orange-400 text-orange-400"
                  />
                  <span class="text-orange-500 font-semibold text-sm ml-0.5">{{ merchant.rating }}</span>
                </div>
              </div>

              <!-- Location and Extra Info -->
              <div class="space-y-1">
                <div class="flex items-center text-xs text-gray-500 truncate">
                  <span class="truncate">{{ merchant.location }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div v-if="merchant.hasGift" class="flex items-center gap-1 text-xs">
                    <div class="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <span class="text-white text-xs">礼</span>
                    </div>
                    <span class="text-gray-600">到店付款有赠品</span>
                  </div>
                  <span class="flex items-center gap-0.5 text-xs text-gray-400 whitespace-nowrap ml-auto">
                    <MapPin class="w-3 h-3" />
                    {{ merchant.distance }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-7 gap-2 mt-3">
            <button class="col-span-3 flex items-center justify-center gap-1 py-2 px-2 bg-gray-50 text-gray-700 rounded-lg text-xs hover:bg-gray-100 transition-colors whitespace-nowrap">
              <TrendingUp class="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
              <span>{{ merchant.commission }}</span>
            </button>
            <button class="col-span-2 flex items-center justify-center gap-1 py-2 px-2 bg-gray-50 text-gray-700 rounded-lg text-xs hover:bg-gray-100 transition-colors whitespace-nowrap">
              <Phone class="w-3.5 h-3.5 text-orange-500" />
              <span>打电话</span>
            </button>
            <button class="col-span-2 flex items-center justify-center gap-1 py-2 px-2 bg-gray-50 text-gray-700 rounded-lg text-xs hover:bg-gray-100 transition-colors whitespace-nowrap">
              <Navigation class="w-3.5 h-3.5 text-orange-500" />
              <span>去这里</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-sm">
      <div class="grid grid-cols-5 h-16">
        <button 
          v-for="nav in bottomNav" 
          :key="nav.id"
          @click="handleNavClick(nav.id)"
          class="flex flex-col items-center justify-center gap-0.5 transition-colors"
          :class="activeNav === nav.id ? 'text-red-500' : 'text-gray-500'"
        >
          <component 
            :is="nav.icon" 
            class="w-5 h-5"
          />
          <span class="text-xs" :class="activeNav === nav.id ? 'font-medium' : ''">{{ nav.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Users, 
  Coffee, 
  Smartphone, 
  Sparkles, 
  ShoppingBag,
  Award,
  Star,
  MapPin,
  TrendingUp,
  Phone,
  Navigation,
  MapPinned,
  Video,
  MessageSquare,
  User
} from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedTab = ref('gifts')
const activeNav = ref('home')

const categories = [
  { id: 'all', name: '全部', icon: Users },
  { id: 'food', name: '美食', icon: Coffee },
  { id: 'entertainment', name: '休闲娱乐', icon: Smartphone },
  { id: 'beauty', name: '美容美发', icon: Sparkles },
  { id: 'daily', name: '日用百货', icon: ShoppingBag }
]

const filterTabs = [
  { id: 'all', name: '全部分类' },
  { id: 'gifts', name: '到店有礼' },
  { id: 'distance', name: '距离优先' }
]

const merchants = [
  {
    id: 1,
    name: '琼海博鳌璋晨客栈旅店',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    rating: 5.0,
    location: '海南省琼海市博鳌镇玉带湾路...',
    distance: '908.37km',
    commission: '数据价值分配6%',
    hasGift: true
  },
  {
    id: 2,
    name: '海口龙华区卡野拉小百货店',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop',
    rating: 5.0,
    location: '海南省海口市龙华区',
    distance: '918.52km',
    commission: '数据价值分配6%',
    hasGift: false
  }
]

const bottomNav = [
  { id: 'home', name: '生活圈', icon: MapPinned },
  { id: 'shop', name: '选品广场', icon: ShoppingBag },
  { id: 'live', name: '直播', icon: Video },
  { id: 'message', name: '消息', icon: MessageSquare },
  { id: 'profile', name: '我的', icon: User }
]

const handleCategoryClick = (category) => {
  if (category.id === 'all') {
    selectedCategory.value = category.id
  } else {
    // 跳转到分类页面
    router.push({
      path: '/category',
      query: { type: category.id, name: category.name }
    })
  }
}

const handleNavClick = (navId) => {
  activeNav.value = navId
  
  switch (navId) {
    case 'home':
      // 已在当前页面
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
      router.push('/profile')
      break
  }
}
</script>