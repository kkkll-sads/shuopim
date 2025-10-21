# 树拍易购 H5 项目

基于 Vue3 + Vite + Capacitor 构建的移动端 H5 应用

## 📋 环境要求

### 必需环境

#### Node.js
- **版本要求**：Node.js >= 16.x（推荐使用 18.x 或 20.x LTS 版本）
- **下载地址**：https://nodejs.org/

验证安装：
```bash
node -v  # 应显示 v16.x.x 或更高版本
npm -v   # 应显示 8.x.x 或更高版本
```

#### 包管理器（三选一）

**npm（推荐，Node.js 自带）**
```bash
npm -v
```

**pnpm（更快，更节省空间）**
```bash
npm install -g pnpm
pnpm -v
```

**yarn**
```bash
npm install -g yarn
yarn -v
```

### 可选环境（原生应用开发）

#### Android 开发
如需构建 Android 应用，需要安装：

1. **Java Development Kit (JDK)**
   - 版本：JDK 11 或更高
   - 下载：https://adoptium.net/

2. **Android Studio**
   - 最新稳定版
   - 下载：https://developer.android.com/studio
   - 包含 Android SDK 和模拟器

3. **Android SDK**
   - Android Studio 会自动安装
   - 需要 API Level 22 或更高

#### iOS 开发（仅 macOS）
如需构建 iOS 应用：
- macOS 系统
- Xcode 13 或更高版本
- Xcode Command Line Tools

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd vue3-capacitor-h5
```

### 2. 安装依赖
```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 3. 配置环境变量（可选）
复制环境变量模板：
```bash
cp env.development .env.development
```

编辑 `.env.development` 配置：
```env
VITE_API_BASE=http://localhost:8000
VITE_IM_API_BASE=http://localhost:9501
VITE_IM_WS_URL=ws://localhost:9502/wss/default.io
```

### 4. 启动开发服务器
```bash
npm run dev
```
访问：http://localhost:3000

### 5. 构建生产版本
```bash
npm run build
```

### 6. 预览构建结果
```bash
npm run preview
```

## 📱 Capacitor 集成

### 添加 Android 平台
```bash
npm run cap:add
```

### 同步代码到原生项目
```bash
npm run cap:sync
```

### 运行 Android 应用
```bash
npm run cap:run
```

### 构建并同步
```bash
npm run cap:build
```

## 🛠️ 技术栈

### 核心框架
- **Vue 3** (v3.x) - 渐进式 JavaScript 框架，使用 Composition API
- **Vite** (v5.x) - 下一代前端构建工具，快速的 HMR
- **TypeScript** (v5.x) - JavaScript 的超集，提供类型安全

### UI 框架与样式
- **Tailwind CSS** (v3.x) - 实用优先的 CSS 框架
- **Vant 4** - 移动端 Vue 组件库（部分页面使用）
- **Lucide Vue Next** - 现代化图标库
- **Less** - CSS 预处理器

### 路由与状态管理
- **Vue Router** (v4.x) - Vue 官方路由管理器
- **Pinia** - Vue 新一代状态管理

### 移动端集成
- **Capacitor** (v6.x) - 跨平台原生应用运行时
- **@capacitor/keyboard** - 键盘管理插件
- **@capacitor/status-bar** - 状态栏控制插件
- **@capacitor/haptics** - 触觉反馈插件

### 开发工具
- **ESLint** - JavaScript/TypeScript 代码检查
- **PostCSS** - CSS 转换工具
- **Autoprefixer** - CSS 自动添加浏览器前缀

## 📁 项目结构

