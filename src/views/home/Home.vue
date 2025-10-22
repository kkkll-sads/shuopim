<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Hero Section with Search -->
    <div class="relative h-80 overflow-hidden">
      <img 
        src="/3b1cd3c27d4727efd8faa453a55326bc.png" 
        alt="Hero Background" 
        class="w-full h-full object-contain object-top bg-gradient-to-b from-green-50 to-teal-50"
      />
      <div class="absolute inset-0 flex flex-col">
        <div class="w-full max-w-2xl mx-auto px-3 pt-8">
          <!-- Location and Search Bar -->
          <div class="flex items-center gap-2">
            <div class="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 flex-shrink-0">
              <MapPin class="w-5 h-5 text-white" />
              <span class="text-white text-base">未知</span>
            </div>
            <div class="flex-1 bg-white/95 backdrop-blur-sm rounded-full shadow-md flex items-center overflow-hidden">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="请输入商家名称"
                class="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base px-4 py-2.5"
              />
              <button class="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 text-base font-medium hover:from-red-600 hover:to-red-700 transition-all flex-shrink-0 search-btn">
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Icons -->
    <div class="bg-white mx-3 rounded-2xl shadow-md p-5 category-card">
      <div class="flex gap-4 overflow-x-auto scrollbar-hide">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="handleCategoryClick(category)"
          class="flex flex-col items-center gap-1.5 group py-2 flex-shrink-0"
        >
          <div 
            class="w-12 h-12 flex items-center justify-center transition-all overflow-hidden"
          >
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-10 h-10 object-contain"
            />
          </div>
          <span 
            class="text-sm text-gray-700 whitespace-nowrap text-center leading-tight font-medium"
          >
            {{ category.name }}
          </span>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-6 px-4 mt-2 mb-4 overflow-x-auto">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.id"
        @click="selectedTab = tab.id"
        class="relative pb-2 text-base font-medium transition-colors whitespace-nowrap flex-shrink-0"
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
                <h3 class="text-base font-semibold text-gray-900 mb-1.5 truncate">
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
            <button class="col-span-3 flex items-center justify-center gap-1 py-2 px-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
              <TrendingUp class="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{{ merchant.commission }}</span>
            </button>
            <button class="col-span-2 flex items-center justify-center gap-1 py-2 px-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
              <Phone class="w-4 h-4 text-orange-500" />
              <span>打电话</span>
            </button>
            <button class="col-span-2 flex items-center justify-center gap-1 py-2 px-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
              <Navigation class="w-4 h-4 text-orange-500" />
              <span>去这里</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation 
      :active-nav="activeNav" 
      @nav-click="handleNavClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
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
  Navigation
} from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref(0)
const selectedTab = ref('all')
const activeNav = ref('home')

const categories = [
  { id: 0, name: '全部', icon: Users, image: 'https://file.sdskpm.net/spyg/icon/classfy_all.png' },
  { id: 1, name: '美食', icon: Coffee, image: 'https://file.sdskpm.net/uploads/20250415/40f0f3c414facbbea23b74c8658af866.png' },
  { id: 2, name: '休闲娱乐', icon: Smartphone, image: 'https://file.sdskpm.net/uploads/20250415/2984d2ea5625975db7dc808a5b3ba512.png' },
  { id: 3, name: '美容美发', icon: Sparkles, image: 'https://file.sdskpm.net/uploads/20250415/eda1f47a94b34f03c5b8dd6658069626.png' },
  { id: 4, name: '日用百货', icon: ShoppingBag, image: 'https://file.sdskpm.net/uploads/20250415/9b6fcca0889b021c091a8f3ba3a26545.png' },
  { id: 5, name: '健康保健', icon: Users, image: 'https://file.sdskpm.net/uploads/20250415/e5d8edc808d3176880a32622370763ed.png' },
  { id: 6, name: '汽车服务', icon: Users, image: 'https://file.sdskpm.net/uploads/20250415/8863bc7a0a7dabbdea5d9cf03cc4895c.png' },
  { id: 7, name: '茶叶茶行', icon: Coffee, image: 'https://file.sdskpm.net/uploads/20250415/0e87d323ae781026f2007f35dab01a5d.png' },
  { id: 8, name: '超市购物', icon: ShoppingBag, image: 'https://file.sdskpm.net/uploads/20250415/a314a5069104ef48172693380695d502.png' },
  { id: 9, name: '摄影广告', icon: Sparkles, image: 'https://file.sdskpm.net/uploads/20250415/aa97d72dea7f3eb17a211939af4b79a8.png' },
  { id: 10, name: '其他', icon: Smartphone, image: 'https://file.sdskpm.net/uploads/20250415/ce3201162784809a357e29223632ee7a.png' }
]

const filterTabs = [
  { id: 'all', name: '全部分类' },
  { id: 'gifts', name: '到店有礼' },
  { id: 'distance', name: '距离优先' }
]

const merchants = [
  {
    id: 1,
    name: '贺州市禾云广告策划有限公司',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    rating: 5.0,
    location: '广西壮族自治区贺州市八步区...',
    distance: '7.27km',
    commission: '数据价值分配6%',
    hasGift: true
  },
  {
    id: 2,
    name: '敏新电子商务中心',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop',
    rating: 5.0,
    location: '广西壮族自治区贺州市平桂区...',
    distance: '9.55km',
    commission: '数据价值分配6%',
    hasGift: false
  }
]


const handleCategoryClick = (category) => {
  // 无论点击哪个分类，都跳转到分类页面
  router.push({
    path: '/category',
    query: { type: category.id, name: category.name }
  })
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

<style scoped>
.category-card {
  margin-top: -4rem;
  position: relative;
  z-index: 10;
}

.search-btn {
  margin-left: -1rem;
  transform: translateX(-0.5rem);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.gap-4 {
  gap: 0.5rem;
}
</style>