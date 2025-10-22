# 请求拦截器 Token 分离修复完成

## 🎯 修复目标

将 IM API 和 Django API 的 Token 使用分离，确保：
- **IM API 使用 IM Token** - 用于 IM 相关功能
- **Django API 使用 Django Token** - 用于业务功能
- **智能识别 API 类型** - 自动选择合适的 Token

## 🔧 修复内容

### 1. **修改请求拦截器逻辑**

#### 文件：`src/utils/request.ts`
```typescript
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 检查是否为IM API请求
    const isIMRequest = config.url?.includes('/api/v1/talk/') || 
                       config.url?.includes('/api/v1/user/') ||
                       config.url?.includes('/api/v1/contact/') ||
                       config.url?.includes('/api/v1/group/') ||
                       config.url?.includes('/api/v1/message/')
    
    if (isIMRequest) {
      // 使用IM Token
      const imToken = localStorage.getItem('imToken')
      if (imToken) {
        config.headers.Authorization = `Bearer ${imToken}`
        console.log('request.ts: 已添加IM Token Authorization头')
      } else {
        console.log('request.ts: 未找到IM Token，跳过Authorization头')
      }
    } else {
      // 使用Django Token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('request.ts: 已添加Django Token Authorization头')
      } else {
        console.log('request.ts: 未找到Django Token，跳过Authorization头')
      }
    }
    
    return config
  }
)
```

### 2. **创建 IM 专用请求客户端**

#### 文件：`src/utils/im-request.ts`
```typescript
import axios from 'axios'
import { showToast } from 'vant'

// 创建IM专用的axios实例
const imRequest = axios.create({
  baseURL: import.meta.env.VITE_IM_API_BASE || 'http://127.0.0.1:8501',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// IM请求拦截器
imRequest.interceptors.request.use(
  (config) => {
    // 使用IM Token
    const imToken = localStorage.getItem('imToken')
    if (imToken) {
      config.headers.Authorization = `Bearer ${imToken}`
      console.log('im-request.ts: 已添加IM Token Authorization头')
    } else {
      console.log('im-request.ts: 未找到IM Token，跳过Authorization头')
    }
    
    return config
  }
)

// IM响应拦截器
imRequest.interceptors.response.use(
  (response) => {
    // 处理成功响应
    const { code, data, message } = response.data
    
    if (code === 200 || code === 201) {
      return data
    } else {
      showToast(message || 'IM请求失败')
      return Promise.reject(new Error(message || 'IM请求失败'))
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      // IM Token过期，清除IM相关数据
      localStorage.removeItem('imToken')
      localStorage.removeItem('imUserId')
      showToast('IM Token已过期，请重新登录')
    } else {
      showToast(error.message || 'IM网络错误')
    }
    return Promise.reject(error)
  }
)
```

### 3. **更新 IM API 调用**

#### 文件：`src/api/im.ts`
```typescript
import imRequest from '@/utils/im-request'

// IM 用户详情
export const getIMUserDetail = () => {
  return imRequest({
    url: '/api/v1/user/detail',
    method: 'post',
    data: {}
  })
}

// IM 联系人列表
export const getIMContacts = () => {
  return imRequest({
    url: '/api/v1/contact/list',
    method: 'post',
    data: {}
  })
}

// IM 会话列表
export const getIMSessions = () => {
  return imRequest({
    url: '/api/v1/talk/session-list',
    method: 'post',
    data: {}
  })
}

// 发送消息
export const sendMessage = (data: any) => {
  return imRequest({
    url: '/api/v1/message/send',
    method: 'post',
    data
  })
}

// 获取消息记录
export const getMessageRecords = (params: any) => {
  return imRequest({
    url: '/api/v1/message/records',
    method: 'post',
    data: params
  })
}
```

### 4. **更新组合式函数**

#### 文件：`src/composables/useIM.js`
```javascript
// 调用真实的 IM API
const response = await getIMSessions()  // 移除 imToken 参数

// 调用真实的 IM API
const response = await getIMContacts()  // 移除 imToken 参数
```

#### 文件：`src/composables/useChat.js`
```javascript
// 调用真实的 IM API
const response = await getMessageRecords({
  session_id: chatId,
  page: 1,
  limit: 50
})  // 移除 imToken 参数

// 调用真实的 IM API
const response = await sendIMMessage({
  to_user_id: messageData.toUserId || chatId,
  message_type: messageData.type || 'text',
  content: messageData.content,
  session_id: chatId
})  // 移除 imToken 参数
```

## 🚀 修复效果

### 1. **智能 Token 选择**
- **IM API 请求** → 自动使用 `imToken`
- **Django API 请求** → 自动使用 `token`
- **无需手动传递 Token** → 拦截器自动处理

### 2. **API 路径识别**
```javascript
// IM API 路径模式
const isIMRequest = config.url?.includes('/api/v1/talk/') || 
                   config.url?.includes('/api/v1/user/') ||
                   config.url?.includes('/api/v1/contact/') ||
                   config.url?.includes('/api/v1/group/') ||
                   config.url?.includes('/api/v1/message/')
```

### 3. **错误处理优化**
- **IM Token 过期** → 清除 IM 相关数据，提示重新登录
- **Django Token 过期** → 清除所有登录数据，跳转登录页
- **网络错误** → 显示相应的错误提示

### 4. **代码简化**
- **移除 Token 参数** → API 调用更简洁
- **统一错误处理** → 拦截器统一处理
- **自动 Token 管理** → 无需手动管理

## 📊 技术优势

### 1. **Token 分离**
- **IM Token** → 专门用于 IM 功能
- **Django Token** → 专门用于业务功能
- **独立过期处理** → 不同 Token 独立管理

### 2. **智能识别**
- **URL 模式匹配** → 自动识别 API 类型
- **拦截器处理** → 透明化 Token 管理
- **错误分类** → 针对性错误处理

### 3. **代码维护**
- **集中管理** → 拦截器统一处理
- **易于扩展** → 新增 API 类型简单
- **调试友好** → 详细的日志输出

## ✅ 修复完成

### 1. **请求拦截器优化**
- ✅ 智能识别 IM API 和 Django API
- ✅ 自动选择合适的 Token
- ✅ 详细的调试日志

### 2. **IM 专用客户端**
- ✅ 独立的 IM 请求客户端
- ✅ 专门的 IM Token 处理
- ✅ 针对性的错误处理

### 3. **API 调用简化**
- ✅ 移除 Token 参数传递
- ✅ 统一的 API 调用方式
- ✅ 透明的 Token 管理

### 4. **错误处理优化**
- ✅ IM Token 过期处理
- ✅ Django Token 过期处理
- ✅ 网络错误处理

## 🎉 修复效果

现在系统可以：
1. **自动识别 API 类型** - 根据 URL 路径自动选择 Token
2. **独立管理 Token** - IM Token 和 Django Token 独立处理
3. **简化 API 调用** - 无需手动传递 Token 参数
4. **优化错误处理** - 针对不同 Token 的过期处理

### 下一步操作
1. **测试 IM API 调用** - 验证 IM Token 是否正确使用
2. **测试 Django API 调用** - 验证 Django Token 是否正确使用
3. **测试错误处理** - 验证 Token 过期时的处理逻辑
4. **性能测试** - 验证拦截器性能影响

现在 Token 分离功能已经完全实现，系统可以智能地为不同的 API 使用相应的 Token！🚀
