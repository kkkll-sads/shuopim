# 表单验证库使用指南

完整的表单验证解决方案，包括同步验证、异步验证和统一的错误处理机制。

## 📦 核心模块

1. **validators.js** - 同步验证规则库
2. **asyncValidators.js** - 异步验证工具
3. **useFormValidation.js** - 表单验证 Composable
4. **errorHandler.js** - 错误处理工具

---

## 🚀 快速开始

### 基本示例

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      v-model="formData.email"
      label="邮箱"
      type="email"
      :error="errors.email"
      :error-message="errorMessages.email"
      @blur="handleBlur('email')"
    />
    
    <FormButton type="submit" :loading="isSubmitting">
      提交
    </FormButton>
  </form>
</template>

<script setup>
import { useFormValidation } from '@/composables/useFormValidation'
import { required, email } from '@/utils/validation/validators'
import { FormInput, FormButton } from '@/components/common'

// 初始表单值
const initialValues = {
  email: ''
}

// 验证规则
const validationRules = {
  email: [
    { validator: required('请输入邮箱') },
    { validator: email('请输入正确的邮箱格式') }
  ]
}

// 使用表单验证
const {
  formData,
  errors,
  errorMessages,
  isSubmitting,
  handleBlur,
  handleSubmit: submit
} = useFormValidation(initialValues, validationRules)

// 提交处理
const handleSubmit = () => {
  submit(async (data) => {
    console.log('提交数据:', data)
    // 调用API...
  })
}
</script>
```

---

## 1️⃣ 同步验证规则

### 必填验证

```javascript
import { required } from '@/utils/validation/validators'

const rules = {
  username: [
    { validator: required('请输入用户名') }
  ]
}
```

### 长度验证

```javascript
import { minLength, maxLength, lengthBetween } from '@/utils/validation/validators'

const rules = {
  password: [
    { validator: minLength(6, '密码至少6位') },
    { validator: maxLength(20, '密码最多20位') }
  ],
  username: [
    { validator: lengthBetween(3, 15, '用户名长度必须在3-15个字符之间') }
  ]
}
```

### 格式验证

```javascript
import { email, phone, idCard, bankCard, url } from '@/utils/validation/validators'

const rules = {
  email: [{ validator: email() }],
  phone: [{ validator: phone() }],
  idCard: [{ validator: idCard() }],
  bankCard: [{ validator: bankCard() }],
  website: [{ validator: url() }]
}
```

### 数值验证

```javascript
import { numeric, integer, minValue, maxValue, between } from '@/utils/validation/validators'

const rules = {
  age: [
    { validator: numeric('请输入数字') },
    { validator: integer('请输入整数') },
    { validator: between(18, 100, '年龄必须在18-100之间') }
  ],
  price: [
    { validator: minValue(0, '价格不能为负数') }
  ]
}
```

### 正则表达式验证

```javascript
import { pattern } from '@/utils/validation/validators'

const rules = {
  username: [
    { validator: pattern(/^[a-zA-Z0-9_]+$/, '只能包含字母、数字和下划线') }
  ]
}
```

### 字段匹配验证

```javascript
import { sameAs } from '@/utils/validation/validators'

const rules = {
  passwordConfirm: [
    {
      validator: sameAs(
        'password',
        (field) => formData[field],
        '两次密码输入不一致'
      )
    }
  ]
}
```

### 密码强度验证

```javascript
import { passwordStrength } from '@/utils/validation/validators'

const rules = {
  password: [
    {
      validator: passwordStrength({
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumber: true,
        requireSpecial: true
      })
    }
  ]
}
```

### 条件验证

```javascript
import { when, required } from '@/utils/validation/validators'

const rules = {
  companyName: [
    {
      validator: when(
        (formData) => formData.userType === 'company',
        required('请输入公司名称')
      )
    }
  ]
}
```

### 自定义验证

```javascript
import { custom } from '@/utils/validation/validators'

const rules = {
  age: [
    {
      validator: custom((value) => {
        if (value < 18) {
          return '必须年满18岁'
        }
        if (value > 100) {
          return '年龄不能超过100岁'
        }
        return true
      })
    }
  ]
}
```

---

## 2️⃣ 异步验证

### 用户名唯一性验证

```javascript
import { uniqueUsername } from '@/utils/validation/asyncValidators'
import { checkUsernameAPI } from '@/api/user'

const rules = {
  username: [
    { validator: required('请输入用户名') },
    uniqueUsername(checkUsernameAPI, '用户名已存在')
  ]
}
```

### 邮箱唯一性验证

```javascript
import { uniqueEmail } from '@/utils/validation/asyncValidators'
import { checkEmailAPI } from '@/api/user'

