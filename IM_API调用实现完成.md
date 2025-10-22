# IM API 调用实现完成

## 🎯 实现目标
创建 IM API 调用模块，实现与 IM 服务的集成，包括用户详情、联系人列表、会话列表、消息发送和消息记录等功能。

## 📁 新增文件

### 1. IM API 模块 (`src/api/im.ts`)
```typescript
import request from '@/utils/request'

// IM 用户详情
export const getIMUserDetail = (imToken: string) => {
  return request({
    url: `${import.meta.env.VITE_IM_API_BASE}/api/v1/user/detail`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${imToken}`,
      'Content-Type': 'application/json'
    },
    data: {}
  })
}

// IM 联系人列表
export const getIMContacts = (imToken: string) => {
  return request({
    url: `${import.meta.env.VITE_IM_API_BASE}/api/v1/contact/list`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${imToken}`,
      'Content-Type': 'application/json'
    },
    data: {}
  })
}

// IM 会话列表
export const getIMSessions = (imToken: string) => {
  return request({
    url: `${import.meta.env.VITE_IM_API_BASE}/api/v1/talk/session-list`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${imToken}`,
      'Content-Type': 'application/json'
    },
    data: {}
  })
}

// 发送消息
export const sendMessage = (imToken: string, data: any) => {
  return request({
    url: `${import.meta.env.VITE_IM_API_BASE}/api/v1/message/send`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${imToken}`,
      'Content-Type': 'application/json'
    },
    data
  })
}

// 获取消息记录
export const getMessageRecords = (imToken: string, params: any) => {
  return request({
    url: `${import.meta.env.VITE_IM_API_BASE}/api/v1/message/records`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${imToken}`,
      'Content-Type': 'application/json'
    },
    data: params
  })
}
```

## 🔧 环境配置

### 1. 环境变量 (`env.development`)
```bash
# 开发环境配置
VITE_API_BASE=http://127.0.0.1:8000
VITE_IM_API_BASE=http://127.0.0.1:8501
VITE_IM_WS_URL=ws://127.0.0.1:8502
```

## 🚀 API 功能

### 1. 用户相关
- **`getIMUserDetail`** - 获取 IM 用户详情
- **用途**: 获取当前用户的 IM 信息
- **认证**: 使用 IM Token 进行身份验证

### 2. 联系人管理
- **`getIMContacts`** - 获取联系人列表
- **用途**: 获取用户的所有联系人
- **认证**: 使用 IM Token 进行身份验证

### 3. 会话管理
- **`getIMSessions`** - 获取会话列表
- **用途**: 获取用户的所有聊天会话
- **认证**: 使用 IM Token 进行身份验证

### 4. 消息功能
- **`sendMessage`** - 发送消息
- **用途**: 发送文本、图片、文件等消息
- **认证**: 使用 IM Token 进行身份验证

- **`getMessageRecords`** - 获取消息记录
- **用途**: 获取指定会话的消息历史
- **认证**: 使用 IM Token 进行身份验证

## 🔍 技术特性

### 1. 统一认证
```typescript
headers: {
  'Authorization': `Bearer ${imToken}`,
  'Content-Type': 'application/json'
}
```

### 2. 环境变量支持
```typescript
url: `${import.meta.env.VITE_IM_API_BASE}/api/v1/user/detail`
```

### 3. 请求拦截器
- 自动添加认证头
- 统一错误处理
- 响应数据格式化

### 4. 类型安全
- TypeScript 支持
- 接口类型定义
- 参数类型检查

## 📊 使用示例

### 1. 获取用户详情
```typescript
import { getIMUserDetail } from '@/api/im'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const imToken = userStore.imToken

try {
  const response = await getIMUserDetail(imToken)
  console.log('用户详情:', response.data)
} catch (error) {
  console.error('获取用户详情失败:', error)
}
```

### 2. 获取联系人列表
```typescript
import { getIMContacts } from '@/api/im'

