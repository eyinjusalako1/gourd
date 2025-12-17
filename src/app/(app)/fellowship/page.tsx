'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useToast } from '@/components/ui/Toast'
import { FellowshipService } from '@/lib/fellowship-service'
import { FellowshipGroup } from '@/types'
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  Lock, 
  Globe, 
  Calendar,
  Filter,
  Heart,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { getGradientFromName } from '@/utils/gradient'

export default function FellowshipPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { isSteward } = useUserProfile()
  const toast = useToast()
  const [groups, setGroups] = useState<FellowshipGroup[]>([])
  const [userJoinedGroupIds, setUserJoinedGroupIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPrivacy, setFilterPrivacy] = useState<string>('all')
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null)

  useEffect(() => {
    loadGroups()
    loadUserMemberships()
  }, [user?.id])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const data = await FellowshipService.getGroups(user?.id)
      setGroups(data)
    } catch (error) {
      console.error('Error loading groups:', error)
      toast({
        title: 'Error',
        description: 'Failed to load groups. Please try again.',
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUserMemberships = async () => {
    if (!user?.id) {
      setUserJoinedGroupIds(new Set())
      return
    }

    try {
      const joinedGroups = await FellowshipService.getUserJoinedGroups(user.id)
      const groupIds = new Set(joinedGroups.map(g => g.id))
      setUserJoinedGroupIds(groupIds)
    } catch (error) {
      console.error('Error loading user memberships:', error)
      // Graceful fallback - assume no memberships
      setUserJoinedGroupIds(new Set())
    }
  }

  const filteredAndSortedGroups = useMemo(() => {
    let filtered = groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = filterType === 'all' || group.group_type === filterType
      const matchesPrivacy = filterPrivacy === 'all' || 
                            (filterPrivacy === 'public' && !group.is_private) ||
                            (filterPrivacy === 'private' && group.is_private)
      
      return matchesSearch && matchesType && matchesPrivacy
    })

    // Sort: user's groups first, then others
    filtered.sort((a, b) => {
      const aIsMember = userJoinedGroupIds.has(a.id)
      const bIsMember = userJoinedGroupIds.has(b.id)
      
      if (aIsMember && !bIsMember) return -1
      if (!aIsMember && bIsMember) return 1
      
      // If both are same membership status, sort by member count (descending)
      return (b.member_count || 0) - (a.member_count || 0)
    })

    return filtered
  }, [groups, searchTerm, filterType, filterPrivacy, userJoinedGroupIds])

  const handleJoinGroup = async (e: React.MouseEvent, group: FellowshipGroup) => {
    e.stopPropagation() // Prevent card click
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You must be signed in to join a group',
        variant: 'error',
      })
      return
    }

    setJoiningGroupId(group.id)
    try {
      if (group.is_private) {
        await FellowshipService.requestToJoinGroup(group.id, user.id)
        toast({
          title: 'Join request sent',
          description: 'Your request to join this group has been sent',
          variant: 'success',
        })
      } else {
        await FellowshipService.joinGroup(group.id, user.id)
        toast({
          title: 'Joined group',
          description: 'You have successfully joined this fellowship group',
          variant: 'success',
        })
        // Refresh both groups and memberships
        await Promise.all([loadGroups(), loadUserMemberships()])
      }
    } catch (error: any) {
      console.error('Error joining group:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to join group',
        variant: 'error',
      })
    } finally {
      setJoiningGroupId(null)
    }
  }

  const handleOpenGroup = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation()
    router.push(`/fellowship/${groupId}`)
  }

  const isUserMember = (groupId: string): boolean => {
    return userJoinedGroupIds.has(groupId)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-900 text-slate-50 flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading fellowship groups...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy-900 text-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Fellowship Groups</h1>
            <p className="mt-2 text-slate-400">
              Find and join Christian fellowship groups in your area
            </p>
          </div>
          
          {user && isSteward && (
            <button
              onClick={() => router.push('/fellowship/create')}
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 text-navy-900 px-4 py-2 text-sm font-semibold hover:bg-gold-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="w-full bg-navy-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-50 placeholder-slate-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="bible_study">Bible Study</option>
                <option value="prayer_group">Prayer Group</option>
                <option value="fellowship">Fellowship</option>
                <option value="youth_group">Youth Group</option>
                <option value="senior_group">Senior Group</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Privacy Filter */}
            <div>
              <select
                className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-slate-50 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-colors"
                value={filterPrivacy}
                onChange={(e) => setFilterPrivacy(e.target.value)}
              >
                <option value="all">All Groups</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        {filteredAndSortedGroups.length === 0 ? (
          <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">
              No groups found
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || filterType !== 'all' || filterPrivacy !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a fellowship group in your area!'
              }
            </p>
            {user && isSteward && (
              <button
                onClick={() => router.push('/fellowship/create')}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 text-navy-900 px-4 py-2 text-sm font-semibold hover:bg-gold-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Group
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGroups.map((group) => {
              const isMember = isUserMember(group.id)
              const isJoining = joiningGroupId === group.id
              
              return (
                <div
                  key={group.id}
                  className="bg-navy-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/30 hover:shadow-[0_0_20px_rgba(245,196,81,0.2)] transition-all cursor-pointer group"
                  onClick={() => router.push(`/fellowship/${group.id}`)}
                >
                  {/* Cover gradient */}
                  <div
                    className="h-24 w-full"
                    style={{ background: getGradientFromName(group.name) }}
                  />

                  {/* Card content */}
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-50 truncate group-hover:text-gold-500 transition-colors">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {group.is_private ? (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                              <Lock className="w-3 h-3" />
                              <span>Private</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                              <Globe className="w-3 h-3" />
                              <span>Public</span>
                            </span>
                          )}
                          {isMember && (
                            <span className="inline-flex items-center gap-1 text-xs text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded-full">
                              <span>Member</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {group.description}
                    </p>

                    {/* Location chip */}
                    {group.location && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-900/60 border border-white/10 rounded-full text-xs text-slate-300">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{group.location}</span>
                      </div>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {group.member_count || 0} {group.member_count === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                      {group.meeting_schedule && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span className="truncate max-w-[100px]">{group.meeting_schedule}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => isMember ? handleOpenGroup(e, group.id) : handleJoinGroup(e, group)}
                      disabled={isJoining}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                        isMember
                          ? 'border border-gold-600/40 text-gold-500 hover:bg-gold-500/10'
                          : 'bg-gold-500 text-navy-900 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isJoining ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          <span>Joining...</span>
                        </>
                      ) : isMember ? (
                        <>
                          <span>Open</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <span>{group.is_private ? 'Request to Join' : 'Join Group'}</span>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
