import { useState } from 'react'
import type { Room } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { LoginForm } from './components/LoginForm'
import { RoomList } from './components/RoomList'
import { CreateRoomForm } from './components/CreateRoomForm'
import { ChatRoom } from './components/ChatRoom'

function App() {
  const [userId, setUserId] = useLocalStorage<string | null>('userId', null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Handle login
  const handleLogin = (username: string) => {
    setUserId(username)
  }

  // Handle logout
  const handleLogout = () => {
    setUserId(null)
    setSelectedRoom(null)
  }

  // Handle room selection
  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room)
  }

  // Handle leaving room
  const handleLeaveRoom = () => {
    setSelectedRoom(null)
  }

  // Handle room created
  const handleRoomCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Not logged in - show login form
  if (!userId) {
    return <LoginForm onLogin={handleLogin} />
  }

  // In a chat room - show chat interface
  if (selectedRoom) {
    return (
      <ChatRoom
        room={selectedRoom}
        currentUserId={userId}
        onLeaveRoom={handleLeaveRoom}
      />
    )
  }

  // Logged in but no room selected - show room list
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Chat Demo</h1>
              <p className="text-gray-600 mt-1">Welcome, {userId}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create Room Form */}
        <div className="mb-6">
          <CreateRoomForm
            onRoomCreated={handleRoomCreated}
            currentUserId={userId}
          />
        </div>

        {/* Room List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Available Rooms
          </h2>
          <RoomList
            key={refreshKey}
            onSelectRoom={handleSelectRoom}
          />
        </div>
      </div>
    </div>
  )
}

export default App
