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
            <div class="flex items-center gap-3 border-b border-gray-300 pb-3">
              <Smartphone class="w-5 h-5 text-gray-600" />
              <input
                v-model="phone"
                type="tel"
                placeholder="请输入手机号"
                class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="mb-6">
            <div class="flex items-center gap-3 border-b border-gray-300 pb-3">
              <Lock class="w-5 h-5 text-gray-600" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Verification Code Input -->
          <div class="mb-6 relative">
            <div class="flex items-center gap-3 border-b border-gray-300 pb-3">
              <Shield class="w-5 h-5 text-gray-600" />
              <input
                v-model="verificationCode"
                type="text"
                placeholder="请输入验证码"
                class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 pr-20"
              />
              <button
                type="button"
                @click="getVerificationCode"
                :disabled="countdown > 0"
                class="absolute right-0 text-pink-500 hover:text-pink-600 transition-colors text-sm disabled:text-gray-400 whitespace-nowrap"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- Invitation Code Input -->
          <div class="mb-6">
            <div class="flex items-center gap-3 border-b border-gray-300 pb-3">
              <Send class="w-5 h-5 text-gray-600" />
              <input
                v-model="invitationCode"
                type="text"
                placeholder="邀请码（选填）"
                class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
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
            :disabled="loading"
            class="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg font-medium py-4 rounded-full hover:from-pink-600 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '注册中...' : '注册' }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Smartphone, Lock, Shield, Send } from 'lucide-vue-next'

const router = useRouter()

const phone = ref('')
const password = ref('')
const verificationCode = ref('')
const invitationCode = ref('')
const showPassword = ref(false)
const agreedToTerms = ref(false)
const countdown = ref(0)
const loading = ref(false)

let countdownTimer = null

const getVerificationCode = () => {
  if (!phone.value) {
    alert('请先输入手机号')
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
  if (!phone.value || !password.value || !verificationCode.value) {
    alert('请填写完整信息')
    return
  }
  
  if (!agreedToTerms.value) {
    alert('请同意服务协议')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟注册 API 调用
    // TODO: 替换为实际的 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('注册成功:', {
      phone: phone.value,
      password: password.value,
      verificationCode: verificationCode.value,
      invitationCode: invitationCode.value
    })
    
    alert('注册成功！请登录')
    
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>