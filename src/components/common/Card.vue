<template>
  <div
    :class="[
      'bg-white rounded-xl overflow-hidden transition-all',
      shadow ? 'shadow-sm hover:shadow-md' : '',
      clickable ? 'cursor-pointer' : '',
      padding,
      customClass
    ]"
    @click="handleClick"
  >
    <!-- Header -->
    <div v-if="title || $slots.header" :class="['flex items-center justify-between', headerPadding]">
      <div v-if="title || $slots.title" class="flex items-center gap-2">
        <component v-if="icon" :is="icon" :class="['flex-shrink-0', iconColor, iconSize]" />
        <h3 v-if="title" :class="['font-semibold', titleClass]">
          {{ title }}
        </h3>
        <slot v-else name="title"></slot>
      </div>
      <slot name="header-right"></slot>
    </div>

    <!-- Divider -->
    <div v-if="(title || $slots.header) && divider" class="border-t border-gray-100 my-3"></div>

    <!-- Content -->
    <div :class="contentPadding">
      <slot></slot>
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" :class="['border-t border-gray-100 pt-3 mt-3', footerPadding]">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  iconColor: {
    type: String,
    default: 'text-purple-500'
  },
  iconSize: {
    type: String,
    default: 'w-5 h-5'
  },
  shadow: {
    type: Boolean,
    default: true
  },
  padding: {
    type: String,
    default: 'p-4'
  },
  headerPadding: {
    type: String,
    default: ''
  },
  contentPadding: {
    type: String,
    default: ''
  },
  footerPadding: {
    type: String,
    default: ''
  },
  divider: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  titleClass: {
    type: String,
    default: 'text-gray-800'
  },
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

