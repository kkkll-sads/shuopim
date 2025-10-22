/**
 * IM即时通讯组合式函数
 * 提供IM相关的业务逻辑和状态管理
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthState } from './useAuthState'
import { usePageData } from './usePageData'
import { useNavigation } from './useNavigation'
import { useToast } from './useToast'
import { useStorage } from './useStorage'
import { useUserStore } from '@/store/user'
import { 
  getIMSessions, 
  getIMContacts, 
  getIMUserDetail, 
  searchContact, 
  getContactDetail,
  createFriendApply,
  getFriendApplyList,
  acceptFriendApply,
  declineFriendApply,
  getUnreadApplyNum
} from '@/api/im'

/**
 * 使用聊天列表
 * @param {Object} options - 配置选项
 * @returns {Object} 聊天列表相关的状态和方法
 */
export function useChatList(options = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30秒
    enableUnreadCount = true,
    enableMuteStatus = true,
    onChatSelect = null,
    onChatUpdate = null
  } = options

  // 聊天列表数据
  const chatList = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastUpdate = ref(null)

  // 搜索和过滤
  const searchQuery = ref('')
  const filterType = ref('all') // all, unread, muted
  const sortBy = ref('time') // time, name, unread

  // 未读统计
  const totalUnread = computed(() => {
    return chatList.value.reduce((total, chat) => total + (chat.unread || 0), 0)
  })

  const unreadChats = computed(() => {
    return chatList.value.filter(chat => chat.unread > 0)
  })

  const mutedChats = computed(() => {
    return chatList.value.filter(chat => chat.muted)
  })

  // 过滤后的聊天列表
  const filteredChatList = computed(() => {
    let filtered = [...chatList.value]

    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
      )
    }

    // 类型过滤
    if (filterType.value === 'unread') {
      filtered = filtered.filter(chat => chat.unread > 0)
    } else if (filterType.value === 'muted') {
      filtered = filtered.filter(chat => chat.muted)
    }

    // 排序
    if (sortBy.value === 'time') {
      filtered.sort((a, b) => new Date(b.time) - new Date(a.time))
    } else if (sortBy.value === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy.value === 'unread') {
      filtered.sort((a, b) => (b.unread || 0) - (a.unread || 0))
    }

    return filtered
  })

  /**
   * 获取聊天列表
   * @returns {Promise} 获取结果
   */
  const fetchChatList = async () => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      console.log('useIM: IM Token 调试信息')
      console.log('useIM: userStore.imToken:', imToken)
      console.log('useIM: localStorage imToken:', localStorage.getItem('imToken'))
      console.log('useIM: localStorage imUserId:', localStorage.getItem('imUserId'))
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await getIMSessions()
      
      // IM API 直接返回数据，无需检查 code
      const imSessions = response.items || []
      chatList.value = imSessions.map(session => ({
        id: session.id,
        name: session.name || session.title,
        avatar: session.avatar || '',
        lastMessage: session.last_message || '',
        time: session.updated_at || session.created_at,
        badge: session.badge || '',
        unread: session.unread_count || 0,
        muted: session.muted || false,
        type: session.type || 'private'
      }))
      
      lastUpdate.value = new Date()

      if (onChatUpdate) {
        onChatUpdate(chatList.value)
      }

      return { success: true, data: chatList.value }
    } catch (err) {
      console.error('获取聊天列表失败:', err)
      error.value = err.message || '获取聊天列表失败'
      
      // 如果API失败，使用模拟数据作为后备
      console.log('使用模拟数据作为后备')
      const mockChats = [
        {
          id: 1,
          name: '文企通一群',
          avatar: '',
          lastMessage: '[通知消息]',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          badge: '',
          unread: 0,
          muted: false,
          type: 'group'
        },
        {
          id: 2,
          name: '689556630',
          avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0do4MHEpvfKutyMVeytROXyrB2YC2A.png',
          lastMessage: '你好',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          badge: '商家',
          unread: 3,
          muted: false,
          type: 'private'
        }
      ]
      
      chatList.value = mockChats
      lastUpdate.value = new Date()
      
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新聊天列表
   * @returns {Promise} 刷新结果
   */
  const refreshChatList = async () => {
    return await fetchChatList()
  }

  /**
   * 选择聊天
   * @param {Object} chat - 聊天对象
   */
  const selectChat = (chat) => {
    if (onChatSelect) {
      onChatSelect(chat)
    }
  }

  /**
   * 标记为已读
   * @param {number} chatId - 聊天ID
   */
  const markAsRead = (chatId) => {
    const chat = chatList.value.find(c => c.id === chatId)
    if (chat) {
      chat.unread = 0
      if (onChatUpdate) {
        onChatUpdate(chatList.value)
      }
    }
  }

  /**
   * 切换免打扰状态
   * @param {number} chatId - 聊天ID
   */
  const toggleMute = (chatId) => {
    const chat = chatList.value.find(c => c.id === chatId)
    if (chat) {
      chat.muted = !chat.muted
      if (onChatUpdate) {
        onChatUpdate(chatList.value)
      }
    }
  }

  /**
   * 删除聊天
   * @param {number} chatId - 聊天ID
   */
  const deleteChat = (chatId) => {
    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index > -1) {
      chatList.value.splice(index, 1)
      if (onChatUpdate) {
        onChatUpdate(chatList.value)
      }
    }
  }

  /**
   * 搜索聊天
   * @param {string} query - 搜索关键词
   */
  const searchChats = (query) => {
    searchQuery.value = query
  }

  /**
   * 设置过滤器
   * @param {string} type - 过滤类型
   */
  const setFilter = (type) => {
    filterType.value = type
  }

  /**
   * 设置排序
   * @param {string} sort - 排序方式
   */
  const setSort = (sort) => {
    sortBy.value = sort
  }

  // 自动刷新
  let refreshTimer = null

  const startAutoRefresh = () => {
    if (autoRefresh && !refreshTimer) {
      refreshTimer = setInterval(fetchChatList, refreshInterval)
    }
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  // 生命周期
  onMounted(() => {
    fetchChatList()
    if (autoRefresh) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    // 状态
    chatList,
    loading,
    error,
    lastUpdate,
    searchQuery,
    filterType,
    sortBy,
    
    // 计算属性
    totalUnread,
    unreadChats,
    mutedChats,
    filteredChatList,
    
    // 方法
    fetchChatList,
    refreshChatList,
    selectChat,
    markAsRead,
    toggleMute,
    deleteChat,
    searchChats,
    setFilter,
    setSort,
    startAutoRefresh,
    stopAutoRefresh
  }
}

/**
 * 使用好友管理
 * @param {Object} options - 配置选项
 * @returns {Object} 好友管理相关的状态和方法
 */
export function useFriendManagement(options = {}) {
  const {
    enableSearch = true,
    enablePinyin = true,
    enableGrouping = true,
    onFriendAdd = null,
    onFriendRemove = null
  } = options

  // 好友列表数据
  const friendList = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 搜索和过滤
  const searchQuery = ref('')
  const selectedGroup = ref('all')

  // 分组数据
  const groupedFriends = computed(() => {
    if (!enableGrouping) return { all: friendList.value }

    const groups = {}
    friendList.value.forEach(friend => {
      const firstLetter = friend.pinyin ? friend.pinyin.charAt(0).toUpperCase() : friend.name.charAt(0).toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(friend)
    })

    // 按字母排序
    const sortedGroups = {}
    Object.keys(groups).sort().forEach(key => {
      sortedGroups[key] = groups[key].sort((a, b) => a.pinyin.localeCompare(b.pinyin))
    })

    return sortedGroups
  })

  // 过滤后的好友列表
  const filteredFriends = computed(() => {
    let filtered = friendList.value

    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(query) ||
        friend.nickname.toLowerCase().includes(query) ||
        (friend.pinyin && friend.pinyin.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  /**
   * 获取好友列表
   * @returns {Promise} 获取结果
   */
  const fetchFriendList = async () => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await getIMContacts()
      
      // IM API 直接返回数据，无需检查 code
      const imContacts = response.items || []
      friendList.value = imContacts.map(contact => ({
        id: contact.user_id,
        name: contact.nickname,
        nickname: contact.nickname,
        avatar: contact.avatar || '',
        gender: contact.gender,
        motto: contact.motto,
        remark: contact.remark,
        groupId: contact.group_id,
        pinyin: contact.nickname,
        isOnline: false
      }))
      
      return { success: true, data: friendList.value }
    } catch (err) {
      console.error('获取好友列表失败:', err)
      error.value = err.message || '获取好友列表失败'
      
      // 如果API失败，使用模拟数据作为后备
      console.log('使用模拟数据作为后备')
      const mockFriends = [
        {
          id: 1,
          name: '张三',
          nickname: 'zhangsan',
          avatar: '',
          pinyin: 'zhangsan',
          phone: '13800138001',
          isOnline: true
        },
        {
          id: 2,
          name: '李四',
          nickname: 'lisi',
          avatar: '',
          pinyin: 'lisi',
          phone: '13800138002',
          isOnline: false
        }
      ]

      friendList.value = mockFriends
      return { success: true, data: mockFriends }
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索用户
   * @param {string} query - 搜索关键词
   * @returns {Promise} 搜索结果
   */
  const searchUsers = async (query) => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟搜索结果
      const mockResults = [
        {
          id: Date.now(),
          name: `用户${query}`,
          nickname: `user_${query}`,
          avatar: '',
          isAdded: false
        }
      ]

      return { success: true, data: mockResults }
    } catch (err) {
      error.value = err.message || '搜索用户失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 添加好友
   * @param {Object} user - 用户信息
   * @returns {Promise} 添加结果
   */
  const addFriend = async (user) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newFriend = {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        avatar: user.avatar,
        pinyin: user.name,
        phone: user.phone || '',
        isOnline: false
      }

      friendList.value.push(newFriend)
      
      if (onFriendAdd) {
        onFriendAdd(newFriend)
      }

      return { success: true, data: newFriend }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * 删除好友
   * @param {number} friendId - 好友ID
   * @returns {Promise} 删除结果
   */
  const removeFriend = async (friendId) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = friendList.value.findIndex(f => f.id === friendId)
      if (index > -1) {
        const friend = friendList.value[index]
        friendList.value.splice(index, 1)
        
        if (onFriendRemove) {
          onFriendRemove(friend)
        }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * 搜索好友
   * @param {string} query - 搜索关键词
   */
  const searchFriends = (query) => {
    searchQuery.value = query
  }

  /**
   * 搜索联系人（通过手机号）
   * @param {string} mobile - 手机号
   * @returns {Promise} 搜索结果
   */
  const searchContactByMobile = async (mobile) => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await searchContact(mobile)
      
      // 转换 API 响应格式为本地格式
      const contactData = {
        id: response.user_id,
        name: response.nickname,
        nickname: response.nickname,
        avatar: response.avatar || '',
        gender: response.gender,
        motto: response.motto,
        mobile: response.mobile,
        pinyin: response.nickname,
        isOnline: false
      }
      
      return { success: true, data: contactData }
    } catch (err) {
      console.error('搜索联系人失败:', err)
      error.value = err.message || '搜索联系人失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取联系人详情
   * @param {number} userId - 用户ID
   * @returns {Promise} 联系人详情
   */
  const getContactInfo = async (userId) => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await getContactDetail(userId)
      
      // 转换 API 响应格式为本地格式
      const contactData = {
        id: response.user_id,
        name: response.nickname,
        nickname: response.nickname,
        avatar: response.avatar || '',
        gender: response.gender,
        motto: response.motto,
        mobile: response.mobile,
        email: response.email,
        relation: response.relation,
        remark: response.contact_remark,
        groupId: response.contact_group_id,
        onlineStatus: response.online_status,
        pinyin: response.nickname,
        isOnline: response.online_status === 'Y'
      }
      
      return { success: true, data: contactData }
    } catch (err) {
      console.error('获取联系人详情失败:', err)
      error.value = err.message || '获取联系人详情失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 发起好友申请
   * @param {Object} data - 申请数据
   * @param {number} data.user_id - 对方用户ID
   * @param {string} data.remark - 申请备注
   * @returns {Promise} 申请结果
   */
  const sendFriendApply = async (data) => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await createFriendApply(data)
      
      return { success: true, data: response }
    } catch (err) {
      console.error('发起好友申请失败:', err)
      error.value = err.message || '发起好友申请失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取好友申请列表
   * @returns {Promise} 申请列表
   */
  const fetchFriendApplyList = async () => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await getFriendApplyList()
      
      // 转换 API 响应格式为本地格式
      const applyList = (response.items || []).map(apply => ({
        id: apply.id,
        userId: apply.user_id,
        friendId: apply.friend_id,
        remark: apply.remark,
        nickname: apply.nickname,
        avatar: apply.avatar || '',
        createdAt: apply.created_at,
        pinyin: apply.nickname
      }))
      
      return { success: true, data: applyList }
    } catch (err) {
      console.error('获取好友申请列表失败:', err)
      error.value = err.message || '获取好友申请列表失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 接受好友申请
   * @param {Object} data - 接受数据
   * @param {number} data.apply_id - 申请ID
   * @param {string} data.remark - 备注名
   * @returns {Promise} 接受结果
   */
  const acceptApply = async (data) => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await acceptFriendApply(data)
      
      return { success: true, data: response }
    } catch (err) {
      console.error('接受好友申请失败:', err)
      error.value = err.message || '接受好友申请失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 拒绝好友申请
   * @param {Object} data - 拒绝数据
   * @param {number} data.apply_id - 申请ID
   * @param {string} data.remark - 备注
   * @returns {Promise} 拒绝结果
   */
  const declineApply = async (data) => {
    loading.value = true
    error.value = null

    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await declineFriendApply(data)
      
      return { success: true, data: response }
    } catch (err) {
      console.error('拒绝好友申请失败:', err)
      error.value = err.message || '拒绝好友申请失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取未读申请数量
   * @returns {Promise} 未读数量
   */
  const fetchUnreadApplyNum = async () => {
    try {
      // 获取用户存储
      const userStore = useUserStore()
      const imToken = userStore.imToken
      
      if (!imToken) {
        throw new Error('IM Token 不存在，请重新登录')
      }
      
      // 调用真实的 IM API
      const response = await getUnreadApplyNum()
      
      return { success: true, data: response.num || 0 }
    } catch (err) {
      console.error('获取未读申请数量失败:', err)
      return { success: false, error: err.message || '获取未读申请数量失败' }
    }
  }

  return {
    // 状态
    friendList,
    loading,
    error,
    searchQuery,
    selectedGroup,
    
    // 计算属性
    groupedFriends,
    filteredFriends,
    
    // 方法
    fetchFriendList,
    searchUsers,
    addFriend,
    removeFriend,
    searchFriends,
    searchContactByMobile,
    getContactInfo,
    sendFriendApply,
    fetchFriendApplyList,
    acceptApply,
    declineApply,
    fetchUnreadApplyNum
  }
}

/**
 * 使用群组管理
 * @param {Object} options - 配置选项
 * @returns {Object} 群组管理相关的状态和方法
 */
export function useGroupManagement(options = {}) {
  const {
    mode = 'search', // search, my
    enableSearch = true,
    enableJoin = true,
    onGroupJoin = null,
    onGroupLeave = null
  } = options

  // 群组列表数据
  const groupList = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 搜索
  const searchQuery = ref('')

  // 过滤后的群组列表
  const filteredGroups = computed(() => {
    if (!searchQuery.value) return groupList.value

    const query = searchQuery.value.toLowerCase()
    return groupList.value.filter(group => 
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query) ||
      group.groupId.toString().includes(query)
    )
  })

  /**
   * 获取群组列表
   * @returns {Promise} 获取结果
   */
  const fetchGroupList = async () => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟数据
      const mockGroups = [
        {
          id: 1,
          name: '技术交流群',
          description: '分享技术心得，共同进步',
          avatar: '',
          groupId: 123456,
          memberCount: 150,
          maxMembers: 200,
          isJoined: false,
          isFull: false
        },
        {
          id: 2,
          name: '产品讨论群',
          description: '产品经理交流群',
          avatar: '',
          groupId: 789012,
          memberCount: 200,
          maxMembers: 200,
          isJoined: false,
          isFull: true
        }
      ]

      groupList.value = mockGroups
      return { success: true, data: mockGroups }
    } catch (err) {
      error.value = err.message || '获取群组列表失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 加入群组
   * @param {number} groupId - 群组ID
   * @returns {Promise} 加入结果
   */
  const joinGroup = async (groupId) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const group = groupList.value.find(g => g.id === groupId)
      if (group) {
        group.isJoined = true
        group.memberCount += 1
        
        if (onGroupJoin) {
          onGroupJoin(group)
        }
      }

      return { success: true, data: group }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * 退出群组
   * @param {number} groupId - 群组ID
   * @returns {Promise} 退出结果
   */
  const leaveGroup = async (groupId) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const group = groupList.value.find(g => g.id === groupId)
      if (group) {
        group.isJoined = false
        group.memberCount -= 1
        
        if (onGroupLeave) {
          onGroupLeave(group)
        }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * 搜索群组
   * @param {string} query - 搜索关键词
   */
  const searchGroups = (query) => {
    searchQuery.value = query
  }

  return {
    // 状态
    groupList,
    loading,
    error,
    searchQuery,
    
    // 计算属性
    filteredGroups,
    
    // 方法
    fetchGroupList,
    joinGroup,
    leaveGroup,
    searchGroups
  }
}

/**
 * 使用IM导航
 * @param {Object} options - 配置选项
 * @returns {Object} IM导航相关的状态和方法
 */
export function useIMNavigation(options = {}) {
  const {
    enableHistory = true,
    enableBreadcrumb = true,
    onRouteChange = null
  } = options

  const {
    navigateTo,
    goBack,
    getQueryParam,
    getRouteParam,
    isCurrentRoute
  } = useNavigation({
    enableHistory,
    enableBreadcrumb
  })

  /**
   * 导航到聊天页面
   * @param {Object} chat - 聊天对象
   */
  const goToChat = (chat) => {
    navigateTo(`/im/chat/${chat.id}`, {
      query: {
        name: chat.name,
        type: chat.type || 'private'
      }
    })
  }

  /**
   * 导航到好友页面
   * @param {Object} friend - 好友对象
   */
  const goToFriend = (friend) => {
    navigateTo(`/im/friend/${friend.id}`, {
      query: {
        name: friend.name
      }
    })
  }

  /**
   * 导航到群组页面
   * @param {Object} group - 群组对象
   */
  const goToGroup = (group) => {
    navigateTo(`/im/group/${group.id}`, {
      query: {
        name: group.name
      }
    })
  }

  /**
   * 导航到添加好友页面
   */
  const goToAddFriend = () => {
    navigateTo('/im/add-friend')
  }

  /**
   * 导航到通讯录页面
   */
  const goToContacts = () => {
    navigateTo('/im/contacts')
  }

  /**
   * 导航到群组搜索页面
   */
  const goToGroupSearch = () => {
    navigateTo('/im/groups/search')
  }

  /**
   * 导航到我的群组页面
   */
  const goToMyGroups = () => {
    navigateTo('/im/groups/my')
  }

  /**
   * 导航到创建群组页面
   */
  const goToCreateGroup = () => {
    navigateTo('/im/create-group')
  }

  /**
   * 导航到验证消息页面
   */
  const goToVerification = () => {
    navigateTo('/im/verification')
  }

  /**
   * 导航到黑名单页面
   */
  const goToBlacklist = () => {
    navigateTo('/im/blacklist')
  }

  return {
    // 基础导航
    navigateTo,
    goBack,
    getQueryParam,
    getRouteParam,
    isCurrentRoute,
    
    // IM专用导航
    goToChat,
    goToFriend,
    goToGroup,
    goToAddFriend,
    goToContacts,
    goToGroupSearch,
    goToMyGroups,
    goToCreateGroup,
    goToVerification,
    goToBlacklist
  }
}

/**
 * 使用IM状态管理
 * @param {Object} options - 配置选项
 * @returns {Object} IM状态管理相关的状态和方法
 */
export function useIMState(options = {}) {
  const {
    enableAuth = true,
    enableNotifications = true,
    enableOfflineMode = true
  } = options

  // 认证状态
  const {
    isAuthenticated,
    user,
    hasPermission
  } = useAuthState({
    autoCheck: enableAuth
  })

  // 通知状态
  const notifications = ref([])
  const unreadCount = ref(0)
  const isNotificationEnabled = ref(true)

  // 在线状态
  const isOnline = ref(navigator.onLine)
  const lastOnlineTime = ref(null)

  /**
   * 添加通知
   * @param {Object} notification - 通知对象
   */
  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    })
    
    if (!notification.read) {
      unreadCount.value += 1
    }
  }

  /**
   * 标记通知为已读
   * @param {number} notificationId - 通知ID
   */
  const markNotificationAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  /**
   * 清除所有通知
   */
  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  /**
   * 切换通知状态
   */
  const toggleNotifications = () => {
    isNotificationEnabled.value = !isNotificationEnabled.value
  }

  /**
   * 更新在线状态
   */
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    if (isOnline.value) {
      lastOnlineTime.value = new Date()
    }
  }

  // 监听网络状态
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return {
    // 认证状态
    isAuthenticated,
    user,
    hasPermission,
    
    // 通知状态
    notifications,
    unreadCount,
    isNotificationEnabled,
    
    // 在线状态
    isOnline,
    lastOnlineTime,
    
    // 方法
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    toggleNotifications,
    updateOnlineStatus
  }
}

export default {
  useChatList,
  useFriendManagement,
  useGroupManagement,
  useIMNavigation,
  useIMState
}
