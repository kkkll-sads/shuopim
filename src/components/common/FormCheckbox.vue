<template>
  <div :class="['form-checkbox-container', containerClass]">
    <!-- Main Label (for group) -->
    <label
      v-if="label"
      :class="[
        'block text-sm font-medium mb-3',
        labelClass,
        { 'text-red-500': error }
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Single Checkbox Mode -->
    <div
      v-if="!options || options.length === 0"
      class="flex items-start"
    >
      <div class="flex items-center h-6">
        <input
          :id="inputId"
          type="checkbox"
          :checked="modelValue"
          @change="handleSingleChange"
          :disabled="disabled"
          :required="required"
          :class="[
            'w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer',
            error
              ? 'border-red-500 text-red-500 focus:ring-red-500'
              : 'border-gray-300 text-orange-500 focus:ring-orange-500',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-400',
            checkboxClass
          ]"
        />
      </div>
      <div class="ml-3">
        <label
          :for="inputId"
          :class="[
            'text-sm cursor-pointer select-none',
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
          ]"
        >
          <span v-if="checkboxLabel">{{ checkboxLabel }}</span>
          <slot v-else></slot>
        </label>
        <p v-if="description" class="text-sm text-gray-500 mt-1">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Multiple Checkbox Mode (Group) -->
    <div
      v-else
      :class="[
        'space-y-3',
        inline ? 'flex flex-wrap gap-4' : ''
      ]"
    >
      <div
        v-for="option in options"
        :key="getOptionValue(option)"
        class="flex items-start"
      >
        <div class="flex items-center h-6">
          <input
            :id="`${inputId}-${getOptionValue(option)}`"
            type="checkbox"
            :value="getOptionValue(option)"
            :checked="isChecked(getOptionValue(option))"
            @change="handleGroupChange"
            :disabled="disabled || option.disabled"
            :class="[
              'w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer',
              error
                ? 'border-red-500 text-red-500 focus:ring-red-500'
                : 'border-gray-300 text-orange-500 focus:ring-orange-500',
              disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-400',
              checkboxClass
            ]"
          />
        </div>
        <div class="ml-3 flex-1">
          <label
            :for="`${inputId}-${getOptionValue(option)}`"
            :class="[
              'text-sm cursor-pointer select-none',
              disabled || option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
            ]"
          >
            {{ getOptionLabel(option) }}
          </label>
          <p
            v-if="option.description"
            class="text-sm text-gray-500 mt-1"
          >
            {{ option.description }}
          </p>
        </div>
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
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  // v-model 绑定值
  // 单个复选框：boolean
  // 多个复选框：array
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  // 选项数组（用于多选组）
  options: {
    type: Array,
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
  // 组标签（用于多选组）
  label: {
    type: String,
    default: ''
  },
  // 单个复选框的标签
  checkboxLabel: {
    type: String,
    default: ''
  },
  // 描述文本
  description: {
    type: String,
    default: ''
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
  // 是否内联显示（用于多选组）
  inline: {
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
  // 复选框类名
  checkboxClass: {
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
const inputId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`)

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

// 检查选项是否被选中
const isChecked = (value) => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value)
  }
  return false
}

// 处理单个复选框变化
const handleSingleChange = (event) => {
  const checked = event.target.checked
  emit('update:modelValue', checked)
  emit('change', checked)
}

// 处理复选框组变化
const handleGroupChange = (event) => {
  const value = event.target.value
  const checked = event.target.checked
  
  let newValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  
  if (checked) {
    if (!newValue.includes(value)) {
      newValue.push(value)
    }
  } else {
    newValue = newValue.filter(v => v !== value)
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
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

/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type="checkbox"]:checked {
  background-color: currentColor;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-color: currentColor;
}

input[type="checkbox"]:focus {
  outline: none;
  ring: 2px;
}

/* Animation for checkbox */
input[type="checkbox"] {
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  animation: checkboxPop 0.2s ease;
}

@keyframes checkboxPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

