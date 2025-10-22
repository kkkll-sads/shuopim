import { ref, reactive } from 'vue'

export interface WSMessage {
  type: string
  data: any
  timestamp: number
}

export class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 3000

  public isConnected = ref(false)
  public messages = reactive<WSMessage[]>([])

  constructor(url: string) {
    this.url = url
  }

  connect(imToken: string) {
    try {
      this.ws = new WebSocket(`${this.url}?token=${imToken}`)
      
      this.ws.onopen = () => {
        console.log('WebSocket 连接成功')
        this.isConnected.value = true
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.messages.push({
            type: message.type || 'message',
            data: message,
            timestamp: Date.now()
          })
        } catch (error) {
          console.error('解析 WebSocket 消息失败:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket 连接关闭')
        this.isConnected.value = false
        this.attemptReconnect(imToken)
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error)
        this.isConnected.value = false
      }
    } catch (error) {
      console.error('WebSocket 连接失败:', error)
    }
  }

  private attemptReconnect(imToken: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`尝试重连 WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect(imToken)
      }, this.reconnectInterval)
    } else {
      console.error('WebSocket 重连失败，已达到最大重试次数')
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket 未连接')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected.value = false
  }
}

// 创建全局 WebSocket 实例
export const wsManager = new WebSocketManager(import.meta.env.VITE_IM_WS_URL)
