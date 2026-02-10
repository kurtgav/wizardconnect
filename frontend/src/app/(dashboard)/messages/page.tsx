// ============================================
// MESSAGES PAGE - PIXEL CONCEPT DESIGN
// Dreamy vaporwave messaging experience with real-time updates
// ============================================

'use client'

import { useState, useEffect, useRef } from 'react'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { ProfileModal } from '@/components/ui/ProfileModal'
import { createClient } from '@/lib/supabase/client'
import { apiClient } from '@/lib/api-client'
import type { ConversationWithDetails, Message } from '@/types/api'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetails, setShowDetails] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelsRef = useRef<Map<string, any>>(new Map())
  const supabase = createClient()

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
    return () => {
      // Cleanup all subscriptions on unmount
      channelsRef.current.forEach((channel) => {
        if (channel) {
          supabase.removeChannel(channel)
        }
      })
      channelsRef.current.clear()
    }
  }, [])

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      subscribeToMessages(selectedConversation.id)
      subscribeToConversationUpdates()
    } else {
      setMessages([])
    }

    // Cleanup subscription when changing conversation
    return () => {
      const messageChannel = channelsRef.current.get('messages')
      if (messageChannel) {
        supabase.removeChannel(messageChannel)
        channelsRef.current.delete('messages')
      }
      const conversationChannel = channelsRef.current.get('conversations')
      if (conversationChannel) {
        supabase.removeChannel(conversationChannel)
        channelsRef.current.delete('conversations')
      }
    }
  }, [selectedConversation])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getConversations()
      setConversations(data || [])
      if (data && data.length > 0 && !selectedConversation) {
        // Desktop default: select first conversation
        if (window.innerWidth >= 1024) {
          setSelectedConversation(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response: any = await apiClient.getMessages(conversationId)
      setMessages(Array.isArray(response) ? response : (response.data || []))
      setCurrentUserId(response.current_user_id || '')
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  // Subscribe to new messages for the current conversation
  const subscribeToMessages = (conversationId: string) => {
    const channelName = `messages:${conversationId}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          const newMessage = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to messages for conversation:', conversationId)
        }
      })

    channelsRef.current.set('messages', channel)
  }

  // Subscribe to conversation updates (for last message and unread count)
  const subscribeToConversationUpdates = () => {
    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        async () => {
          // Reload conversations to get updated last_message and unread counts
          const data = await apiClient.getConversations()
          setConversations(data || [])
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to conversation updates')
        }
      })

    channelsRef.current.set('conversations', channel)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) {
      return
    }

    try {
      setSendingMessage(true)
      const message = await apiClient.sendMessage(selectedConversation.id, { content: newMessage })
      setMessages((prev) => [...prev, message])
      setNewMessage('')

      // Refresh conversations to update last_message
      const data = await apiClient.getConversations()
      setConversations(data || [])
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleProfileClick = (userId: string) => {
    setProfileModalUserId(userId)
  }

  const selectConversation = (conv: ConversationWithDetails) => {
    setSelectedConversation(conv)
    setMobileView('chat')
  }

  const goBackToList = () => {
    setMobileView('list')
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const filteredConversations = conversations.filter(conv =>
    `${conv.other_participant.first_name} ${conv.other_participant.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden bg-[var(--retro-cream)]">
      <div className="flex h-full w-full border-b-4 border-[var(--retro-navy)] bg-[var(--retro-cream)] relative overflow-hidden">

        {/* Messenger Layout Container */}
        <div className="flex flex-1 overflow-hidden">

          {/* 1. LEFT SIDEBAR: Conversation List */}
          <div className={`
            ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
            w-full md:w-[320px] lg:w-[360px] border-r-4 border-[var(--retro-navy)] flex-col bg-white
          `}>
            {/* Sidebar Header */}
            <div className="p-4 border-b-4 border-[var(--retro-navy)] bg-[var(--retro-white)] flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="pixel-font text-xl text-[var(--retro-navy)] uppercase">Chats</h2>
                <div className="md:hidden">
                  <PixelIcon name="smiley" size={24} />
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transmissions..."
                  className="pixel-input w-full pl-10 pr-4 py-2 text-sm bg-[var(--retro-cream)] focus:bg-white transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                  <PixelIcon name="smiley" size={16} />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                  <div className="animate-spin mb-4">
                    <PixelIcon name="smiley" size={32} />
                  </div>
                  <p className="pixel-font text-xs tracking-widest uppercase">Syncing...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-12 text-center opacity-50">
                  <div className="mb-4 flex justify-center">
                    <PixelIcon name="smiley" size={48} />
                  </div>
                  <p className="pixel-font-body text-sm">No transmissions detected</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`
                      flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4
                      ${selectedConversation?.id === conv.id
                        ? 'bg-[var(--retro-yellow)] border-l-[var(--retro-navy)]'
                        : 'hover:bg-[var(--retro-cream)] border-l-transparent'
                      }
                    `}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 border-2 border-[var(--retro-navy)] bg-white overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                        {conv.other_participant.avatar_url ? (
                          <img
                            src={conv.other_participant.avatar_url}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--retro-blue)] text-white">
                            <PixelIcon name="smiley" size={24} />
                          </div>
                        )}
                      </div>
                      {conv.other_participant.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-[var(--retro-navy)] rounded-full z-10"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="pixel-font text-xs truncate font-bold text-[var(--retro-navy)]">
                          {conv.other_participant.first_name} {conv.other_participant.last_name}
                        </h4>
                        <span className="text-[10px] opacity-40 font-mono whitespace-nowrap ml-2">
                          {conv.updated_at ? formatTime(conv.updated_at) : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <p className={`pixel-font-body text-xs truncate ${conv.unread_count > 0 ? 'font-bold text-black' : 'opacity-60 text-[var(--retro-navy)]'}`}>
                          {conv.last_message || "Initialize connection..."}
                        </p>
                        {conv.unread_count > 0 && (
                          <div className="flex-shrink-0 w-5 h-5 bg-[var(--retro-red)] border-2 border-[var(--retro-navy)] flex items-center justify-center text-[10px] text-white pixel-font shadow-[1px_1px_0_0_rgba(0,0,0,0.2)]">
                            {conv.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. CENTER: Chat Window */}
          <div className={`
            ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
            flex-1 flex-col bg-white overflow-hidden
          `}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b-4 border-[var(--retro-navy)] flex justify-between items-center bg-[var(--retro-cream)] flex-shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.05)] z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={goBackToList}
                      className="md:hidden p-2 hover:bg-[var(--retro-navy)] hover:text-white border-2 border-[var(--retro-navy)] transition-all flex-shrink-0"
                    >
                      <PixelIcon name="smiley" size={20} className="rotate-180" />
                    </button>
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-70 min-w-0"
                      onClick={() => handleProfileClick(selectedConversation.other_participant.id)}
                    >
                      <div className="w-10 h-10 border-2 border-[var(--retro-navy)] overflow-hidden bg-white flex-shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                        {selectedConversation.other_participant.avatar_url ? (
                          <img src={selectedConversation.other_participant.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--retro-blue)] text-white">
                            <PixelIcon name="smiley" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <h3 className="pixel-font text-sm text-[var(--retro-navy)] truncate">
                          {selectedConversation.other_participant.first_name} {selectedConversation.other_participant.last_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedConversation.other_participant.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <p className="text-[9px] uppercase font-bold text-[var(--retro-navy)] opacity-60">
                            {selectedConversation.other_participant.online ? "ACTIVE NOW" : "OFFLINE"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className={`pixel-btn px-3 py-1.5 hidden lg:flex items-center gap-2 ${showDetails ? 'bg-[var(--retro-yellow)]' : ''}`}
                    >
                      <span className="text-[10px]">INFO</span>
                    </button>
                    <button onClick={() => handleProfileClick(selectedConversation.other_participant.id)} className="pixel-btn px-3 py-1.5 flex items-center gap-2">
                      <span className="text-[10px]">VIEW</span>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 bg-white custom-scrollbar pattern-dots pb-20">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 select-none py-20">
                      <div className="animate-pulse">
                        <PixelIcon name="smiley" size={64} />
                      </div>
                      <p className="pixel-font text-sm mt-6 uppercase tracking-widest">No transmissions found</p>
                      <p className="pixel-font-body text-xs mt-2">Initialize conversation sequence...</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.sender_id === currentUserId;
                      const prevMsg = messages[idx - 1];
                      const nextMsg = messages[idx + 1];

                      const isFirstInGroup = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                      const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;

                      const showDate = isFirstInGroup && (!prevMsg || new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 30 * 60 * 1000);

                      return (
                        <div key={msg.id} className={`${isFirstInGroup ? 'mt-6' : 'mt-1'}`}>
                          {showDate && (
                            <div className="flex justify-center mb-6 mt-2">
                              <span className="bg-[var(--retro-cream)] border-2 border-[var(--retro-navy)] px-3 py-1 pixel-font text-[8px] uppercase opacity-70 shadow-[2px_2px_0_0_rgba(0,0,0,0.05)]">
                                {new Date(msg.created_at).toLocaleDateString()} at {formatTime(msg.created_at)}
                              </span>
                            </div>
                          )}
                          <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {/* Avatar logic: only show for last in group of other user */}
                            {!isMe && (
                              <div className="w-8 h-8 flex-shrink-0">
                                {isLastInGroup ? (
                                  <div className="w-8 h-8 border-2 border-[var(--retro-navy)] overflow-hidden bg-white shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                                    {selectedConversation.other_participant.avatar_url ? (
                                      <img src={selectedConversation.other_participant.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-[var(--retro-blue)] text-white">
                                        <PixelIcon name="smiley" size={16} />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-8" />
                                )}
                              </div>
                            )}

                            <div className={`group relative max-w-[75%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                              <div className={`
                                p-3 border-2 border-[var(--retro-navy)]
                                shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]
                                transition-transform active:scale-[0.98]
                                ${isMe
                                  ? 'bg-[var(--retro-navy)] text-white rounded-l-2xl'
                                  : 'bg-[var(--retro-white)] text-[var(--retro-navy)] rounded-r-2xl'
                                }
                                ${isMe && isFirstInGroup ? 'rounded-tr-2xl' : ''}
                                ${isMe && isLastInGroup ? 'rounded-br-none' : ''}
                                ${!isMe && isFirstInGroup ? 'rounded-tl-2xl' : ''}
                                ${!isMe && isLastInGroup ? 'rounded-bl-none' : ''}
                                ${!isFirstInGroup && !isLastInGroup && isMe ? 'rounded-r-md' : ''}
                                ${!isFirstInGroup && !isLastInGroup && !isMe ? 'rounded-l-md' : ''}
                              `}>
                                <p className="pixel-font-body text-sm leading-relaxed break-words">{msg.content}</p>
                              </div>

                              {/* Message Status/Time Overlay on hover */}
                              <div className={`
                                flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
                                ${isMe ? 'justify-end' : 'justify-start'}
                              `}>
                                <span className="text-[8px] uppercase font-bold text-[var(--retro-navy)] opacity-40">{formatTime(msg.created_at)}</span>
                                {isMe && isLastInGroup && (
                                  <div className="w-2 h-2 rounded-full bg-blue-400 border border-[var(--retro-navy)]"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t-4 border-[var(--retro-navy)] bg-[var(--retro-cream)] flex-shrink-0">
                  <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <div className="flex gap-1 mb-1 mr-1">
                      <button className="p-2 hover:bg-[var(--retro-white)] transition-colors opacity-50"><PixelIcon name="smiley" size={20} /></button>
                      <button className="p-2 hover:bg-[var(--retro-white)] transition-colors opacity-50 hidden sm:block"><PixelIcon name="smiley" size={20} /></button>
                    </div>
                    <div className="flex-1 relative">
                      <textarea
                        rows={1}
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        placeholder="Type a transmission..."
                        className="pixel-input w-full py-2.5 px-4 text-sm bg-white resize-none max-h-32 focus:ring-0"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                            (e.target as HTMLTextAreaElement).style.height = 'auto';
                          }
                        }}
                        disabled={sendingMessage}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="pixel-btn h-[46px] px-6 disabled:opacity-50 flex items-center gap-2 group shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                      <span className="hidden sm:inline font-bold">SEND</span>
                      <div className="group-hover:translate-x-1 transition-transform">
                        <PixelIcon name="smiley" size={18} />
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-[var(--retro-white)] pattern-dots opacity-40">
                <div className="w-32 h-32 border-4 border-[var(--retro-navy)] border-dashed flex items-center justify-center bg-[var(--retro-cream)]">
                  <PixelIcon name="smiley" size={48} />
                </div>
                <h3 className="pixel-font text-sm mt-6 uppercase">Encrypted Connection Ready</h3>
                <p className="pixel-font-body text-xs mt-2 text-center max-w-xs">
                  Select a transmission channel from the left to begin your conversation.
                </p>
              </div>
            )}
          </div>

          {/* 3. RIGHT SIDEBAR: Details (Desktop only) */}
          {selectedConversation && showDetails && (
            <div className="hidden lg:flex w-[300px] border-l-4 border-[var(--retro-navy)] flex-col bg-[var(--retro-white)] overflow-y-auto custom-scrollbar">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 border-4 border-[var(--retro-navy)] bg-white overflow-hidden shadow-[6px_6px_0_0_var(--retro-navy)] group cursor-pointer" onClick={() => handleProfileClick(selectedConversation.other_participant.id)}>
                    {selectedConversation.other_participant.avatar_url ? (
                      <img src={selectedConversation.other_participant.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--retro-blue)] text-white">
                        <PixelIcon name="smiley" size={56} />
                      </div>
                    )}
                  </div>
                  {selectedConversation.other_participant.online && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-[var(--retro-navy)] rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"></div>
                  )}
                </div>

                <h2 className="pixel-font text-base font-bold text-[var(--retro-navy)] mb-1">
                  {selectedConversation.other_participant.first_name} {selectedConversation.other_participant.last_name}
                </h2>
                <p className="text-[10px] uppercase font-bold text-[var(--retro-navy)] opacity-40 mb-8 tracking-widest">
                  {selectedConversation.other_participant.online ? "Connected" : "Signal Lost"}
                </p>

                <div className="w-full space-y-4">
                  <div className="bg-[var(--retro-cream)] p-4 border-2 border-[var(--retro-navy)] text-left shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                    <p className="pixel-font text-[10px] uppercase opacity-40 mb-2 border-b-2 border-[var(--retro-navy)] border-dashed pb-1">Status Report</p>
                    <p className="pixel-font-body text-xs font-bold text-[var(--retro-navy)]">
                      {selectedConversation.other_participant.online ? "🟢 ENCRYPTED CONNECTION" : "⚪ STANDBY MODE"}
                    </p>
                  </div>

                  <div className="bg-[var(--retro-cream)] p-4 border-2 border-[var(--retro-navy)] text-left shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                    <p className="pixel-font text-[10px] uppercase opacity-40 mb-2 border-b-2 border-[var(--retro-navy)] border-dashed pb-1">User Bio</p>
                    <p className="pixel-font-body text-xs italic text-[var(--retro-navy)] leading-relaxed">
                      "{selectedConversation.other_participant.bio || "No decryption available for bio..."}"
                    </p>
                  </div>

                  <div className="bg-[var(--retro-cream)] p-4 border-2 border-[var(--retro-navy)] text-left shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                    <p className="pixel-font text-[10px] uppercase opacity-40 mb-2 border-b-2 border-[var(--retro-navy)] border-dashed pb-1">Location Data</p>
                    <p className="pixel-font-body text-xs text-[var(--retro-navy)]">
                      {selectedConversation.other_participant.major || "Unknown Sector"}
                    </p>
                  </div>
                </div>

                <div className="w-full mt-10 space-y-3 pb-8">
                  <button
                    onClick={() => handleProfileClick(selectedConversation.other_participant.id)}
                    className="pixel-btn w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  >
                    ACCESS FULL PROFILE
                  </button>
                  <button className="pixel-btn pixel-btn-secondary w-full py-2.5 text-xs opacity-50 cursor-not-allowed">
                    SILENCE NOTIFICATIONS
                  </button>
                  <button className="pixel-btn pixel-btn-secondary w-full py-2.5 text-xs text-[var(--retro-red)] border-[var(--retro-red)] hover:bg-[var(--retro-red)] hover:text-white transition-colors">
                    TERMINATE CONNECTION
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {profileModalUserId && (
        <ProfileModal
          userId={profileModalUserId}
          onClose={() => setProfileModalUserId(null)}
        />
      )}
    </div>
  )
}
