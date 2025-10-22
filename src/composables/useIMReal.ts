import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import { wsManager } from '@/utils/websocket'
import * as imAPI from '@/api/im'

export interface Contact {
  id: number
  nickname: string
  avatar: string
  mobile: string
  remark: string
  online: boolean
}

export interface Session {
  id: number
  type: number
  name: string
  avatar: string
  unread_num: number
  last_message: string
  last_time: string
}

export function useIMReal() {
  const userStore = useUserStore()
  
  // 状态
  const userDetail = ref<any>(null)
  const contacts = ref<Contact[]>([])
  const sessions = ref<Session[]>([])
  const currentSession = ref<Session | null>(null)
  const messages = ref<any[]>([])
  const loading = ref<boolean>(false)

  // WebSocket 状态
  const isConnected = computed(() => wsManager.isConnected.value)
  const wsMessages = computed(() => wsManager.messages)

  // 获取 IM 用户详情
  const fetchUserDetail = async () => {
    if (!userStore.imToken) return { success: false, message: 'IM Token 不存在' }
    
    try {
      loading.value = true
      const response = await imAPI.getIMUserDetail(userStore.imToken)
      userDetail.value = response
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // 获取联系人列表
  const fetchContacts = async () => {
    if (!userStore.imToken) return { success: false, message: 'IM Token 不存在' }
    
    try {
      loading.value = true
      const response = await imAPI.getIMContacts(userStore.imToken)
      contacts.value = response.data?.items || []
      return { success: true, data: contacts.value }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // 获取会话列表
  const fetchSessions = async () => {
    if (!userStore.imToken) return { success: false, message: 'IM Token 不存在' }
    
    try {
      loading.value = true
      const response = await imAPI.getIMSessions(userStore.imToken)
      sessions.value = response.data?.items || []
      return { success: true, data: sessions.value }
    } catch (error: any) {
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // 连接 WebSocket
  const connectWebSocket = () => {
    if (userStore.imToken) {
      wsManager.connect(userStore.imToken)
    }
  }

  // 断开 WebSocket
  const disconnectWebSocket = () => {
    wsManager.disconnect()
  }

  // 发送消息
  const sendMessage = (message: any) => {
    if (userStore.imToken) {
      return imAPI.sendMessage(userStore.imToken, message)
    }
    return Promise.reject(new Error('IM Token 不存在'))
  }

  // 设置当前会话
  const setCurrentSession = (session: Session | null) => {
    currentSession.value = session
  }

  // 添加消息
  const addMessage = (message: any) => {
    messages.value.push(message)
  }

  // 清除消息
  const clearMessages = () => {
    messages.value = []
  }

  // 初始化 IM 功能
  const initIM = async () => {
    if (!userStore.isIMSynced) {
      console.warn('用户未同步到 IM 系统')
      return
    }

    try {
      // 获取用户详情
      await fetchUserDetail()
      // 获取联系人
      await fetchContacts()
      // 获取会话列表
      await fetchSessions()
      // 连接 WebSocket
      connectWebSocket()
    } catch (error) {
      console.error('初始化 IM 失败:', error)
    }
  }

  // 监听 WebSocket 消息
  watch(
    () => wsMessages.value,
    (messages) => {
      messages.forEach(message => {
        // 处理不同类型的消息
        switch (message.type) {
          case 'message':
            addMessage(message.data)
            break
          case 'notification':
            // 处理通知
            break
          default:
            console.log('未知消息类型:', message.type)
        }
      })
    },
    { deep: true }
  )

  return {
    // 状态
    userDetail,
    contacts,
    sessions,
    currentSession,
    messages,
    loading,
    isConnected,
    
    // 方法
    initIM,
    fetchUserDetail,
    fetchContacts,
    fetchSessions,
    connectWebSocket,
    disconnectWebSocket,
    sendMessage,
    setCurrentSession,
    addMessage,
    clearMessages
  }
}
