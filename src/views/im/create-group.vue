<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <button @click="goBack" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft class="w-6 h-6 text-gray-700" />
      </button>
      <h1 class="text-lg font-medium text-gray-800">创建群聊</h1>
      <button
        @click="handleCreate"
        :disabled="!groupName.trim() || isCreating"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
          groupName.trim() && !isCreating
            ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        ]"
      >
        {{ isCreating ? '创建中...' : '完成' }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Group Avatar -->
      <div class="bg-white p-6 mb-2">
        <div class="text-center">
          <div class="inline-block relative group-avatar">
            <div
              class="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              @click="handleUploadAvatar"
            >
              <img
                v-if="groupAvatar"
                :src="groupAvatar"
                alt="群头像"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-center">
                <Camera class="w-10 h-10 text-purple-400 mx-auto mb-1" />
                <p class="text-xs text-gray-500">设置群头像</p>
              </div>
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Plus class="w-5 h-5 text-white" />
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">点击设置群头像</p>
        </div>
      </div>

      <!-- Group Name -->
      <div class="bg-white p-4 mb-2">
        <FormInput
          v-model="groupName"
          label="群名称"
          type="text"
          placeholder="请输入群名称"
          :maxlength="20"
          :show-count="true"
          required
          :error="errors.groupName"
          :error-message="errorMessages.groupName"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
        />
      </div>

      <!-- Group Description -->
      <div class="bg-white p-4 mb-2">
        <FormInput
          v-model="groupDescription"
          label="群简介"
          type="textarea"
          placeholder="请输入群简介（选填）"
          :maxlength="100"
          :rows="3"
          :show-count="true"
          container-class="mb-0"
          label-class="text-gray-700 font-medium mb-3"
        />
      </div>

      <!-- Members List -->
      <div class="bg-white p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-gray-700 font-medium">群成员 ({{ members.length + 1 }})</span>
          <button
            @click="addMoreMembers"
            class="text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" />
            添加
          </button>
        </div>

        <div class="space-y-2">
          <!-- Me -->
          <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="我"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="text-base font-medium text-gray-900">我</div>
              <div class="text-xs text-gray-500">群主</div>
            </div>
          </div>

          <!-- Selected Members -->
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 member-item"
          >
            <img
              :src="member.avatar"
              :alt="member.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="text-base text-gray-900">{{ member.name }}</div>
              <div class="text-xs text-gray-500">{{ member.nickname }}</div>
            </div>
            <button
              @click="removeMember(member.id)"
              class="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X class="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="p-4">
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div class="flex gap-2">
            <Info class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-blue-700">
              <p class="mb-1">温馨提示：</p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>群名称最多20个字符</li>
                <li>创建后可随时修改群信息</li>
                <li>群成员可以邀请其他好友加入</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Camera, Plus, X, Info } from 'lucide-vue-next'
import FormInput from '@/components/common/FormInput.vue'

const router = useRouter()

const groupName = ref('')
const groupDescription = ref('')
const groupAvatar = ref('')
const members = ref([])
const isCreating = ref(false)

// 表单验证状态
const errors = reactive({
  groupName: false
})

// 错误消息
const errorMessages = reactive({
  groupName: ''
})

// 验证规则
const validateForm = () => {
  let isValid = true
  
  // 重置错误状态
  Object.keys(errors).forEach(key => {
    errors[key] = false
    errorMessages[key] = ''
  })
  
  // 验证群名称
  if (!groupName.value.trim()) {
    errors.groupName = true
    errorMessages.groupName = '请输入群名称'
    isValid = false
  } else if (groupName.value.trim().length < 2) {
    errors.groupName = true
    errorMessages.groupName = '群名称至少2个字符'
    isValid = false
  }
  
  return isValid
}

onMounted(() => {
  if (history.state && history.state.members) {
    members.value = history.state.members
  }
})

const goBack = () => {
  router.back()
}

const handleUploadAvatar = () => {
  console.log('上传群头像')
  // TODO: 实现头像上传功能
}

const addMoreMembers = () => {
  router.push({
    name: 'SelectMembers',
    state: {
      selectedMembers: members.value
    }
  })
}

const removeMember = (memberId) => {
  members.value = members.value.filter(member => member.id !== memberId)
}

const handleCreate = async () => {
  if (!validateForm() || isCreating.value) return

  isCreating.value = true

  try {
    console.log('创建群聊:', {
      name: groupName.value,
      description: groupDescription.value,
      avatar: groupAvatar.value,
      members: members.value.map(m => m.id)
    })

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    isCreating.value = false
    alert('群聊创建成功！')
    router.push('/im')
  } catch (error) {
    console.error('创建群聊失败:', error)
    isCreating.value = false
    alert('创建失败，请重试')
  }
}
</script>

<style scoped>
.group-avatar {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.member-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

textarea {
  font-family: inherit;
}
</style>
