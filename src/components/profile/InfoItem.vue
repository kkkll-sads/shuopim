<template>
  <div
    :class="[
      'bg-white rounded-xl p-4 shadow-sm transition-all',
      clickable ? 'cursor-pointer hover:shadow-md' : '',
      selected ? 'ring-2 ring-purple-400' : '',
      customClass
    ]"
    @click="handleClick"
  >
    <div class="flex items-start justify-between">
      <!-- Content -->
      <div class="flex-1 min-w-0 mr-3">
        <!-- Title & Badge -->
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-base font-semibold text-gray-800 truncate">
            {{ title }}
          </h3>
          <span
            v-if="badge"
            class="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex-shrink-0"
          >
            {{ badge }}
          </span>
          <span
            v-if="isDefault"
            class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0"
          >
            默认
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-1">
          <p
            v-for="(detail, index) in details"
            :key="index"
            class="text-sm text-gray-600"
          >
            {{ detail }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="$slots.actions || showActions" class="flex flex-col gap-2 flex-shrink-0">
        <slot name="actions">
          <button
            v-if="showEdit"
            @click.stop="handleEdit"
            class="text-sm text-purple-500 hover:text-purple-600 transition-colors"
          >
            编辑
          </button>
          <button
            v-if="showDelete"
            @click.stop="handleDelete"
            class="text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            删除
          </button>
        </slot>
      </div>

      <!-- Arrow -->
      <ChevronRight
        v-if="showArrow"
        class="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
      />
    </div>
  </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  details: {
    type: Array,
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click', 'edit', 'delete'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}

const handleEdit = () => {
  emit('edit')
}

const handleDelete = () => {
  emit('delete')
}
</script>

