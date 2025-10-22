<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">添加银行卡</h1>
    </div>

    <!-- Form -->
    <div class="flex-1 bg-white mt-3 mx-4 rounded-2xl shadow-sm form-container">
      <!-- 账号类型 -->
      <div class="px-4 py-4 border-b border-gray-100 flex items-center justify-between form-item">
        <label class="text-gray-700 font-medium">账号类型</label>
        <div class="flex items-center gap-2">
          <button
            @click="form.accountType = 'personal'"
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300',
              form.accountType === 'personal' ? 'border-orange-500 scale-110' : 'border-gray-300'
            ]"
          >
            <div
              v-if="form.accountType === 'personal'"
              class="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-scale"
            ></div>
          </button>
          <span class="text-gray-800">个人</span>
        </div>
      </div>

      <!-- 银行名称 -->
      <div class="px-4 py-4 border-b border-gray-100 flex items-center justify-between form-item">
        <label class="text-gray-700 font-medium">银行名称</label>
        <button class="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors" @click="selectBank">
          <span>{{ form.bankName || '请选择银行' }}</span>
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>

      <!-- 银行账号 -->
      <div class="px-4 py-4 border-b border-gray-100 form-item">
        <FormInput
          v-model="form.cardNumber"
          label="银行账号"
          type="text"
          placeholder="填写银行卡号"
          required
          :error="errors.cardNumber"
          :error-message="errorMessages.cardNumber"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
          input-class="text-right"
        />
      </div>

      <!-- 持卡姓名 -->
      <div class="px-4 py-4 border-b border-gray-100 form-item">
        <FormInput
          v-model="form.cardholderName"
          label="持卡姓名"
          type="text"
          placeholder="持卡人姓名"
          required
          :error="errors.cardholderName"
          :error-message="errorMessages.cardholderName"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
          input-class="text-right"
        />
      </div>

      <!-- 手机号码 -->
      <div class="px-4 py-4 form-item">
        <FormInput
          v-model="form.phone"
          label="手机号码"
          type="tel"
          placeholder="持卡人手机号"
          required
          :error="errors.phone"
          :error-message="errorMessages.phone"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
          input-class="text-right"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="p-4 bg-transparent">
      <button
        @click="submit"
        class="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-orange-200 transition-all transform active:scale-95"
      >
        确认添加
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
  accountType: 'personal',
  bankName: '',
  cardNumber: '',
  cardholderName: '',
  phone: ''
})

// 表单验证状态
const errors = reactive({
  cardNumber: false,
  cardholderName: false,
  phone: false
})

// 错误消息
const errorMessages = reactive({
  cardNumber: '',
  cardholderName: '',
  phone: ''
})

// 验证规则
const validateForm = () => {
  let isValid = true
  
  // 重置错误状态
  Object.keys(errors).forEach(key => {
    errors[key] = false
    errorMessages[key] = ''
  })
  
  // 验证银行账号
  if (!form.value.cardNumber.trim()) {
    errors.cardNumber = true
    errorMessages.cardNumber = '请输入银行账号'
    isValid = false
  } else if (!/^\d{16,19}$/.test(form.value.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = true
    errorMessages.cardNumber = '请输入正确的银行卡号'
    isValid = false
  }
  
  // 验证持卡人姓名
  if (!form.value.cardholderName.trim()) {
    errors.cardholderName = true
    errorMessages.cardholderName = '请输入持卡人姓名'
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
  
  return isValid
}

const goBack = () => {
  router.back()
}

const selectBank = () => {
  console.log('Select bank')
  // TODO: 实现银行选择功能
}

const submit = () => {
  if (!validateForm()) {
    return
  }
  
  console.log('Submit bank card:', form.value)
  // TODO: 调用API提交银行卡
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

@keyframes scale {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-scale {
  animation: scale 0.3s ease-out;
}

input:focus {
  color: #1f2937;
}

input::placeholder {
  transition: opacity 0.3s ease;
}

input:focus::placeholder {
  opacity: 0.5;
}
</style>