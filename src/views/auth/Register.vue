<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-400 via-pink-300 to-pink-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">Hello!</h1>
        <p class="text-2xl text-gray-700">欢迎注册树拍平台</p>
      </div>

      <!-- Register Form Card -->
      <div class="bg-white/90 rounded-3xl p-8 shadow-xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Phone Input -->
          <div class="mb-6">
            <FormInput
              v-model="phone"
              type="tel"
              placeholder="请输入手机号"
              :prefix-icon="Smartphone"
              :error="errors.phone"
              :error-message="errorMessages.phone"
              container-class="mb-0"
              input-class="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-3 focus:border-gray-800 focus:ring-0"
            />
          </div>

          <!-- Password Input -->
          <div class="mb-6">
            <FormInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              :error="errors.password"
              :error-message="errorMessages.password"
              container-class="mb-0"
              input-class="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-3 focus:border-gray-800 focus:ring-0"
            />
          </div>

          <!-- Verification Code Input -->
          <div class="mb-6 relative">
            <FormInput
              v-model="verificationCode"
              type="text"
              placeholder="请输入验证码"
              :prefix-icon="Shield"
              :error="errors.verificationCode"
              :error-message="errorMessages.verificationCode"
              container-class="mb-0"
              input-class="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-3 pr-20 focus:border-gray-800 focus:ring-0"
            />
            <button
              type="button"
              @click="getVerificationCode"
              :disabled="countdown > 0"
              class="absolute right-0 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-600 transition-colors text-sm disabled:text-gray-400 whitespace-nowrap"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>

          <!-- Invitation Code Input -->
          <div class="mb-6">
            <FormInput
              v-model="invitationCode"
              type="text"
              placeholder="邀请码（选填）"
              :prefix-icon="Send"
              container-class="mb-0"
              input-class="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-3 focus:border-gray-800 focus:ring-0"
            />
          </div>

          <!-- Go to Login Link -->
          <div class="flex justify-end mb-8 text-sm">
            <button type="button" @click="$router.push('/login')" class="text-gray-600 hover:text-gray-800 transition-colors">
              已有账号！去登录
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="registering"
            class="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg font-medium py-4 rounded-full hover:from-pink-600 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ registering ? '注册中...' : '注册' }}
          </button>

          <!-- Agreement Checkbox -->
          <div class="mt-6 flex items-start gap-2 text-xs text-gray-600">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              id="terms"
              class="mt-1 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
            />
            <label for="terms" class="leading-relaxed">
              注册即代表你已同意
              <a href="#" class="text-blue-500 hover:underline">《服务协议》</a>
              和
              <a href="#" class="text-blue-500 hover:underline">《隐私政策》</a>
              和
              <a href="#" class="text-blue-500 hover:underline">《用户须知》</a>
              和
              <a href="#" class="text-blue-500 hover:underline">《交易风险提示》</a>
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Smartphone, Lock, Shield, Send } from 'lucide-vue-next'
import FormInput from '@/components/common/FormInput.vue'
import { useAuth } from '@/composables'

const router = useRouter()
const { register, registering, registerError } = useAuth()

const phone = ref('')
const password = ref('')
const verificationCode = ref('')
const invitationCode = ref('')
const showPassword = ref(false)
const agreedToTerms = ref(false)
const countdown = ref(0)

// 表单验证状态
const errors = reactive({
  phone: false,
  password: false,
  verificationCode: false
})

// 错误消息
const errorMessages = reactive({
  phone: '',
  password: '',
  verificationCode: ''
})

let countdownTimer = null

// 验证规则
const validateForm = () => {
  let isValid = true
  
  // 重置错误状态
  Object.keys(errors).forEach(key => {
    errors[key] = false
    errorMessages[key] = ''
  })
  
  // 验证手机号
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phone.value.trim()) {
    errors.phone = true
    errorMessages.phone = '请输入手机号'
    isValid = false
  } else if (!phoneRegex.test(phone.value)) {
    errors.phone = true
    errorMessages.phone = '请输入正确的手机号'
    isValid = false
  }
  
  // 验证密码
  if (!password.value.trim()) {
    errors.password = true
    errorMessages.password = '请输入密码'
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = true
    errorMessages.password = '密码至少6位'
    isValid = false
  }
  
  // 验证验证码
  if (!verificationCode.value.trim()) {
    errors.verificationCode = true
    errorMessages.verificationCode = '请输入验证码'
    isValid = false
  } else if (verificationCode.value.length !== 6) {
    errors.verificationCode = true
    errorMessages.verificationCode = '验证码为6位数字'
    isValid = false
  }
  
  return isValid
}

const getVerificationCode = () => {
  if (!phone.value.trim()) {
    errors.phone = true
    errorMessages.phone = '请先输入手机号'
    return
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone.value)) {
    errors.phone = true
    errorMessages.phone = '请输入正确的手机号'
    return
  }
  
  // Start countdown
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 1000)
  
  console.log('发送验证码到:', phone.value)
}

const handleSubmit = async () => {
  if (!agreedToTerms.value) {
    alert('请同意服务协议')
    return
  }
  
  if (!validateForm()) {
    return
  }
  
  try {
    // 准备注册数据
    const registerData = {
      username: phone.value, // 使用手机号作为用户名
      mobile: phone.value,
      password: password.value,
      password_confirm: password.value,
      email: '', // 注册时邮箱可以为空
      verification_code: verificationCode.value || undefined,
      invitation_code: invitationCode.value || undefined
    }
    
    console.log('准备发送注册请求，数据:', registerData)
    console.log('API基础URL:', import.meta.env.VITE_API_BASE || 'http://localhost:8000')
    console.log('完整请求URL:', `${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/v1/auth/register`)
    
    // 调用真实的注册API
    const result = await register(registerData)
    
    console.log('注册API响应:', result)
    
    if (result.success) {
      console.log('注册成功，用户信息:', result.data)
      // 注册成功后会自动跳转到首页（由 useAuth 处理）
    } else {
      console.error('注册失败:', result.error)
    }
  } catch (error) {
    console.error('注册失败，详细错误信息:', error)
    console.error('错误类型:', error.constructor.name)
    console.error('错误消息:', error.message)
    console.error('错误响应:', error.response)
    console.error('错误状态码:', error.response?.status)
    console.error('错误数据:', error.response?.data)
    console.error('错误配置:', error.config)
  }
}
</script>