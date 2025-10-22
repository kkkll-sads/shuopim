# IM 页面完整文档

## 📱 页面总览

本项目包含完整的即时通讯(IM)功能页面，采用模块化设计，页面复用，易于维护。共 **8 个核心功能页面**。

---

## 🗂️ 文件结构

```
src/views/im/
├── IM.vue              # IM 主页（聊天列表）
├── contacts.vue        # 通讯录
├── add-friend.vue      # 添加好友
├── groups.vue          # 群组（通用页面，支持两种模式）
├── verification.vue    # 验证消息
├── blacklist.vue       # 黑名单
├── select-members.vue  # 选择群成员
└── create-group.vue    # 创建群聊
```

---

## 🎯 页面详情

### 1. IM.vue - IM 主页

**路由**: `/im`

**功能**:
- 显示聊天列表
- 顶部操作栏：
  - 🏪 商家按钮
  - 👤 通讯录按钮 → `/im/contacts`
  - ➕ 更多菜单：
    - 加好友 → `/im/add-friend`
    - 加群 → `/im/groups/search`
    - 创建群聊（待实现）
- 聊天项显示：
  - 头像
  - 名称 + 标签
  - 最后一条消息
  - 未读数量
  - 免打扰状态
- 空状态提示

**数据格式**:
```javascript
{
  id: number,
  name: string,
  avatar: string,
  lastMessage: string,
  time: string,
  badge: string,        // '商家' 等标签
  unread: number,       // 未读数量
  muted: boolean        // 是否免打扰
}
```

---

### 2. contacts.vue - 通讯录

**路由**: `/im/contacts`

**功能**:
- 字母索引导航（A-Z, #）
- 特殊功能区：
  - 🔔 验证消息 → `/im/verification`
  - 🚫 黑名单 → `/im/blacklist`
  - 👥 我的群聊 → `/im/groups/my`
- 联系人按字母分组显示
- 顶部操作：
  - 🔍 搜索按钮
  - ➕ 添加好友 → `/im/add-friend`

**数据格式**:
```javascript
{
  id: number,
  name: string,
  avatar: string,
  pinyin: string        // 拼音，用于排序
}
```

---

### 3. add-friend.vue - 添加好友

**路由**: `/im/add-friend`

**功能**:
- 🔍 搜索用户（姓名或昵称）
- 🎯 实时过滤
- 📋 显示用户列表
- ➕ 添加好友操作
- ✅ 已添加状态显示
- 🔄 刷新列表功能

**优化亮点**:
- 💎 精美卡片设计
- 🎨 渐变色头像装饰
- ✨ 流畅的滑入动画
- 🌈 悬停阴影效果
- 💫 优雅的空状态

**数据格式**:
```javascript
{
  id: number,
  name: string,
  nickname: string,
  avatar: string,
  isAdded: boolean      // 是否已添加
}
```

**API 接口**:
```javascript
// 搜索用户
GET /api/users/search?q={query}

// 添加好友
POST /api/friends/add
Body: { userId: number }
```

---

### 4. groups.vue - 群组（通用页面）

**路由**: 
- `/im/groups/search` - 找群模式
- `/im/groups/my` - 我的群聊模式

**两种模式**:

#### 模式一：找群 (`mode=search`)
- 显示搜索栏
- 显示所有可加入的群组
- 支持按群名称或群号搜索
- "加入群"按钮
- 群满时显示"已满"状态

#### 模式二：我的群聊 (`mode=my`)
- 不显示搜索栏
- 显示已加入的群组列表
- 点击进入群聊详情
- 右侧箭头按钮

**数据格式**:
```javascript
{
  id: number,
  name: string,
  groupId: string,      // 群号
  memberCount: number,  // 当前成员数
  maxMembers: number,   // 最大成员数
  avatar: string
}
```

**API 接口**:
```javascript
// 找群 - 获取可加入的群组
GET /api/groups/search

// 我的群聊 - 获取已加入的群组
GET /api/groups/my

// 加入群组
POST /api/groups/join
Body: { groupId: number }
```

---

### 5. verification.vue - 验证消息

**路由**: `/im/verification`

**功能**:
- 显示好友验证请求列表
- 每条请求显示：
  - 头像
  - 姓名
  - 验证消息
  - 时间
  - 状态标签（待处理/已同意/已拒绝）
