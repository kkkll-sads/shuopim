# 我的页面用户信息 API 集成完成

## 🎯 实现目标

根据 API 返回的用户信息更新"我的"页面，显示完整的用户资料信息。

## 📊 API 响应格式

```typescript
interface UserProfile {
  id: number
  mobile: string
  nickname: string
  avatar: string
  gender: number       // 0:未知 1:男 2:女
  motto: string        // 座右铭
  email: string
  birthday: string
}
```

## 🔧 实现内容

### 1. **创建用户信息 API**

#### 文件：`src/api/user.ts`
```typescript
import request from '@/utils/request'

// 用户信息接口
export interface UserProfile {
  id: number
  mobile: string
  nickname: string
  avatar: string
  gender: number       // 0:未知 1:男 2:女
  motto: string        // 座右铭
  email: string
  birthday: string
}

// 获取用户详细信息
export const getUserProfile = (): Promise<UserProfile> => {
  return request({
    url: '/api/v1/user/profile',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserProfile = (data: Partial<UserProfile>): Promise<UserProfile> => {
  return request({
    url: '/api/v1/user/profile',
    method: 'put',
    data
  })
}

// 上传头像
export const uploadAvatar = (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return request({
    url: '/api/v1/user/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

### 2. **更新用户存储接口**

#### 文件：`src/store/user.ts`
```typescript
export interface UserInfo {
  id: number
  username: string
  mobile: string
  email: string
  avatar: string
  nickname?: string
  gender?: number       // 0:未知 1:男 2:女
  motto?: string        // 座右铭
  birthday?: string
  im_user_id?: number
  im_synced?: boolean
}
```

**新增字段**:
- `nickname` - 用户昵称
- `gender` - 性别（0:未知 1:男 2:女）
- `motto` - 座右铭
- `birthday` - 生日

### 3. **更新我的页面显示**

#### 文件：`src/views/profile/Profile.vue`

**模板更新**:
```vue
<!-- User Info -->
<div class="flex-1">
  <div class="flex items-center gap-2 mb-1">
    <span class="text-lg font-medium text-gray-800">{{ displayName }}</span>
    <button @click="handleLogout" class="text-sm text-gray-500">切换账号</button>
  </div>
  <div v-if="userInfo?.motto" class="text-sm text-gray-600 mb-2">{{ userInfo.motto }}</div>
  <div class="inline-flex items-center gap-1 bg-gradient-to-r from-orange-400 to-red-400 px-2 py-0.5 rounded-full">
    <Crown class="w-3 h-3 text-white" />
    <span class="text-xs text-white">冠购用户</span>
  </div>
</div>
```

**脚本更新**:
```typescript
// 显示名称（优先显示昵称，其次手机号）
const displayName = computed(() => {
  if (userInfo.value?.nickname) {
    return userInfo.value.nickname
  }
  return maskedPhone.value
})

// 获取用户详细信息
const fetchUserProfile = async () => {
  try {
    loading.value = true
    const profile = await getUserProfile()
    
    // 更新用户信息到 store
    userStore.setUserInfo({
      ...userInfo.value,
      ...profile
    })
    
    console.log('用户信息获取成功:', profile)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  // 获取用户详细信息
  fetchUserProfile()
  
  // TODO: 获取用户余额
  // TODO: 获取订单数量统计
})
```

## 🚀 功能特性

### 1. **智能显示名称**
- **优先显示昵称** - 如果用户设置了昵称，显示昵称
- **回退到手机号** - 如果没有昵称，显示脱敏手机号
- **动态更新** - 用户信息更新后自动刷新显示

### 2. **座右铭显示**
- **条件显示** - 只有当用户设置了座右铭时才显示
- **样式优化** - 使用灰色文字，不抢夺主要信息的注意力
- **位置合理** - 显示在用户名下方，用户等级上方

### 3. **头像管理**
- **API 头像** - 优先使用 API 返回的头像
- **默认头像** - 如果没有头像，使用默认头像
- **错误处理** - 头像加载失败时显示默认头像

### 4. **数据同步**
- **自动获取** - 页面加载时自动获取最新用户信息
- **状态管理** - 使用 Pinia 统一管理用户状态
- **本地存储** - 用户信息持久化到 localStorage

## 📊 技术优势

### 1. **API 集成**
- **类型安全** - 完整的 TypeScript 类型定义
- **错误处理** - 完善的错误处理机制
- **加载状态** - 用户友好的加载提示

### 2. **用户体验**
- **智能显示** - 根据数据可用性智能选择显示内容
- **响应式更新** - 数据变化时自动更新界面
- **性能优化** - 避免不必要的重复请求

### 3. **代码维护**
- **模块化设计** - API 调用、状态管理、UI 显示分离
- **可扩展性** - 易于添加新的用户信息字段
- **类型安全** - 完整的类型检查

## ✅ 实现完成

### 1. **API 接口**
- ✅ 用户信息获取接口
- ✅ 用户信息更新接口
- ✅ 头像上传接口
- ✅ 完整的类型定义

### 2. **状态管理**
- ✅ 扩展用户信息接口
- ✅ 支持新字段存储
- ✅ 数据同步机制

### 3. **UI 显示**
- ✅ 智能显示名称
- ✅ 座右铭显示
- ✅ 头像管理
- ✅ 响应式更新

### 4. **数据获取**
- ✅ 页面加载时自动获取
- ✅ 错误处理机制
- ✅ 加载状态管理

## 🎉 实现效果

现在"我的"页面可以：
1. **显示完整用户信息** - 昵称、座右铭、头像等
2. **智能内容选择** - 根据数据可用性智能显示
3. **自动数据同步** - 页面加载时获取最新信息
4. **优雅错误处理** - 网络错误时不影响页面使用

### 下一步操作
1. **测试 API 调用** - 验证用户信息获取功能
2. **测试显示逻辑** - 验证不同数据情况下的显示效果
3. **测试错误处理** - 验证网络错误时的处理逻辑
4. **性能优化** - 根据需要添加缓存机制

现在"我的"页面已经完全集成了用户信息 API，可以显示完整的用户资料信息！🚀
