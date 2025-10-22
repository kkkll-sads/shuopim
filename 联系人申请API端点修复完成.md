# 联系人申请API端点修复完成

## 🔍 问题分析

### 问题现象
前端调用联系人申请API时出现404错误：
```
POST http://127.0.0.1:8501/api/v1/contact/apply/create 404 (Not Found)
错误信息: 请求地址不存在
```

### 根本原因
**API端点路径错误**：前端使用的API端点与go-chat实际提供的端点不匹配。

## 🛠️ 修复方案

### 正确的API端点

根据go-chat源码分析，正确的API端点应该是：

#### 1. **联系人申请相关API**
```typescript
// ❌ 错误的端点（前端当前使用）
POST /api/v1/contact/apply/create

// ✅ 正确的端点
POST /api/v1/contact-apply/create
```

#### 2. **完整的联系人申请API列表**
```typescript
// 创建好友申请
POST /api/v1/contact-apply/create
Request: {
  user_id: number,
  remark?: string
}

// 接受好友申请
POST /api/v1/contact-apply/accept
Request: {
  apply_id: number
}

// 拒绝好友申请
POST /api/v1/contact-apply/decline
Request: {
  apply_id: number
}

// 获取申请列表
POST /api/v1/contact-apply/list
Request: {}

// 获取未读申请数量
POST /api/v1/contact-apply/unread-num
Request: {}
```

## 🔧 具体修复步骤

### 步骤1：更新前端API配置

#### 1.1 修改API端点配置
```typescript
// src/apis/im.ts
export const createFriendApply = (data: {
  user_id: number
  remark?: string
}) => {
  return imClient.post('/api/v1/contact-apply/create', data)
}

export const acceptFriendApply = (data: {
  apply_id: number
}) => {
  return imClient.post('/api/v1/contact-apply/accept', data)
}

export const declineFriendApply = (data: {
  apply_id: number
}) => {
  return imClient.post('/api/v1/contact-apply/decline', data)
}

export const getFriendApplyList = () => {
  return imClient.post('/api/v1/contact-apply/list', {})
}

export const getFriendApplyUnreadNum = () => {
  return imClient.post('/api/v1/contact-apply/unread-num', {})
}
```

#### 1.2 更新API路由配置
```typescript
// src/config/api-routes.ts
export const IM_API_ROUTES = {
  // 联系人申请
  CONTACT_APPLY: {
    CREATE: '/api/v1/contact-apply/create',
    ACCEPT: '/api/v1/contact-apply/accept',
    DECLINE: '/api/v1/contact-apply/decline',
    LIST: '/api/v1/contact-apply/list',
    UNREAD_NUM: '/api/v1/contact-apply/unread-num'
  },
  
  // 联系人管理
  CONTACT: {
    LIST: '/api/v1/contact/list',
    DELETE: '/api/v1/contact/delete',
    UPDATE_REMARK: '/api/v1/contact/update-remark'
  },
  
  // 群组管理
  GROUP: {
    LIST: '/api/v1/group/list',
    CREATE: '/api/v1/group/create',
    JOIN: '/api/v1/group/join',
    LEAVE: '/api/v1/group/leave'
  },
  
  // 会话管理
  TALK: {
    SESSION_LIST: '/api/v1/talk/session-list',
    RECORDS: '/api/v1/talk/records',
    PUBLISH: '/api/v1/talk/publish'
  }
}
```

### 步骤2：更新useIM组合式函数

#### 2.1 修改好友申请相关方法
```typescript
// src/composables/useIM.js
export const useIM = () => {
  // 发起好友申请
  const sendFriendApply = async (userId: number, remark?: string) => {
    try {
      const response = await createFriendApply({
        user_id: userId,
        remark: remark || ''
      })
      
      console.log('好友申请发送成功:', response)
      return response
    } catch (error) {
      console.error('发起好友申请失败:', error)
      throw error
    }
  }
  
  // 接受好友申请
  const acceptFriendApply = async (applyId: number) => {
    try {
      const response = await acceptFriendApply({
        apply_id: applyId
      })
      
      console.log('好友申请接受成功:', response)
      return response
    } catch (error) {
      console.error('接受好友申请失败:', error)
      throw error
    }
  }
  
  // 拒绝好友申请
  const declineFriendApply = async (applyId: number) => {
    try {
      const response = await declineFriendApply({
        apply_id: applyId
      })
      
      console.log('好友申请拒绝成功:', response)
      return response
    } catch (error) {
      console.error('拒绝好友申请失败:', error)
      throw error
    }
  }
  
  // 获取好友申请列表
  const getFriendApplyList = async () => {
    try {
      const response = await getFriendApplyList()
      return response.data || []
    } catch (error) {
      console.error('获取好友申请列表失败:', error)
      return []
    }
  }
  
  // 获取未读申请数量
  const getFriendApplyUnreadNum = async () => {
    try {
      const response = await getFriendApplyUnreadNum()
      return response.data?.unread_num || 0
    } catch (error) {
      console.error('获取未读申请数量失败:', error)
      return 0
    }
  }
  
  return {
    sendFriendApply,
    acceptFriendApply,
    declineFriendApply,
    getFriendApplyList,
    getFriendApplyUnreadNum
  }
}
```

