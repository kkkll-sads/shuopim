<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 路由跳转由路由守卫统一处理
</script>

<style>
html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  width: 100%;
}

/* 防止点击高亮 */
* {
  -webkit-tap-highlight-color: transparent;
}

/* 输入框允许选择 */
input, textarea {
  -webkit-user-select: text;
  user-select: text;
}
</style>