- 待处理请求显示操作按钮：
  - ✅ 同意按钮
  - ❌ 拒绝按钮
- 空状态提示

**数据格式**:
```javascript
{
  id: number,
  name: string,
  avatar: string,
  message: string,      // 验证消息
  time: string,         // 时间
  status: string        // 'pending' | 'accepted' | 'rejected'
}
```

**API 接口**:
```javascript
// 获取验证消息列表
GET /api/friends/verifications

// 同意好友请求
POST /api/friends/accept
Body: { verificationId: number }

// 拒绝好友请求
POST /api/friends/reject
Body: { verificationId: number }
```

---

### 6. blacklist.vue - 黑名单

**路由**: `/im/blacklist`

**功能**:
- 显示黑名单用户列表
- 每个用户显示：
  - 头像
  - 姓名
  - 拉黑时间
- "移除"按钮（带确认）
- 空状态提示

**数据格式**:
```javascript
{
  id: number,
  name: string,
  avatar: string,
  blockedAt: string     // 拉黑时间
}
```

**API 接口**:
```javascript
// 获取黑名单列表
GET /api/blacklist

// 移出黑名单
POST /api/blacklist/remove
Body: { userId: number }
```

---

### 7. select-members.vue - 选择群成员

**路由**: `/im/select-members`

**功能**:
- 🔍 搜索好友
- ✅ 多选好友（复选框）
- 👥 顶部已选成员预览
- ❌ 移除已选成员
- 💜 紫粉色主题
- 📊 实时显示已选数量
- ➡️ 下一步（跳转到创建群聊页面）

**特色交互**:
- 点击好友卡片进行多选
- 已选好友高亮显示
- 头像右下角复选框动画
- 顶部横向滚动的已选成员
- 快速移除按钮

**数据格式**:
```javascript
{
  id: number,
  name: string,
  nickname: string,
  avatar: string
}
```

**页面跳转**:
```javascript
// 下一步 → 创建群聊页面
router.push({
  name: 'CreateGroup',
  state: { members: selectedMembers }
})
```

---

### 8. create-group.vue - 创建群聊

**路由**: `/im/create-group`

**功能**:
- 📷 设置群头像（支持上传）
- ✏️ 输入群名称（必填，最多20字符）
- 📝 输入群简介（选填，最多100字符）
- 👥 显示群成员列表
- ➕ 添加更多成员
- ❌ 移除成员
- 💡 温馨提示
- ✨ 完成创建

**页面布局**:
1. **头部**：返回 + 标题 + 完成按钮
2. **群头像区**：大号圆角卡片，支持点击上传
3. **群名称**：单行输入，字符计数
4. **群简介**：多行输入，字符计数
5. **成员列表**：显示我（群主）+ 选中的成员
6. **提示信息**：蓝色提示框

**数据格式**:
```javascript
{
  name: string,           // 群名称
  description: string,    // 群简介
  avatar: string,         // 群头像URL
  memberIds: number[]     // 成员ID数组
}
```

**API 接口**:
```javascript
// 创建群聊
POST /api/groups/create
Body: {
  name: string,
  description: string,
  avatar: string,
  memberIds: number[]
}

// 上传群头像
POST /api/upload/group-avatar
Body: FormData (file)
```

---

## 🎨 设计规范

### 颜色主题

| 功能 | 主色调 | 说明 |
|------|--------|------|
| 好友功能 | 橙红渐变 | from-orange-400 to-red-500 |
| 群组功能 | 紫粉渐变 | from-purple-400 to-pink-500 |
| 验证消息 | 青蓝渐变 | from-teal-400 to-teal-500 |
| 黑名单 | 蓝靛渐变 | from-blue-400 to-blue-500 |

### 统一样式

所有页面采用统一的设计语言：

1. **头部样式**
   - 白色背景 + 阴影
   - 返回按钮（悬停效果）
   - 居中标题
   - 右侧操作按钮

2. **空状态**
   - 渐变色圆形图标背景
   - 浮动装饰元素动画
   - 友好的提示文案

3. **列表项**
   - 白色背景
   - 分割线
   - 淡入动画
   - 悬停效果

4. **按钮样式**
   - 渐变色主按钮
   - 圆角/圆形按钮
   - 悬停变色
   - 点击缩放效果

---

## 🔄 页面流程图

