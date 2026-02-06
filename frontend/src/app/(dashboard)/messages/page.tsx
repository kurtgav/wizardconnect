// ============================================
// MESSAGES PAGE - PIXEL CONCEPT DESIGN
// Dreamy vaporwave messaging experience
// ============================================

'use client'

import { useState } from 'react'
import { PixelIcon, PixelIconName } from '@/components/ui/PixelIcon'

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    matchId: '1',
    name: 'Player One',
    avatar: '👩‍💻',
    lastMessage: 'That sounds great! When are you free?',
    unreadCount: 2,
    timestamp: '10:30 AM',
    online: true,
  },
  {
    id: '2',
    matchId: '2',
    name: 'Pixel Artist',
    avatar: '👨‍💻',
    lastMessage: 'Thanks for the message!',
    unreadCount: 0,
    timestamp: 'Yesterday',
    online: false,
  },
]

// Mock messages
const mockMessages = [
  {
    id: '1',
    senderId: 'other',
    content: 'Hi! I saw we matched! 😊',
    timestamp: '10:15 AM',
  },
  {
    id: '2',
    senderId: 'me',
    content: 'Hey! Nice to meet you! How are you?',
    timestamp: '10:18 AM',
  },
  {
    id: '3',
    senderId: 'other',
    content: 'I\'m good! Just finished my CS class. What about you?',
    timestamp: '10:20 AM',
  },
  {
    id: '4',
    senderId: 'me',
    content: 'Same! We should grab coffee sometime ☕',
    timestamp: '10:25 AM',
  },
  {
    id: '5',
    senderId: 'other',
    content: 'That sounds great! When are you free?',
    timestamp: '10:30 AM',
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(mockConversations[0])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="pixel-font text-3xl md:text-5xl font-bold mb-4 text-[var(--retro-navy)] uppercase tracking-tighter">
          Server <span className="text-[var(--retro-yellow)] text-shadow-md">Chat</span>
        </h1>
        <div className="inline-block px-4 py-1 border-b-4 border-[var(--retro-red)]">
          <p className="pixel-font-body font-bold text-[var(--retro-navy)]">
            ONLINE STATUS: <span className="text-green-600">CONNECTED</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Sidebar: User List */}
        <div className="lg:col-span-1 pixel-card flex flex-col p-0 overflow-hidden">
          <div className="p-4 bg-[var(--retro-navy)] text-white border-b-4 border-[var(--retro-navy)]">
            <h2 className="pixel-font text-sm">Active Players</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[var(--retro-white)]">
            {mockConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`
                  cursor-pointer p-3 border-2 transition-all relative
                  ${selectedConversation?.id === conv.id
                    ? 'bg-[var(--retro-yellow)] border-[var(--retro-navy)] shadow-[2px_2px_0_0_var(--retro-navy)]'
                    : 'bg-white border-transparent hover:border-[var(--retro-navy)]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--retro-cream)] border-2 border-[var(--retro-navy)] flex items-center justify-center text-xl">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="pixel-font text-xs text-[var(--retro-navy)] truncate">{conv.name}</h3>
                      {conv.online && <div className="w-2 h-2 bg-green-500 border border-[var(--retro-navy)]" />}
                    </div>
                    <p className="pixel-font-body text-sm truncate opacity-80">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 pixel-card flex flex-col p-0 overflow-hidden relative">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-[var(--retro-blue)] border-b-4 border-[var(--retro-navy)] flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border-2 border-[var(--retro-navy)] flex items-center justify-center">
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <h3 className="pixel-font text-sm">{selectedConversation.name}</h3>
                    <p className="pixel-font-body text-xs opacity-90">{selectedConversation.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button className="pixel-btn pixel-btn-secondary px-2 py-1 text-[10px]">
                  OPTIONS
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--retro-white)]">
                {mockMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                          max-w-[70%] p-3 border-2 border-[var(--retro-navy)] shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]
                          ${msg.senderId === 'me'
                        ? 'bg-[var(--retro-navy)] text-white'
                        : 'bg-[var(--retro-cream)] text-[var(--retro-navy)]'
                      }
                       `}>
                      <p className="pixel-font-body text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 opacity-60 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[var(--retro-cream)] border-t-4 border-[var(--retro-navy)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="pixel-input flex-1 border-2"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="pixel-btn px-6"
                  >
                    SEND
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[var(--retro-cream)]">
              <div className="text-center opacity-50">
                <p className="pixel-font text-[var(--retro-navy)] mb-2">NO SIGNAL...</p>
                <p className="pixel-font-body">Select a frequency to start transmission</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