const rules = {
  email: [
    { validator: email('请输入正确的邮箱格式') },
    uniqueEmail(checkEmailAPI, '邮箱已被注册')
  ]
}
```

### 验证码验证

```javascript
import { validVerificationCode } from '@/utils/validation/asyncValidators'
import { validateCodeAPI } from '@/api/auth'

const rules = {
  code: [
    { validator: required('请输入验证码') },
    validVerificationCode(validateCodeAPI, '验证码错误或已过期')
  ]
}
```

### 自定义异步验证

```javascript
import { customAsync } from '@/utils/validation/asyncValidators'

const rules = {
  inviteCode: [
    customAsync(
      async (value) => {
        const response = await fetch(`/api/validate-invite/${value}`)
        const data = await response.json()
        
        if (!data.valid) {
          return { valid: false, message: '邀请码无效' }
        }
        
        return { valid: true }
      },
      { debounce: 500 }
    )
  ]
}
```

---

## 3️⃣ 表单验证 Composable

### useFormValidation

完整的表单验证解决方案，支持同步和异步验证。

#### 基本用法

```vue
<script setup>
import { useFormValidation } from '@/composables/useFormValidation'
import { required, email, minLength } from '@/utils/validation/validators'

const {
  formData,
  errors,
  errorMessages,
  isValid,
  isSubmitting,
  handleBlur,
  handleSubmit
} = useFormValidation(
  // 初始值
  {
    username: '',
    email: '',
    password: ''
  },
  // 验证规则
  {
    username: [
      { validator: required('请输入用户名') },
      { validator: minLength(3, '用户名至少3个字符') }
    ],
    email: [
      { validator: required('请输入邮箱') },
      { validator: email() }
    ],
    password: [
      { validator: required('请输入密码') },
      { validator: minLength(6, '密码至少6位') }
    ]
  }
)

const onSubmit = () => {
  handleSubmit(async (data) => {
    console.log('提交数据:', data)
    // 调用API
    await api.register(data)
  })
}
</script>
```

#### API 说明

##### 状态

- `formData` - 响应式表单数据
- `errors` - 错误状态对象
- `errorMessages` - 错误消息对象
- `touched` - 字段触摸状态
- `validating` - 验证中状态
- `isSubmitting` - 提交中状态
- `isValidated` - 是否已验证
- `isValid` - 表单是否有效
- `isDirty` - 是否有字段被修改
- `isValidatingAny` - 是否有字段正在验证
- `allErrors` - 所有错误的映射

##### 方法

- `validateField(field, value)` - 验证单个字段
- `validateAll()` - 验证所有字段
- `resetValidation(fields)` - 重置验证状态
- `resetForm(values)` - 重置表单
- `setFieldValue(field, value, validate)` - 设置字段值
- `setFieldError(field, message)` - 设置字段错误
- `setErrors(errorMap)` - 批量设置错误
- `touchField(field, validate)` - 标记字段为已触摸
- `handleBlur(field)` - 处理字段失焦
- `handleInput(field, value)` - 处理字段输入
- `handleSubmit(onSubmit)` - 处理表单提交

### useFieldValidation

单个字段的验证钩子。

```vue
<script setup>
import { useFieldValidation } from '@/composables/useFormValidation'
import { required, email } from '@/utils/validation/validators'

const {
  value,
  error,
  errorMessage,
  validate
} = useFieldValidation(
  'email',
  '',
  [
    { validator: required('请输入邮箱') },
    { validator: email() }
  ]
)
</script>

<template>
  <FormInput
    v-model="value"
    :error="error"
    :error-message="errorMessage"
    @blur="validate"
  />
</template>
```

---

## 4️⃣ 错误处理

### 格式化错误

```javascript
import { formatValidationErrors, ErrorFormatter } from '@/utils/validation/errorHandler'

const errors = {
  username: '用户名已存在',
  email: '邮箱格式不正确'
}

const fieldLabels = {
  username: '用户名',
  email: '邮箱地址'
}

// 格式化为列表
const errorList = formatValidationErrors(errors, fieldLabels)
// [
//   { field: 'username', label: '用户名', message: '用户名已存在', displayText: '用户名: 用户名已存在' },
//   { field: 'email', label: '邮箱地址', message: '邮箱格式不正确', displayText: '邮箱地址: 邮箱格式不正确' }
// ]

// 格式化为文本
const text = ErrorFormatter.toText(errors, fieldLabels)
// "用户名: 用户名已存在\n邮箱地址: 邮箱格式不正确"

// 格式化为HTML
const html = ErrorFormatter.toHTML(errors, fieldLabels)
```

### 处理服务器错误

```javascript
import { mapServerErrors } from '@/utils/validation/errorHandler'

