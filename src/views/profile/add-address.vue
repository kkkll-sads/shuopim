<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">添加收货地址</h1>
    </div>

    <!-- Form -->
    <div class="flex-1 bg-white mt-3 mx-4 rounded-2xl shadow-sm form-container">
      <!-- 联系人 -->
      <div class="px-4 py-4 border-b border-gray-100 form-item">
        <FormInput
          v-model="form.name"
          label="联系人"
          type="text"
          placeholder="请输入姓名"
          required
          :error="errors.name"
          :error-message="errorMessages.name"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
        />
      </div>

      <!-- 手机号 -->
      <div class="px-4 py-4 border-b border-gray-100 form-item">
        <FormInput
          v-model="form.phone"
          label="手机号"
          type="tel"
          placeholder="请输入手机号码"
          required
          :error="errors.phone"
          :error-message="errorMessages.phone"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
        />
      </div>

      <!-- 所在地区 -->
      <div class="px-4 py-4 border-b border-gray-100 flex items-center form-item">
        <label class="text-gray-700 w-20 font-medium">所在地区</label>
        <button class="flex-1 flex items-center justify-between text-gray-400 hover:text-orange-500 transition-colors" @click="selectRegion">
          <span>{{ form.region || '请选择' }}</span>
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>

      <!-- 详细地址 -->
      <div class="px-4 py-4 border-b border-gray-100 form-item">
        <FormInput
          v-model="form.address"
          label="详细地址"
          type="textarea"
          placeholder="请填写详细地址，如街道、楼牌号等"
          :rows="3"
          required
          :error="errors.address"
          :error-message="errorMessages.address"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
        />
      </div>

      <!-- 设为默认 -->
      <div class="px-4 py-4 flex items-center justify-between form-item">
        <span class="text-gray-700 font-medium">设为默认</span>
        <button
          @click="form.isDefault = !form.isDefault"
          :class="[
            'w-12 h-6 rounded-full transition-all relative duration-300 toggle-button',
            form.isDefault ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gray-300'
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-md duration-300',
              form.isDefault ? 'translate-x-6' : 'translate-x-0.5'
            ]"
          ></div>
        </button>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="p-4 bg-transparent">
      <button
        @click="submit"
        class="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-orange-200 transition-all transform active:scale-95"
      >
        完成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()

const form = ref({
  name: '',
  phone: '',
  region: '',
  address: '',
  isDefault: false
})

// 表单验证状态
const errors = reactive({
  name: false,
  phone: false,
  address: false
})

// 错误消息
const errorMessages = reactive({
  name: '',
  phone: '',
  address: ''
})

// 验证规则
const validateForm = () => {
  let isValid = true
  
  // 重置错误状态
  Object.keys(errors).forEach(key => {
    errors[key] = false
    errorMessages[key] = ''
  })
  
  // 验证姓名
  if (!form.value.name.trim()) {
    errors.name = true
    errorMessages.name = '请输入联系人姓名'
    isValid = false
  }
  
  // 验证手机号
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!form.value.phone.trim()) {
    errors.phone = true
    errorMessages.phone = '请输入手机号码'
    isValid = false
  } else if (!phoneRegex.test(form.value.phone)) {
    errors.phone = true
    errorMessages.phone = '请输入正确的手机号码'
    isValid = false
  }
  
  // 验证详细地址
  if (!form.value.address.trim()) {
    errors.address = true
    errorMessages.address = '请输入详细地址'
    isValid = false
  }
  
  return isValid
}

const goBack = () => {
  router.back()
}

const selectRegion = () => {
  console.log('Select region')
  // TODO: 实现地区选择功能
}

const submit = () => {
  if (!validateForm()) {
    return
  }
  
  console.log('Submit address:', form.value)
  // TODO: 调用API提交地址
  // 提交成功后返回列表页
  router.back()
}
</script>

<style scoped>
.form-container {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-item {
  transition: background-color 0.2s ease;
}

.form-item:active {
  background-color: #f9fafb;
}

.toggle-button {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-button:active {
  transform: scale(0.95);
}

input:focus,
textarea:focus {
  color: #1f2937;
}

input::placeholder,
textarea::placeholder {
  transition: opacity 0.3s ease;
}

input:focus::placeholder,
textarea:focus::placeholder {
  opacity: 0.5;
}
</style>