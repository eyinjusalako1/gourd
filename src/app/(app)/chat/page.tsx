'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { FellowshipService } from '@/lib/fellowship-service'
import { FellowshipGroup } from '@/types'
import { MessageCircle, Users, Loader2, MapPin } from 'lucide-react'
import { getGradientFromName } from '@/utils/gradient'

export default function ChatPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [groups, setGroups] = useState<FellowshipGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadGroups()
    }
  }, [user?.id])

  const loadGroups = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const userGroups = await FellowshipService.getUserJoinedGroups(user.id)
      setGroups(userGroups)
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-50 mb-2">Chats</h1>
          <p className="text-slate-400">Group conversations</p>
        </div>

        {/* Groups List */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-navy-800/40 border border-gold-500/20 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-gold-500/50" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">No groups yet</h3>
            <p className="text-slate-400 text-sm text-center max-w-sm mb-6">
              Join a fellowship group to start chatting with members.
            </p>
            <button
              onClick={() => router.push('/fellowship')}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg font-medium transition-colors"
            >
              Browse Groups
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => router.push(`/chat/${group.id}`)}
                className="w-full bg-navy-800/30 border border-white/10 rounded-xl p-4 hover:border-gold-500/30 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  {/* Group Avatar with gradient */}
                  <div className={`w-12 h-12 rounded-xl ${getGradientFromName(group.name)} flex items-center justify-center text-lg font-bold text-slate-50 flex-shrink-0`}>
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-50 truncate">{group.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      {group.location && (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{group.location}</span>
                        </>
                      )}
                      {group.member_count > 0 && (
                        <>
                          <span>•</span>
                          <Users className="w-3 h-3" />
                          <span>{group.member_count} members</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