try {
  await api.register(formData)
} catch (error) {
  // 服务器返回: { errors: { username: ['用户名已存在'], email: ['邮箱格式不正确'] } }
  const formErrors = mapServerErrors(error.response.data)
  setErrors(formErrors)
}
```

### 错误收集器

```javascript
import { ErrorCollector } from '@/utils/validation/errorHandler'

const collector = new ErrorCollector()

collector.add('username', '用户名已存在')
collector.add('email', '邮箱格式不正确')

console.log(collector.hasErrors()) // true
console.log(collector.get('username')) // '用户名已存在'
console.log(collector.getAll()) // { username: '用户名已存在', email: '邮箱格式不正确' }

collector.remove('username')
collector.clear()
```

### 显示错误通知

```javascript
import { showErrorNotification } from '@/utils/validation/errorHandler'

const errors = {
  username: '用户名已存在',
  email: '邮箱格式不正确'
}

showErrorNotification(errors, {
  fieldLabels: { username: '用户名', email: '邮箱' },
  showFirst: true, // 只显示第一个错误
  type: 'alert' // 'alert', 'toast', 'console'
})
```

### 滚动到错误字段

```javascript
import { scrollToFirstError } from '@/utils/validation/errorHandler'

const errors = {
  username: '用户名已存在'
}

scrollToFirstError(errors, {
  offset: 100,
  behavior: 'smooth'
})
```

### 错误重试机制

```javascript
import { withRetry } from '@/utils/validation/errorHandler'

const validateWithRetry = withRetry(
  async (value) => {
    const response = await api.validateCode(value)
    return response.data
  },
  {
    maxRetries: 3,
    retryDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`重试第 ${attempt} 次, 错误:`, error)
    }
  }
)
```

---

## 🎯 完整示例

### 注册表单

```vue
<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- 用户名 -->
    <FormInput
      v-model="formData.username"
      label="用户名"
      placeholder="请输入用户名"
      :error="errors.username"
      :error-message="errorMessages.username"
      :disabled="isSubmitting"
      @blur="handleBlur('username')"
    />

    <!-- 邮箱 -->
    <FormInput
      v-model="formData.email"
      label="邮箱"
      type="email"
      placeholder="请输入邮箱"
      :error="errors.email"
      :error-message="errorMessages.email"
      :disabled="isSubmitting"
      @blur="handleBlur('email')"
    >
      <template v-if="validating.email" #suffix>
        <span class="text-sm text-gray-500">验证中...</span>
      </template>
    </FormInput>

    <!-- 手机号 -->
    <FormInput
      v-model="formData.phone"
      label="手机号"
      type="tel"
      placeholder="请输入手机号"
      :error="errors.phone"
      :error-message="errorMessages.phone"
      :disabled="isSubmitting"
      @blur="handleBlur('phone')"
    />

    <!-- 密码 -->
    <FormInput
      v-model="formData.password"
      label="密码"
      type="password"
      placeholder="请输入密码"
      :error="errors.password"
      :error-message="errorMessages.password"
      :disabled="isSubmitting"
      helper-text="密码至少6位，包含字母和数字"
      @blur="handleBlur('password')"
    />

    <!-- 确认密码 -->
    <FormInput
      v-model="formData.passwordConfirm"
      label="确认密码"
      type="password"
      placeholder="请再次输入密码"
      :error="errors.passwordConfirm"
      :error-message="errorMessages.passwordConfirm"
      :disabled="isSubmitting"
      @blur="handleBlur('passwordConfirm')"
    />

    <!-- 邀请码 -->
    <FormInput
      v-model="formData.inviteCode"
      label="邀请码（可选）"
      placeholder="请输入邀请码"
      :error="errors.inviteCode"
      :error-message="errorMessages.inviteCode"
      :disabled="isSubmitting"
      @blur="handleBlur('inviteCode')"
    >
      <template v-if="validating.inviteCode" #suffix>
        <span class="text-sm text-gray-500">验证中...</span>
      </template>
    </FormInput>

    <!-- 同意条款 -->
    <FormCheckbox
      v-model="formData.agreed"
      :error="errors.agreed"
      :error-message="errorMessages.agreed"
    >
      我同意
      <a href="#" class="text-blue-500">《服务条款》</a>
      和
      <a href="#" class="text-blue-500">《隐私政策》</a>
    </FormCheckbox>

    <!-- 提交按钮 -->
    <FormButton
      type="submit"
      variant="primary"
      size="lg"
      :loading="isSubmitting"
      :disabled="!isValid || isSubmitting"
      class="w-full"
    >
      注册
    </FormButton>
  </form>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFormValidation } from '@/composables/useFormValidation'
