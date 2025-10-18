import type { Room, Message } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// API error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// Fetch helper
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new ApiError(response.status, text || response.statusText)
  }

  return response.json()
}

// Room APIs
export const roomApi = {
  // Get all rooms
  async getRooms(): Promise<Room[]> {
    return apiFetch<Room[]>('/rooms')
  },

  // Get room by ID
  async getRoom(id: string): Promise<Room> {
    return apiFetch<Room>(`/rooms/${id}`)
  },

  // Create new room
  async createRoom(name: string, userId?: string): Promise<{ ok: boolean; id: string; name: string }> {
    return apiFetch('/rooms', {
      method: 'POST',
      body: JSON.stringify({ name, userId }),
    })
  },

  // Add member to room
  async addMember(roomId: string, userId: string): Promise<{ ok: boolean; memberId: string }> {
    return apiFetch(`/rooms/${roomId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  },
}

// Message APIs
export const messageApi = {
  // Get messages for a room
  async getMessages(roomId: string): Promise<Message[]> {
    return apiFetch<Message[]>(`/messages?roomId=${roomId}`)
  },

  // Post a new message
  async postMessage(
    roomId: string,
    userId: string,
    body: string
  ): Promise<{ ok: boolean; id: string }> {
    return apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ roomId, userId, body }),
    })
  },
}