```
vue3-capacitor-h5/
├── src/
│   ├── views/              # 页面组件
│   │   ├── Login.vue       # 登录页面
│   │   ├── Register.vue    # 注册页面
│   │   ├── ForgotPassword.vue  # 忘记密码
│   │   ├── Home.vue        # 首页
│   │   ├── Category.vue    # 分类页面
│   │   ├── IM.vue          # 消息/聊天列表
│   │   └── Profile.vue     # 我的页面
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义和守卫
│   ├── store/              # 状态管理
│   │   ├── index.ts        # Pinia store 入口
│   │   └── user.ts         # 用户状态管理
│   ├── styles/             # 全局样式
│   │   └── tailwind.css    # Tailwind CSS 配置
│   ├── utils/              # 工具函数
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── public/                 # 静态资源
├── android/                # Android 原生项目（Capacitor 生成）
├── capacitor.config.ts     # Capacitor 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 🎨 功能特性

### 用户认证
- ✅ **登录页面** - 现代化渐变背景，手机号/验证码登录
- ✅ **注册页面** - 手机号注册，邀请码支持
- ✅ **忘记密码** - 验证码重置密码
- ✅ **路由守卫** - 自动登录状态检查和跳转
- ✅ **Pinia 状态管理** - 用户信息持久化

### 首页功能
- ✅ **轮播图展示** - 大图背景展示
- ✅ **位置标签** - 显示当前位置
- ✅ **搜索功能** - 商家名称搜索
- ✅ **分类图标** - 5个主要分类快速入口
- ✅ **筛选标签** - 全部分类、到店有礼、距离优先
- ✅ **商家列表** - 商家卡片展示，评分、位置、距离
- ✅ **操作按钮** - 数据价值分配、打电话、导航

### 分类页面
- ✅ **返回导航** - 支持返回上一页
- ✅ **搜索栏** - 商家搜索功能
- ✅ **分类下拉** - 多分类切换
- ✅ **筛选功能** - 到店有礼、距离优先排序
- ✅ **商家列表** - 与首页一致的商家卡片
- ✅ **空状态** - 无数据时的提示

### 消息页面
- ✅ **聊天列表** - 显示所有会话
- ✅ **头像展示** - 支持自定义头像和默认头像
- ✅ **商家标签** - 显示商家身份
- ✅ **未读徽章** - 未读消息数量提示
- ✅ **下拉菜单** - 加好友、加群、创建群聊
- ✅ **空状态** - 暂无会话提示

### 我的页面
- ✅ **用户信息** - 头像、昵称、手机号
- ✅ **余额卡片** - 树豆、消费券、树权
- ✅ **订单统计** - 待付款、待发货、待收货、退款
- ✅ **功能菜单** - 收货地址、优惠券、账单等
- ✅ **生活圈入口** - 快捷导航
- ✅ **退出登录** - 清除登录状态

### 底部导航
- ✅ **统一导航栏** - 5个主要功能入口
- ✅ **图标高亮** - 当前页面图标红色高亮
- ✅ **路由跳转** - 页面间无缝切换

### UI/UX 优化
- ✅ **Tailwind CSS** - 实用优先的样式系统
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **过渡动画** - 平滑的页面切换和交互
- ✅ **加载状态** - 按钮禁用和加载提示
- ✅ **表单验证** - 实时输入验证

### 移动端优化
- ✅ **触摸优化** - 防止点击高亮，适配手势
- ✅ **安全区域** - 支持刘海屏和底部安全区
- ✅ **键盘适配** - 输入时自动调整布局
- ✅ **性能优化** - 懒加载、代码分割

### Capacitor 原生功能
- ✅ **状态栏控制** - 自定义状态栏样式
- ✅ **键盘管理** - 键盘显示/隐藏控制
- ✅ **触觉反馈** - 点击震动反馈
- ✅ **应用状态** - 监听前台/后台切换

## 🔧 开发说明

### 环境变量
创建 `.env.development` 文件：
```env
VITE_API_BASE=http://localhost:8000
VITE_IM_API_BASE=http://localhost:9501
VITE_IM_WS_URL=ws://localhost:9502/wss/default.io
```

### 样式规范
- **Tailwind CSS** - 实用优先，响应式设计
- **Less** - 部分页面使用 Less 预处理器
- **PostCSS** - 自动添加浏览器前缀
- **移动端优先** - 适配各种屏幕尺寸
- **安全区域** - 支持刘海屏和底部安全区

### 组件规范
- **Composition API** - 使用 Vue 3 组合式 API
- **TypeScript** - 完整的类型定义
- **单文件组件** - `<script setup>` 语法
- **Props 验证** - 使用 TypeScript 接口定义
- **响应式数据** - ref/reactive 管理状态

### 代码规范
```typescript
// ✅ 推荐写法
<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
}

const user = ref<User | null>(null)
</script>

