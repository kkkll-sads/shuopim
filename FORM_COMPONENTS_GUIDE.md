# 表单组件使用指南

完整的表单组件库，包括 FormInput、FormSelect、FormCheckbox、FormRadio 和 FormButton。

## 📦 组件列表

1. **FormInput** - 输入框组件
2. **FormSelect** - 下拉选择组件
3. **FormCheckbox** - 复选框组件
4. **FormRadio** - 单选框组件
5. **FormButton** - 按钮组件

---

## 1️⃣ FormInput 组件

### 基本用法

```vue
<template>
  <FormInput
    v-model="username"
    label="用户名"
    type="text"
    placeholder="请输入用户名"
    required
  />
</template>

<script setup>
import { ref } from 'vue'
import { FormInput } from '@/components/common'

const username = ref('')
</script>
```

### 支持的输入类型

```vue
<!-- 文本输入 -->
<FormInput v-model="text" type="text" />

<!-- 电话号码 -->
<FormInput v-model="phone" type="tel" />

<!-- 密码 -->
<FormInput v-model="password" type="password" />

<!-- 邮箱 -->
<FormInput v-model="email" type="email" />

<!-- 数字 -->
<FormInput v-model="age" type="number" />

<!-- 文本域 -->
<FormInput v-model="description" type="textarea" :rows="4" />
```

### 带图标

```vue
<template>
  <FormInput
    v-model="phone"
    type="tel"
    placeholder="请输入手机号"
    :prefix-icon="Smartphone"
  />
</template>

<script setup>
import { Smartphone } from 'lucide-vue-next'
</script>
```

### 验证状态

```vue
<template>
  <FormInput
    v-model="email"
    type="email"
    label="邮箱"
    :error="errors.email"
    :error-message="errorMessages.email"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'

const email = ref('')
const errors = reactive({ email: false })
const errorMessages = reactive({ email: '' })

const validate = () => {
  if (!email.value.includes('@')) {
    errors.email = true
    errorMessages.email = '请输入正确的邮箱'
  }
}
</script>
```

### 字符计数

```vue
<FormInput
  v-model="bio"
  type="textarea"
  label="个人简介"
  :maxlength="100"
  :show-count="true"
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String | '' | v-model 绑定值 |
| type | String | 'text' | 输入类型 |
| label | String | '' | 标签文本 |
| placeholder | String | '' | 占位符 |
| prefixIcon | Object | null | 前缀图标 |
| suffixIcon | Object | null | 后缀图标 |
| required | Boolean | false | 是否必填 |
| disabled | Boolean | false | 是否禁用 |
| readonly | Boolean | false | 是否只读 |
| maxlength | Number | null | 最大长度 |
| showCount | Boolean | false | 是否显示字符计数 |
| rows | Number | 3 | textarea 行数 |
| error | Boolean | false | 错误状态 |
| errorMessage | String | '' | 错误消息 |
| helperText | String | '' | 帮助文本 |

---

## 2️⃣ FormSelect 组件

### 基本用法

```vue
<template>
  <FormSelect
    v-model="city"
    label="城市"
    :options="cities"
    placeholder="请选择城市"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FormSelect } from '@/components/common'

const city = ref('')
const cities = [
  '北京',
  '上海',
  '广州',
  '深圳'
]
</script>
```

### 对象数组选项

```vue
<template>
  <FormSelect
    v-model="selectedCity"
    label="城市"
    :options="cityOptions"
    value-key="id"
    label-key="name"
    placeholder="请选择城市"
  />
</template>

<script setup>
const selectedCity = ref('')
const cityOptions = [
  { id: '1', name: '北京', disabled: false },
  { id: '2', name: '上海', disabled: false },
  { id: '3', name: '广州', disabled: true },
  { id: '4', name: '深圳', disabled: false }
]
</script>
```

### 带图标

```vue
<FormSelect
  v-model="country"
  label="国家"
  :options="countries"
  :prefix-icon="MapPin"
  placeholder="请选择国家"
