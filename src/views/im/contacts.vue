<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">通讯录</h1>
      <div class="flex items-center gap-2">
        <button @click="openSearch" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <Search class="w-5 h-5 text-gray-700" />
        </button>
        <button @click="addContact" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <Plus class="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>

    <!-- Special Sections -->
    <div class="bg-white">
      <button
        @click="goToVerification"
        class="w-full px-4 py-3 flex items-center justify-between border-b hover:bg-gray-50"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
            <MessageSquare class="w-6 h-6 text-white" />
          </div>
          <span class="text-gray-900">验证消息</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>

      <button
        @click="goToBlacklist"
        class="w-full px-4 py-3 flex items-center justify-between border-b hover:bg-gray-50"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
            <UserX class="w-6 h-6 text-white" />
          </div>
          <span class="text-gray-900">黑名单</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>

      <button
        @click="goToMyGroups"
        class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <Users class="w-6 h-6 text-white" />
          </div>
          <span class="text-gray-900">我的群聊</span>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <!-- Contacts List -->
    <div class="relative mt-2">
      <!-- Alphabetical Index -->
      <div class="fixed right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-0.5">
        <button
          v-for="letter in alphabet"
          :key="letter"
          @click="scrollToLetter(letter)"
          class="text-xs text-gray-500 hover:text-orange-500 py-0.5 px-1"
        >
          {{ letter }}
        </button>
      </div>

      <!-- Contact Groups -->
      <div v-if="contacts.length > 0" class="bg-white">
        <div
          v-for="group in groupedContacts"
          :key="group.letter"
          :id="`letter-${group.letter}`"
          class="border-b"
        >
          <div class="px-4 py-2 bg-gray-100 text-sm text-gray-600 font-medium">
            {{ group.letter }}
          </div>
          <button
            v-for="contact in group.contacts"
            :key="contact.id"
            @click="openContact(contact)"
            class="w-full px-4 py-3 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50"
          >
            <img
              :src="contact.avatar"
              :alt="contact.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div class="flex-1 text-left">
              <div class="text-base font-medium text-gray-900">{{ contact.name }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white py-32 text-center">
        <div class="flex justify-center mb-4">
          <svg class="w-32 h-32 text-gray-300" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="25" width="60" height="50" rx="2" fill="currentColor" opacity="0.3"/>
            <rect x="30" y="35" width="40" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="30" y="42" width="30" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="30" y="49" width="35" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="30" y="56" width="25" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
            <path d="M75 70 L85 80 L85 70 Z" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
        <p class="text-gray-400">暂无好友</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Search, Plus, MessageSquare, UserX, Users } from 'lucide-vue-next'

const router = useRouter()

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']

// Sample contacts data - replace with actual API call
const contacts = ref([
  // {
  //   id: 1,
  //   name: '张三',
  //   avatar: '/placeholder.svg?height=48&width=48',
  //   pinyin: 'zhangsan'
  // },
  // Add more contacts here
])

// Group contacts by first letter
const groupedContacts = computed(() => {
  const groups = {}
  
  contacts.value.forEach(contact => {
    const firstLetter = contact.pinyin ? contact.pinyin[0].toUpperCase() : '#'
    const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#'
    
    if (!groups[letter]) {
      groups[letter] = []
    }
    groups[letter].push(contact)
  })
  
  // Convert to array and sort
  return Object.keys(groups)
    .sort()
    .map(letter => ({
      letter,
      contacts: groups[letter].sort((a, b) => a.pinyin.localeCompare(b.pinyin))
    }))
})

const goBack = () => {
  router.back()
}

const openSearch = () => {
  // TODO: 实现搜索功能
  console.log('Open search')
}

const addContact = () => {
  router.push('/im/add-friend')
}

const goToVerification = () => {
  router.push('/im/verification')
}

const goToBlacklist = () => {
  router.push('/im/blacklist')
}

const goToMyGroups = () => {
  router.push('/im/groups/my')
}

const scrollToLetter = (letter) => {
  const element = document.getElementById(`letter-${letter}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const openContact = (contact) => {
  console.log('Open contact:', contact)
  // TODO: Navigate to contact detail page
}

// Fetch contacts on mount
// TODO: Replace with actual API call
// const fetchContacts = async () => {
//   const response = await fetch('/api/contacts')
//   contacts.value = await response.json()
// }
// fetchContacts()
</script>

<style scoped>
.contact-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 优化字母索引 */
.fixed.right-2 button:active {
  transform: scale(1.2);
  font-weight: bold;
}
</style>