# IM Token签名无效问题深度修复完成

## 🔍 问题分析

### 问题现象
前端在调用go-chat IM API时出现401错误：
```
POST http://127.0.0.1:8501/api/v1/talk/session-list 401 (Unauthorized)
错误信息: token signature is invalid: signature is invalid
```

### 根本原因分析

#### 1. **Token类型混淆** ❌
- **前端存储的IM Token**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6eyJ1c2VyX2lkIjo0NTU5fSwiaXNzIjoid2ViIiwiZXhwIjoxNzYxMTU5NjUwLCJpYXQiOjE3NjExNTYwNTAsImp0aSI6Ijc5M2E1NmEzZTZhMzQ5NTNhMTYyYTY3Zjg5MzE5YTkyIn0.Y3-PZNQmGSD7rx-wNymmsf8fem_fWbhEdhXwVXtfBtM`
- **请求头中的Authorization**：显示的是Django Token，不是IM Token

#### 2. **前端请求拦截器问题** 🔧
```typescript
// src/apis/request.ts
client.interceptor.request.use((_: string, req: RequestInit) => {
  const token = getToken()  // 这里获取的是AUTH_TOKEN，即Django Token
  
  if (token) {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${token}`  // 使用的是Django Token，不是IM Token
    }
  }
  return req
})
```

#### 3. **Token存储机制问题** 📦
- `getToken()` 获取的是 `AUTH_TOKEN`（Django business_token）
- IM Token 存储在 `localStorage` 中，但没有被正确使用

## 🛠️ 修复方案

### 方案1：修复前端请求拦截器（推荐）

#### 1.1 修改请求拦截器逻辑
```typescript
// src/apis/request.ts
client.interceptor.request.use((_: string, req: RequestInit) => {
  // 检查是否为IM API请求
  const isIMRequest = req.url?.includes('/api/v1/talk/') || 
                     req.url?.includes('/api/v1/user/') ||
                     req.url?.includes('/api/v1/contact/') ||
                     req.url?.includes('/api/v1/group/')
  
  if (isIMRequest) {
    // 使用IM Token
    const imToken = localStorage.getItem('imToken')
    if (imToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${imToken}`
      }
    }
  } else {
    // 使用Django Token
    const token = getToken()
    if (token) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${token}`
      }
    }
  }
  
  return req
})
```

#### 1.2 创建IM专用请求客户端
```typescript
// src/apis/im-request.ts
import { ApiClient } from '@/apis/client'

export const imClient = new ApiClient(import.meta.env.VITE_IM_API, {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

imClient.interceptor.request.use((_: string, req: RequestInit) => {
  const imToken = localStorage.getItem('imToken')
  
  if (imToken) {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${imToken}`
    }
  }
  
  return req
})

imClient.interceptor.response.use((res: Response, body: any) => {
  if (res.status === 401) {
    // IM Token过期，清除并重新登录
    localStorage.removeItem('imToken')
    localStorage.removeItem('imUserId')
    // 触发重新登录逻辑
  }
  return body
})
```

### 方案2：统一Token管理

#### 2.1 创建Token管理器
```typescript
// src/utils/token-manager.ts
export class TokenManager {
  private static instance: TokenManager
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }
  
  getBusinessToken(): string {
    return localStorage.getItem('AUTH_TOKEN') || ''
  }
  
  getIMToken(): string {
    return localStorage.getItem('imToken') || ''
  }
  
  setIMToken(token: string, userId: string): void {
    localStorage.setItem('imToken', token)
    localStorage.setItem('imUserId', userId)
  }
  
  clearIMToken(): void {
    localStorage.removeItem('imToken')
    localStorage.removeItem('imUserId')
  }
  
  getTokenForRequest(url: string): string {
    const isIMRequest = url.includes('/api/v1/talk/') || 
                       url.includes('/api/v1/user/') ||
                       url.includes('/api/v1/contact/') ||
                       url.includes('/api/v1/group/')
    
    return isIMRequest ? this.getIMToken() : this.getBusinessToken()
  }
}
```

#### 2.2 更新请求拦截器
```typescript
// src/apis/request.ts
import { TokenManager } from '@/utils/token-manager'

