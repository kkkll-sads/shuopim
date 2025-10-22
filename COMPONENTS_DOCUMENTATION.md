# IM 可复用组件文档

## 📦 组件总览

本项目包含 6 个高度可复用的 IM 组件，统一设计风格，灵活配置，易于使用。

---

## 📁 文件结构

```
src/components/im/
├── index.js           # 组件导出
├── UserCard.vue       # 用户卡片组件
├── GroupCard.vue      # 群组卡片组件
├── ChatItem.vue       # 聊天项组件
├── SearchBar.vue      # 搜索栏组件
├── EmptyState.vue     # 空状态组件
└── Avatar.vue         # 头像组件
```

---

## 🎯 组件详情

### 1. UserCard - 用户卡片组件

**功能**: 展示用户信息的通用卡片组件

**Props**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| user | Object | required | 用户对象 |
| size | String | 'medium' | 尺寸: 'small', 'medium', 'large' |
| selected | Boolean | false | 是否选中 |
| showBadge | Boolean | false | 是否显示徽章 |
| badgeType | String | 'add' | 徽章类型: 'add', 'check', 'message', 'remove' |
| showStatus | Boolean | false | 是否显示在线状态 |
| showIdPrefix | Boolean | true | 是否显示ID前缀 |
| ringColor | String | 'ring-purple-400' | 选中边框颜色 |

**User 对象格式**:
```javascript
{
  id: number,
  name: string,
  nickname: string,
  avatar: string,
  badge: string,        // 可选，如 "商家"
  online: boolean       // 可选，在线状态
}
```

**事件**:
- `@click` - 点击卡片时触发，参数为 user 对象

**插槽**:
- `action` - 右侧操作区域插槽

**使用示例**:
```vue
<script setup>
import { UserCard } from '@/components/im'

const user = {
  id: 1,
  name: '张三',
  nickname: '13012345678',
  avatar: '/avatar.jpg',
  online: true
}

const handleClick = (user) => {
  console.log('点击用户:', user)
}
</script>

<template>
  <!-- 基础使用 -->
  <UserCard :user="user" @click="handleClick" />

  <!-- 带徽章 -->
  <UserCard 
    :user="user" 
    show-badge 
    badge-type="add"
    @click="handleClick"
  />

  <!-- 选中状态 -->
  <UserCard 
    :user="user" 
    :selected="true"
    ring-color="ring-orange-400"
  />

  <!-- 自定义操作按钮 -->
  <UserCard :user="user">
    <template #action>
      <button class="px-4 py-1 bg-blue-500 text-white rounded-full">
        添加
      </button>
    </template>
  </UserCard>
</template>
```

---

### 2. GroupCard - 群组卡片组件

**功能**: 展示群组信息的通用卡片组件

**Props**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| group | Object | required | 群组对象 |
| size | String | 'medium' | 尺寸 |
| selected | Boolean | false | 是否选中 |
| showBadge | Boolean | true | 是否显示群组徽章 |
| showGroupId | Boolean | false | 是否显示群号 |
| showMemberCount | Boolean | true | 是否显示成员数 |
| showDefaultAction | Boolean | false | 是否显示默认箭头 |

**Group 对象格式**:
```javascript
{
  id: number,
  name: string,
  groupId: string,
  avatar: string,
  memberCount: number,
  maxMembers: number
}
```

**事件**:
- `@click` - 点击卡片时触发

**插槽**:
- `action` - 右侧操作区域插槽

**使用示例**:
```vue
<script setup>
import { GroupCard } from '@/components/im'

const group = {
  id: 1,
  name: '我的群聊',
  groupId: 'G12345',
  avatar: '/group.jpg',
  memberCount: 68,
  maxMembers: 200
}
</script>

<template>
  <!-- 基础使用 -->
  <GroupCard :group="group" @click="openGroup" />

  <!-- 显示群号 -->
  <GroupCard :group="group" show-group-id />

  <!-- 自定义操作 -->
  <GroupCard :group="group">
    <template #action>
      <button class="px-4 py-1 bg-purple-500 text-white rounded-full">
        加入
      </button>
    </template>
  </GroupCard>
</template>
```

---

### 3. ChatItem - 聊天项组件

**功能**: 聊天列表中的单个聊天项

**Props**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| chat | Object | required | 聊天对象 |

**Chat 对象格式**:
```javascript
{
  id: number,
  name: string,
  avatar: string,
  lastMessage: string,
  time: string,
  type: string,        // 'user' 或 'group'
  badge: string,       // 可选，如 "商家"
  unread: number,      // 未读数量
  muted: boolean       // 是否免打扰
}
```

**事件**:
- `@click` - 点击聊天项时触发

**使用示例**:
```vue
<script setup>
import { ChatItem } from '@/components/im'

const chat = {
  id: 1,
  name: '张三',
  avatar: '/avatar.jpg',
  lastMessage: '在吗？',
  time: '10:30',
  type: 'user',
  badge: '商家',
  unread: 3,
  muted: false
}
</script>

<template>
  <ChatItem :chat="chat" @click="openChat" />
</template>
```

