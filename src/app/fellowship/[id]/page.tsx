'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { FellowshipService } from '@/lib/fellowship-service'
import { FellowshipGroup, GroupMembership, JoinRequest } from '@/types'
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar, 
  Tag, 
  Lock, 
  Globe,
  Heart,
  BookOpen,
  Prayer,
  Settings,
  UserPlus,
  Check,
  X,
  MessageCircle
} from 'lucide-react'

export default function GroupDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [group, setGroup] = useState<FellowshipGroup | null>(null)
  const [members, setMembers] = useState<GroupMembership[]>([])
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [joinMessage, setJoinMessage] = useState('')
  const [showJoinModal, setShowJoinModal] = useState(false)

  useEffect(() => {
    loadGroupData()
  }, [params.id, user])

  const loadGroupData = async () => {
    try {
      const [groupData, membersData, requestsData] = await Promise.all([
        FellowshipService.getGroup(params.id),
        FellowshipService.getGroupMembers(params.id),
        FellowshipService.getPendingRequests(params.id)
      ])

      setGroup(groupData)
      setMembers(membersData)
      setPendingRequests(requestsData)

      if (user) {
        const [memberCheck, adminCheck] = await Promise.all([
          FellowshipService.isMember(params.id, user.id),
          FellowshipService.isAdmin(params.id, user.id)
        ])
        setIsMember(memberCheck)
        setIsAdmin(adminCheck)
      }
    } catch (error) {
      console.error('Error loading group data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    if (!user || !group) return

    try {
      if (group.is_private) {
        await FellowshipService.requestToJoinGroup(params.id, user.id, joinMessage)
        alert('Join request sent! The group admin will review your request.')
      } else {
        await FellowshipService.joinGroup(params.id, user.id)
        alert('Successfully joined the group!')
        loadGroupData() // Refresh data
      }
      setShowJoinModal(false)
      setJoinMessage('')
    } catch (error: any) {
      alert(error.message || 'Failed to join group')
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    if (!user) return

    try {
      await FellowshipService.approveJoinRequest(requestId, user.id)
      loadGroupData() // Refresh data
    } catch (error: any) {
      alert(error.message || 'Failed to approve request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    if (!user) return

    try {
      await FellowshipService.rejectJoinRequest(requestId, user.id)
      loadGroupData() // Refresh data
    } catch (error: any) {
      alert(error.message || 'Failed to reject request')
    }
  }

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'bible_study':
        return <BookOpen className="w-6 h-6" />
      case 'prayer_group':
        return <Prayer className="w-6 h-6" />
      default:
        return <Heart className="w-6 h-6" />
    }
  }

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'bible_study':
        return 'bg-gold-100 text-gold-600 dark:bg-gold-900 dark:text-gold-400'
      case 'prayer_group':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
      default:
        return 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading group details...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Group Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The group you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/fellowship')} className="btn-primary">
            Back to Groups
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getGroupTypeColor(group.group_type)}`}>
                  {getGroupTypeIcon(group.group_type)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      {group.is_private ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      <span>{group.is_private ? 'Private' : 'Public'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{group.member_count} members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Settings className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Group</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Group Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Group Details</h2>
              <div className="space-y-4">
                {group.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Location</div>
                      <div className="text-gray-600 dark:text-gray-400">{group.location}</div>
                    </div>
                  </div>
                )}

                {group.meeting_schedule && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Meeting Schedule</div>
                      <div className="text-gray-600 dark:text-gray-400">{group.meeting_schedule}</div>
                    </div>
                  </div>
                )}

                {group.meeting_location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Meeting Location</div>
                      <div className="text-gray-600 dark:text-gray-400">{group.meeting_location}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Members</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                      {group.max_members && ` (max ${group.max_members})`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {group.tags.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Group */}
            {user && !isMember && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Join This Group</h3>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{group.is_private ? 'Request to Join' : 'Join Group'}</span>
                </button>
              </div>
            )}

            {/* Members */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Members ({members.length})</h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {(member as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {(member as any).user?.user_metadata?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </div>
                    </div>
                  </div>
                ))}
                {members.length > 5 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center pt-2">
                    +{members.length - 5} more members
                  </div>
                )}
              </div>
            </div>

            {/* Pending Requests (Admin Only) */}
            {isAdmin && pendingRequests.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Pending Requests ({pendingRequests.length})
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {(request as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {(request as any).user?.user_metadata?.name || 'Unknown User'}
                          </div>
                        </div>
                      </div>
                      {request.message && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          "{request.message}"
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded flex items-center justify-center space-x-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded flex items-center justify-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {group.is_private ? 'Request to Join' : 'Join Group'}
            </h3>
            
            {group.is_private && (
              <div className="mb-4">
                <label htmlFor="join-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="join-message"
                  className="input-field"
                  rows={3}
                  placeholder="Tell the group admin why you'd like to join..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinGroup}
                className="flex-1 btn-primary"
              >
                {group.is_private ? 'Send Request' : 'Join Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