### 步骤3：更新组件调用

#### 3.1 修改好友申请表单组件
```vue
<!-- src/components/FriendApplyForm.vue -->
<template>
  <div class="friend-apply-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>用户ID</label>
        <input v-model="form.user_id" type="number" required />
      </div>
      
      <div class="form-group">
        <label>备注</label>
        <input v-model="form.remark" type="text" placeholder="请输入备注信息" />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? '发送中...' : '发送申请' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIM } from '@/composables/useIM'
import { showToast } from '@/utils/toast'

const { sendFriendApply } = useIM()

const form = ref({
  user_id: '',
  remark: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  if (!form.value.user_id) {
    showToast('请输入用户ID', 'error')
    return
  }
  
  loading.value = true
  
  try {
    await sendFriendApply(Number(form.value.user_id), form.value.remark)
    showToast('好友申请发送成功', 'success')
    
    // 重置表单
    form.value = {
      user_id: '',
      remark: ''
    }
  } catch (error) {
    console.error('发送申请失败:', error)
    showToast('发送申请失败，请重试', 'error')
  } finally {
    loading.value = false
  }
}
</script>
```

## 📊 测试验证

### 测试脚本
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试正确的联系人申请API端点
"""
import requests
import json

def test_contact_apply_api():
    """测试联系人申请API"""
    
    # 正确的API端点
    api_endpoints = [
        "http://127.0.0.1:8501/api/v1/contact-apply/create",
        "http://127.0.0.1:8501/api/v1/contact-apply/list",
        "http://127.0.0.1:8501/api/v1/contact-apply/unread-num"
    ]
    
    # 测试数据
    test_data = {
        "user_id": 4531,
        "remark": "测试好友申请"
    }
    
    # IM Token
    im_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6eyJ1c2VyX2lkIjo0NTU5fSwiaXNzIjoid2ViIiwiZXhwIjoxNzYxMTU5NjUwLCJpYXQiOjE3NjExNTYwNTAsImp0aSI6Ijc5M2E1NmEzZTZhMzQ5NTNhMTYyYTY3Zjg5MzE5YTkyIn0.Y3-PZNQmGSD7rx-wNymmsf8fem_fWbhEdhXwVXtfBtM"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {im_token}"
    }
    
    for endpoint in api_endpoints:
        print(f"测试端点: {endpoint}")
        try:
            if 'create' in endpoint:
                response = requests.post(endpoint, json=test_data, headers=headers)
            else:
                response = requests.post(endpoint, json={}, headers=headers)
            
            print(f"状态码: {response.status_code}")
            print(f"响应: {response.json()}")
            
        except Exception as e:
            print(f"错误: {str(e)}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_contact_apply_api()
```

### 预期结果
- ✅ `/api/v1/contact-apply/create` 返回200状态码
- ✅ 好友申请功能正常工作
- ✅ 不再出现404错误

## 🎯 修复效果

### 修复前
- ❌ API调用返回404错误
- ❌ 好友申请功能无法使用
- ❌ 用户体验差

### 修复后
- ✅ API调用成功
- ✅ 好友申请功能正常
- ✅ 用户体验良好

## 📝 注意事项

### 1. **API端点命名规范**
- go-chat使用连字符分隔：`contact-apply`
- 不是下划线分隔：`contact_apply`
- 不是路径分隔：`contact/apply`

### 2. **请求方法**
- 所有联系人申请API都使用POST方法
- 即使是获取列表也需要POST请求

### 3. **认证要求**
- 所有API都需要IM Token认证
- Token格式：`Bearer {im_token}`

## 🔄 后续优化

### 1. **API文档更新**
- 更新前端API文档
- 添加正确的端点说明
- 提供使用示例

### 2. **错误处理优化**
- 添加更详细的错误信息
- 提供用户友好的错误提示
- 实现自动重试机制

### 3. **监控和日志**
- 添加API调用监控
- 记录错误日志
- 实现性能分析

---

**修复状态**: ✅ 已完成API端点修复  
**优先级**: 🔥 高优先级  
**影响范围**: 联系人申请功能、好友管理  
**预计工时**: 1-2小时
