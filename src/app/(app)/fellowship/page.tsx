'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'
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
  Sparkles
} from 'lucide-react'

export default function FellowshipPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { isSteward } = useUserProfile()
  const [groups, setGroups] = useState<FellowshipGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPrivacy, setFilterPrivacy] = useState<string>('all')

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const data = await FellowshipService.getGroups(user?.id)
      setGroups(data)
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || group.group_type === filterType
    const matchesPrivacy = filterPrivacy === 'all' || 
                          (filterPrivacy === 'public' && !group.is_private) ||
                          (filterPrivacy === 'private' && group.is_private)
    
    return matchesSearch && matchesType && matchesPrivacy
  })

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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading fellowship groups...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fellowship Groups</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Find and join Christian fellowship groups in your area
              </p>
            </div>
            
            {user && isSteward && (
              <button
                onClick={() => router.push('/fellowship/create')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Group</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                className="input-field"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="bible_study">Bible Study</option>
                <option value="prayer_group">Sparkles Group</option>
                <option value="fellowship">Fellowship</option>
                <option value="youth_group">Youth Group</option>
                <option value="senior_group">Senior Group</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Privacy Filter */}
            <div>
              <select
                className="input-field"
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
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No groups found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterType !== 'all' || filterPrivacy !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a fellowship group in your area!'
              }
            </p>
            {user && isSteward && (
              <button
                onClick={() => router.push('/fellowship/create')}
                className="btn-primary"
              >
                Create First Group
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => router.push(`/fellowship/${group.id}`)}>
                {/* Group Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getGroupTypeColor(group.group_type)}`}>
                      {getGroupTypeIcon(group.group_type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        {group.is_private ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                        <span>{group.is_private ? 'Private' : 'Public'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {group.description}
                </p>

                {/* Location */}
                {group.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{group.location}</span>
                  </div>
                )}

                {/* Meeting Schedule */}
                {group.meeting_schedule && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{group.meeting_schedule}</span>
                  </div>
                )}

                {/* Member Count */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Users className="w-4 h-4" />
                  <span>
                    {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                    {group.max_members && ` / ${group.max_members} max`}
                  </span>
                </div>

                {/* Tags */}
                {group.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {group.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        +{group.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full btn-primary">
                  {group.is_private ? 'Request to Join' : 'Join Group'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}








