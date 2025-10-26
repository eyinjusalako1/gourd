'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Logo from '@/components/Logo'
import { 
  ArrowLeft, 
  Send, 
  Smile,
  Paperclip,
  Image,
  Users,
  MoreVertical
} from 'lucide-react'

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  isOwnMessage: boolean
  avatar?: string
}

export default function FellowshipChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      content: 'Looking forward to our next meeting!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isOwnMessage: false
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      content: 'Same here! Let\'s discuss chapter 3 this week.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      isOwnMessage: false
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fellowshipName = 'Young Adults Bible Study'

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.user_metadata?.name || 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwnMessage: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <Logo size="sm" showText={false} />
              <div>
                <h1 className="text-lg font-bold text-white">{fellowshipName}</h1>
                <p className="text-sm text-white/60">Group Chat</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-white/60 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/60 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-[80%]`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${message.isOwnMessage ? 'bg-[#F5C451] text-[#0F1433]' : 'bg-white/20 text-white'}`}>
                  {getInitials(message.userName)}
                </div>
                
                {/* Message Content */}
                <div className={`flex flex-col ${message.isOwnMessage ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-lg px-3 py-2 ${message.isOwnMessage ? 'bg-[#F5C451] text-[#0F1433]' : 'bg-white/5 text-white'}`}>
                    {!message.isOwnMessage && (
                      <div className="text-xs font-semibold mb-1 opacity-70">{message.userName}</div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className="text-xs text-white/40 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-[#0F1433] border-t border-[#D4AF37]/30 sticky bottom-0">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-end space-x-2">
            {/* Attachment Button */}
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            
            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  setIsTyping(e.target.value.length > 0)
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 pr-10 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none max-h-32"
                rows={1}
              />
            </div>
            
            {/* Emoji Button */}
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-lg transition-colors ${newMessage.trim() ? 'bg-[#F5C451] text-[#0F1433] hover:bg-[#D4AF37]' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

