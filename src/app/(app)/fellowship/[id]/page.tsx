'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import AppHeader from '@/components/AppHeader'
import { FellowshipService } from '@/lib/fellowship-service'
import { FellowshipGroup, GroupMembership } from '@/types'
import { 
  Users, 
  MapPin, 
  Calendar, 
  Lock, 
  Globe, 
  MessageCircle,
  Settings,
  UserPlus,
  BookOpen,
  Sparkles,
  Heart
} from 'lucide-react'

export default function FellowshipDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [group, setGroup] = useState<FellowshipGroup | null>(null)
  const [memberships, setMemberships] = useState<GroupMembership[]>([])
  const [isMember, setIsMember] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    loadGroupData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user])

  const loadGroupData = async () => {
    try {
      const groupData = await FellowshipService.getGroup(params.id)
      let membershipsData: GroupMembership[] = []
      
      if (groupData) {
        try {
          membershipsData = await FellowshipService.getGroupMembers(params.id)
        } catch (error) {
          console.error('Error loading members:', error)
        }
      }

      setGroup(groupData)
      setMemberships(membershipsData || [])

      if (user) {
        const userMembership = membershipsData?.find(m => m.user_id === user.id)
        setIsMember(!!userMembership)
        setIsAdmin(userMembership?.role === 'admin')
      }
    } catch (error: any) {
      console.error('Error loading group:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load group',
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!user || !group) return

    setJoining(true)
    try {
      if (group.is_private) {
        await FellowshipService.requestToJoinGroup(params.id, user.id)
        toast({
          title: 'Join request sent',
          description: 'Your request to join this group has been sent to the group admin',
          variant: 'success',
        })
      } else {
        await FellowshipService.joinGroup(params.id, user.id)
        toast({
          title: 'Joined group',
          description: 'You have successfully joined this fellowship group',
          variant: 'success',
        })
        await loadGroupData()
      }
    } catch (error: any) {
      console.error('Error joining group:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to join group',
        variant: 'error',
      })
    } finally {
      setJoining(false)
    }
  }

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'bible_study':
        return <BookOpen className="w-5 h-5" />
      case 'prayer_group':
        return <Sparkles className="w-5 h-5" />
      default:
        return <Heart className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading group...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Group Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The group you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button onClick={() => router.push('/fellowship')} className="btn-primary">
            Back to Groups
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <AppHeader 
        title={group.name}
        backHref="/fellowship"
        rightSlot={
          isAdmin && (
            <button
              onClick={() => router.push(`/fellowships/${group.id}/manage`)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Group Header */}
        <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
              {getGroupTypeIcon(group.group_type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
                {group.is_private ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  <Globe className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{group.description}</p>
            </div>
          </div>

          {/* Group Info */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {group.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{group.location}</span>
              </div>
            )}
            {group.meeting_schedule && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{group.meeting_schedule}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>
                {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                {group.max_members && ` / ${group.max_members} max`}
              </span>
            </div>
          </div>
        </div>

        {/* Join Button */}
        {user && !isMember && (
          <div className="bg-white dark:bg-navy-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {joining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>{group.is_private ? 'Request to Join' : 'Join Group'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Members */}
        {memberships.length > 0 && (
          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Members ({memberships.length})
            </h2>
            <div className="space-y-3">
              {memberships.slice(0, 10).map((membership) => (
                <div key={membership.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(membership as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {(membership as any).user?.user_metadata?.name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {membership.role === 'admin' ? 'Admin' : 'Member'}
                    </div>
                  </div>
                </div>
              ))}
              {memberships.length > 10 && (
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center pt-2">
                  +{memberships.length - 10} more members
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Button */}
        {isMember && (
          <button
            onClick={() => router.push(`/fellowships/${group.id}/chat`)}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open Group Chat</span>
          </button>
        )}
      </div>
    </>
  )
}

