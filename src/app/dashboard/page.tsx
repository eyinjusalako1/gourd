'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Heart, Users, BookOpen, Calendar, Settings, LogOut } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // For demo purposes, let's show a dashboard even without authentication
  // In production, you'd want proper authentication
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show demo dashboard for now
  const displayUser = user || {
    email: 'demo@example.com',
    user_metadata: {
      name: 'Demo User',
      denomination: 'Christian',
      location: 'Your City'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {displayUser.user_metadata?.name || 'Friend'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fellowship Groups</h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Groups joined</p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gold-600 dark:text-gold-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bible Studies</h3>
            <p className="text-3xl font-bold text-gold-600 dark:text-gold-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Studies attended</p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Events</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Events joined</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity yet</p>
                <p className="text-sm">Start by joining a fellowship group!</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full btn-primary py-3">
                Find Fellowship Groups
              </button>
              <button className="w-full btn-secondary py-3">
                Join Bible Study
              </button>
              <button className="w-full btn-secondary py-3">
                Create Event
              </button>
              <button className="w-full btn-secondary py-3">
                Share Testimony
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <p className="text-gray-900 dark:text-white">{displayUser.user_metadata?.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <p className="text-gray-900 dark:text-white">{displayUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Denomination</label>
              <p className="text-gray-900 dark:text-white">{displayUser.user_metadata?.denomination || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <p className="text-gray-900 dark:text-white">{displayUser.user_metadata?.location || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