/>
```

### 验证状态

```vue
<FormSelect
  v-model="gender"
  label="性别"
  :options="['男', '女', '其他']"
  required
  :error="errors.gender"
  :error-message="errorMessages.gender"
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String/Number | '' | v-model 绑定值 |
| options | Array | [] | 选项数组 |
| valueKey | String | 'value' | 选项值字段名 |
| labelKey | String | 'label' | 选项标签字段名 |
| label | String | '' | 标签文本 |
| placeholder | String | '请选择' | 占位符 |
| prefixIcon | Object | null | 前缀图标 |
| required | Boolean | false | 是否必填 |
| disabled | Boolean | false | 是否禁用 |
| error | Boolean | false | 错误状态 |
| errorMessage | String | '' | 错误消息 |
| helperText | String | '' | 帮助文本 |

---

## 3️⃣ FormCheckbox 组件

### 单个复选框

```vue
<template>
  <FormCheckbox
    v-model="agreed"
    checkbox-label="我同意服务条款"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FormCheckbox } from '@/components/common'

const agreed = ref(false)
</script>
```

### 带插槽的复选框

```vue
<FormCheckbox v-model="agreed">
  我同意
  <a href="#" class="text-blue-500">服务条款</a>
  和
  <a href="#" class="text-blue-500">隐私政策</a>
</FormCheckbox>
```

### 复选框组

```vue
<template>
  <FormCheckbox
    v-model="selectedHobbies"
    label="兴趣爱好"
    :options="hobbies"
  />
</template>

<script setup>
const selectedHobbies = ref([])
const hobbies = [
  { value: 'reading', label: '阅读' },
  { value: 'music', label: '音乐' },
  { value: 'sports', label: '运动' },
  { value: 'travel', label: '旅游' }
]
</script>
```

### 内联显示

```vue
<FormCheckbox
  v-model="selectedColors"
  label="喜欢的颜色"
  :options="colors"
  inline
/>
```

### 带描述的复选框

```vue
<FormCheckbox
  v-model="selectedPlans"
  label="选择套餐"
  :options="plans"
/>

<script setup>
const plans = [
  {
    value: 'basic',
    label: '基础版',
    description: '适合个人用户，包含基本功能'
  },
  {
    value: 'pro',
    label: '专业版',
    description: '适合小团队，包含高级功能'
  },
  {
    value: 'enterprise',
    label: '企业版',
    description: '适合大型企业，包含所有功能'
  }
]
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | Boolean/Array | false | v-model 绑定值 |
| options | Array | [] | 选项数组（多选组） |
| valueKey | String | 'value' | 选项值字段名 |
| labelKey | String | 'label' | 选项标签字段名 |
| label | String | '' | 组标签 |
| checkboxLabel | String | '' | 单个复选框标签 |
| description | String | '' | 描述文本 |
| required | Boolean | false | 是否必填 |
| disabled | Boolean | false | 是否禁用 |
| inline | Boolean | false | 是否内联显示 |
| error | Boolean | false | 错误状态 |
| errorMessage | String | '' | 错误消息 |
| helperText | String | '' | 帮助文本 |

---

## 4️⃣ FormRadio 组件

### 基本用法

```vue
<template>
  <FormRadio
    v-model="gender"
    label="性别"
    :options="genderOptions"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FormRadio } from '@/components/common'

const gender = ref('')
const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' }
]
</script>
```

### 内联显示

```vue
<FormRadio
  v-model="size"
  label="尺寸"
  :options="['S', 'M', 'L', 'XL']"
  inline
/>
```

### 卡片样式

```vue
<template>
  <FormRadio
    v-model="plan"
    label="选择套餐"
    :options="plans"
    card-style
  />
</template>

<script setup>
const plan = ref('')
const plans = [
  {
    value: 'basic',
    label: '基础版',
    description: '￥9.9/月'
  },
  {
    value: 'pro',
    label: '专业版',
    description: '￥29.9/月'
  },
  {
    value: 'enterprise',
    label: '企业版',
    description: '￥99.9/月'
  }
]
</script>
```

### 带图标的卡片

```vue
<template>
  <FormRadio
    v-model="method"
    label="支付方式"
    :options="paymentMethods"
    card-style
  />