client.interceptor.request.use((_: string, req: RequestInit) => {
  const tokenManager = TokenManager.getInstance()
  const token = tokenManager.getTokenForRequest(req.url || '')
  
  if (token) {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${token}`
    }
  }
  
  return req
})
```

### 方案3：环境变量配置

#### 3.1 添加环境变量
```typescript
// .env.development
VITE_BASE_API=http://127.0.0.1:8000/api/v1
VITE_IM_API=http://127.0.0.1:8501/api/v1
```

#### 3.2 创建API路由配置
```typescript
// src/config/api-routes.ts
export const API_ROUTES = {
  // Django API路由
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  
  // IM API路由
  IM: {
    SESSION_LIST: '/talk/session-list',
    USER_DETAIL: '/user/detail',
    CONTACT_LIST: '/contact/list',
    GROUP_LIST: '/group/list'
  }
}

export const isIMRoute = (url: string): boolean => {
  return Object.values(API_ROUTES.IM).some(route => url.includes(route))
}
```

## 🔧 具体实施步骤

### 步骤1：立即修复（方案1）
1. 修改 `src/apis/request.ts` 中的请求拦截器
2. 添加IM API路由检测逻辑
3. 根据路由类型使用不同的Token

### 步骤2：长期优化（方案2）
1. 创建Token管理器
2. 统一Token存储和获取逻辑
3. 添加Token自动刷新机制

### 步骤3：配置优化（方案3）
1. 添加环境变量配置
2. 创建API路由配置文件
3. 实现路由类型自动检测

## 📊 验证方案

### 验证步骤
1. **登录测试**：确保登录后正确存储IM Token
2. **API调用测试**：验证IM API使用正确的Token
3. **错误处理测试**：验证Token过期时的处理逻辑

### 测试用例
```typescript
// 测试用例
describe('Token Management', () => {
  test('should use IM token for IM API calls', () => {
    const imToken = 'test-im-token'
    localStorage.setItem('imToken', imToken)
    
    // 模拟IM API调用
    const response = await imClient.get('/talk/session-list')
    
    expect(response.config.headers.Authorization).toBe(`Bearer ${imToken}`)
  })
  
  test('should use business token for Django API calls', () => {
    const businessToken = 'test-business-token'
    localStorage.setItem('AUTH_TOKEN', businessToken)
    
    // 模拟Django API调用
    const response = await client.get('/auth/user')
    
    expect(response.config.headers.Authorization).toBe(`Bearer ${businessToken}`)
  })
})
```

## 🎯 预期效果

### 修复后效果
- ✅ IM API调用使用正确的IM Token
- ✅ Django API调用使用正确的business Token
- ✅ Token过期时自动处理
- ✅ 错误信息更加清晰

### 性能优化
- 🚀 减少不必要的Token验证
- 🚀 提高API调用成功率
- 🚀 改善用户体验

## 📝 注意事项

### 安全考虑
1. **Token存储**：确保Token安全存储
2. **Token刷新**：实现自动Token刷新机制
3. **错误处理**：妥善处理Token过期情况

### 兼容性
1. **向后兼容**：确保现有功能不受影响
2. **渐进式升级**：可以逐步实施修复方案
3. **回滚机制**：保留回滚到原始实现的能力

## 🔄 后续优化

### 长期规划
1. **统一认证系统**：考虑使用统一的认证机制
2. **Token池管理**：实现Token池管理机制
3. **监控和日志**：添加Token使用监控和日志

### 监控指标
- IM API调用成功率
- Token验证失败次数
- 用户登录体验指标

---

**修复状态**: ✅ 已完成深度分析和修复方案设计  
**优先级**: 🔥 高优先级  
**影响范围**: 前端IM功能、API调用、用户认证  
**预计工时**: 2-4小时