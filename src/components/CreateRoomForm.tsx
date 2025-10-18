import { useState } from 'react'
import { roomApi } from '../api/client'

interface CreateRoomFormProps {
  onRoomCreated: () => void
  currentUserId: string
}

export function CreateRoomForm({ onRoomCreated, currentUserId }: CreateRoomFormProps) {
  const [roomName, setRoomName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) return

    try {
      setIsSubmitting(true)
      setError(null)
      await roomApi.createRoom(roomName.trim(), currentUserId)
      setRoomName('')
      onRoomCreated()
    } catch (err) {
      setError('Failed to create room')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Create New Room</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!roomName.trim() || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