</template>

<script setup>
import { CreditCard, Smartphone, Wallet } from 'lucide-vue-next'

const method = ref('')
const paymentMethods = [
  {
    value: 'card',
    label: '银行卡',
    description: '支持储蓄卡和信用卡',
    icon: CreditCard
  },
  {
    value: 'alipay',
    label: '支付宝',
    description: '快捷安全',
    icon: Smartphone
  },
  {
    value: 'wechat',
    label: '微信支付',
    description: '扫码支付',
    icon: Wallet
  }
]
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String/Number/Boolean | '' | v-model 绑定值 |
| options | Array | [] | 选项数组 |
| valueKey | String | 'value' | 选项值字段名 |
| labelKey | String | 'label' | 选项标签字段名 |
| label | String | '' | 标签文本 |
| name | String | '' | radio name 属性 |
| required | Boolean | false | 是否必填 |
| disabled | Boolean | false | 是否禁用 |
| inline | Boolean | false | 是否内联显示 |
| cardStyle | Boolean | false | 是否使用卡片样式 |
| error | Boolean | false | 错误状态 |
| errorMessage | String | '' | 错误消息 |
| helperText | String | '' | 帮助文本 |

---

## 5️⃣ FormButton 组件

### 基本用法

```vue
<FormButton @click="handleSubmit">
  提交
</FormButton>
```

### 不同样式

```vue
<FormButton variant="primary">主要按钮</FormButton>
<FormButton variant="secondary">次要按钮</FormButton>
<FormButton variant="outline">轮廓按钮</FormButton>
<FormButton variant="ghost">幽灵按钮</FormButton>
<FormButton variant="danger">危险按钮</FormButton>
```

### 不同尺寸

```vue
<FormButton size="sm">小按钮</FormButton>
<FormButton size="md">中按钮</FormButton>
<FormButton size="lg">大按钮</FormButton>
```

### 加载状态

```vue
<FormButton :loading="isLoading" @click="handleSubmit">
  提交
</FormButton>
```

### 带图标

```vue
<template>
  <FormButton :left-icon="Save">
    保存
  </FormButton>
  
  <FormButton :right-icon="ArrowRight">
    下一步
  </FormButton>
</template>

<script setup>
import { Save, ArrowRight } from 'lucide-vue-next'
</script>
```

---

## 🎯 完整示例

### 注册表单