// ❌ 避免
<script>
export default {
  data() {
    return { user: null }
  }
}
</script>
```

### 路由配置
所有路由在 `src/router/index.ts` 中定义：
```typescript
{
  path: '/home',
  name: 'Home',
  component: () => import('@/views/Home.vue'),
  meta: {
    title: '首页',
    requiresAuth: true  // 需要登录
  }
}
```

### 状态管理
使用 Pinia 管理全局状态：
```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  return { token, setToken }
})
```

## 📱 移动端适配

### 视口配置
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 安全区域
```css
/* 支持安全区域 */
@supports (padding: max(0px)) {
  .container {
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}
```

### 触摸优化
```css
/* 防止点击高亮 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
```

## 🚀 部署

### H5 部署
1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到服务器**
   - 将 `dist` 目录上传到 Web 服务器
   - 配置服务器支持 SPA（单页应用）路由
   - 设置 HTTPS（推荐）

3. **Nginx 配置示例**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Android 打包

#### 前置准备
- 已安装 Android Studio
- 已配置 JDK 11+
- 已配置 Android SDK

#### 打包步骤
1. **构建 Web 项目**
   ```bash
   npm run build
   ```

2. **同步到原生项目**
   ```bash
   npm run cap:sync
   ```

3. **打开 Android Studio**
   ```bash
   npx cap open android
   ```

4. **配置签名**（生产环境）
   - 在 Android Studio 中配置 keystore
   - 更新 `android/app/build.gradle`

5. **构建 APK/AAB**
   - Debug: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Release: `Build > Generate Signed Bundle / APK`

## ❓ 常见问题

### 依赖安装问题

**Q: npm install 失败怎么办？**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

**Q: 使用国内镜像加速**
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用 pnpm
npm install -g pnpm
pnpm config set registry https://registry.npmmirror.com
```

### 开发环境问题

**Q: 端口 3000 被占用？**
```bash
# 修改 vite.config.ts 中的端口
server: {
  port: 3001
}
```

**Q: HMR（热更新）不工作？**
```bash
# 检查是否使用了代理或防火墙
# 尝试重启开发服务器
npm run dev
```

### 构建问题

**Q: 构建失败，内存不足？**
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Q: TypeScript 类型错误？**
```bash
# 检查 tsconfig.json 配置
# 确保所有依赖都有类型定义
npm install --save-dev @types/node
```

### Capacitor 问题

**Q: Android 构建失败？**
- 检查 JDK 版本（需要 JDK 11+）
- 检查 Gradle 配置
- 清理 Android 构建缓存：`./gradlew clean`

**Q: 真机调试时无法连接？**
- 确保手机和电脑在同一网络
- 检查 USB 调试是否开启
- 运行 `adb devices` 检查设备连接

### 样式问题

**Q: Tailwind CSS 样式不生效？**
- 检查 `tailwind.config.js` 配置
- 确保 `src/styles/tailwind.css` 被导入
- 重启开发服务器

**Q: 移动端样式显示异常？**
- 检查视口配置（viewport meta）
- 使用开发者工具移动端模式测试
- 检查是否正确使用响应式类

## 🔗 相关链接

### 官方文档
- [Vue 3 文档](https://cn.vuejs.org/) - Vue 3 中文文档
- [Vite 文档](https://cn.vitejs.dev/) - Vite 中文文档
- [Capacitor 文档](https://capacitorjs.com/docs) - Capacitor 官方文档
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - Tailwind CSS 官方文档
- [Pinia 文档](https://pinia.vuejs.org/zh/) - Pinia 中文文档
- [Vue Router 文档](https://router.vuejs.org/zh/) - Vue Router 中文文档

### 组件库
- [Vant 4 文档](https://vant-ui.github.io/vant/#/zh-CN) - Vant 移动端组件库
- [Lucide Icons](https://lucide.dev/) - 现代化图标库

### 工具
- [TypeScript 手册](https://www.typescriptlang.org/docs/) - TypeScript 官方文档
- [ESLint](https://eslint.org/) - JavaScript 代码检查工具
- [PostCSS](https://postcss.org/) - CSS 转换工具

## 📄 许可证

MIT License

Copyright (c) 2024 树拍易购

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
