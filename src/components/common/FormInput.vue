<template>
  <div :class="['form-input', containerClass]">
    <!-- Label -->
    <label v-if="label" :for="inputId" :class="['block mb-2 font-medium', labelClass]">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Prefix Icon -->
      <div v-if="prefixIcon" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <component :is="prefixIcon" class="w-5 h-5" />
      </div>

      <!-- Input -->
      <input
        v-if="type !== 'textarea'"
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="[
          'w-full px-4 py-3 rounded-lg border transition-all outline-none',
          prefixIcon ? 'pl-10' : '',
          suffixIcon || showClear ? 'pr-10' : '',
          error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 
          'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          inputClass
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.enter="handleEnter"
      />

      <!-- Textarea -->
      <textarea
        v-else
        :id="inputId"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        :class="[
          'w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none',
          error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 
          'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          inputClass
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      ></textarea>

      <!-- Suffix Icon or Clear Button -->
      <div v-if="suffixIcon || (showClear && inputValue)" class="absolute right-3 top-1/2 -translate-y-1/2">
        <button
          v-if="showClear && inputValue && !disabled"
          @click="handleClear"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
        <component v-else-if="suffixIcon" :is="suffixIcon" class="w-5 h-5 text-gray-400" />
      </div>

      <!-- Character Count -->
      <div v-if="maxlength && showCount" class="absolute right-3 bottom-3 text-xs text-gray-400">
        {{ inputValue.length }}/{{ maxlength }}
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <!-- Helper Text -->
    <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: null
  },
  rows: {
    type: Number,
    default: 3
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: [Object, Function],
    default: null
  },
  suffixIcon: {
    type: [Object, Function],
    default: null
  },
  showClear: {
    type: Boolean,
    default: false
  },
  showCount: {
    type: Boolean,
    default: false
  },
  containerClass: {
    type: String,
    default: ''
  },
  labelClass: {
    type: String,
    default: 'text-gray-700'
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus', 'enter', 'clear'])

const inputValue = ref(props.modelValue)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  emit('input', inputValue.value)
}

const handleBlur = () => {
  emit('blur', inputValue.value)
}

const handleFocus = () => {
  emit('focus', inputValue.value)
}

const handleEnter = () => {
  emit('enter', inputValue.value)
}

const handleClear = () => {
  inputValue.value = ''
  emit('clear')
}
</script>

