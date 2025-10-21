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
      component: () => import('@/views/Register.vue'),
      meta: { title: '注册', requiresAuth: false }
    },
    {
      path: '/forgot',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPassword.vue'),
      meta: { title: '忘记密码', requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: '首页',
        requiresAuth: true
      }
    },
    {
      path: '/im',
      name: 'IM',
      component: () => import('@/views/IM.vue'),
      meta: {
        title: '聊天',
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: {
        title: '我的',
        requiresAuth: true
      }
    },
    {
      path: '/category',
      name: 'Category',
      component: () => import('@/views/Category.vue'),
      meta: {
        title: '分类',
        requiresAuth: true
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 树拍易购`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/home')
  } else {
    next()
  }
})

export default router