import {
  required,
  minLength,
  email,
  phone,
  sameAs,
  passwordStrength
} from '@/utils/validation/validators'
import {
  uniqueUsername,
  uniqueEmail,
  uniquePhone,
  validInviteCode
} from '@/utils/validation/asyncValidators'
import { scrollToFirstError } from '@/utils/validation/errorHandler'
import {
  FormInput,
  FormCheckbox,
  FormButton
} from '@/components/common'
import { registerAPI, checkUsernameAPI, checkEmailAPI, checkPhoneAPI, validateInviteCodeAPI } from '@/api/auth'

const router = useRouter()

// 初始表单值
const initialValues = {
  username: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  inviteCode: '',
  agreed: false
}

// 验证规则
const validationRules = {
  username: [
    { validator: required('请输入用户名') },
    { validator: minLength(3, '用户名至少3个字符') },
    uniqueUsername(checkUsernameAPI)
  ],
  email: [
    { validator: required('请输入邮箱') },
    { validator: email() },
    uniqueEmail(checkEmailAPI)
  ],
  phone: [
    { validator: required('请输入手机号') },
    { validator: phone() },
    uniquePhone(checkPhoneAPI)
  ],
  password: [
    { validator: required('请输入密码') },
    {
      validator: passwordStrength({
        minLength: 6,
        requireNumber: true
      }, '密码至少6位，必须包含字母和数字')
    }
  ],
  passwordConfirm: [
    { validator: required('请确认密码') },
    {
      validator: sameAs(
        'password',
        (field) => formData[field],
        '两次密码输入不一致'
      )
    }
  ],
  inviteCode: [
    validInviteCode(validateInviteCodeAPI)
  ],
  agreed: [
    {
      validator: (value) => {
        return value === true
          ? { valid: true }
          : { valid: false, message: '请同意服务条款和隐私政策' }
      }
    }
  ]
}

// 使用表单验证
const {
  formData,
  errors,
  errorMessages,
  validating,
  isValid,
  isSubmitting,
  handleBlur,
  handleSubmit,
  allErrors
} = useFormValidation(initialValues, validationRules)

// 提交处理
const onSubmit = () => {
  handleSubmit(async (data) => {
    try {
      await registerAPI(data)
      alert('注册成功！')
      router.push('/login')
    } catch (error) {
      console.error('注册失败:', error)
      alert('注册失败，请重试')
      
      // 滚动到第一个错误字段
      if (Object.keys(allErrors.value).length > 0) {
        scrollToFirstError(allErrors.value)
      }
    }
  })
}
</script>
```

---

## 📝 最佳实践

### 1. 验证规则组织

```javascript
// 创建可复用的验证规则配置
export const userValidationRules = {
  username: [
    { validator: required('请输入用户名') },
    { validator: minLength(3) },
    { validator: maxLength(15) }
  ],
  email: [
    { validator: required('请输入邮箱') },
    { validator: email() }
  ]
}
```

### 2. 字段标签映射

```javascript
export const fieldLabels = {
  username: '用户名',
  email: '邮箱地址',
  phone: '手机号码',
  password: '密码'
}
```

### 3. 验证时机

- **失焦验证**: 用户离开字段时验证
- **实时验证**: 字段被触摸后，输入时实时验证
- **提交验证**: 提交时验证所有字段

### 4. 错误提示优化

- 使用清晰、具体的错误消息
- 提供解决建议
- 国际化支持

### 5. 性能优化

- 异步验证使用防抖
- 避免不必要的重复验证
- 大表单按需验证

---

## 🔧 高级用法

### 动态验证规则

```javascript
import { computed } from 'vue'

const validationRules = computed(() => ({
  companyName: formData.userType === 'company'
    ? [{ validator: required('请输入公司名称') }]
    : []
}))
```

### 自定义验证消息

```javascript
const customMessages = {
  required: (field) => `${fieldLabels[field]}不能为空`,
  email: () => '请输入有效的邮箱地址',
  minLength: (field, min) => `${fieldLabels[field]}至少${min}个字符`
}
```

### 验证组

```javascript
// 验证特定字段组
const validateGroup = async (fields) => {
  const promises = fields.map(field => validateField(field))
  const results = await Promise.all(promises)
  return results.every(r => r === true)
}

// 使用
await validateGroup(['username', 'email', 'phone'])
```

---

## 🎓 总结

这套验证库提供了：

✅ **丰富的验证规则** - 覆盖常见验证场景  
✅ **异步验证支持** - 服务器端验证无缝集成  
✅ **统一错误处理** - 完善的错误管理机制  
✅ **类型安全** - TypeScript 支持  
✅ **高性能** - 防抖、缓存等优化  
✅ **易于扩展** - 自定义验证规则  
✅ **开发体验** - 简洁的 API 设计  

立即使用这套验证库，让表单开发更加高效！🚀

