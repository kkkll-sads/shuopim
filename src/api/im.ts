import imRequest from '@/utils/im-request'

// IM 用户详情
export const getIMUserDetail = () => {
  return imRequest({
    url: '/api/v1/user/detail',
    method: 'post',
    data: {}
  })
}

// IM 联系人列表
export const getIMContacts = () => {
  return imRequest({
    url: '/api/v1/contact/list',
    method: 'post',
    data: {}
  })
}

// IM 会话列表
export const getIMSessions = () => {
  return imRequest({
    url: '/api/v1/talk/session-list',
    method: 'post',
    data: {}
  })
}

// 发送消息
export const sendMessage = (data: any) => {
  return imRequest({
    url: '/api/v1/message/send',
    method: 'post',
    data
  })
}

// 获取消息记录
export const getMessageRecords = (params: any) => {
  return imRequest({
    url: '/api/v1/message/records',
    method: 'post',
    data: params
  })
}

// 搜索联系人
export const searchContact = (mobile: string) => {
  return imRequest({
    url: '/api/v1/contact/search',
    method: 'post',
    data: { mobile }
  })
}

// 获取联系人详情
export const getContactDetail = (userId: number) => {
  return imRequest({
    url: '/api/v1/contact/detail',
    method: 'post',
    data: { user_id: userId }
  })
}

// 发起好友申请
export const createFriendApply = (data: { user_id?: number; remark?: string }) => {
  return imRequest({
    url: '/api/v1/contact-apply/create',
    method: 'post',
    data
  })
}

// 获取好友申请列表
export const getFriendApplyList = () => {
  return imRequest({
    url: '/api/v1/contact-apply/list',
    method: 'post',
    data: {}
  })
}

// 接受好友申请
export const acceptFriendApply = (data: { apply_id?: number; remark?: string }) => {
  return imRequest({
    url: '/api/v1/contact-apply/accept',
    method: 'post',
    data
  })
}

// 拒绝好友申请
export const declineFriendApply = (data: { apply_id?: number; remark?: string }) => {
  return imRequest({
    url: '/api/v1/contact-apply/decline',
    method: 'post',
    data
  })
}

// 获取未读申请数量
export const getUnreadApplyNum = () => {
  return imRequest({
    url: '/api/v1/contact-apply/unread-num',
    method: 'post',
    data: {}
  })
}