// ============================================
// MESSAGES PAGE - PREMIUM PIXEL ART
// ============================================

'use client'

import { useState } from 'react'
import { ParallaxBackground, ScanlineEffect } from '@/components/effects/ParallaxBackground'
import { ParticleEffects } from '@/components/effects/ParticleEffects'

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    matchId: '1',
    name: 'Maria Santos',
    avatar: '👩‍💻',
    lastMessage: 'That sounds great! When are you free?',
    unreadCount: 2,
    timestamp: '10:30 AM',
    online: true,
  },
  {
    id: '2',
    matchId: '2',
    name: 'Jose Reyes',
    avatar: '👨‍💻',
    lastMessage: 'Thanks for the message!',
    unreadCount: 0,
    timestamp: 'Yesterday',
    online: false,
  },
]

// Mock messages for a conversation
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
      // In production, this would send via Supabase
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <main className="min-h-screen relative">
      {/* Premium Background Effects */}
      <ParallaxBackground />
      <ParticleEffects type="hearts" density="10" className="opacity-30" />
      <ScanlineEffect />

      <div className="relative z-10 py-12 px-4" style={{ background: 'rgba(255, 248, 240, 0.9)' }}>
        <div className="pixel-container max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="text-6xl pixel-bounce inline-block">💬</span>
            </div>
            <h1 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-4xl md:text-5xl font-bold mb-4">
              Messages
            </h1>
            <div className="pixel-divider max-w-md mx-auto mb-6"></div>
            <p className="pixel-font-body text-xl" style={{ color: '#2D3436' }}>
              Chat with your matches! Messaging is open Feb 11-13.
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: '600px' }}>
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="pixel-card hover-lift pixel-shine-effect h-full flex flex-col">
              <h2 className="pixel-font-heading text-xl font-bold mb-4 pb-4 border-b-4 border-gray-800" style={{ color: '#1976D2' }}>
                💬 Conversations
              </h2>

              <div className="flex-1 overflow-y-auto space-y-3">
                {mockConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`pixel-border-thin p-3 cursor-pointer transition-all hover:scale-102 hover-lift ${
                      selectedConversation?.id === conv.id ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="text-3xl pixel-bounce">{conv.avatar}</div>
                        {conv.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="pixel-font-heading font-bold text-sm truncate">{conv.name}</h3>
                          <span className="pixel-font-body text-xs" style={{ color: '#636E72' }}>{conv.timestamp}</span>
                        </div>
                        <p className="pixel-font-body text-xs truncate" style={{ color: '#636E72' }}>{conv.lastMessage}</p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unreadCount > 0 && (
                        <div className="w-6 h-6 flex items-center justify-center text-white text-xs font-bold pixel-border"
                          style={{ background: '#D32F2F', minWidth: '24px' }}>
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="pixel-card hover-lift pixel-shine-effect h-full flex flex-col">
                {/* Chat Header */}
                <div className="pb-4 border-b-4 border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-4xl pixel-bounce">{selectedConversation.avatar}</div>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="pixel-font-heading font-bold text-lg" style={{ color: '#1976D2' }}>
                        {selectedConversation.name}
                      </h3>
                      <p className="pixel-font-body text-xs" style={{ color: '#636E72' }}>
                        {selectedConversation.online ? '🟢 Online' : '⚫ Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`pixel-border-thin p-3 ${
                            msg.senderId === 'me'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="pt-4 border-t-4 border-gray-800">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="pixel-input flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="pixel-btn pixel-btn-primary pixel-ripple disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pixel-card hover-lift h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 pixel-bounce">💬</div>
                  <h3 className="pixel-font-heading font-bold text-lg mb-2" style={{ color: '#1976D2' }}>
                    Select a Conversation
                  </h3>
                  <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 pixel-card hover-lift" style={{ background: 'linear-gradient(135deg, #E8F8F5 0%, #B2DFDB 100%)' }}>
          <h3 className="pixel-font-heading font-bold mb-3" style={{ color: '#1976D2' }}>
            📅 Messaging Schedule
          </h3>
          <p className="pixel-font-body text-sm" style={{ color: '#2D3436' }}>
            Messaging is only available from <strong>February 11-13, 2026</strong>. Use this time to connect with your matches before the public Valentine's Day reveal! After Feb 13, messaging will remain open but focus on the reveal event.
          </p>
        </div>
        </div>
      </div>
    </main>
  )
}
