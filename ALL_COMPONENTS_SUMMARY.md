# 项目可复用组件完整总览

## 📦 组件库总览

本项目包含 **15 个高度可复用的组件**，分为三大类：IM 组件、通用组件和 Profile 组件。

---

## 📁 组件结构

```
src/components/
├── im/                    # IM 聊天相关组件 (6个)
│   ├── UserCard.vue
│   ├── GroupCard.vue
│   ├── ChatItem.vue
│   ├── SearchBar.vue
│   ├── EmptyState.vue
│   ├── Avatar.vue
│   └── index.js
│
├── common/                # 通用组件 (4个)
│   ├── PageHeader.vue
│   ├── FormInput.vue
│   ├── FormButton.vue
│   ├── Card.vue
│   └── index.js
│
└── profile/               # 个人中心组件 (5个)
    ├── MenuItem.vue
    ├── BalanceCard.vue
    ├── StatCard.vue
    ├── TransactionItem.vue
    ├── InfoItem.vue
    └── index.js
```

---

## 🎯 组件分类详情

### 一、IM 组件 (6个)

#### 1. **UserCard** - 用户卡片
- **用途**: 展示用户信息
- **场景**: 添加好友、选择成员、联系人列表
- **特点**: 
  - 支持选中状态
  - 多种徽章类型
  - 在线状态显示
  - 自定义操作插槽

#### 2. **GroupCard** - 群组卡片
- **用途**: 展示群组信息
- **场景**: 找群、我的群聊
- **特点**:
  - 方形圆角头像
  - 成员数显示
  - 群满状态提示
  - 紫粉色主题

#### 3. **ChatItem** - 聊天项
- **用途**: 聊天列表项
- **场景**: IM 主页
- **特点**:
  - 自动区分单人/群聊
  - 未读数显示
  - 免打扰模式
  - 用户标签

#### 4. **SearchBar** - 搜索栏
- **用途**: 搜索输入
- **场景**: 所有需要搜索的页面
- **特点**:
  - v-model 双向绑定
  - 防抖功能
  - 清除按钮
  - 自定义按钮

#### 5. **EmptyState** - 空状态
- **用途**: 空数据展示
- **场景**: 所有列表为空的情况
- **特点**:
  - 8种预设图标
  - 6种主题颜色
  - 浮动动画
  - 可选操作按钮

#### 6. **Avatar** - 头像
- **用途**: 用户/群组头像
- **场景**: 所有需要显示头像的地方
- **特点**:
  - 5种尺寸
  - 3种形状
  - 徽章支持
  - 在线状态

---

### 二、通用组件 (4个)

#### 1. **PageHeader** - 页面头部
- **用途**: 统一的页面头部
- **场景**: 所有子页面
- **特点**:
  - 返回按钮
  - 标题居中
  - 左右插槽
  - 操作按钮
- **Props**: `title`, `showBack`, `bgClass`, `shadow`, `showAction`

**使用示例**:
```vue
<PageHeader 
  title="添加好友"
  show-action
  action-text="完成"
  @action="handleSubmit"
/>
```

#### 2. **FormInput** - 表单输入框
- **用途**: 统一的输入框样式
- **场景**: 所有表单页面
- **特点**:
  - 支持文本/密码/邮箱等
  - 前缀/后缀图标
  - 清除按钮
  - 字符计数
  - 错误提示
  - v-model 双向绑定
- **Props**: `modelValue`, `type`, `label`, `placeholder`, `error`, `maxlength`

**使用示例**:
```vue
<FormInput
  v-model="username"
  label="用户名"
  placeholder="请输入用户名"
  :prefix-icon="User"
  show-clear
  required
/>
```

#### 3. **FormButton** - 表单按钮
- **用途**: 统一的按钮样式
- **场景**: 所有需要按钮的地方
- **特点**:
  - 6种样式变体
  - 3种尺寸
  - Loading 状态
  - 前缀/后缀图标
  - 自动缩放动画
- **Props**: `variant`, `size`, `loading`, `disabled`, `block`
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`

**使用示例**:
```vue
<FormButton
  variant="primary"
  size="large"
  :loading="isSubmitting"
  block
  @click="handleSubmit"
>
  提交
</FormButton>
```

#### 4. **Card** - 通用卡片
- **用途**: 统一的卡片容器
- **场景**: 所有需要卡片布局的地方
- **特点**:
  - 标题/图标
  - 分隔线
  - 头部/底部插槽
  - 可点击
  - 阴影效果
- **Props**: `title`, `icon`, `shadow`, `clickable`, `divider`

**使用示例**:
```vue
<Card title="我的订单" :icon="Package" divider>
  <OrderList />
  <template #footer>
    <button>查看全部</button>
  </template>