---

### 4. SearchBar - 搜索栏组件

**功能**: 带搜索图标和清除按钮的搜索输入框

**Props**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String | '' | v-model 绑定值 |
| placeholder | String | '搜索' | 占位文本 |
| type | String | 'text' | 输入类型 |
| size | String | 'medium' | 尺寸: 'small', 'medium' |
| showButton | Boolean | false | 是否显示搜索按钮 |
| buttonText | String | '搜索' | 按钮文本 |
| buttonClass | String | - | 按钮样式类 |
| showClear | Boolean | true | 是否显示清除按钮 |
| shadow | Boolean | false | 是否显示阴影 |
| debounce | Number | 0 | 防抖延迟(ms) |

**事件**:
- `@update:modelValue` - 输入值变化
- `@input` - 输入事件
- `@search` - 搜索事件（点击按钮或回车）
- `@enter` - 回车键事件
- `@clear` - 清除事件

**方法**:
- `focus()` - 聚焦输入框

**使用示例**:
```vue
<script setup>
import { ref } from 'vue'
import { SearchBar } from '@/components/im'

const searchQuery = ref('')
const searchBarRef = ref(null)

const handleSearch = (value) => {
  console.log('搜索:', value)
}

const handleInput = (value) => {
  console.log('输入:', value)
}
</script>

<template>
  <!-- 基础使用 -->
  <SearchBar 
    v-model="searchQuery" 
    placeholder="搜索好友"
    @search="handleSearch"
  />

  <!-- 带搜索按钮 -->
  <SearchBar 
    v-model="searchQuery"
    show-button
    button-text="搜索"
    @search="handleSearch"
  />

  <!-- 带防抖 -->
  <SearchBar 
    v-model="searchQuery"
    :debounce="300"
    @input="handleInput"
  />

  <!-- 自定义按钮样式 -->
  <SearchBar 
    v-model="searchQuery"
    show-button
    button-class="bg-gradient-to-r from-purple-400 to-pink-500"
    ref="searchBarRef"
  />
</template>
```

---

### 5. EmptyState - 空状态组件

**功能**: 统一的空状态展示组件

**Props**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | String | 'search' | 图标类型 |
| title | String | '暂无数据' | 标题 |
| description | String | '暂时没有内容～' | 描述文本 |
| size | String | 'medium' | 尺寸 |
| theme | String | 'gray' | 主题色 |
| showDecorations | Boolean | true | 是否显示装饰 |
| decorations | Array | ['?', '✦', '○'] | 装饰符号 |
| showAction | Boolean | false | 是否显示操作按钮 |
| actionText | String | '操作' | 按钮文本 |
| actionClass | String | - | 按钮样式类 |

**图标类型**:
- `search` - 搜索
- `users` - 用户
- `message` - 消息
- `userX` - 禁止用户
- `inbox` - 收件箱
- `file` - 文件
- `package` - 包裹
- `userPlus` - 添加用户

**主题色**:
- `gray` - 灰色
- `orange` - 橙色
- `purple` - 紫色
- `blue` - 蓝色
- `teal` - 青色
- `red` - 红色

**事件**:
- `@action` - 点击操作按钮时触发

**使用示例**:
```vue
<script setup>
import { EmptyState } from '@/components/im'

const handleAddFriend = () => {
  console.log('添加好友')
}
</script>

<template>
  <!-- 基础使用 -->
  <EmptyState 
    icon="search"
    title="暂无搜索结果"
    description="试试搜索用户名或昵称～"
  />

  <!-- 橙色主题 -->
  <EmptyState 
    icon="userPlus"
    title="暂无好友"
    description="快去添加好友吧～"
    theme="orange"
  />

  <!-- 带操作按钮 -->
  <EmptyState 
    icon="users"
    title="暂无群聊"
    description="创建或加入群聊开始交流～"
    theme="purple"
    show-action
    action-text="创建群聊"
    @action="handleAddFriend"
  />

  <!-- 自定义装饰 -->
  <EmptyState 
    icon="message"
    title="暂无消息"
    theme="teal"
    :decorations="['💬', '✨', '👋']"
  />
</template>
```

---

### 6. Avatar - 头像组件

**功能**: 灵活的头像组件，支持多种形状、徽章和状态

**Props**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | String | '' | 头像图片地址 |
| alt | String | 'Avatar' | alt 文本 |
| size | String | 'medium' | 尺寸 |
| shape | String | 'circle' | 形状: 'circle', 'square', 'rounded' |
| border | Boolean | false | 是否显示边框 |
| borderColor | String | 'ring-purple-400' | 边框颜色类 |
| badge | Boolean | false | 是否显示徽章 |
| badgeType | String | 'add' | 徽章类型 |
| badgeText | String | '' | 徽章文本（自定义） |
| badgeColor | String | 'orange' | 徽章颜色 |
| showStatus | Boolean | false | 是否显示状态点 |
| online | Boolean | false | 是否在线 |

**尺寸**:
- `xs` - 32px
- `small` - 40px
- `medium` - 48px
- `large` - 56px
- `xl` - 64px

