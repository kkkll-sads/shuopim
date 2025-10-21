import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

import App from './App.vue'
import router from './router'

// 导入样式（顺序很重要！）
import './styles/tailwind.css'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Capacitor 初始化
const initCapacitor = async () => {
  // 检查是否为原生平台
  const isNative = Capacitor.isNativePlatform()
  
  if (isNative) {
    try {
      // 设置状态栏
      await StatusBar.setStyle({ style: Style.Dark })
      await StatusBar.setBackgroundColor({ color: '#ffffff' })
      
      // 配置键盘
      await Keyboard.setAccessoryBarVisible({ isVisible: false })
      
      // 监听应用状态
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive)
      })
      
      console.log('Capacitor plugins initialized successfully')
    } catch (error) {
      console.warn('Failed to initialize some Capacitor plugins:', error)
    }
  } else {
    console.log('Running on web platform, skipping native plugins initialization')
  }
}

// 初始化
initCapacitor()

app.mount('#app')

// 导出全局方法供组件使用
app.config.globalProperties.$haptics = Haptics
app.config.globalProperties.$impactStyle = ImpactStyle