</Card>
```

---

### 三、Profile 组件 (5个)

#### 1. **MenuItem** - 菜单项
- **用途**: 个人中心菜单项
- **场景**: Profile 页面、设置页面
- **特点**:
  - 图标 + 文本
  - 徽章支持
  - 右侧值/箭头
  - 描述文本
- **Props**: `title`, `icon`, `iconBg`, `badge`, `value`, `showArrow`

**使用示例**:
```vue
<MenuItem
  title="我的订单"
  :icon="Package"
  icon-bg="bg-gradient-to-br from-blue-400 to-blue-500"
  badge="3"
  @click="goToOrders"
/>
```

#### 2. **BalanceCard** - 余额卡片
- **用途**: 展示余额信息
- **场景**: 我的数资、余额详情
- **特点**:
  - 渐变背景
  - 主余额/副余额
  - 操作按钮
  - 点击跳转
- **Props**: `label`, `value`, `subValue`, `icon`, `bgGradient`, `actions`

**使用示例**:
```vue
<BalanceCard
  label="树豆"
  :value="12345"
  sub-label="冻结"
  :sub-value="100"
  :icon="Coins"
  bg-gradient="bg-gradient-to-r from-orange-400 to-orange-600"
  show-action
  :actions="[
    { label: '充值', action: 'recharge' },
    { label: '提现', action: 'withdraw' }
  ]"
  @click="viewDetail"
  @action="handleAction"
/>
```

#### 3. **StatCard** - 统计卡片
- **用途**: 展示统计数据
- **场景**: 数据统计、收入详情
- **特点**:
  - 图标 + 标签
  - 大号数值
  - 单位显示
  - 趋势指示
- **Props**: `label`, `value`, `unit`, `icon`, `trend`, `trendText`

**使用示例**:
```vue
<StatCard
  label="今日收入"
  :value="1234.56"
  unit="元"
  :icon="DollarSign"
  trend="up"
  trend-text="较昨日+12.5%"
  clickable
  show-arrow
  @click="viewDetails"
/>
```

#### 4. **TransactionItem** - 交易记录项
- **用途**: 展示单条交易记录
- **场景**: 交易明细、账单
- **特点**:
  - 收入/支出类型
  - 金额高亮
  - 状态标签
  - 图标支持
- **Props**: `title`, `amount`, `type`, `status`, `description`, `date`
- **Types**: `income`, `expense`
- **Status**: `pending`, `success`, `failed`, `cancelled`

**使用示例**:
```vue
<TransactionItem
  title="购买商品"
  :amount="99.00"
  type="expense"
  status="success"
  description="商品订单支付"
  date="2024-10-21 15:30"
  :icon="ShoppingCart"
/>
```

#### 5. **InfoItem** - 信息项
- **用途**: 展示详细信息
- **场景**: 地址列表、银行卡列表
- **特点**:
  - 标题 + 详情
  - 默认标签
  - 选中状态
  - 编辑/删除操作
- **Props**: `title`, `details`, `isDefault`, `selected`, `showActions`

**使用示例**:
```vue
<InfoItem
  title="张三"
  :details="[
    '13012345678',
    '北京市朝阳区xxx小区xxx号'
  ]"
  is-default
  show-actions
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

---

## 🎨 设计规范

### 颜色主题

| 组件类型 | 主题色 | 用途 |
|---------|--------|------|
| IM 组件 | 橙红/紫粉 | 好友/群组功能 |
| Profile 组件 | 渐变色 | 个人中心 |
| 通用组件 | 紫色 | 统一主题 |

### 尺寸规范

所有组件支持 3 种尺寸：
- **small**: 适用于紧凑布局
- **medium**: 默认尺寸
- **large**: 强调重要内容

### 动画效果

- `slideIn` - 卡片滑入
- `fadeIn` - 淡入效果
- `float` - 浮动装饰
- `scale` - 点击缩放

---

## 💡 使用指南

### 1. 按需引入（推荐）

```vue
<script setup>
// IM 组件
import { UserCard, GroupCard, EmptyState } from '@/components/im'

// 通用组件
import { PageHeader, FormInput, FormButton } from '@/components/common'

// Profile 组件
import { MenuItem, BalanceCard, TransactionItem } from '@/components/profile'
</script>
```

### 2. 全局注册

```javascript
// main.js
import * as IMComponents from '@/components/im'
import * as CommonComponents from '@/components/common'
import * as ProfileComponents from '@/components/profile'

const app = createApp(App)

// 注册所有组件
Object.keys(IMComponents).forEach(key => {
  app.component(key, IMComponents[key])
})
Object.keys(CommonComponents).forEach(key => {
  app.component(key, CommonComponents[key])
})
Object.keys(ProfileComponents).forEach(key => {
  app.component(key, ProfileComponents[key])
})
```

