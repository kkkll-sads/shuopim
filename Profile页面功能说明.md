# Profile 页面（我的）功能说明

## ✅ 已完成

"我的"页面已创建完成并添加到路由系统！

## 📱 页面访问

- **路由路径：** `/profile`
- **访问方式：** 
  1. 点击底部导航的"我的"按钮
  2. 直接访问 http://localhost:3000/profile（需要登录）

## 🎨 页面结构

### 1. 用户信息区域
- **头像：** 绿色渐变圆形头像，显示手机号后两位
- **手机号：** 显示脱敏手机号（188****8888）
- **退出登录按钮：** 点击退出登录
- **用户徽章：** 显示"树拍用户"标识

### 2. 余额卡片（橙红渐变）
显示三种资产类型：
- **树豆：** 可点击查看明细
- **消费券：** 可点击查看明细
- **树权：** 可点击查看明细

当前显示 `0.0000`（模拟数据）

### 3. 我的订单
显示五种订单状态：
- **待支付：** 💰 钱包图标
- **待发货：** 📦 包裹图标
- **待收货：** 📦 盒子图标
- **待评价：** ✏️ 编辑图标
- **退款/售后：** 🔄 旋转图标

每个状态都带有红色数字徽章（显示未处理订单数量）

### 4. 附加功能菜单
- **我的数资：** 网格图标
- **线下订单：** 日历图标
- **银行卡：** 信用卡图标
- **优惠券：** 票券图标

### 5. 设置入口
独立的设置按钮，带有右箭头

### 6. 底部导航
五个标签页：
- 生活圈（Home）
- 选品广场（TODO）
- 直播（TODO）
- 消息（IM）
- 我的（当前页）

## 🔧 功能实现

### 1. 用户信息展示
```javascript
// 手机号脱敏
const maskedPhone = computed(() => {
  const phone = userInfo.value?.phone || '188****8888'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

// 头像字母
const userInitial = computed(() => {
  const phone = userInfo.value?.phone || '188'
  return phone.slice(-2)
})
```

### 2. 退出登录
```javascript
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.clearAuth()  // 清除认证信息
    router.push('/login')  // 跳转到登录页
  }
}
```

### 3. 底部导航跳转
```javascript
const handleTabClick = (tabId) => {
  switch (tabId) {
    case 'home': router.push('/home'); break
    case 'message': router.push('/im'); break
    case 'profile': /* 当前页 */; break
    // 其他待实现
  }
}
```

### 4. 订单状态徽章
订单数量通过 `orderCounts` 对象管理：
```javascript
const orderCounts = ref({
  payment: 0,    // 待支付
  shipment: 0,   // 待发货
  receipt: 0,    // 待收货
  review: 0,     // 待评价
  refund: 0      // 退款/售后
})
```

## 🎯 交互优化

### 1. 按钮 Hover 效果
所有功能按钮都有缩放效果：
```vue
class="hover:scale-105 transition-transform"
```

### 2. 状态高亮
底部导航当前页高亮显示（橙色）：
```vue
:class="activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'"
```

### 3. 徽章显示
只有当数量大于0时才显示红色数字徽章：
```vue
<span v-if="orderCounts.payment > 0" class="...">
  {{ orderCounts.payment }}
</span>
```

## 📊 数据结构

### 用户信息
```javascript
{
  phone: '13800138000',
  name: '用户8000',
  // 从 userStore 获取
}
```

### 余额信息
```javascript
{
  beans: '0.0000',      // 树豆
  vouchers: '0.0000',   // 消费券
  rights: '0.0000'      // 树权
}
```

### 订单统计
```javascript
{
  payment: 0,   // 待支付
  shipment: 0,  // 待发货
  receipt: 0,   // 待收货
  review: 0,    // 待评价
  refund: 0     // 退款/售后
}
```

## 🔄 页面间导航

### 从 Home 页面到 Profile
```javascript
// 在 Home.vue 底部导航点击"我的"
handleNavClick('profile') → router.push('/profile')
```

### 从 Profile 返回 Home
```javascript
// 在 Profile 页面底部导航点击"生活圈"
handleTabClick('home') → router.push('/home')
```

## 🚀 待实现功能

### 1. API 集成
```javascript
// TODO: 在 onMounted 中调用
onMounted(async () => {
  // 获取用户余额
  const balanceRes = await getBalance()
  balances.value = balanceRes.data
  
  // 获取订单统计
  const orderRes = await getOrderStats()
  orderCounts.value = orderRes.data
})
```

### 2. 功能页面跳转
目前只输出 console.log，需要实现：
- 余额明细页面
- 各订单状态列表页面
- 我的数资页面
- 线下订单页面
- 银行卡管理页面
- 优惠券页面
- 设置页面

### 3. 选品广场和直播
底部导航的"选品广场"和"直播"功能待实现。

## 🧪 测试步骤

### 1. 访问页面
```
1. 登录系统
2. 访问 http://localhost:3000/profile
   或点击底部导航"我的"
```

### 2. 测试用户信息
```
✓ 检查头像显示
✓ 检查手机号脱敏
✓ 点击"退出登录"弹出确认框
```

### 3. 测试余额卡片
```
✓ 点击三个余额项都有响应
✓ 控制台输出对应的明细类型
```

### 4. 测试订单状态
```
✓ 点击五个订单状态都有响应
✓ 徽章正确显示（当前都是0）
```

### 5. 测试底部导航
```
✓ 点击"生活圈" → 跳转到 Home
✓ 点击"消息" → 跳转到 IM
✓ 点击"我的" → 保持当前页
✓ 当前页高亮显示（橙色）
```

## 📝 文件清单

### 新增文件
1. **src/views/Profile.vue** - 我的页面组件
2. **Profile页面功能说明.md** - 本文档

### 修改文件
1. **src/router/index.ts** - 添加 Profile 路由
2. **src/views/Home.vue** - 添加导航跳转逻辑

## 🎨 设计规范

### 颜色方案
- **主色：** 橙色 (`text-orange-500`, `bg-orange-500`)
- **渐变：** 橙红渐变 (`from-orange-400 via-orange-500 to-red-500`)
- **头像：** 绿色渐变 (`from-green-400 to-green-600`)
- **背景：** 灰色 (`bg-gray-100`)

### 图标
使用 Lucide Vue Next 图标库：
- Wallet, Package, Box, Edit3, RotateCcw
- Grid, Calendar, CreditCard, Ticket
- Settings, ChevronRight, User

### 布局
- 圆角卡片：`rounded-2xl`
- 阴影：`shadow-sm`, `shadow-lg`
- 间距：`mx-4 mt-4`
- 内边距：`p-4`, `p-6`

## ✅ 完成状态

- ✅ 页面创建完成
- ✅ 路由配置完成
- ✅ 用户信息展示
- ✅ 退出登录功能
- ✅ 余额卡片展示
- ✅ 订单状态展示
- ✅ 功能菜单展示
- ✅ 底部导航集成
- ✅ 页面间跳转
- ✅ 交互效果优化

**Profile 页面已完成并可以正常使用！** 🎉

