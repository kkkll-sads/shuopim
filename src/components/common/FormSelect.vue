<template>
  <div :class="['form-select-container', containerClass]">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="[
        'block text-sm font-medium mb-2',
        labelClass,
        { 'text-red-500': error }
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Select Container -->
    <div
      :class="[
        'relative',
        { 'opacity-50 cursor-not-allowed': disabled }
      ]"
    >
      <!-- Prefix Icon -->
      <div
        v-if="prefixIcon"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
      >
        <component
          :is="prefixIcon"
          :class="[
            'w-5 h-5',
            error ? 'text-red-500' : 'text-gray-400'
          ]"
        />
      </div>

      <!-- Select Element -->
      <select
        :id="inputId"
        :value="modelValue"
        @change="handleChange"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full appearance-none rounded-lg border px-4 py-3 pr-10 transition-all duration-200',
          prefixIcon ? 'pl-11' : 'pl-4',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200',
          disabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-white hover:border-gray-400',
          inputClass
        ]"
      >
        <!-- Placeholder Option -->
        <option
          v-if="placeholder"
          value=""
          disabled
          :selected="!modelValue"
        >
          {{ placeholder }}
        </option>

        <!-- Options -->
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
          :disabled="option.disabled"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <!-- Dropdown Arrow Icon -->
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown
          :class="[
            'w-5 h-5 transition-colors',
            error ? 'text-red-500' : 'text-gray-400'
          ]"
        />
      </div>
    </div>

    <!-- Error Message -->
    <transition name="error-slide">
      <div
        v-if="error && errorMessage"
        class="mt-2 flex items-center gap-1 text-sm text-red-500"
      >
        <AlertCircle class="w-4 h-4 flex-shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>
    </transition>

    <!-- Helper Text -->
    <div
      v-if="helperText && !error"
      class="mt-2 text-sm text-gray-500"
    >
      {{ helperText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDown, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  // v-model 绑定值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 选项数组
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  // 选项值字段名
  valueKey: {
    type: String,
    default: 'value'
  },
  // 选项标签字段名
  labelKey: {
    type: String,
    default: 'label'
  },
  // 标签文本
  label: {
    type: String,
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 前缀图标
  prefixIcon: {
    type: Object,
    default: null
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 错误状态
  error: {
    type: Boolean,
    default: false
  },
  // 错误消息
  errorMessage: {
    type: String,
    default: ''
  },
  // 帮助文本
  helperText: {
    type: String,
    default: ''
  },
  // 容器类名
  containerClass: {
    type: String,
    default: ''
  },
  // 输入框类名
  inputClass: {
    type: String,
    default: ''
  },
  // 标签类名
  labelClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 生成唯一ID
const inputId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

// 获取选项的值
const getOptionValue = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option[props.valueKey]
  }
  return option
}

// 获取选项的标签
const getOptionLabel = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option[props.labelKey]
  }
  return option
}

// 处理选择变化
const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
/* Error message animation */
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom select styling */
select {
  background-image: none;
}

select:focus {
  outline: none;
}

/* Disabled state */
select:disabled {
  color: #9ca3af;
}

/* Option styling */
option:disabled {
  color: #d1d5db;
}
</style>

