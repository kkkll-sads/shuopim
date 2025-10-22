# IM 组件使用示例

本文档提供了所有 IM 可复用组件的实际使用示例。

---

## 📋 目录

1. [UserCard 使用示例](#1-usercard-使用示例)
2. [GroupCard 使用示例](#2-groupcard-使用示例)
3. [ChatItem 使用示例](#3-chatitem-使用示例)
4. [SearchBar 使用示例](#4-searchbar-使用示例)
5. [EmptyState 使用示例](#5-emptystate-使用示例)
6. [Avatar 使用示例](#6-avatar-使用示例)
7. [组合使用示例](#7-组合使用示例)

---

## 1. UserCard 使用示例

### 示例 1: 添加好友列表

```vue
<script setup>
import { ref } from 'vue'
import { UserCard } from '@/components/im'

const users = ref([
  {
    id: 1,
    name: '张三',
    nickname: '13012345678',
    avatar: '/avatar1.jpg',
    online: true,
    isAdded: false
  },
  {
    id: 2,
    name: '李四',
    nickname: '李老板',
    avatar: '/avatar2.jpg',
    badge: '商家',
    online: false,
    isAdded: true
  }
])

const addFriend = (user) => {
  if (user.isAdded) return
  // API call
  user.isAdded = true
}
</script>

<template>
  <div class="p-4 space-y-3">
    <UserCard 
      v-for="user in users"
      :key="user.id"
      :user="user"
      show-badge
      :badge-type="user.isAdded ? 'check' : 'add'"
      show-status
      @click="addFriend"
    >
      <template #action>
        <button
          :disabled="user.isAdded"
          class="px-5 py-2 rounded-full text-sm font-medium transition-all"
          :class="user.isAdded 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600'"
        >
          {{ user.isAdded ? '已添加' : '添加' }}
        </button>
      </template>
    </UserCard>
  </div>
</template>
```

### 示例 2: 选择群成员

```vue
<script setup>
import { ref } from 'vue'
import { UserCard } from '@/components/im'

const friends = ref([/* ... */])
const selectedMembers = ref([])

const toggleMember = (user) => {
  const index = selectedMembers.value.findIndex(m => m.id === user.id)
  if (index > -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(user)
  }
}

const isSelected = (userId) => {
  return selectedMembers.value.some(m => m.id === userId)
}
</script>

<template>
  <div class="p-4 space-y-2">
    <UserCard 
      v-for="friend in friends"
      :key="friend.id"
      :user="friend"
      :selected="isSelected(friend.id)"
      show-badge
      badge-type="check"
      ring-color="ring-purple-400"
      @click="toggleMember"
    />
  </div>
</template>
```

---

## 2. GroupCard 使用示例

### 示例 1: 找群列表

```vue
<script setup>
import { ref } from 'vue'
import { GroupCard } from '@/components/im'

const groups = ref([
  {
    id: 1,
    name: '技术交流群',
    groupId: 'G12345',
    avatar: '/group1.jpg',
    memberCount: 68,
    maxMembers: 200
  },
  {
    id: 2,
    name: '产品讨论组',
    groupId: 'G23456',
    avatar: '/group2.jpg',
    memberCount: 200,
    maxMembers: 200
  }
])

const joinGroup = async (group) => {
  if (group.memberCount >= group.maxMembers) {
    alert('群已满')
    return
  }
  // API call
  console.log('加入群:', group.name)
}
</script>

<template>
  <div class="p-4 space-y-3">
    <GroupCard 
      v-for="group in groups"
      :key="group.id"
      :group="group"
      show-group-id
      @click="joinGroup"
    >
      <template #action>
        <button
          :disabled="group.memberCount >= group.maxMembers"
          class="px-5 py-2 rounded-full text-sm font-medium transition-all"
          :class="group.memberCount >= group.maxMembers
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600'"
        >
          {{ group.memberCount >= group.maxMembers ? '已满' : '加入群' }}
        </button>
      </template>
    </GroupCard>
  </div>
</template>
```

### 示例 2: 我的群聊

```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GroupCard } from '@/components/im'

const router = useRouter()
const myGroups = ref([/* ... */])

const openGroup = (group) => {
  router.push(`/im/chat/${group.id}`)
}
</script>

<template>
  <div class="p-4 space-y-3">
    <GroupCard 
      v-for="group in myGroups"
      :key="group.id"
      :group="group"
      show-default-action
      @click="openGroup"
    />
  </div>
</template>
```

---

## 3. ChatItem 使用示例

### 示例: IM 主页聊天列表

```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChatItem } from '@/components/im'

const router = useRouter()

const chats = ref([
  {
    id: 1,
    name: '张三',
    avatar: '/avatar1.jpg',
    lastMessage: '在吗？',
    time: '10:30',
    type: 'user',
    badge: '商家',
    unread: 3,
    muted: false
  },
  {
    id: 2,
    name: '技术交流群',
    avatar: '/group1.jpg',
    lastMessage: '[图片]',
    time: '昨天',
    type: 'group',
    unread: 99,
    muted: true
  }
])

const openChat = (chat) => {
  router.push(`/im/chat/${chat.id}`)
}
</script>

<template>
  <div class="bg-white">
    <ChatItem 
      v-for="chat in chats"
      :key="chat.id"
      :chat="chat"
      @click="openChat"
    />
  </div>
</template>
```

---

## 4. SearchBar 使用示例

### 示例 1: 基础搜索

```vue
<script setup>
import { ref } from 'vue'
import { SearchBar } from '@/components/im'

const searchQuery = ref('')

const handleSearch = (value) => {
  console.log('搜索:', value)
  // API call
}
</script>

<template>
  <SearchBar 
    v-model="searchQuery"
    placeholder="搜索用户"
    show-button
    @search="handleSearch"
  />
</template>
```

### 示例 2: 带防抖的实时搜索

```vue
<script setup>
import { ref } from 'vue'
import { SearchBar } from '@/components/im'

const searchQuery = ref('')
const results = ref([])

const handleInput = async (value) => {
  if (!value.trim()) {
    results.value = []
    return
  }
  
  // API call
  const response = await fetch(`/api/search?q=${value}`)
  results.value = await response.json()
}
</script>

<template>
  <SearchBar 
    v-model="searchQuery"
    placeholder="搜索"
    :debounce="300"
    @input="handleInput"
  />
</template>
```

### 示例 3: 多种样式

```vue
<template>
  <!-- 默认样式 -->
  <SearchBar v-model="query1" />

  <!-- 小尺寸 -->
  <SearchBar v-model="query2" size="small" />

  <!-- 带阴影 -->
  <SearchBar v-model="query3" shadow />

  <!-- 自定义按钮 -->
  <SearchBar 
    v-model="query4"
    show-button
    button-text="搜索"
    button-class="bg-gradient-to-r from-blue-400 to-purple-500"
  />
</template>
```

---

## 5. EmptyState 使用示例

### 示例 1: 不同场景的空状态

```vue
<script setup>
import { EmptyState } from '@/components/im'
</script>

<template>
  <!-- 搜索无结果 -->
  <EmptyState 
    icon="search"
    title="暂无搜索结果"
    description="试试搜索用户名或昵称～"
    theme="orange"
  />

  <!-- 暂无好友 -->
  <EmptyState 
    icon="userPlus"
    title="暂无好友"
    description="添加好友开始聊天吧～"
    theme="orange"
  />

  <!-- 暂无群聊 -->
  <EmptyState 
    icon="users"
    title="暂无群聊"
    description="创建或加入群聊开始交流～"
    theme="purple"
  />

  <!-- 暂无消息 -->
  <EmptyState 
    icon="message"
    title="暂无验证消息"
    description="好友验证请求会显示在这里～"
    theme="teal"
  />

  <!-- 黑名单为空 -->
  <EmptyState 
    icon="userX"
    title="黑名单为空"
    description="被拉黑的用户会显示在这里～"
    theme="blue"
  />
</template>
```

### 示例 2: 带操作按钮

```vue
<script setup>
import { useRouter } from 'vue-router'
import { EmptyState } from '@/components/im'

const router = useRouter()

const goToAddFriend = () => {
  router.push('/im/add-friend')
}

const goToCreateGroup = () => {
  router.push('/im/select-members')
}
</script>

<template>
  <!-- 添加好友 -->
  <EmptyState 
    icon="userPlus"
    title="暂无好友"
    description="添加好友开始聊天吧～"
    theme="orange"
    show-action
    action-text="添加好友"
    action-class="bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600"
    @action="goToAddFriend"
  />

  <!-- 创建群聊 -->
  <EmptyState 
    icon="users"
    title="暂无群聊"
    description="创建群聊开始交流～"
    theme="purple"
    show-action
    action-text="创建群聊"
    @action="goToCreateGroup"
  />
</template>
```

---

## 6. Avatar 使用示例

### 示例 1: 不同尺寸和形状

```vue
<script setup>
import { Avatar } from '@/components/im'
</script>

<template>
  <div class="flex items-center gap-4">
    <!-- 不同尺寸 -->
    <Avatar src="/avatar.jpg" size="xs" />
    <Avatar src="/avatar.jpg" size="small" />
    <Avatar src="/avatar.jpg" size="medium" />
    <Avatar src="/avatar.jpg" size="large" />
    <Avatar src="/avatar.jpg" size="xl" />
  </div>

  <div class="flex items-center gap-4 mt-4">
    <!-- 不同形状 -->
    <Avatar src="/avatar.jpg" shape="circle" />
    <Avatar src="/group.jpg" shape="rounded" />
    <Avatar src="/avatar.jpg" shape="square" />
  </div>
</template>
```

### 示例 2: 带徽章和状态

```vue
<template>
  <div class="flex items-center gap-4">
    <!-- 添加好友徽章 -->
    <Avatar 
      src="/avatar.jpg"
      badge
      badge-type="add"
      badge-color="orange"
    />

    <!-- 已选中徽章 -->
    <Avatar 
      src="/avatar.jpg"
      badge
      badge-type="check"
      badge-color="green"
    />

    <!-- 群组徽章 -->
    <Avatar 
      src="/group.jpg"
      shape="rounded"
      badge
      badge-type="group"
      badge-color="purple"
    />

    <!-- 在线状态 -->
    <Avatar 
      src="/avatar.jpg"
      show-status
      :online="true"
    />

    <!-- 离线状态 -->
    <Avatar 
      src="/avatar.jpg"
      show-status
      :online="false"
    />
  </div>
</template>
```

### 示例 3: 自定义徽章

```vue
<template>
  <!-- 未读消息数 -->
  <Avatar 
    src="/avatar.jpg"
    badge
    badge-type="custom"
    badge-text="99+"
    badge-color="red"
  />

  <!-- 等级徽章 -->
  <Avatar 
    src="/avatar.jpg"
    badge
    badge-type="custom"
    badge-text="VIP"
    badge-color="orange"
  />
</template>
```

---

## 7. 组合使用示例

### 示例 1: 完整的添加好友页面

```vue
<script setup>
import { ref, computed } from 'vue'
import { UserCard, SearchBar, EmptyState } from '@/components/im'

const searchQuery = ref('')
const users = ref([
  { id: 1, name: '张三', nickname: '13012345678', avatar: '/avatar1.jpg', isAdded: false },
  { id: 2, name: '李四', nickname: '李老板', avatar: '/avatar2.jpg', badge: '商家', isAdded: false },
  { id: 3, name: '王五', nickname: '15011112222', avatar: '/avatar3.jpg', isAdded: true }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value
  }
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.nickname.toLowerCase().includes(query)
  )
})

const handleSearch = (value) => {
  console.log('搜索:', value)
}

const addFriend = async (user) => {
  if (user.isAdded) return
  
  // API call
  console.log('添加好友:', user.name)
  user.isAdded = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 搜索栏 -->
    <SearchBar 
      v-model="searchQuery"
      placeholder="搜索用户"
      show-button
      button-text="搜索"
      @search="handleSearch"
    />
    
    <!-- 用户列表 -->
    <div v-if="filteredUsers.length > 0" class="p-4 space-y-3">
      <UserCard 
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        show-badge
        :badge-type="user.isAdded ? 'check' : 'add'"
        @click="addFriend"
      >
        <template #action>
          <button
            :disabled="user.isAdded"
            class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
            :class="user.isAdded 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-sm'"
          >
            <span v-if="user.isAdded" class="flex items-center gap-1">
              <Check class="w-4 h-4" />
              已添加
            </span>
            <span v-else>添加</span>
          </button>
        </template>
      </UserCard>
    </div>
    
    <!-- 空状态 -->
    <EmptyState 
      v-else
      icon="search"
      title="暂无搜索结果"
      description="试试搜索用户名或昵称～"
      theme="orange"
    />
  </div>
</template>
```

### 示例 2: 聊天列表页面

```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChatItem, SearchBar, EmptyState } from '@/components/im'

const router = useRouter()
const searchQuery = ref('')
const chats = ref([
  {
    id: 1,
    name: '张三',
    avatar: '/avatar1.jpg',
    lastMessage: '在吗？',
    time: '10:30',
    type: 'user',
    badge: '商家',
    unread: 3,
    muted: false
  },
  {
    id: 2,
    name: '技术交流群',
    avatar: '/group1.jpg',
    lastMessage: '大家好',
    time: '昨天',
    type: 'group',
    unread: 99,
    muted: true
  }
])

const openChat = (chat) => {
  router.push(`/im/chat/${chat.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 搜索栏（可选） -->
    <SearchBar 
      v-model="searchQuery"
      placeholder="搜索聊天"
      size="small"
    />
    
    <!-- 聊天列表 -->
    <div v-if="chats.length > 0" class="bg-white">
      <ChatItem 
        v-for="chat in chats"
        :key="chat.id"
        :chat="chat"
        @click="openChat"
      />
    </div>
    
    <!-- 空状态 -->
    <EmptyState 
      v-else
      icon="message"
      title="暂无聊天"
      description="开始聊天吧～"
      theme="gray"
    />
  </div>
</template>
```

### 示例 3: 选择群成员页面

```vue
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserCard, SearchBar, EmptyState, Avatar } from '@/components/im'
import { X } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')
const selectedMembers = ref([])
const friends = ref([/* ... */])

const filteredFriends = computed(() => {
  if (!searchQuery.value.trim()) return friends.value
  const query = searchQuery.value.toLowerCase()
  return friends.value.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.nickname.toLowerCase().includes(query)
  )
})

const isSelected = (friendId) => {
  return selectedMembers.value.some(m => m.id === friendId)
}

const toggleMember = (friend) => {
  const index = selectedMembers.value.findIndex(m => m.id === friend.id)
  if (index > -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(friend)
  }
}

const handleNext = () => {
  if (selectedMembers.value.length === 0) return
  router.push({
    name: 'CreateGroup',
    state: { members: selectedMembers.value }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 头部 -->
    <div class="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
      <h1 class="text-lg font-medium">选择群成员</h1>
      <button
        @click="handleNext"
        :disabled="selectedMembers.length === 0"
        class="px-4 py-1.5 rounded-full text-sm font-medium"
        :class="selectedMembers.length > 0
          ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
      >
        下一步 ({{ selectedMembers.length }})
      </button>
    </div>

    <!-- 搜索栏 -->
    <SearchBar 
      v-model="searchQuery"
      placeholder="搜索好友"
    />

    <!-- 已选成员预览 -->
    <div v-if="selectedMembers.length > 0" class="bg-white px-4 py-3 border-b">
      <div class="flex items-center gap-2 overflow-x-auto">
        <div
          v-for="member in selectedMembers"
          :key="member.id"
          class="flex-shrink-0 relative"
        >
          <Avatar 
            :src="member.avatar"
            size="medium"
            border
            border-color="ring-purple-400"
          />
          <button
            @click="toggleMember(member)"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <X class="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- 好友列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="filteredFriends.length > 0" class="p-4 space-y-2">
        <UserCard 
          v-for="friend in filteredFriends"
          :key="friend.id"
          :user="friend"
          :selected="isSelected(friend.id)"
          show-badge
          badge-type="check"
          ring-color="ring-purple-400"
          @click="toggleMember"
        />
      </div>

      <!-- 空状态 -->
      <EmptyState 
        v-else
        icon="users"
        title="暂无好友"
        description="添加好友后可以创建群聊～"
        theme="purple"
      />
    </div>
  </div>
</template>
```

---

## 🎉 总结

通过这些组件，你可以：

- ✅ 快速构建一致的界面
- ✅ 减少重复代码
- ✅ 提高开发效率
- ✅ 保持设计统一
- ✅ 易于维护和扩展

**核心思想**: 组件化、可复用、灵活配置！

---

**文档更新时间**: 2024-10-21