**徽章类型**:
- `add` - 添加
- `check` - 已选
- `remove` - 删除
- `group` - 群组
- `custom` - 自定义（使用 badgeText）

**徽章颜色**:
- `orange`, `green`, `blue`, `purple`, `red`

**使用示例**:
```vue
<script setup>
import { Avatar } from '@/components/im'
</script>

<template>
  <!-- 基础使用 -->
  <Avatar src="/avatar.jpg" alt="用户头像" />

  <!-- 大尺寸 + 边框 -->
  <Avatar 
    src="/avatar.jpg" 
    size="large"
    border
    border-color="ring-orange-400"
  />

  <!-- 带徽章 -->
  <Avatar 
    src="/avatar.jpg"
    badge
    badge-type="add"
    badge-color="orange"
  />

  <!-- 在线状态 -->
  <Avatar 
    src="/avatar.jpg"
    show-status
    :online="true"
  />

  <!-- 方形头像（群组） -->
  <Avatar 
    src="/group.jpg"
    shape="rounded"
    badge
    badge-type="group"
    badge-color="purple"
  />

  <!-- 自定义徽章文本 -->
  <Avatar 
    src="/avatar.jpg"
    badge
    badge-type="custom"
    badge-text="99+"
    badge-color="red"
  />
</template>
```

---

## 🎨 设计规范

### 颜色主题

| 组件 | 主色调 | 用途 |
|------|--------|------|
| UserCard | 橙红渐变 | 好友相关 |
| GroupCard | 紫粉渐变 | 群组相关 |
| ChatItem | - | 聊天列表 |
| SearchBar | 可配置 | 搜索功能 |
| EmptyState | 多主题 | 空状态显示 |
| Avatar | 可配置 | 头像展示 |

### 动画效果

所有组件都包含流畅的动画：
- `slideIn` - 滑入动画
- `fadeIn` - 淡入动画
- `float` - 浮动动画（装饰元素）

---

## 🔧 全局使用配置

### 方式1：按需引入（推荐）

```vue
<script setup>
import { UserCard, GroupCard, EmptyState } from '@/components/im'
</script>

<template>
  <UserCard :user="user" />
  <GroupCard :group="group" />
  <EmptyState icon="search" />
</template>
```

### 方式2：全局注册

```javascript
// main.js
import * as IMComponents from '@/components/im'

const app = createApp(App)

// 注册所有IM组件
Object.keys(IMComponents).forEach(key => {
  app.component(key, IMComponents[key])
})
```

---

## 💡 使用建议

### 1. 组件组合

```vue
<template>
  <!-- 搜索栏 + 用户卡片 + 空状态 -->
  <div>
    <SearchBar v-model="query" @search="handleSearch" />
    
    <div v-if="users.length > 0">
      <UserCard 
        v-for="user in users"
        :key="user.id"
        :user="user"
        @click="selectUser"
      />
    </div>
    
    <EmptyState 
      v-else
      icon="search"
      title="暂无搜索结果"
      theme="orange"
    />
  </div>
</template>
```

### 2. 响应式设计

所有组件都支持响应式：
- 使用 `size` 属性适配不同屏幕
- 使用 Tailwind 的响应式类
- 文本自动截断（truncate）

### 3. 主题定制

通过 props 传递自定义类名：
```vue
<SearchBar 
  button-class="bg-gradient-to-r from-blue-400 to-purple-500"
/>

<EmptyState 
  action-class="bg-green-500 text-white"
/>
```

---

## 📝 完整示例

### 添加好友页面

```vue
<script setup>
import { ref, computed } from 'vue'
import { UserCard, SearchBar, EmptyState } from '@/components/im'

const searchQuery = ref('')
const users = ref([/* ... */])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user => 
    user.name.includes(searchQuery.value)
  )
})

const addFriend = async (user) => {
  // API call
  user.isAdded = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SearchBar 
      v-model="searchQuery"
      placeholder="搜索用户"
      show-button
    />
    
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
            class="px-5 py-2 rounded-full text-sm font-medium"
            :class="user.isAdded 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-gradient-to-r from-orange-400 to-red-500 text-white'"
          >
            {{ user.isAdded ? '已添加' : '添加' }}
          </button>
        </template>
      </UserCard>
    </div>
    
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

---

## ✅ 组件清单

- [x] UserCard - 用户卡片
- [x] GroupCard - 群组卡片
- [x] ChatItem - 聊天项
- [x] SearchBar - 搜索栏
- [x] EmptyState - 空状态
- [x] Avatar - 头像

**总计**: 6个核心组件

---

## 🎉 总结

这些可复用组件提供了：

- ✅ **统一的设计语言**
- ✅ **灵活的配置选项**
- ✅ **流畅的动画效果**
- ✅ **完整的类型支持**
- ✅ **易于使用和维护**
- ✅ **高度可定制化**

通过这些组件，可以快速构建一致、美观的 IM 界面！

---

**文档更新时间**: 2024-10-21  
**项目版本**: Vue 3 + Vite + TailwindCSS

