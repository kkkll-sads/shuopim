<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">{{ pageTitle }}</h1>
      <button @click="refreshGroups" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <RefreshCw class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <!-- Search Bar (仅在找群模式显示) -->
    <div v-if="isSearchMode" class="bg-white px-4 py-3 flex items-center gap-2">
      <div class="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
        <Search class="w-5 h-5 text-gray-400 mr-2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="请输入您要搜索的群昵称或账号"
          class="flex-1 bg-transparent outline-none text-sm"
          @input="handleSearch"
        />
      </div>
      <button
        @click="performSearch"
        class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-orange-500 hover:to-red-600 transition-all"
      >
        搜索
      </button>
    </div>

    <!-- Groups List -->
    <div class="mt-2 bg-white">
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="flex items-center gap-3 px-4 py-4 border-b border-gray-100 group-item"
      >
        <!-- Avatar -->
        <div class="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          <img
            v-if="group.avatar"
            :src="group.avatar"
            :alt="group.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
            <Users class="w-8 h-8 text-white" />
          </div>
        </div>

        <!-- Group Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="text-base font-medium text-gray-900 truncate">{{ group.name }}</h3>
            <span class="text-xs text-purple-500 flex items-center gap-1 flex-shrink-0">
              <Users class="w-3 h-3" />
              {{ group.memberCount }}/{{ group.maxMembers }}
            </span>
          </div>
          <p class="text-sm text-gray-500">群号:{{ group.groupId }}</p>
        </div>

        <!-- Action Button -->
        <button
          v-if="isSearchMode"
          @click="joinGroup(group)"
          :disabled="group.memberCount >= group.maxMembers"
          :class="[
            'px-5 py-1.5 rounded-full text-sm font-medium border transition-all',
            group.memberCount >= group.maxMembers
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-red-500 text-red-500 hover:bg-red-50 active:scale-95'
          ]"
        >
          {{ group.memberCount >= group.maxMembers ? '已满' : '加入群' }}
        </button>
        <button
          v-else
          @click="openGroup(group)"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredGroups.length === 0" class="py-20 text-center empty-state">
        <div class="relative w-32 h-32 mx-auto mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6">
              <Users class="w-20 h-20 text-purple-300" />
            </div>
          </div>
          <div class="decoration decoration-1">+</div>
          <div class="decoration decoration-2">✦</div>
          <div class="decoration decoration-3">○</div>
        </div>
        <p class="text-gray-400 text-base mb-2">{{ emptyTitle }}</p>
        <p class="text-gray-400 text-sm">{{ emptyDesc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, Search, RefreshCw, Users } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const groups = ref([])

// 判断是搜索模式（找群）还是列表模式（我的群聊）
const isSearchMode = computed(() => route.params.mode === 'search')

// 页面标题
const pageTitle = computed(() => isSearchMode.value ? '找群' : '我的群聊')

// 空状态文案
const emptyTitle = computed(() => isSearchMode.value ? '暂无群组' : '暂无群聊')
const emptyDesc = computed(() => isSearchMode.value ? '搜索或创建新群组～' : '加入群聊开始交流吧～')

// Sample data - 根据模式从不同的API获取
const fetchGroups = async () => {
  if (isSearchMode.value) {
    // TODO: 调用后端API获取可加入的群组列表
    // const response = await fetch('/api/groups/search')
    // groups.value = await response.json()
    
    // 示例数据
    groups.value = [
      {
        id: 1,
        name: '济源市邵原镇代理群',
        groupId: '190003690',
        memberCount: 68,
        maxMembers: 200,
        avatar: ''
      },
      {
        id: 2,
        name: '我心向善',
        groupId: '100020095',
        memberCount: 72,
        maxMembers: 200,
        avatar: ''
      },
      {
        id: 3,
        name: '济源市玉泉街道代理群',
        groupId: '140003690',
        memberCount: 69,
        maxMembers: 200,
        avatar: ''
      },
      {
        id: 4,
        name: '上海市松江区代理群',
        groupId: '100084848',
        memberCount: 110,
        maxMembers: 200,
        avatar: ''
      },
      {
        id: 5,
        name: '交流群',
        groupId: '100009481',
        memberCount: 200,
        maxMembers: 200,
        avatar: ''
      }
    ]
  } else {
    // TODO: 调用后端API获取我的群组列表
    // const response = await fetch('/api/groups/my')
    // groups.value = await response.json()
    
    // 示例数据 - 我的群聊
    groups.value = [
      // {
      //   id: 1,
      //   name: '文企通一群',
      //   groupId: '100001234',
      //   memberCount: 156,
      //   maxMembers: 200,
      //   avatar: ''
      // }
    ]
  }
}

const filteredGroups = computed(() => {
  if (!isSearchMode.value || !searchQuery.value.trim()) {
    return groups.value
  }
  const query = searchQuery.value.toLowerCase()
  return groups.value.filter(
    group =>
      group.name.toLowerCase().includes(query) ||
      group.groupId.includes(query)
  )
})

const refreshGroups = () => {
  fetchGroups()
}

const handleSearch = () => {
  // 实时过滤由 computed 处理
}

const performSearch = () => {
  console.log('搜索:', searchQuery.value)
  // TODO: 实现服务器端搜索
}

const joinGroup = async (group) => {
  if (group.memberCount >= group.maxMembers) {
    return
  }
  
  console.log('加入群组:', group.name)
  // TODO: 调用后端API加入群组
  // const response = await fetch('/api/groups/join', {
  //   method: 'POST',
  //   body: JSON.stringify({ groupId: group.id })
  // })
  
  alert(`申请加入群组: ${group.name}`)
}

const openGroup = (group) => {
  console.log('打开群聊:', group.name)
  // TODO: 跳转到群聊详情页面
  // router.push(`/im/group/${group.id}`)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
.group-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  animation: fadeIn 0.6s ease-out;
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
  color: #c084fc;
  animation-delay: 0s;
}

.decoration-2 {
  bottom: 2rem;
  right: 0.5rem;
  color: #ec4899;
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

