'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Users } from 'lucide-react'
import AppHeader from '@/components/AppHeader'

export default function ChatPage() {
  const router = useRouter()

  // Mock fellowship with chat
  const fellowships = [
    {
      id: '1',
      name: 'Young Adults Bible Study',
      lastMessage: 'Let\'s discuss chapter 3 this week.',
      lastMessageTime: '2h ago',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Women\'s Prayer Circle',
      lastMessage: 'Prayer meeting this Wednesday',
      lastMessageTime: '1d ago',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Men\'s Accountability Group',
      lastMessage: 'Great discussion last week!',
      lastMessageTime: '3d ago',
      unreadCount: 5
    }
  ]

  return (
    <>
      <AppHeader title="Chats" backHref="/dashboard" />

      {/* Fellowship Chats List */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        {fellowships.map(fellowship => (
          <button
            key={fellowship.id}
            onClick={() => router.push(`/fellowships/${fellowship.id}/chat`)}
            className="w-full bg-white/5 border border-[#D4AF37] rounded-2xl p-4 relative overflow-hidden hover:bg-white/10 transition-colors text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-12 h-12 bg-[#F5C451] rounded-full flex items-center justify-center text-lg font-bold text-[#0F1433]">
                {fellowship.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">{fellowship.name}</h3>
                  {fellowship.unreadCount > 0 && (
                    <div className="bg-[#F5C451] text-[#0F1433] text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                      {fellowship.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80 truncate">{fellowship.lastMessage}</p>
                  <span className="text-xs text-white/60 ml-2">{fellowship.lastMessageTime}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State for No Chats */}
      {fellowships.length === 0 && (
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <MessageCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No chats yet</h3>
          <p className="text-white/80 mb-6">Join a fellowship to start chatting!</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#F5C451] text-[#0F1433] px-6 py-3 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
          >
            Browse Fellowships
          </button>
        </div>
      )}
    </>
  )
}

