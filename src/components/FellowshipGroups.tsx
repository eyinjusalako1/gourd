'use client'

import { useState } from 'react'
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
  const [fellowships, setFellowships] = useState<Fellowship[]>(sampleFellowships)

  const canCreateGroup = userRole === 'Leader' || userRole === 'Church Admin'

  const handleJoinGroup = (groupId: string) => {
    // Navigate to group details or join logic
    console.log('Joining group:', groupId)
  }

  const handleCreateGroup = () => {
    // Navigate to create group page
    console.log('Creating new group')
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
            className="flex items-center space-x-2 px-3 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Create Group</span>
          </button>
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4">
        {fellowships.map(fellowship => (
          <div key={fellowship.id} className="bg-[#0F1433] border border-[#F5C451] rounded-2xl p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200 hover:bg-[#0F1433]/90 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center space-x-4 flex-1 relative z-10">
              {/* Group Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F5C451] rounded-full flex items-center justify-center relative">
                <Users className="w-6 h-6 text-[#0F1433]" />
                {fellowship.isLeader && (
                  <Crown className="absolute -top-1 -right-1 w-4 h-4 text-[#F5C451]" />
                )}
              </div>
              
              {/* Group Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-white text-lg">
                    {fellowship.name}
                  </h3>
                  {fellowship.unreadMessages > 0 && (
                    <div className="bg-[#F5C451] text-[#0F1433] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {fellowship.unreadMessages}
                    </div>
                  )}
                </div>
                <p className="text-sm text-white/80 mb-2">
                  {fellowship.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-white/60">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-[#F5C451]" />
                    <span>{fellowship.memberCount} members</span>
                  </span>
                  <span>Last activity: {fellowship.lastActivity}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 relative z-10">
              <button
                onClick={() => handleJoinGroup(fellowship.id)}
                className="px-4 py-2 bg-[#F5C451] text-[#0F1433] rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {fellowship.isLeader ? 'Manage' : 'Join'}
              </button>
              
              <button
                onClick={() => handleJoinGroup(fellowship.id)}
                className="flex items-center justify-center p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-[#F5C451]/50"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
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
      <div className="bg-beige-100 dark:bg-beige-800 rounded-xl p-4">
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

