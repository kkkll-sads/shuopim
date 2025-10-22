/**
 * 聊天功能组合式函数
 * 提供聊天相关的状态管理和方法
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi'
import { useStorage } from './useStorage'
import { useToast } from './useToast'
import { useUserStore } from '@/store/user'
import { getMessageRecords, sendMessage as sendIMMessage } from '@/api/im'

/**
 * 使用聊天功能
 * @param {Object} options - 配置选项
 * @returns {Object} 聊天相关的状态和方法
 */
export function useChat(options = {}) {
  const {
    chatId,
    chatType = 'group', // 'group' | 'private'
    autoRefresh = true,
    refreshInterval = 5000,
    maxMessages = 100,
    enableTyping = true,
    enableReadStatus = true
  } = options

  // API 和存储
  const { request } = useApi()
  const { setValue: setItem, value: getItem } = useStorage(`chat_messages_${chatId}`, [])
  const { success: showSuccess, error: showError } = useToast()

  // 响应式状态
  const messages = ref([])
  const chatInfo = ref({
    id: chatId,
    name: '加载中...',
    avatar: '/default-avatar.png',
    type: chatType,
    isOnline: false,
    lastSeen: null,
    memberCount: 0
  })
  const currentUserId = ref('user_001') // 当前用户ID
  const onlineCount = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)
  const sending = ref(false)
  const inputMessage = ref('')
  const isRecording = ref(false)
  const isTyping = ref(false)
  const typingUsers = ref([])

  // 定时器
  let refreshTimer = null
  let typingTimer = null

  // 计算属性
  const hasMessages = computed(() => messages.value.length > 0)
  const unreadCount = computed(() => {
    return messages.value.filter(msg => 
      !msg.isRead && msg.senderId !== currentUserId.value
    ).length
  })

  // 模拟数据
  const mockMessages = [
    {
      id: 'msg_001',
      type: 'text',
      content: '不登记不报案,就这么简单六个字,坚持到底就是胜利!所有群转发,大家周知!',
      senderId: 'user_002',
      senderName: '凤姐十鲜',
      senderAvatar: '/avatars/fengjie.jpg',
      timestamp: Date.now() - 3600000,
      status: 'read'
    },
    {
      id: 'msg_002',
      type: 'text',
      content: '👍👍👌👌🤘',
      senderId: 'user_003',
      senderName: '平凡的世界',
      senderAvatar: '/avatars/pingfan.jpg',
      timestamp: Date.now() - 1800000,
      status: 'read'
    },
    {
      id: 'msg_003',
      type: 'text',
      content: '怎么都没人说话呀',
      senderId: 'user_004',
      senderName: '凤姐干鲜',
      senderAvatar: '/avatars/fengjie2.jpg',
      timestamp: Date.now() - 900000,
      status: 'read'
    },
    {
      id: 'msg_004',
      type: 'text',
      content: '应该很多人都不懂这里可以聊天了吧,看大家都是在Q群聊的多',
      senderId: 'user_005',
      senderName: '风卷云散',
      senderAvatar: '/avatars/fengjuan.jpg',
      timestamp: Date.now() - 300000,
      status: 'read'
    }
  ]

  const mockChatInfo = {
    id: chatId,
    name: '文企通一群',
    avatar: '/avatars/group.jpg',
    type: 'group',
    isOnline: true,
    memberCount: 156,
    lastSeen: null
  }

  // 方法
  /**
   * 获取聊天信息
   */
  const fetchChatInfo = async () => {
    try {
      loading.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      chatInfo.value = { ...mockChatInfo, id: chatId }
      onlineCount.value = Math.floor(Math.random() * 20) + 5
      
    } catch (error) {
      console.error('获取聊天信息失败:', error)
      showError('获取聊天信息失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取消息列表
   */
  const fetchMessages = async () => {
    try {
      // 先从本地存储加载
      const storedMessages = getItem.value || []
      if (storedMessages.length > 0) {
        // 如果有本地存储的消息，直接使用，不显示加载状态
        messages.value = storedMessages
        console.log('从本地存储加载消息:', storedMessages.length, '条')
        return
      }
      
      // 只有在没有本地存储消息时才显示加载状态
      loading.value = true
      console.log('从IM API加载消息...')
      
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await getMessageRecords({
        session_id: chatId,
        page: 1,
        limit: 50
      })
      
      if (response.code === 200) {
        // 转换 IM API 响应格式为本地格式
        const imMessages = response.data.messages || []
        messages.value = imMessages.map(msg => ({
          id: msg.id,
          type: msg.message_type || 'text',
          content: msg.content,
          senderId: msg.sender_id,
          senderName: msg.sender_name || '未知用户',
          senderAvatar: msg.sender_avatar || '/default-avatar.png',
          timestamp: new Date(msg.created_at).getTime(),
          status: msg.status || 'sent'
        }))
        
        // 保存到本地存储
        setItem(messages.value)
        console.log('IM消息加载完成，已保存到本地存储')
      } else {
        throw new Error(response.message || '获取消息失败')
      }
      
    } catch (error) {
      console.error('获取消息失败:', error)
      showError('获取消息失败: ' + error.message)
      
      // 如果API失败，使用模拟数据作为后备
      console.log('使用模拟数据作为后备')
      messages.value = [...mockMessages]
      setItem(messages.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载更多消息
   */
  const loadMoreMessages = async () => {
    if (loadingMore.value) return
    
    try {
      loadingMore.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟更多历史消息
      const moreMessages = [
        {
          id: `msg_old_${Date.now()}`,
          type: 'text',
          content: '这是一条历史消息',
          senderId: 'user_006',
          senderName: '历史用户',
          senderAvatar: '/default-avatar.png',
          timestamp: Date.now() - 7200000,
          status: 'read'
        }
      ]
      
      messages.value = [...moreMessages, ...messages.value]
      
    } catch (error) {
      console.error('加载更多消息失败:', error)
    } finally {
      loadingMore.value = false
    }
  }

  /**
   * 发送消息
   */
  const sendMessage = async (messageData) => {
    if (!messageData.content && messageData.type === 'text') {
      throw new Error('消息内容不能为空')
    }
    
    let tempMessage = null
    
    try {
      sending.value = true
      
      // 创建临时消息
      tempMessage = {
        id: `temp_${Date.now()}`,
        type: messageData.type,
        content: messageData.content,
        senderId: currentUserId.value,
        senderName: '我',
        senderAvatar: '/avatars/me.jpg',
        timestamp: Date.now(),
        status: 'sending'
      }
      
      // 添加到消息列表
      messages.value.push(tempMessage)
      
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await sendIMMessage({
        to_user_id: messageData.toUserId || chatId,
        message_type: messageData.type || 'text',
        content: messageData.content,
        session_id: chatId
      })
      
      if (response.code === 200) {
        // 更新消息状态
        const messageIndex = messages.value.findIndex(msg => msg.id === tempMessage.id)
        if (messageIndex !== -1) {
          messages.value[messageIndex] = {
            ...tempMessage,
            id: response.data.message_id || `msg_${Date.now()}`,
            status: 'sent'
          }
        }
        
        // 保存到本地存储
        setItem(messages.value)
        
        showSuccess('消息发送成功')
      } else {
        throw new Error(response.message || '发送消息失败')
      }
      
    } catch (error) {
      console.error('发送消息失败:', error)
      showError('发送消息失败: ' + error.message)
      
      // 更新消息状态为失败
      if (tempMessage) {
        const messageIndex = messages.value.findIndex(msg => msg.id === tempMessage.id)
        if (messageIndex !== -1) {
          messages.value[messageIndex].status = 'failed'
        }
      }
      
      throw error
    } finally {
      sending.value = false
    }
  }

  /**
   * 开始录音
   */
  const startRecording = () => {
    isRecording.value = true
    console.log('开始录音')
    // TODO: 实现录音功能
  }

  /**
   * 停止录音
   */
  const stopRecording = () => {
    isRecording.value = false
    console.log('停止录音')
    // TODO: 实现录音停止和发送
  }

  /**
   * 标记消息为已读
   */
  const markAsRead = () => {
    messages.value.forEach(msg => {
      if (msg.senderId !== currentUserId.value) {
        msg.isRead = true
      }
    })
    
    // 保存到本地存储
    setItem(messages.value)
  }

  /**
   * 刷新消息
   */
  const refreshMessages = async () => {
    try {
      await fetchMessages()
      showSuccess('消息已刷新')
    } catch (error) {
      showError('刷新消息失败')
    }
  }

  /**
   * 设置输入状态
   */
  const setTyping = (typing) => {
    isTyping.value = typing
    
    if (typing) {
      // 发送正在输入状态
      // TODO: 实现WebSocket发送输入状态
    }
  }

  /**
   * 清空聊天记录
   */
  const clearHistory = () => {
    messages.value = []
    setItem([])
    showSuccess('聊天记录已清空')
  }

  /**
   * 删除消息
   */
  const deleteMessage = (messageId) => {
    const index = messages.value.findIndex(msg => msg.id === messageId)
    if (index !== -1) {
      messages.value.splice(index, 1)
      setItem(messages.value)
      showSuccess('消息已删除')
    }
  }

  /**
   * 转发消息
   */
  const forwardMessage = (messageId, targetChatId) => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      // TODO: 实现消息转发
      console.log('转发消息:', message, '到:', targetChatId)
      showSuccess('消息已转发')
    }
  }

  /**
   * 复制消息
   */
  const copyMessage = (messageId) => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message && message.type === 'text') {
      navigator.clipboard.writeText(message.content)
      showSuccess('消息已复制')
    }
  }

  // 自动刷新
  const startAutoRefresh = () => {
    if (autoRefresh && !refreshTimer) {
      refreshTimer = setInterval(async () => {
        try {
          // 模拟获取新消息
          const newMessages = await getNewMessages()
          if (newMessages.length > 0) {
            messages.value = [...messages.value, ...newMessages]
            setItem(messages.value)
          }
        } catch (error) {
          console.error('自动刷新失败:', error)
        }
      }, refreshInterval)
    }
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  // 模拟获取新消息
  const getNewMessages = async () => {
    // 模拟随机收到新消息
    if (Math.random() > 0.8) {
      return [{
        id: `msg_${Date.now()}`,
        type: 'text',
        content: '这是一条新消息',
        senderId: 'user_007',
        senderName: '新用户',
        senderAvatar: '/default-avatar.png',
        timestamp: Date.now(),
        status: 'read'
      }]
    }
    return []
  }

  // 监听输入变化
  watch(inputMessage, (newValue) => {
    if (enableTyping) {
      setTyping(newValue.length > 0)
    }
  })

  // 生命周期
  onMounted(async () => {
    try {
      await Promise.all([
        fetchChatInfo(),
        fetchMessages()
      ])
      startAutoRefresh()
    } catch (error) {
      console.error('初始化聊天失败:', error)
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
    if (typingTimer) {
      clearTimeout(typingTimer)
    }
  })

  return {
    // 状态
    messages,
    chatInfo,
    currentUserId,
    onlineCount,
    loading,
    loadingMore,
    sending,
    inputMessage,
    isRecording,
    isTyping,
    typingUsers,
    hasMessages,
    unreadCount,

    // 方法
    fetchChatInfo,
    fetchMessages,
    loadMoreMessages,
    sendMessage,
    startRecording,
    stopRecording,
    markAsRead,
    refreshMessages,
    setTyping,
    clearHistory,
    deleteMessage,
    forwardMessage,
    copyMessage
  }
}

export default useChat
