'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/Toast'
import { FellowshipService } from '@/lib/fellowship-service'
import { FellowshipGroup, GroupChatMessage } from '@/types'
import { supabase } from '@/lib/supabase'
import BackButton from '@/components/BackButton'
import { Send, Users, Loader2, BookOpen, ArrowRight } from 'lucide-react'
// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name[0].toUpperCase()
}

interface GroupChatPageProps {
  params: Promise<{ groupId: string }> | { groupId: string }
}

export default function GroupChatPage({ params }: GroupChatPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const toast = useToast()
  const [groupId, setGroupId] = useState<string>('')
  const [group, setGroup] = useState<FellowshipGroup | null>(null)
  const [messages, setMessages] = useState<GroupChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = params instanceof Promise ? await params : params
        const id = resolvedParams?.groupId || ''
        setGroupId(id)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }
    resolveParams()
  }, [params])

  // Load group and messages
  useEffect(() => {
    if (groupId) {
      loadGroup()
      loadMessages()
      // Start polling for new messages every 5 seconds
      pollIntervalRef.current = setInterval(() => {
        loadMessages(false) // Silent refresh
      }, 5000)
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [groupId])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadGroup = async () => {
    if (!groupId) return
    try {
      const groupData = await FellowshipService.getGroup(groupId)
      setGroup(groupData)
    } catch (error) {
      console.error('Error loading group:', error)
      toast({
        title: 'Error',
        description: 'Failed to load group information.',
        variant: 'error',
        duration: 3000,
      })
    }
  }

  const loadMessages = async (showLoading = true) => {
    if (!groupId || !user?.id) return
    try {
      if (showLoading) setLoading(true)
      // Get session to include access token
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/chat/group/${groupId}`, {
        headers: {
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
        },
      })
      
      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: 'Access Denied',
            description: 'You must be a member of this group to view messages.',
            variant: 'error',
            duration: 3000,
          })
          router.push('/chat')
          return
        }
        throw new Error('Failed to load messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
      if (showLoading) {
        toast({
          title: 'Error',
          description: 'Failed to load messages.',
          variant: 'error',
          duration: 3000,
        })
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !groupId || sending || !user?.id) return

    setSending(true)
    try {
      // Get session to include access token
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/chat/group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
        },
        body: JSON.stringify({
          content: messageInput.trim(),
          type: 'text',
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: 'Access Denied',
            description: 'You must be a member of this group to send messages.',
            variant: 'error',
            duration: 3000,
          })
          return
        }
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      setMessages(prev => [...prev, data.message])
      setMessageInput('')
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom()
        // Refresh messages to get latest
        loadMessages(false)
      }, 100)
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'error',
        duration: 3000,
      })
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const isMyMessage = (message: GroupChatMessage) => {
    return message.user_id === user?.id
  }

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-navy-800/50 border-b border-white/10 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-slate-50 transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-50">{group?.name || 'Group Chat'}</h1>
              {group && (
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Users className="w-3 h-3" />
                  <span>{group.member_count} members</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-navy-800/40 border border-gold-500/20 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-gold-500/50" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Start the conversation</h3>
              <p className="text-slate-400 text-sm text-center max-w-sm mb-4">
                Be the first to share a message with your group!
              </p>
              <button
                onClick={() => router.push('/devotions')}
                className="flex items-center space-x-2 bg-gold-500/10 border border-gold-600/40 text-gold-500 hover:bg-gold-500/20 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Share today&apos;s devotion</span>
              </button>
            </div>
          ) : (
            messages.map((message) => {
              const isMine = isMyMessage(message)
              const isDevotionShare = message.type === 'devotion_share'

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex items-end space-x-2 max-w-[75%] ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar - only for other users */}
                    {!isMine && (
                      <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 mb-1">
                        {message.user.avatar_url ? (
                          <img
                            src={message.user.avatar_url}
                            alt={message.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gold-500">
                            {getInitials(message.user.name)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="flex flex-col">
                      {isDevotionShare ? (
                        // Devotion Share Card
                        <div className="bg-navy-800/40 border border-gold-600/30 rounded-xl p-4 space-y-3 max-w-md">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-gold-500" />
                            <h4 className="text-sm font-semibold text-slate-50">📖 Devotion shared</h4>
                          </div>
                          
                          {message.metadata?.passageRef && (
                            <div className="bg-navy-900/60 rounded-lg p-3 border border-white/5">
                              <p className="text-sm font-medium text-gold-500 mb-1">
                                {message.metadata.passageRef}
                              </p>
                            </div>
                          )}
                          
                          {message.metadata?.reflection && (
                            <div className="bg-navy-900/60 rounded-lg p-3 border border-white/5">
                              <p className="text-xs text-slate-400 mb-1">Reflection:</p>
                              <p className="text-sm text-slate-200 whitespace-pre-wrap line-clamp-3">
                                {message.metadata.reflection}
                              </p>
                            </div>
                          )}
                          
                          {!message.metadata?.passageRef && (
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                          
                          <button
                            onClick={() => router.push('/devotions')}
                            className="w-full flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-navy-900 px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <span>Open Devotions</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        // Regular Message Bubble
                        <div className={`rounded-2xl px-4 py-3 ${
                          isMine
                            ? 'bg-navy-900/60 border border-gold-600/30 text-slate-50'
                            : 'bg-navy-900/40 border border-white/10 text-slate-50'
                        }`}>
                          {!isMine && (
                            <div className="text-xs font-semibold mb-1.5 text-gold-500">
                              {message.user.name}
                            </div>
                          )}
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-1 px-1 ${isMine ? 'text-right' : 'text-left'} text-slate-400/60`}>
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Sticky at bottom */}
      <div className="bg-navy-800/50 border-t border-white/10 px-4 py-3 fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-navy-900/60 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="bg-gold-500 hover:bg-gold-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-navy-900 p-2 rounded-lg transition-colors"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

