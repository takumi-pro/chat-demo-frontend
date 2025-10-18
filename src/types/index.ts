// User type
export interface User {
  id: string
  name: string
  createdAt: string
}

// Room type
export interface Room {
  id: string
  name: string
  createdAt: string
  members?: RoomMember[]
}

// RoomMember type
export interface RoomMember {
  id: string
  roomId: string
  userId: string
  role: string
  createdAt: string
  user: User
}

// Message type
export interface Message {
  id: string
  roomId: string
  userId: string
  body: string
  createdAt: string
  user?: User
}

// WebSocket message types
export interface WsInitMessage {
  type: 'init'
  payload: Message[]
}

export interface WsNewMessage {
  type: 'message'
  payload: {
    id: string
    roomId: string
    userId: string
    userName: string
    body: string
    createdAt: string
  }
}

export interface WsErrorMessage {
  type: 'error'
  message: string
}

export type WsMessage = WsInitMessage | WsNewMessage | WsErrorMessage
