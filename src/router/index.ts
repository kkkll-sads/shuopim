import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/Register.vue'),
      meta: { title: '注册', requiresAuth: false }
    },
    {
      path: '/forgot',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPassword.vue'),
      meta: { title: '忘记密码', requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/Home.vue'),
      meta: {
        title: '首页',
        requiresAuth: true
      }
    },
    {
      path: '/im',
      name: 'IM',
      component: () => import('@/views/im/IM.vue'),
      meta: {
        title: '聊天',
        requiresAuth: true
      }
    },
    {
      path: '/im/contacts',
      name: 'Contacts',
      component: () => import('@/views/im/contacts.vue'),
      meta: {
        title: '通讯录',
        requiresAuth: true
      }
    },
    {
      path: '/im/add-friend',
      name: 'AddFriend',
      component: () => import('@/views/im/add-friend.vue'),
      meta: {
        title: '添加好友',
        requiresAuth: true
      }
    },
    {
      path: '/im/groups/:mode',
      name: 'Groups',
      component: () => import('@/views/im/groups.vue'),
      meta: {
        title: '群组',
        requiresAuth: true
      }
    },
    {
      path: '/im/chat/:id',
      name: 'Chat',
      component: () => import('@/views/im/chat.vue'),
      meta: {
        title: '聊天',
        requiresAuth: true
      }
    },
    {
      path: '/im/friend/:id',
      name: 'FriendDetail',
      component: () => import('@/views/im/friend-detail.vue'),
      meta: {
        title: '联系人详情',
        requiresAuth: true
      }
    },
    {
      path: '/im/verification',
      name: 'Verification',
      component: () => import('@/views/im/verification.vue'),
      meta: {
        title: '验证消息',
        requiresAuth: true
      }
    },
    {
      path: '/im/blacklist',
      name: 'Blacklist',
      component: () => import('@/views/im/blacklist.vue'),
      meta: {
        title: '黑名单',
        requiresAuth: true
      }
    },
    {
      path: '/im/select-members',
      name: 'SelectMembers',
      component: () => import('@/views/im/select-members.vue'),
      meta: {
        title: '选择群成员',
        requiresAuth: true
      }
    },
    {
      path: '/im/create-group',
      name: 'CreateGroup',
      component: () => import('@/views/im/CreateGroupPage.vue'),
      meta: {
        title: '创建群聊',
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/Profile.vue'),
      meta: {
        title: '我的',
        requiresAuth: true
      }
    },
    {
      path: '/category',
      name: 'Category',
      component: () => import('@/views/category/Category.vue'),
      meta: {
        title: '分类',
        requiresAuth: true
      }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('@/views/profile/Orders.vue'),
      meta: {
        title: '我的订单',
        requiresAuth: true
      }
    },
    {
      path: '/my-assets',
      name: 'MyAssets',
      component: () => import('@/views/profile/MyAssets.vue'),
      meta: {
        title: '我的数资',
        requiresAuth: true
      }
    },
    {
      path: '/address-list',
      name: 'AddressList',
      component: () => import('@/views/profile/address-list.vue'),
      meta: {
        title: '收货地址',
        requiresAuth: true
      }
    },
    {
      path: '/add-address',
      name: 'AddAddress',
      component: () => import('@/views/profile/add-address.vue'),
      meta: {
        title: '添加收货地址',
        requiresAuth: true
      }
    },
    {
      path: '/bank-cards',
      name: 'BankCards',
      component: () => import('@/views/profile/bank-cards.vue'),
      meta: {
        title: '银行卡',
        requiresAuth: true
      }
    },
    {
      path: '/add-bank-card',
      name: 'AddBankCard',
      component: () => import('@/views/profile/add-bank-card.vue'),
      meta: {
        title: '添加银行卡',
        requiresAuth: true
      }
    },
    {
      path: '/coupons',
      name: 'Coupons',
      component: () => import('@/views/profile/coupons.vue'),
      meta: {
        title: '我的优惠券',
        requiresAuth: true
      }
    },
    {
      path: '/offline-orders',
      name: 'OfflineOrders',
      component: () => import('@/views/profile/offline-orders.vue'),
      meta: {
        title: '线下订单',
        requiresAuth: true
      }
    },
    {
      path: '/my-recommendations',
      name: 'MyRecommendations',
      component: () => import('@/views/profile/my-recommendations.vue'),
      meta: {
        title: '我的推荐',
        requiresAuth: true
      }
    },
    {
      path: '/balance/:type',
      name: 'BalanceDetail',
      component: () => import('@/views/profile/balance-detail.vue'),
      meta: {
        title: '余额详情',
        requiresAuth: true
      }
    },
    {
      path: '/transactions/:type',
      name: 'Transactions',
      component: () => import('@/views/profile/transactions.vue'),
      meta: {
        title: '交易明细',
        requiresAuth: true
      }
    },
    {
      path: '/income-details',
      name: 'IncomeDetails',
      component: () => import('@/views/profile/income-details.vue'),
      meta: {
        title: '收入详情',
        requiresAuth: true
      }
    },
    {
      path: '/profit-sharing',
      name: 'ProfitSharing',
      component: () => import('@/views/profile/profit-sharing.vue'),
      meta: {
        title: '盈收分润',
        requiresAuth: true
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  // 添加调试信息
  console.log('路由守卫 - 目标路径:', to.path)
  console.log('路由守卫 - 需要认证:', to.meta.requiresAuth)
  console.log('路由守卫 - Token存在:', !!token)
  console.log('路由守卫 - Token值:', token ? token.substring(0, 20) + '...' : 'null')
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 树拍易购`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !token) {
    // 需要认证但没有token，跳转到登录页
    console.log('路由守卫 - 重定向到登录页，原因：需要认证但没有token')
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登录用户访问登录页，跳转到首页
    console.log('路由守卫 - 重定向到首页，原因：已登录用户访问登录页')
    next('/home')
  } else {
    // 其他情况正常访问（包括注册页面）
    console.log('路由守卫 - 允许访问:', to.path)
    next()
  }
})

export default router