```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- 用户名 -->
    <FormInput
      v-model="form.username"
      label="用户名"
      type="text"
      placeholder="请输入用户名"
      :prefix-icon="User"
      required
      :error="errors.username"
      :error-message="errorMessages.username"
    />

    <!-- 邮箱 -->
    <FormInput
      v-model="form.email"
      label="邮箱"
      type="email"
      placeholder="请输入邮箱"
      :prefix-icon="Mail"
      required
      :error="errors.email"
      :error-message="errorMessages.email"
    />

    <!-- 密码 -->
    <FormInput
      v-model="form.password"
      label="密码"
      type="password"
      placeholder="请输入密码"
      :prefix-icon="Lock"
      required
      :error="errors.password"
      :error-message="errorMessages.password"
      helper-text="密码至少6位"
    />

    <!-- 性别 -->
    <FormRadio
      v-model="form.gender"
      label="性别"
      :options="genderOptions"
      inline
      required
      :error="errors.gender"
      :error-message="errorMessages.gender"
    />

    <!-- 城市 -->
    <FormSelect
      v-model="form.city"
      label="城市"
      :options="cityOptions"
      placeholder="请选择城市"
      :prefix-icon="MapPin"
      required
      :error="errors.city"
      :error-message="errorMessages.city"
    />

    <!-- 兴趣爱好 -->
    <FormCheckbox
      v-model="form.hobbies"
      label="兴趣爱好"
      :options="hobbyOptions"
    />

    <!-- 同意条款 -->
    <FormCheckbox v-model="form.agreed" required>
      我同意
      <a href="#" class="text-blue-500">服务条款</a>
      和
      <a href="#" class="text-blue-500">隐私政策</a>
    </FormCheckbox>

    <!-- 提交按钮 -->
    <FormButton
      type="submit"
      variant="primary"
      size="lg"
      :loading="isSubmitting"
      class="w-full"
    >
      注册
    </FormButton>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Mail, Lock, MapPin } from 'lucide-vue-next'
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormButton
} from '@/components/common'

const form = reactive({
  username: '',
  email: '',
  password: '',
  gender: '',
  city: '',
  hobbies: [],
  agreed: false
})

const errors = reactive({
  username: false,
  email: false,
  password: false,
  gender: false,
  city: false
})

const errorMessages = reactive({
  username: '',
  email: '',
  password: '',
  gender: '',
  city: ''
})

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' }
]

const cityOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' }
]

const hobbyOptions = [
  { value: 'reading', label: '阅读' },
  { value: 'music', label: '音乐' },
  { value: 'sports', label: '运动' },
  { value: 'travel', label: '旅游' }
]

const isSubmitting = ref(false)

const validateForm = () => {
  let isValid = true
  
  // 重置错误
  Object.keys(errors).forEach(key => {
    errors[key] = false
    errorMessages[key] = ''
  })
  
  // 验证用户名
  if (!form.username.trim()) {
    errors.username = true
    errorMessages.username = '请输入用户名'
    isValid = false
  }
  
  // 验证邮箱
  if (!form.email.trim()) {
    errors.email = true
    errorMessages.email = '请输入邮箱'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = true
    errorMessages.email = '请输入正确的邮箱格式'
    isValid = false
  }
  
  // 验证密码
  if (!form.password.trim()) {
    errors.password = true
    errorMessages.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = true
    errorMessages.password = '密码至少6位'
    isValid = false
  }
  
  // 验证性别
  if (!form.gender) {
    errors.gender = true
    errorMessages.gender = '请选择性别'
    isValid = false
  }
  
  // 验证城市
  if (!form.city) {
    errors.city = true
    errorMessages.city = '请选择城市'
    isValid = false
  }
  
  // 验证同意条款
  if (!form.agreed) {
    alert('请同意服务条款和隐私政策')
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('提交成功:', form)
    alert('注册成功！')
  } catch (error) {
    console.error('提交失败:', error)
    alert('注册失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

---

## 🎨 样式定制

所有组件都支持通过 class 属性进行样式定制：

```vue
<FormInput
  container-class="mb-4"
  input-class="custom-input"
  label-class="text-lg font-bold"
/>

<FormSelect
  container-class="mb-4"
  input-class="custom-select"
/>

<FormCheckbox
  container-class="mb-4"
  checkbox-class="custom-checkbox"
/>

<FormRadio
  container-class="mb-4"
  radio-class="custom-radio"
/>
```

---

## 📝 最佳实践

### 1. 统一的验证逻辑

```javascript
// 创建统一的验证函数
const validateForm = () => {
  let isValid = true
  
  // 重置所有错误
  Object.keys(errors).forEach(key => {
    errors[key] = false
    errorMessages[key] = ''
  })
  
  // 执行验证...
  
  return isValid
}
```

### 2. 响应式表单

```vue
<template>
  <div class="max-w-md mx-auto p-4">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 表单内容 -->
    </form>
  </div>
</template>
```

### 3. 禁用状态管理

```vue
<FormInput :disabled="isLoading" />
<FormSelect :disabled="isLoading" />
<FormButton :loading="isLoading" :disabled="isLoading">
  提交
</FormButton>
```

---

## 🚀 更多示例

查看项目中的实际使用案例：
- `src/views/auth/Login.vue` - 登录表单
- `src/views/auth/Register.vue` - 注册表单
- `src/views/profile/add-address.vue` - 地址表单
- `src/views/profile/add-bank-card.vue` - 银行卡表单

