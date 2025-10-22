<template>
  <div class="contact-search">
    <!-- 搜索框 -->
    <div class="search-input-container">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="tel"
          placeholder="请输入手机号搜索联系人"
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @keyup.enter="handleSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchResult" class="search-result mt-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center gap-3">
          <!-- 头像 -->
          <img
            :src="searchResult.avatar || defaultAvatar"
            :alt="searchResult.nickname"
            class="w-12 h-12 rounded-full object-cover"
            @error="handleAvatarError"
          />
          
          <!-- 用户信息 -->
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900">{{ searchResult.nickname }}</h3>
              <span v-if="searchResult.gender === 1" class="text-blue-500 text-sm">♂</span>
              <span v-else-if="searchResult.gender === 2" class="text-pink-500 text-sm">♀</span>
            </div>
            <p v-if="searchResult.motto" class="text-sm text-gray-600 mt-1">{{ searchResult.motto }}</p>
            <p class="text-sm text-gray-500">{{ searchResult.mobile }}</p>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex gap-2">
            <button
              v-if="!isFriend"
              @click="handleAddFriend"
              :disabled="adding"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ adding ? '添加中...' : '添加好友' }}
            </button>
            <button
              v-else
              class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm cursor-not-allowed"
            >
              已是好友
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索提示 -->
    <div v-else-if="hasSearched && !loading" class="search-tip mt-4">
      <div class="text-center text-gray-500 py-8">
        <UserSearch class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>未找到该用户</p>
        <p class="text-sm mt-1">请检查手机号是否正确</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading mt-4">
      <div class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-gray-600">搜索中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, X, UserSearch } from 'lucide-vue-next'
import { useFriendManagement } from '@/composables/useIM'
import { useToast } from '@/composables/useToast'

// Props
interface Props {
  onContactAdded?: (contact: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  onContactAdded: () => {}
})

// 组合式函数
const { searchContactByMobile, getContactInfo, addFriend } = useFriendManagement()
const { showToast } = useToast()

// 响应式数据
const searchQuery = ref('')
const searchResult = ref(null)
const loading = ref(false)
const adding = ref(false)
const hasSearched = ref(false)

// 计算属性
const isFriend = computed(() => {
  return searchResult.value?.relation === 1
})

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=ef4444&color=fff&size=200'

// 方法
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    showToast('请输入手机号')
    return
  }

  // 验证手机号格式
  const mobileRegex = /^1[3-9]\d{9}$/
  if (!mobileRegex.test(searchQuery.value)) {
    showToast('请输入正确的手机号')
    return
  }

  loading.value = true
  hasSearched.value = true
  searchResult.value = null

  try {
    const result = await searchContactByMobile(searchQuery.value)
    
    if (result.success) {
      searchResult.value = result.data
      
      // 如果是好友，获取详细信息
      if (result.data.relation === 1) {
        const detailResult = await getContactInfo(result.data.id)
        if (detailResult.success) {
          searchResult.value = { ...result.data, ...detailResult.data }
        }
      }
    } else {
      showToast(result.error || '搜索失败')
    }
  } catch (error) {
    console.error('搜索联系人失败:', error)
    showToast('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleAddFriend = async () => {
  if (!searchResult.value) return

  adding.value = true
  
  try {
    const result = await addFriend(searchResult.value)
    
    if (result.success) {
      showToast('添加好友成功')
      props.onContactAdded?.(searchResult.value)
    } else {
      showToast(result.error || '添加好友失败')
    }
  } catch (error) {
    console.error('添加好友失败:', error)
    showToast('添加好友失败，请重试')
  } finally {
    adding.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResult.value = null
  hasSearched.value = false
}

const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = defaultAvatar
}
</script>

<style scoped>
.contact-search {
  @apply p-4;
}

.search-input-container {
  @apply mb-4;
}

.search-result {
  @apply animate-fade-in;
}

.loading {
  @apply animate-pulse;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
