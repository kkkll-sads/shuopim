<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-400 via-pink-300 to-pink-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">Hello!</h1>
        <p class="text-2xl text-gray-700">找回密码</p>
      </div>

      <!-- Forgot Password Form Card -->
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
              class="absolute right-0 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-600 transition-colors text-sm disabled:text-gray-400 whitespace-nowrap"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>

          <!-- New Password Input -->
          <div class="mb-6">
            <FormInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入新密码"
              :prefix-icon="Lock"
              :error="errors.password"
              :error-message="errorMessages.password"
              container-class="mb-0"
              input-class="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-3 focus:border-gray-800 focus:ring-0"
            />
          </div>

          <!-- Links -->
          <div class="flex justify-between mb-8 text-sm">
            <button type="button" @click="$router.push('/register')" class="text-gray-600 hover:text-gray-800 transition-colors">
              没有账号！去注册
            </button>
            <button type="button" @click="$router.push('/login')" class="text-pink-500 hover:text-pink-600 transition-colors">
              去登录
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg font-medium py-4 rounded-full hover:from-pink-600 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '修改中...' : '修改密码' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Smartphone, Lock, Shield } from 'lucide-vue-next'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()

const phone = ref('')
const password = ref('')
const verificationCode = ref('')
const showPassword = ref(false)
const countdown = ref(0)
const loading = ref(false)

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
  
  // 验证密码
  if (!password.value.trim()) {
    errors.password = true
    errorMessages.password = '请输入新密码'
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = true
    errorMessages.password = '密码至少6位'
    isValid = false
  }
  
  return isValid
}

let countdownTimer = null

const getVerificationCode = () => {
  if (!phone.value.trim()) {
    errors.phone = true
    errorMessages.phone = '请先输入手机号'
    return
  }
  
  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone.value)) {
    errors.phone = true
    errorMessages.phone = '请输入正确的手机号'
    return
  }
  
  // 清除错误状态
  errors.phone = false
  errorMessages.phone = ''
  
  // Start countdown
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 1000)
  
  console.log('发送验证码到:', phone.value)
  // TODO: 调用发送验证码API
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    // 模拟修改密码 API 调用
    // TODO: 替换为实际的 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('修改密码成功:', {
      phone: phone.value,
      password: password.value,
      verificationCode: verificationCode.value
    })
    
    alert('密码修改成功！请登录')
    
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>