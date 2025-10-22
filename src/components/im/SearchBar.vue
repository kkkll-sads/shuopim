<template>
  <div class="bg-white px-4 py-3" :class="shadow ? 'shadow-sm' : ''">
    <div
      :class="[
        'bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2',
        focused ? 'ring-2 ring-purple-200' : ''
      ]"
    >
      <Search :class="['text-gray-400', size === 'small' ? 'w-4 h-4' : 'w-5 h-5']" />
      <input
        ref="inputRef"
        v-model="searchValue"
        :type="type"
        :placeholder="placeholder"
        :class="[
          'flex-1 bg-transparent outline-none text-gray-900',
          size === 'small' ? 'text-xs' : 'text-sm'
        ]"
        @input="handleInput"
        @keyup.enter="handleEnter"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        v-if="searchValue && showClear"
        @click="handleClear"
        class="p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <X class="w-4 h-4 text-gray-400" />
      </button>
      <button
        v-if="showButton"
        @click="handleSearch"
        :class="[
          'px-4 py-1 rounded-lg text-white font-medium transition-all',
          size === 'small' ? 'text-xs' : 'text-sm',
          buttonClass
        ]"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索'
  },
  type: {
    type: String,
    default: 'text'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium'].includes(value)
  },
  showButton: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: '搜索'
  },
  buttonClass: {
    type: String,
    default: 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600'
  },
  showClear: {
    type: Boolean,
    default: true
  },
  shadow: {
    type: Boolean,
    default: false
  },
  debounce: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'input', 'clear', 'enter'])

const inputRef = ref(null)
const searchValue = ref(props.modelValue)
const focused = ref(false)
let debounceTimer = null

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  if (props.debounce > 0) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('input', searchValue.value)
    }, props.debounce)
  } else {
    emit('input', searchValue.value)
  }
}

const handleSearch = () => {
  emit('search', searchValue.value)
}

const handleEnter = () => {
  emit('enter', searchValue.value)
  emit('search', searchValue.value)
}

const handleClear = () => {
  searchValue.value = ''
  emit('clear')
  inputRef.value?.focus()
}

const handleFocus = () => {
  focused.value = true
}

const handleBlur = () => {
  focused.value = false
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus
})
</script>