---

## 📝 完整示例

### 示例 1: 个人中心页面

```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MenuItem, BalanceCard, StatCard } from '@/components/profile'
import { PageHeader, Card } from '@/components/common'
import { Package, CreditCard, MapPin, Gift } from 'lucide-vue-next'

const router = useRouter()
const balance = ref({
  beans: 12345,
  vouchers: 678,
  rights: 90
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <PageHeader title="个人中心" :show-back="false" />

    <!-- 余额卡片 -->
    <div class="p-4 grid grid-cols-3 gap-3">
      <BalanceCard
        label="树豆"
        :value="balance.beans"
        :icon="Coins"
        bg-gradient="bg-gradient-to-r from-orange-400 to-orange-600"
        @click="viewBeansDetail"
      />
      <!-- 其他余额卡片... -->
    </div>

    <!-- 菜单列表 -->
    <Card class="m-4">
      <MenuItem
        title="我的订单"
        :icon="Package"
        icon-bg="bg-gradient-to-br from-blue-400 to-blue-500"
        @click="router.push('/orders')"
      />
      <MenuItem
        title="收货地址"
        :icon="MapPin"
        icon-bg="bg-gradient-to-br from-green-400 to-green-500"
        @click="router.push('/address-list')"
      />
      <MenuItem
        title="银行卡"
        :icon="CreditCard"
        icon-bg="bg-gradient-to-br from-purple-400 to-purple-500"
        @click="router.push('/bank-cards')"
      />
    </Card>
  </div>
</template>
```

### 示例 2: 添加地址页面

```vue
<script setup>
import { ref } from 'vue'
import { PageHeader, FormInput, FormButton } from '@/components/common'
import { User, Phone, MapPin } from 'lucide-vue-next'

const form = ref({
  name: '',
  phone: '',
  address: ''
})

const handleSubmit = () => {
  console.log('提交表单', form.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <PageHeader title="添加地址" />

    <div class="p-4 space-y-4">
      <FormInput
        v-model="form.name"
        label="收货人"
        placeholder="请输入收货人姓名"
        :prefix-icon="User"
        required
      />

      <FormInput
        v-model="form.phone"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
        :prefix-icon="Phone"
        :maxlength="11"
        show-count
        required
      />

      <FormInput
        v-model="form.address"
        type="textarea"
        label="详细地址"
        placeholder="请输入详细地址"
        :rows="4"
        :maxlength="100"
        show-count
        required
      />

      <FormButton
        variant="primary"
        size="large"
        block
        @click="handleSubmit"
      >
        保存
      </FormButton>
    </div>
  </div>
</template>
```

---

## ✅ 组件检查清单

### IM 组件 (6个)
- [x] UserCard - 用户卡片
- [x] GroupCard - 群组卡片
- [x] ChatItem - 聊天项
- [x] SearchBar - 搜索栏
- [x] EmptyState - 空状态
- [x] Avatar - 头像

### 通用组件 (4个)
- [x] PageHeader - 页面头部
- [x] FormInput - 表单输入
- [x] FormButton - 表单按钮
- [x] Card - 通用卡片

### Profile 组件 (5个)
- [x] MenuItem - 菜单项
- [x] BalanceCard - 余额卡片
- [x] StatCard - 统计卡片
- [x] TransactionItem - 交易记录
- [x] InfoItem - 信息项

**总计**: 15 个可复用组件 ✅

---

## 🎯 组件功能对比表

| 组件 | v-model | 插槽 | 事件 | 主题 | 尺寸 | 动画 | 图标 |
|------|---------|------|------|------|------|------|------|
| UserCard | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| GroupCard | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| ChatItem | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| SearchBar | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| EmptyState | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Avatar | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| PageHeader | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| FormInput | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| FormButton | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Card | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| MenuItem | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| BalanceCard | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| StatCard | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| TransactionItem | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| InfoItem | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🎉 总结

本项目现在拥有完整的组件体系：

- ✅ **15个核心组件**，覆盖所有常见场景
- ✅ **3大分类**，职责清晰
- ✅ **统一设计**，风格一致
- ✅ **灵活配置**，易于定制
- ✅ **完整文档**，快速上手
- ✅ **无 Lint 错误**，代码质量高

通过这些组件，可以大大提高开发效率，保持代码的一致性和可维护性！

---

## 📚 相关文档

- [IM 组件详细文档](./COMPONENTS_DOCUMENTATION.md)
- [IM 组件使用示例](./COMPONENTS_USAGE_EXAMPLES.md)
- [IM 页面文档](./IM_PAGES_DOCUMENTATION.md)

---

**文档更新时间**: 2024-10-21  
**项目版本**: Vue 3 + Vite + TailwindCSS  
**组件总数**: 15 个

