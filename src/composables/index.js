/**
 * 组合式函数库统一导出
 * 提供完整的组合式函数集合
 */

// 导入所有组合式函数
import { useApi, usePagination, useInfiniteScroll } from './useApi'
import { useStorage, useSessionStorage, useCookie, useCache, useStorageManager } from './useStorage'
import { useState, useCounter, useToggle, useList, useForm, useAsyncState } from './useState'
import { useModal, useConfirm, useAlert, useLoading, useNotification, useDrawer, usePopover } from './useModal'
import { useToast, useMessage, useProgress, useSkeleton, useEmpty } from './useToast'
import { useAuth, usePermission } from './useAuth'
import { useAuthState, useAuthGuard, useAuthWatcher } from './useAuthState'
import { useData, useList as useDataList, useSearch, useCache as useDataCache, useSync } from './useData'
import { usePageData, useListData, useDetailData, useStatsData } from './usePageData'
import { useChatList, useFriendManagement, useGroupManagement, useIMNavigation, useIMState } from './useIM'
import { useChat } from './useChat'
import { useUtils, useFormat, useCalculator, useConverter, useValidator, useGenerator } from './useUtils'
import { useDevice, useGesture, useGeolocation, useVibration } from './useDevice'
import { useMobile, useMobileAdapt, useTouchOptimization, useScrollOptimization, useKeyboardOptimization, usePerformanceOptimization } from './useMobile'
import { useNavigation, useRouteGuard, useRouteCache } from './useNavigation'
import { useFormValidation, useFieldValidation } from './useFormValidation'

// 核心组合式函数
export { useApi, usePagination, useInfiniteScroll } from './useApi'
export { useStorage, useSessionStorage, useCookie, useCache, useStorageManager } from './useStorage'
export { useState, useCounter, useToggle, useList, useForm, useAsyncState } from './useState'

// UI交互组合式函数
export { useModal, useConfirm, useAlert, useLoading, useNotification, useDrawer, usePopover } from './useModal'
export { useToast, useMessage, useProgress, useSkeleton, useEmpty } from './useToast'

// 业务逻辑组合式函数
export { useAuth, usePermission } from './useAuth'
export { useAuthState, useAuthGuard, useAuthWatcher } from './useAuthState'
export { useData, useList as useDataList, useSearch, useCache as useDataCache, useSync } from './useData'
export { usePageData, useListData, useDetailData, useStatsData } from './usePageData'
export { useChatList, useFriendManagement, useGroupManagement, useIMNavigation, useIMState } from './useIM'
export { useChat } from './useChat'

// 工具类组合式函数
export { useUtils, useFormat, useCalculator, useConverter, useValidator, useGenerator } from './useUtils'

// 移动端专用组合式函数
export { useDevice, useGesture, useGeolocation, useVibration } from './useDevice'
export { useMobile, useMobileAdapt, useTouchOptimization, useScrollOptimization, useKeyboardOptimization, usePerformanceOptimization } from './useMobile'

// 路由导航组合式函数
export { useNavigation, useRouteGuard, useRouteCache } from './useNavigation'

// 表单验证组合式函数（已存在的）
export { useFormValidation, useFieldValidation } from './useFormValidation'

// 默认导出所有组合式函数
export default {
  // 核心
  useApi,
  useStorage,
  useState,
  
  // UI交互
  useModal,
  useToast,
  
  // 业务逻辑
  useAuth,
  useAuthState,
  useData,
  usePageData,
  
  // IM即时通讯
  useChatList,
  useFriendManagement,
  useGroupManagement,
  useIMNavigation,
  useIMState,
  useChat,
  
  // 工具类
  useUtils,
  useFormat,
  useCalculator,
  useConverter,
  useValidator,
  useGenerator,
  
  // 移动端
  useDevice,
  useMobile,
  useMobileAdapt,
  useTouchOptimization,
  useScrollOptimization,
  useKeyboardOptimization,
  usePerformanceOptimization,
  
  // 路由导航
  useNavigation,
  useRouteGuard,
  useRouteCache,
  
  // 表单验证
  useFormValidation,
  useFieldValidation
}
