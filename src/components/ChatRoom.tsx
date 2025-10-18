import { useState, useCallback } from 'react'
import type { Room, Message } from '../types'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useWebSocket } from '../hooks/useWebSocket'
import { messageApi } from '../api/client'

interface ChatRoomProps {
  room: Room
  currentUserId: string
  onLeaveRoom: () => void
}

export function ChatRoom({ room, currentUserId, onLeaveRoom }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSending, setIsSending] = useState(false)

  const handleInit = useCallback((initialMessages: Message[]) => {
    setMessages(initialMessages)
  }, [])

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const { isConnected } = useWebSocket({
    roomId: room.id,
    userId: currentUserId,
    onInit: handleInit,
    onMessage: handleNewMessage,
    onError: (error) => console.error('WebSocket error:', error),
  })

  const handleSendMessage = async (body: string) => {
    try {
      setIsSending(true)
      await messageApi.postMessage(room.id, currentUserId, body)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected || isSending}
        />
      </div>
    </div>
  )
}