```
IM 主页 (/im)
│
├─ 通讯录图标 → /im/contacts
│   ├─ 验证消息 → /im/verification
│   ├─ 黑名单 → /im/blacklist
│   ├─ 我的群聊 → /im/groups/my
│   └─ 右上角+ → /im/add-friend
│
└─ 右上角+ 下拉菜单
    ├─ 加好友 → /im/add-friend
    ├─ 加群 → /im/groups/search
    └─ 创建群聊 → /im/select-members
        └─ 选择成员后 → /im/create-group
            └─ 创建成功 → /im (返回主页)
```

---

## 📊 路由配置

```javascript
// IM 模块路由
{
  path: '/im',
  name: 'IM',
  component: () => import('@/views/im/IM.vue')
}
{
  path: '/im/contacts',
  name: 'Contacts',
  component: () => import('@/views/im/contacts.vue')
}
{
  path: '/im/add-friend',
  name: 'AddFriend',
  component: () => import('@/views/im/add-friend.vue')
}
{
  path: '/im/groups/:mode',      // mode: 'search' | 'my'
  name: 'Groups',
  component: () => import('@/views/im/groups.vue')
}
{
  path: '/im/verification',
  name: 'Verification',
  component: () => import('@/views/im/verification.vue')
}
{
  path: '/im/blacklist',
  name: 'Blacklist',
  component: () => import('@/views/im/blacklist.vue')
}
{
  path: '/im/select-members',
  name: 'SelectMembers',
  component: () => import('@/views/im/select-members.vue')
}
{
  path: '/im/create-group',
  name: 'CreateGroup',
  component: () => import('@/views/im/create-group.vue')
}
```

---

## ✨ 特色功能

### 1. 页面复用
- `groups.vue` 通过路由参数 `mode` 实现两种模式
- 减少代码重复
- 统一的交互体验

### 2. 智能交互
- 搜索实时过滤
- 状态自动更新
- 智能空状态提示
- 确认操作保护

### 3. 流畅动画
- 页面淡入效果
- 列表项滑入动画
- 装饰元素浮动
- 按钮缩放反馈

### 4. 响应式设计
- 移动端优化
- 触摸友好
- 流畅滚动
- 自适应布局

---

## 🔌 后端对接指南

### API 响应格式建议

```javascript
// 成功响应
{
  code: 200,
  message: "success",
  data: { ... }
}

// 错误响应
{
  code: 400,
  message: "error message",
  data: null
}
```

### 状态码约定

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 未找到 |
| 500 | 服务器错误 |

---

## 🚀 开发建议

### 1. 页面间数据传递
```javascript
// 使用 router.push 传递数据
router.push({
  name: 'PageName',
  state: { data: value }
})

// 在目标页面接收数据
onMounted(() => {
  if (history.state && history.state.data) {
    // 使用数据
  }
})
```

### 2. 数据加载
```javascript
// 在 onMounted 中加载数据
onMounted(async () => {
  await fetchData()
})
```

### 3. 错误处理
```javascript
try {
  const response = await fetch('/api/...')
  if (!response.ok) throw new Error('请求失败')
  // 处理数据
} catch (error) {
  console.error(error)
  // 显示错误提示
}
```

### 4. 加载状态
```javascript
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    // 请求数据
  } finally {
    loading.value = false
  }
}
```

### 5. 防抖处理
```javascript
// 搜索输入防抖
import { debounce } from 'lodash-es'

const handleSearch = debounce(() => {
  // 搜索逻辑
}, 300)
```

---

## 📝 待实现功能

1. **聊天详情页**
   - 消息列表
   - 发送消息
   - 图片/文件发送

2. **群组详情页**
   - 群成员列表
   - 群设置
   - 退出群组

3. **用户详情页**
   - 用户信息展示
   - 发消息
   - 拉黑/删除好友

---

## 🎉 总结

本 IM 模块采用现代化的设计理念和技术栈：

- ✅ **8个完整的功能页面**
- ✅ **统一的设计语言**
- ✅ **流畅的动画效果**
- ✅ **完善的空状态处理**
- ✅ **友好的用户体验**
- ✅ **易于维护和扩展**
- ✅ **完整的后端接口预留**
- ✅ **完整的群聊创建流程**

所有页面已经过优化，代码结构清晰，注释完善，可直接对接后端API使用。

---

**文档更新时间**: 2024-10-21  
**项目版本**: Vue 3 + Vite + TailwindCSS

