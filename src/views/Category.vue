<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-white px-3 py-3 flex items-center gap-2 sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 flex-shrink-0">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <div class="flex-1 min-w-0 flex items-center bg-gray-100 rounded-full px-4 py-2.5">
        <Search class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="请输入商家名称"
          class="flex-1 min-w-0 bg-transparent outline-none text-sm"
        />
      </div>
      <button @click="handleSearch" class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all flex-shrink-0 whitespace-nowrap">
        搜索
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white px-4 py-3.5 flex items-center gap-8 border-b border-gray-100">
      <div class="relative">
        <button @click="showCategoryDropdown = !showCategoryDropdown" class="flex items-center gap-1 text-red-500 font-medium text-sm">
          {{ selectedCategory }}
          <ChevronDown class="w-4 h-4" />
        </button>
        
        <!-- Category Dropdown -->
        <div v-if="showCategoryDropdown" class="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[120px] z-20 border border-gray-100">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectCategory(cat)"
            class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-sm"
            :class="{ 'text-red-500 font-medium': selectedCategory === cat }"
          >
            {{ cat }}
          </button>
        </div>
      </div>
      
      <button
        @click="selectedFilter = 'gift'"
        class="text-sm transition-colors whitespace-nowrap"
        :class="selectedFilter === 'gift' ? 'text-red-500 font-medium' : 'text-gray-600'"
      >
        到店有礼
      </button>
      
      <button
        @click="selectedFilter = 'distance'"
        class="text-sm transition-colors whitespace-nowrap"
        :class="selectedFilter === 'distance' ? 'text-red-500 font-medium' : 'text-gray-600'"
      >
        距离优先
      </button>
    </div>

    <!-- Merchant List -->
    <div v-if="filteredMerchants.length > 0" class="p-3 space-y-3 pb-20 bg-gray-50">
      <div
        v-for="merchant in filteredMerchants"
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
              <div v-if="merchant.badge" class="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 py-0.5 rounded-tl-lg rounded-br-lg flex items-center gap-0.5 whitespace-nowrap shadow-sm text-xs">
                <Award class="w-2.5 h-2.5 flex-shrink-0" />
                <span>{{ merchant.badge }}</span>
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

              <!-- Location -->
              <div class="flex items-center justify-between">
                <div class="flex items-center text-xs text-gray-500 truncate mr-2">
                  <span class="truncate">{{ merchant.location }}</span>
                </div>
                <span class="flex items-center gap-0.5 text-xs text-gray-400 whitespace-nowrap">
                  <MapPin class="w-3 h-3" />
                  {{ merchant.distance }}
                </span>
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

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32">
      <div class="relative mb-6">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" class="opacity-40">
          <!-- Box -->
          <rect x="30" y="50" width="60" height="50" fill="#E5E7EB" rx="4" />
          <rect x="25" y="45" width="60" height="8" fill="#D1D5DB" rx="2" />
          <!-- Decorative dots -->
          <circle cx="105" cy="30" r="3" fill="#FCA5A5" />
          <circle cx="20" cy="85" r="2" fill="#D1D5DB" />
          <!-- Arrow decorations -->
          <path d="M 60 30 L 68 22 L 60 14" stroke="#FCA5A5" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <path d="M 85 60 L 93 68 L 101 60" stroke="#FCA5A5" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
      </div>
      <p class="text-gray-400 text-sm">暂无数据</p>
    </div>

    <!-- Click outside to close dropdown -->
    <div v-if="showCategoryDropdown" @click="showCategoryDropdown = false" class="fixed inset-0 z-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ChevronLeft, 
  Search, 
  ChevronDown, 
  Star, 
  MapPin, 
  TrendingUp, 
  Phone, 
  Navigation,
  Award
} from 'lucide-vue-next'

interface Merchant {
  id: number
  name: string
  category: string
  rating: number
  location: string
  distance: string
  commission: string
  badge: string
  image: string
}

const router = useRouter()
const route = useRoute()

const categories = ['全部', '美食', '休闲娱乐', '美容美发', '日用百货']
const selectedCategory = ref<string>('全部')
const selectedFilter = ref<string>('all')
const searchQuery = ref<string>('')
const showCategoryDropdown = ref<boolean>(false)

const merchants = ref<Merchant[]>([
  {
    id: 1,
    name: '琼海博鳌璋晨客栈旅店',
    category: '美食',
    rating: 5.0,
    location: '海南省琼海市博鳌镇玉带湾路...',
    distance: '908.37km',
    commission: '数据价值分配6%',
    badge: '优质商家',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: '海口龙华区卡野拉小百货店',
    category: '美食',
    rating: 5.0,
    location: '海南省海口市龙华区',
    distance: '918.52km',
    commission: '数据价值分配6%',
    badge: '优质商家',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: '美味餐厅',
    category: '美食',
    rating: 4.8,
    location: '北京市朝阳区',
    distance: '5.2km',
    commission: '数据价值分配8%',
    badge: '热门',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: '休闲咖啡馆',
    category: '休闲娱乐',
    rating: 4.9,
    location: '北京市海淀区',
    distance: '3.5km',
    commission: '数据价值分配12%',
    badge: '推荐',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: '时尚美发沙龙',
    category: '美容美发',
    rating: 4.7,
    location: '北京市东城区',
    distance: '2.8km',
    commission: '数据价值分配15%',
    badge: '新店',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop'
  },
  {
    id: 6,
    name: '便利超市',
    category: '日用百货',
    rating: 4.6,
    location: '北京市西城区',
    distance: '1.2km',
    commission: '数据价值分配5%',
    badge: '',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop'
  }
])

const filteredMerchants = computed(() => {
  let result = merchants.value

  if (selectedCategory.value !== '全部') {
    result = result.filter(m => m.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    result = result.filter(m => 
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedFilter.value === 'distance') {
    result = [...result].sort((a, b) => {
      const distA = parseFloat(a.distance)
      const distB = parseFloat(b.distance)
      return distA - distB
    })
  } else if (selectedFilter.value === 'gift') {
    result = result.filter(m => m.badge)
  }

  return result
})

const selectCategory = (category) => {
  selectedCategory.value = category
  showCategoryDropdown.value = false
}

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // 从路由参数获取分类
  const categoryName = route.query.name as string
  if (categoryName && categories.includes(categoryName)) {
    selectedCategory.value = categoryName
  } else if (categoryName) {
    // 如果传递了分类名称但不在列表中，设置为传递的名称
    selectedCategory.value = categoryName
  }
})
</script>

