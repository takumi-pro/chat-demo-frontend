import { useEffect, useRef, useState, useCallback } from 'react'
import type { WsMessage, Message } from '../types'

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'

interface UseWebSocketOptions {
  roomId: string
  userId: string
  onMessage?: (message: Message) => void
  onInit?: (messages: Message[]) => void
  onError?: (error: string) => void
}

export function useWebSocket({
  roomId,
  userId,
  onMessage,
  onInit,
  onError,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  // Use refs to store the latest callback functions
  const onMessageRef = useRef(onMessage)
  const onInitRef = useRef(onInit)
  const onErrorRef = useRef(onError)

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage
    onInitRef.current = onInit
    onErrorRef.current = onError
  }, [onMessage, onInit, onError])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!roomId || !userId) return

    // Cleanup previous connection if any
    disconnect()

    const wsUrl = `${WS_BASE_URL}/?roomId=${roomId}&userId=${userId}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data: WsMessage = JSON.parse(event.data)

        switch (data.type) {
          case 'init':
            onInitRef.current?.(data.payload)
            break

          case 'message':
            // Convert WsNewMessage to Message format
            const message: Message = {
              id: data.payload.id,
              roomId: data.payload.roomId,
              userId: data.payload.userId,
              body: data.payload.body,
              createdAt: data.payload.createdAt,
              user: {
                id: data.payload.userId,
                name: data.payload.userName,
                createdAt: '',
              },
            }
            onMessageRef.current?.(message)
            break

          case 'error':
            onErrorRef.current?.(data.message)
            break
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    wsRef.current = ws

    // Cleanup on unmount or when roomId/userId changes
    return () => {
      ws.close()
      setIsConnected(false)
    }
  }, [roomId, userId, disconnect])

  const reconnect = useCallback(() => {
    disconnect()
    // The effect will automatically reconnect when disconnect is called
    // since roomId and userId haven't changed
  }, [disconnect])

  return { isConnected, disconnect, reconnect }
}
