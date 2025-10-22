<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button 
        @click="handleGoBack" 
        class="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        style="z-index: 1000; position: relative;"
      >
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">
        {{ mode === 'search' ? '找群' : '我的群聊' }}
      </h1>
      <div class="flex items-center gap-2">
        <button v-if="mode === 'search'" @click="handleRefresh" :disabled="loading" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <RotateCw :class="['w-5 h-5 text-gray-700', { 'animate-spin': loading }]" />
        </button>
        <button v-if="mode === 'my'" @click="goToCreateGroup" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <Plus class="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>

    <!-- Search Bar (only for search mode) -->
    <div v-if="mode === 'search'" class="bg-white px-4 py-3 border-b border-gray-100">
      <FormInput
        v-model="searchQuery"
        type="text"
        placeholder="搜索群名称或群号"
        :prefix-icon="Search"
        container-class="mb-0"
        input-class="bg-gray-100 rounded-lg px-3 py-2 text-sm"
        @keyup.enter="handleSearch"
        @input="handleSearchInput"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p class="text-gray-500">加载中...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="text-red-500 mb-2">⚠️</div>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button @click="handleRefresh" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
          重试
        </button>
      </div>
    </div>

    <!-- Group List -->
    <div v-else class="flex-1">
      <div v-if="filteredGroups.length > 0" class="p-4 space-y-3">
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all group-item"
        >
          <div class="flex items-center gap-3">
            <!-- Group Avatar -->
            <div class="relative flex-shrink-0">
              <img
                :src="group.avatar || '/default-group-avatar.png'"
                :alt="group.name"
                class="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-blue-200"
              />
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Users class="w-3 h-3 text-white" />
              </div>
            </div>
            
            <!-- Group Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 truncate text-base">{{ group.name }}</h3>
                <span v-if="group.isFull" class="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">
                  已满
                </span>
                <span v-else-if="group.isJoined" class="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded font-medium">
                  已加入
                </span>
              </div>
              <p class="text-sm text-gray-500 truncate mb-1">{{ group.description }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-400">
                <span>群号: {{ group.groupId }}</span>
                <span>{{ group.memberCount }}/{{ group.maxMembers }} 人</span>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex-shrink-0">
              <button
                v-if="mode === 'search'"
                @click="handleJoinGroup(group)"
                :disabled="group.isJoined || group.isFull || joiningGroups.has(group.id)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
                  group.isJoined
                    ? 'bg-green-100 text-green-600 cursor-not-allowed'
                    : group.isFull
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : joiningGroups.has(group.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 shadow-sm'
                ]"
              >
                <span v-if="group.isJoined" class="flex items-center gap-1">
                  <Check class="w-4 h-4" />
                  已加入
                </span>
                <span v-else-if="group.isFull" class="flex items-center gap-1">
                  <X class="w-4 h-4" />
                  已满
                </span>
                <span v-else-if="joiningGroups.has(group.id)" class="flex items-center gap-1">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  加入中
                </span>
                <span v-else>加入群</span>
              </button>
              
              <button
                v-else
                @click="goToGroup(group)"
                class="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full text-sm font-medium hover:from-blue-500 hover:to-blue-700 transition-all active:scale-95 shadow-sm"
              >
                进入群聊
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="relative w-32 h-32 mx-auto mb-6">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-6">
                <Users class="w-20 h-20 text-blue-400" />
              </div>
            </div>
            <div class="decoration decoration-1">?</div>
            <div class="decoration decoration-2">✦</div>
            <div class="decoration decoration-3">○</div>
          </div>
          <p class="text-gray-400 text-base mb-2">
            {{ mode === 'search' ? '暂无搜索结果' : '暂无群聊' }}
          </p>
          <p class="text-gray-400 text-sm">
            {{ mode === 'search' ? '试试搜索群名称或群号～' : '点击右上角 + 创建群聊' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  RotateCw,
  Plus,
  Search, 
  Users, 
  Check,
  X
} from 'lucide-vue-next'
import { 
  useGroupManagement, 
  useIMNavigation, 
  useToast,
  useFormat
} from '@/composables'
import FormInput from '@/components/common/FormInput.vue'

interface Group {
  id: number
  name: string
  description: string
  avatar: string
  groupId: number
  memberCount: number
  maxMembers: number
  isJoined: boolean
  isFull: boolean
}

const route = useRoute()
const router = useRouter()

// 获取模式参数
const mode = computed(() => route.query.mode as string || 'search')

// 使用组合式函数
const {
  groupList,
  loading,
  error,
  searchQuery,
  filteredGroups,
  fetchGroupList,
  joinGroup,
  leaveGroup,
  searchGroups
} = useGroupManagement({
  mode: mode.value,
  enableSearch: mode.value === 'search',
  enableJoin: mode.value === 'search'
})

const { 
  goToGroup,
  goToCreateGroup
} = useIMNavigation()

// 自定义返回方法，确保返回到消息页面
const handleGoBack = () => {
  // 直接跳转到消息页面
  router.push('/im')
}

const { success: showSuccess, error: showError } = useToast()
const { formatTime } = useFormat()

// 本地状态
const joiningGroups = ref(new Set<number>())

// 防抖搜索
let searchTimer: NodeJS.Timeout | null = null

const handleSearchInput = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      handleSearch()
    }
  }, 300)
}

const handleSearch = () => {
  searchGroups(searchQuery.value)
}

const handleJoinGroup = async (group: Group) => {
  if (group.isJoined || group.isFull || joiningGroups.value.has(group.id)) return

  joiningGroups.value.add(group.id)

  try {
    const result = await joinGroup(group.id)
    if (result.success) {
      group.isJoined = true
      group.memberCount += 1
      showSuccess(`已加入群聊 ${group.name}`)
    } else {
      showError(result.error || '加入群聊失败')
    }
  } catch (error) {
    showError('加入群聊失败')
  } finally {
    joiningGroups.value.delete(group.id)
  }
}

const handleRefresh = async () => {
  try {
    await fetchGroupList()
    showSuccess('群组列表已刷新')
  } catch (error) {
    showError('刷新失败')
  }
}

// 初始化
onMounted(() => {
  fetchGroupList()
})
</script>

<style scoped>
/* 群组卡片动画 */
.group-item {
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

/* 空状态装饰 */
.decoration {
  position: absolute;
  color: #f3f4f6;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.decoration-1 {
  top: 10px;
  right: 20px;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 20px;
  left: 15px;
  animation-delay: 1s;
}

.decoration-3 {
  top: 50%;
  right: 10px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 群组卡片悬停效果 */
.group-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 按钮悬停效果 */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 加入按钮动画 */
.joining {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
