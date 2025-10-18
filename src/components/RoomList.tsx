import { useEffect, useState } from 'react'
import type { Room } from '../types'
import { roomApi } from '../api/client'

interface RoomListProps {
  onSelectRoom: (room: Room) => void
}

export function RoomList({ onSelectRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await roomApi.getRooms()
      setRooms(data)
    } catch (err) {
      setError('Failed to load rooms')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading rooms...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadRooms}
          className="mt-2 text-sm text-red-700 underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rooms.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No rooms available. Create one to get started!
        </div>
      ) : (
        rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{room.name}</h3>
                <p className="text-sm text-gray-500">
                  {room.members?.length || 0} members
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))
      )}
    </div>
  )
}
