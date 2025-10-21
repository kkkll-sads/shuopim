<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-400 via-pink-300 to-pink-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">Hello!</h1>
        <p class="text-2xl text-gray-700">欢迎登录树拍平台</p>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white/90 rounded-3xl p-8 shadow-xl">
        <!-- Tab Navigation -->
        <div class="flex gap-8 mb-8 justify-center">
          <button
            @click="activeTab = 'password'"
            :class="[
              'text-lg font-medium pb-2 transition-colors',
              activeTab === 'password'
                ? 'text-gray-800 border-b-2 border-gray-800'
                : 'text-gray-400'
            ]"
          >
            密码登录
          </button>
          <button
            @click="activeTab = 'code'"
            :class="[
              'text-lg font-medium pb-2 transition-colors',
              activeTab === 'code'
                ? 'text-gray-800 border-b-2 border-gray-800'
                : 'text-gray-400'
            ]"
          >
            验证码登录
          </button>
        </div>

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

        <!-- Password/Code Input -->
        <div class="mb-6">
          <div class="flex items-center gap-3 border-b border-gray-300 pb-3">
            <Lock class="w-5 h-5 text-gray-600" />
            <input
              v-model="password"
              :type="activeTab === 'password' ? 'password' : 'text'"
              :placeholder="activeTab === 'password' ? '请输入密码' : '请输入验证码'"
              class="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        <!-- Links -->
        <div class="flex justify-between mb-8 text-sm">
          <button @click="$router.push('/forgot')" class="text-pink-500 hover:text-pink-600 transition-colors">
            忘记密码！
          </button>
          <button @click="$router.push('/register')" class="text-gray-600 hover:text-gray-800 transition-colors">
            没有账号！去注册
          </button>
        </div>

        <!-- Login Button -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg font-medium py-4 rounded-full hover:from-pink-600 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <!-- Agreement -->
        <div class="mt-6 flex items-start gap-2 text-xs text-gray-600">
          <input
            v-model="agreed"
            type="checkbox"
            id="agreement"
            class="mt-1 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
          />
          <label for="agreement" class="leading-relaxed">
            登录即代表你已同意
            <a href="#" class="text-blue-500 hover:underline">《服务协议》</a>
            和
            <a href="#" class="text-blue-500 hover:underline">《隐私政策》</a>
            和
            <a href="#" class="text-blue-500 hover:underline">《用户须知》</a>
            和
            <a href="#" class="text-blue-500 hover:underline">《交易风险提示》</a>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Smartphone, Lock } from 'lucide-vue-next'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('password')
const phone = ref('')
const password = ref('')
const agreed = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!agreed.value) {
    alert('请先同意服务协议')
    return
  }
  if (!phone.value || !password.value) {
    alert('请填写完整信息')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟登录 API 调用
    // TODO: 替换为实际的 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功，生成 token
    const mockToken = `mock_token_${Date.now()}`
    const mockUserInfo = {
      phone: phone.value,
      name: '用户' + phone.value.slice(-4),
      loginType: activeTab.value
    }
    
    // 保存 token 和用户信息
    userStore.setToken(mockToken)
    userStore.setUserInfo(mockUserInfo)
    
    console.log('登录成功:', { phone: phone.value, type: activeTab.value })
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>