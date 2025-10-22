<!-- 
  表单验证库使用示例
  这是一个完整的注册表单示例，展示如何使用验证库
-->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">
        用户注册
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <!-- 用户名 -->
        <FormInput
          v-model="formData.username"
          label="用户名"
          placeholder="请输入用户名"
          :prefix-icon="User"
          :error="errors.username"
          :error-message="errorMessages.username"
          :disabled="isSubmitting"
          @blur="handleBlur('username')"
        >
          <template v-if="validating.username" #suffix>
            <div class="flex items-center text-sm text-blue-500">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-1"></div>
              验证中
            </div>
          </template>
        </FormInput>

        <!-- 邮箱 -->
        <FormInput
          v-model="formData.email"
          label="邮箱"
          type="email"
          placeholder="请输入邮箱"
          :prefix-icon="Mail"
          :error="errors.email"
          :error-message="errorMessages.email"
          :disabled="isSubmitting"
          @blur="handleBlur('email')"
        >
          <template v-if="validating.email" #suffix>
            <div class="flex items-center text-sm text-blue-500">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-1"></div>
              验证中
            </div>
          </template>
        </FormInput>

        <!-- 手机号 -->
        <FormInput
          v-model="formData.phone"
          label="手机号"
          type="tel"
          placeholder="请输入手机号"
          :prefix-icon="Smartphone"
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
          :prefix-icon="Lock"
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
          :prefix-icon="Lock"
          :error="errors.passwordConfirm"
          :error-message="errorMessages.passwordConfirm"
          :disabled="isSubmitting"
          @blur="handleBlur('passwordConfirm')"
        />

        <!-- 同意条款 -->
        <FormCheckbox
          v-model="formData.agreed"
          :error="errors.agreed"
          :error-message="errorMessages.agreed"
        >
          我同意
          <a href="#" class="text-blue-500 hover:underline" @click.prevent>《服务条款》</a>
          和
          <a href="#" class="text-blue-500 hover:underline" @click.prevent>《隐私政策》</a>
        </FormCheckbox>

        <!-- 提交按钮 -->
        <FormButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          :disabled="isSubmitting || isValidatingAny"
          class="w-full"
        >
          {{ isSubmitting ? '注册中...' : '注册' }}
        </FormButton>

        <!-- 调试信息 -->
        <div v-if="isDevelopment" class="mt-6 p-4 bg-gray-100 rounded-lg text-xs">
          <h3 class="font-semibold mb-2">调试信息:</h3>
          <div class="space-y-1">
            <div>表单有效: {{ isValid ? '✅' : '❌' }}</div>
            <div>已修改: {{ isDirty ? '是' : '否' }}</div>
            <div>验证中: {{ isValidatingAny ? '是' : '否' }}</div>
            <div>提交中: {{ isSubmitting ? '是' : '否' }}</div>
            <div v-if="Object.keys(allErrors).length > 0">
              <div class="font-semibold mt-2">错误列表:</div>
              <pre class="mt-1">{{ JSON.stringify(allErrors, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
  FormInput,
  FormCheckbox,
  FormButton
} from '@/components/common'
import { User, Mail, Smartphone, Lock } from 'lucide-vue-next'

// 是否开发环境
const isDevelopment = computed(() => process.env.NODE_ENV === 'development')

// 模拟API函数
const mockCheckUsername = async (username) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 模拟：'admin' 已存在
  return username === 'admin'
}

const mockCheckEmail = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 模拟：'test@example.com' 已存在
  return email === 'test@example.com'
}

const mockRegister = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('注册数据:', data)
  return { success: true, message: '注册成功' }
}

// 初始表单值
const initialValues = {
  username: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  agreed: false
}

// 验证规则
const validationRules = {
  username: [
    { validator: required('请输入用户名') },
    { validator: minLength(3, '用户名至少3个字符') },
    // 异步验证：用户名唯一性
    {
      validator: async (value) => {
        if (!value) return { valid: true }
        
        // 防抖处理
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const exists = await mockCheckUsername(value)
        return exists
          ? { valid: false, message: '用户名已存在，试试 "user123"' }
          : { valid: true }
      },
      async: true
    }
  ],
  email: [
    { validator: required('请输入邮箱') },
    { validator: email('请输入正确的邮箱格式') },
    // 异步验证：邮箱唯一性
    {
      validator: async (value) => {
        if (!value) return { valid: true }
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const exists = await mockCheckEmail(value)
        return exists
          ? { valid: false, message: '邮箱已被注册，试试其他邮箱' }
          : { valid: true }
      },
      async: true
    }
  ],
  phone: [
    { validator: required('请输入手机号') },
    { validator: phone('请输入正确的手机号格式') }
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
  isDirty,
  isValidatingAny,
  isSubmitting,
  allErrors,
  handleBlur,
  handleSubmit
} = useFormValidation(initialValues, validationRules)

// 提交处理
const onSubmit = () => {
  handleSubmit(async (data) => {
    try {
      const result = await mockRegister(data)
      alert(`${result.message}\n\n注册信息:\n用户名: ${data.username}\n邮箱: ${data.email}`)
    } catch (error) {
      console.error('注册失败:', error)
      alert('注册失败，请重试')
    }
  })
}
</script>

<style scoped>
/* 加载动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

