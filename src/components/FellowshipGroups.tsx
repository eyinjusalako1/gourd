'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Users, MessageCircle, Plus, Settings, Crown } from 'lucide-react'

interface Fellowship {
  id: string
  name: string
  description: string
  memberCount: number
  unreadMessages: number
  isLeader: boolean
  lastActivity: string
  category: string
}

const sampleFellowships: Fellowship[] = [
  {
    id: '1',
    name: 'Young Adults Bible Study',
    description: 'Weekly study for ages 18-30',
    memberCount: 24,
    unreadMessages: 3,
    isLeader: false,
    lastActivity: '2 hours ago',
    category: 'Bible Study'
  },
  {
    id: '2',
    name: 'Prayer Warriors',
    description: 'Daily prayer and intercession group',
    memberCount: 15,
    unreadMessages: 0,
    isLeader: true,
    lastActivity: '1 day ago',
    category: 'Prayer'
  },
  {
    id: '3',
    name: 'Community Outreach',
    description: 'Serving our local community together',
    memberCount: 32,
    unreadMessages: 7,
    isLeader: false,
    lastActivity: '30 minutes ago',
    category: 'Outreach'
  },
  {
    id: '4',
    name: 'Women\'s Fellowship',
    description: 'Support and encouragement for women',
    memberCount: 18,
    unreadMessages: 1,
    isLeader: false,
    lastActivity: '4 hours ago',
    category: 'Fellowship'
  }
]

export default function FellowshipGroups({ userRole = 'Member' }: { userRole?: 'Member' | 'Leader' | 'Church Admin' }) {
  const router = useRouter()
  const { isSteward } = useUserProfile()
  const [fellowships, setFellowships] = useState<Fellowship[]>(sampleFellowships)

  // Only stewards can create groups
  const canCreateGroup = isSteward

  const handleJoinGroup = (groupId: string) => {
    // Navigate to group details or join logic
    console.log('Joining group:', groupId)
  }

  const handleCreateGroup = () => {
    router.push('/fellowship/create')
  }

  const handleManageGroup = (groupId: string) => {
    // Navigate to group management
    console.log('Managing group:', groupId)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
          My Fellowships
        </h2>
        {canCreateGroup && (
          <button
            onClick={handleCreateGroup}
            className="flex items-center space-x-2 px-3 py-2 bg-[#F5C451] text-navy-900 rounded-lg hover:bg-[#D4AF37] transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Create Group</span>
          </button>
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4">
        {fellowships.map(fellowship => (
          <div key={fellowship.id} className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-navy-900 dark:text-white">
                    {fellowship.name}
                  </h3>
                  {fellowship.isLeader && (
                    <Crown className="w-4 h-4 text-[#F5C451]" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {fellowship.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{fellowship.memberCount} members</span>
                  </span>
                  <span>Last activity: {fellowship.lastActivity}</span>
                </div>
              </div>
              
              {/* Unread Messages Badge */}
              {fellowship.unreadMessages > 0 && (
                <div className="bg-[#F5C451] text-navy-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {fellowship.unreadMessages}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleJoinGroup(fellowship.id)}
                className="flex-1 py-2 px-3 bg-[#F5C451] text-navy-900 rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors"
              >
                View Group
              </button>
              
              <button
                onClick={() => handleJoinGroup(fellowship.id)}
                className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              
              {fellowship.isLeader && (
                <button
                  onClick={() => handleManageGroup(fellowship.id)}
                  className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {fellowships.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-2">No fellowship groups yet</p>
          <p className="text-sm">Join a group or create your own to get started!</p>
          {canCreateGroup && (
            <button
              onClick={handleCreateGroup}
              className="mt-4 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-medium hover:bg-gold-400 transition-colors"
            >
              Create Your First Group
            </button>
          )}
        </div>
      )}

      {/* Quick Join Suggestions */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-white/5 backdrop-blur-sm">
        <h3 className="font-medium text-navy-900 dark:text-white mb-2">
          Suggested Groups
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Discover groups in your area
        </p>
        <button className="w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
          Browse All Groups
        </button>
      </div>
    </div>
  )
}







