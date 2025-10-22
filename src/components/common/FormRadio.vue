<template>
  <div :class="['form-radio-container', containerClass]">
    <!-- Label -->
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

    <!-- Radio Group -->
    <div
      :class="[
        inline ? 'flex flex-wrap gap-4' : 'space-y-3'
      ]"
    >
      <div
        v-for="option in options"
        :key="getOptionValue(option)"
        :class="[
          'flex items-start',
          cardStyle ? 'flex-1 min-w-[120px]' : ''
        ]"
      >
        <!-- Card Style Radio -->
        <div
          v-if="cardStyle"
          @click="!disabled && !option.disabled && handleChange(getOptionValue(option))"
          :class="[
            'flex-1 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
            isChecked(getOptionValue(option))
              ? 'border-orange-500 bg-orange-50 shadow-sm'
              : 'border-gray-300 bg-white hover:border-gray-400',
            disabled || option.disabled
              ? 'opacity-50 cursor-not-allowed'
              : '',
            error ? 'border-red-500' : '',
            radioClass
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="flex items-center h-6">
              <div
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  isChecked(getOptionValue(option))
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                ]"
              >
                <div
                  v-if="isChecked(getOptionValue(option))"
                  class="w-2 h-2 rounded-full bg-white"
                ></div>
              </div>
            </div>
            <div class="flex-1">
              <div
                :class="[
                  'text-sm font-medium',
                  isChecked(getOptionValue(option))
                    ? 'text-orange-600'
                    : 'text-gray-700'
                ]"
              >
                {{ getOptionLabel(option) }}
              </div>
              <div
                v-if="option.description"
                class="text-sm text-gray-500 mt-1"
              >
                {{ option.description }}
              </div>
            </div>
            <!-- Optional Icon -->
            <div v-if="option.icon" class="flex-shrink-0">
              <component
                :is="option.icon"
                :class="[
                  'w-6 h-6',
                  isChecked(getOptionValue(option))
                    ? 'text-orange-500'
                    : 'text-gray-400'
                ]"
              />
            </div>
          </div>
        </div>

        <!-- Standard Style Radio -->
        <template v-else>
          <div class="flex items-center h-6">
            <input
              :id="`${inputId}-${getOptionValue(option)}`"
              type="radio"
              :name="name || inputId"
              :value="getOptionValue(option)"
              :checked="isChecked(getOptionValue(option))"
              @change="handleChange(getOptionValue(option))"
              :disabled="disabled || option.disabled"
              :required="required"
              :class="[
                'w-5 h-5 border-2 transition-all duration-200 cursor-pointer',
                error
                  ? 'border-red-500 text-red-500 focus:ring-red-500'
                  : 'border-gray-300 text-orange-500 focus:ring-orange-500',
                disabled || option.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-orange-400',
                radioClass
              ]"
            />
          </div>
          <div class="ml-3 flex-1">
            <label
              :for="`${inputId}-${getOptionValue(option)}`"
              :class="[
                'text-sm cursor-pointer select-none',
                disabled || option.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700'
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
          <!-- Optional Icon -->
          <div v-if="option.icon" class="ml-2 flex-shrink-0">
            <component
              :is="option.icon"
              class="w-5 h-5 text-gray-400"
            />
          </div>
        </template>
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
  modelValue: {
    type: [String, Number, Boolean],
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
  // radio name 属性
  name: {
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
  // 是否内联显示
  inline: {
    type: Boolean,
    default: false
  },
  // 是否使用卡片样式
  cardStyle: {
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
  // 单选框类名
  radioClass: {
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
const inputId = computed(() => `radio-${Math.random().toString(36).substr(2, 9)}`)

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
  return props.modelValue === value
}

// 处理选择变化
const handleChange = (value) => {
  if (props.disabled) return
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

/* Custom radio styling */
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50%;
}

input[type="radio"]:checked {
  background-color: currentColor;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-color: currentColor;
}

input[type="radio"]:focus {
  outline: none;
  ring: 2px;
}

/* Animation for radio */
input[type="radio"] {
  transition: all 0.2s ease;
}

input[type="radio"]:checked {
  animation: radioPop 0.2s ease;
}

@keyframes radioPop {
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

/* Card style animation */
.form-radio-container > div > div {
  transition: all 0.2s ease;
}

.form-radio-container > div > div:active {
  transform: scale(0.98);
}
</style>

