'use client'

import { useState } from 'react'
import { Plus, Video, Megaphone, BarChart3, Users, Settings, Crown } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
  onClick: () => void
}

interface LeaderDashboardProps {
  userRole: 'Leader' | 'Church Admin'
}

export default function LeaderDashboard({ userRole }: LeaderDashboardProps) {
  const [weeklyStats] = useState({
    attendance: 45,
    engagement: 78,
    newMembers: 3,
    eventsHosted: 2
  })

  const quickActions: QuickAction[] = [
    {
      id: 'create-event',
      label: 'Create Event',
      icon: Plus,
      description: 'Organize a new gathering',
      color: 'bg-blue-500',
      onClick: () => console.log('Create Event')
    },
    {
      id: 'go-live',
      label: 'Go Live',
      icon: Video,
      description: 'Start a live stream',
      color: 'bg-red-500',
      onClick: () => console.log('Go Live')
    },
    {
      id: 'announcement',
      label: 'Send Announcement',
      icon: Megaphone,
      description: 'Share with your community',
      color: 'bg-purple-500',
      onClick: () => console.log('Send Announcement')
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: BarChart3,
      description: 'Check engagement metrics',
      color: 'bg-green-500',
      onClick: () => console.log('View Analytics')
    },
    {
      id: 'manage-members',
      label: 'Manage Members',
      icon: Users,
      description: 'Oversee community members',
      color: 'bg-orange-500',
      onClick: () => console.log('Manage Members')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Configure your groups',
      color: 'bg-gray-500',
      onClick: () => console.log('Settings')
    }
  ]

  return (
    <div className="space-y-6">
      {/* Leader Header */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl p-4 text-navy-900">
        <div className="flex items-center space-x-3 mb-2">
          <Crown className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">
              {userRole === 'Church Admin' ? 'Church Admin Dashboard' : 'Leader Dashboard'}
            </h2>
            <p className="text-sm opacity-90">
              Manage your community and grow together in faith
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-navy-900 dark:text-white mb-3">
          This Week's Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900 dark:text-white">
              {weeklyStats.attendance}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Attendance
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900 dark:text-white">
              {weeklyStats.engagement}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Engagement Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900 dark:text-white">
              {weeklyStats.newMembers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              New Members
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900 dark:text-white">
              {weeklyStats.eventsHosted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Events Hosted
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(action => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-navy-900 dark:text-white text-sm">
                      {action.label}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Church Admin Specific Features */}
      {userRole === 'Church Admin' && (
        <div className="bg-gradient-to-br from-navy-50 to-beige-50 dark:from-navy-900 dark:to-beige-900 rounded-xl p-4">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-3">
            Church Administration
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 text-left hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-navy-900 dark:text-white">
                    Manage Church Page
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update church information and branding
                  </p>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            
            <button className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 text-left hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-navy-900 dark:text-white">
                    Church Analytics
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View church-wide engagement and growth
                  </p>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            
            <button className="w-full bg-white dark:bg-gray-800 rounded-lg p-3 text-left hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-navy-900 dark:text-white">
                    Manage Leaders
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assign and manage church leaders
                  </p>
                </div>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}