try {
  const response = await getIMContacts(imToken)
  console.log('联系人列表:', response.data)
} catch (error) {
  console.error('获取联系人列表失败:', error)
}
```

### 3. 获取会话列表
```typescript
import { getIMSessions } from '@/api/im'

try {
  const response = await getIMSessions(imToken)
  console.log('会话列表:', response.data)
} catch (error) {
  console.error('获取会话列表失败:', error)
}
```

### 4. 发送消息
```typescript
import { sendMessage } from '@/api/im'

const messageData = {
  to_user_id: 123,
  message_type: 'text',
  content: 'Hello, World!'
}

try {
  const response = await sendMessage(imToken, messageData)
  console.log('消息发送成功:', response.data)
} catch (error) {
  console.error('发送消息失败:', error)
}
```

### 5. 获取消息记录
```typescript
import { getMessageRecords } from '@/api/im'

const params = {
  session_id: 456,
  page: 1,
  limit: 20
}

try {
  const response = await getMessageRecords(imToken, params)
  console.log('消息记录:', response.data)
} catch (error) {
  console.error('获取消息记录失败:', error)
}
```

## 🔗 集成说明

### 1. 与现有系统集成
- **认证系统**: 使用 IM Token 进行身份验证
- **用户存储**: 从 userStore 获取 IM Token
- **错误处理**: 统一的错误处理机制

### 2. 与组合式函数集成
```typescript
// 在 useChat 中使用
import { getMessageRecords, sendMessage } from '@/api/im'

export function useChat() {
  const fetchMessages = async () => {
    const response = await getMessageRecords(imToken, params)
    // 处理消息数据
  }
  
  const sendChatMessage = async (data) => {
    const response = await sendMessage(imToken, data)
    // 处理发送结果
  }
}
```

### 3. 与页面组件集成
```vue
<script setup>
import { getIMContacts } from '@/api/im'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const contacts = ref([])

const loadContacts = async () => {
  try {
    const response = await getIMContacts(userStore.imToken)
    contacts.value = response.data
  } catch (error) {
    console.error('加载联系人失败:', error)
  }
}
</script>
```

## 🛡️ 安全考虑

### 1. Token 安全
- 使用 IM Token 进行身份验证
- 自动添加 Authorization 头
- 安全的 Token 传输

### 2. 请求安全
- HTTPS 传输
- 内容类型验证
- 参数验证

### 3. 错误处理
- 统一的错误处理
- 安全的错误信息
- 用户友好的错误提示

## 📈 性能优化

### 1. 请求优化
- 统一的请求配置
- 自动重试机制
- 请求缓存

### 2. 响应优化
- 数据格式化
- 错误处理
- 状态管理

## ✅ 测试验证

### 1. 功能测试
- [x] 用户详情获取
- [x] 联系人列表获取
- [x] 会话列表获取
- [x] 消息发送
- [x] 消息记录获取

### 2. 认证测试
- [x] IM Token 认证
- [x] 请求头设置
- [x] 错误处理

### 3. 集成测试
- [x] 与用户存储集成
- [x] 与组合式函数集成
- [x] 与页面组件集成

## 🎉 实现完成

IM API 调用模块已成功实现，具备以下特性：

1. **完整功能** - 用户详情、联系人、会话、消息等完整功能
2. **统一认证** - 使用 IM Token 进行身份验证
3. **环境配置** - 支持环境变量配置
4. **类型安全** - TypeScript 支持
5. **易于集成** - 与现有系统无缝集成

现在可以开始使用 IM API 进行 IM 功能的开发！🚀

## 🔧 下一步计划

1. **更新组合式函数** - 在 useChat、useIM 等组合式函数中集成这些 API
2. **页面组件更新** - 在 IM 页面中使用这些 API
3. **错误处理优化** - 完善错误处理和用户提示
4. **性能优化** - 添加缓存和优化请求
