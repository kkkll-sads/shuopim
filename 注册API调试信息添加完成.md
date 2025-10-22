# 注册API调试信息添加完成

## 🎯 调试目标

为了定位注册API 400错误的具体原因，在多个关键位置添加了详细的调试信息。

## 🔧 添加的调试信息

### 1. Register.vue 页面调试
**文件**: `src/views/auth/Register.vue`

```javascript
// 添加的调试信息
console.log('准备发送注册请求，数据:', registerData)
console.log('API基础URL:', import.meta.env.VITE_API_BASE || 'http://localhost:8000')
console.log('完整请求URL:', `${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/v1/auth/register`)
console.log('注册API响应:', result)

// 错误调试信息
console.error('注册失败，详细错误信息:', error)
console.error('错误类型:', error.constructor.name)
console.error('错误消息:', error.message)
console.error('错误响应:', error.response)
console.error('错误状态码:', error.response?.status)
console.error('错误数据:', error.response?.data)
console.error('错误配置:', error.config)
```

### 2. useAuth.js 组合式函数调试
**文件**: `src/composables/useAuth.js`

```javascript
// 添加的调试信息
console.log('useAuth: 开始调用注册API，用户数据:', userData)
console.log('useAuth: 注册API函数已导入')
console.log('useAuth: 准备发送请求到后端API')
console.log('useAuth: 注册API响应:', response)
console.log('useAuth: 注册成功，保存认证信息')

// 错误调试信息
console.error('useAuth: 注册失败，响应码:', response.code, '消息:', response.message)
console.error('useAuth: 注册API调用失败，详细错误:', error)
console.error('useAuth: 错误类型:', error.constructor.name)
console.error('useAuth: 错误消息:', error.message)
console.error('useAuth: 错误响应:', error.response)
console.error('useAuth: 错误状态码:', error.response?.status)
console.error('useAuth: 错误数据:', error.response?.data)
```

### 3. auth.ts API文件调试
**文件**: `src/api/auth.ts`

```javascript
// 添加的调试信息
console.log('auth.ts: 准备发送注册请求')
console.log('auth.ts: 请求数据:', data)
console.log('auth.ts: 请求URL: /api/v1/auth/register')
console.log('auth.ts: 请求方法: POST')
console.log('auth.ts: 注册API成功响应:', response)

// 错误调试信息
console.error('auth.ts: 注册API失败，详细错误:', error)
console.error('auth.ts: 错误类型:', error.constructor.name)
console.error('auth.ts: 错误消息:', error.message)
console.error('auth.ts: 错误响应:', error.response)
console.error('auth.ts: 错误状态码:', error.response?.status)
console.error('auth.ts: 错误数据:', error.response?.data)
console.error('auth.ts: 错误配置:', error.config)
```

### 4. request.ts 请求拦截器调试
**文件**: `src/utils/request.ts`

```javascript
// 请求拦截器调试信息
console.log('request.ts: 请求拦截器 - 准备发送请求')
console.log('request.ts: 请求URL:', config.url)
console.log('request.ts: 请求方法:', config.method)
console.log('request.ts: 请求头:', config.headers)
console.log('request.ts: 请求数据:', config.data)
console.log('request.ts: 已添加Authorization头')
console.log('request.ts: 未找到token，跳过Authorization头')

// 响应拦截器调试信息
console.log('request.ts: 响应拦截器 - 收到响应')
console.log('request.ts: 响应状态码:', response.status)
console.log('request.ts: 响应头:', response.headers)
console.log('request.ts: 响应数据:', response.data)
console.log('request.ts: 响应成功，返回数据:', data)

// 错误调试信息
console.error('request.ts: 响应拦截器 - 请求失败')
console.error('request.ts: 错误对象:', error)
console.error('request.ts: 错误响应:', error.response)
console.error('request.ts: 错误状态码:', error.response?.status)
console.error('request.ts: 错误数据:', error.response?.data)
console.error('request.ts: 错误配置:', error.config)
```

## 📊 调试信息覆盖范围

### 1. 请求发送前
- ✅ 用户输入数据验证
- ✅ API基础URL配置
- ✅ 完整请求URL构建
- ✅ 请求数据格式检查

### 2. 请求发送过程
- ✅ 请求拦截器执行
- ✅ 请求头设置
- ✅ 请求数据发送
- ✅ API函数调用

### 3. 响应处理过程
- ✅ 响应拦截器执行
- ✅ 响应状态码检查
- ✅ 响应数据处理
- ✅ 错误处理逻辑

### 4. 错误处理
- ✅ 错误类型识别
- ✅ 错误消息提取
- ✅ 错误响应数据
- ✅ 错误配置信息

## 🎯 调试信息使用指南

### 1. 打开浏览器开发者工具
1. 按 `F12` 或右键选择"检查"
2. 切换到 `Console` 标签页
3. 清空控制台日志

### 2. 执行注册操作
1. 填写注册表单
2. 点击注册按钮
3. 观察控制台输出

### 3. 关键调试信息查看
- **请求数据**: 检查发送的数据格式是否正确
- **请求URL**: 确认API地址是否正确
- **请求头**: 检查Content-Type等头部信息
- **响应数据**: 查看后端返回的具体错误信息
- **错误状态码**: 确认HTTP状态码
- **错误数据**: 查看后端返回的错误详情

## 🔧 常见问题排查

### 1. 数据格式问题
- 检查 `请求数据` 中的字段名是否正确
- 检查 `请求数据` 中的数据类型是否正确
- 检查是否有空值或undefined

### 2. API地址问题
- 检查 `API基础URL` 是否正确
- 检查 `完整请求URL` 是否可访问
- 确认后端服务是否运行

### 3. 请求头问题
- 检查 `Content-Type` 是否为 `application/json`
- 检查是否有必要的认证头
- 检查请求头格式是否正确

### 4. 后端响应问题
- 查看 `错误数据` 中的具体错误信息
- 检查后端API是否支持该请求格式
- 确认后端API的期望数据格式

## 🎉 总结

调试信息已全面添加！

1. **全面覆盖** - 从页面到API的完整调用链
2. **详细信息** - 包含请求、响应、错误的详细信息
3. **易于排查** - 分层次的调试信息便于定位问题
4. **实时监控** - 可以实时查看API调用过程

现在可以通过控制台日志详细分析注册API 400错误的具体原因！🎉
