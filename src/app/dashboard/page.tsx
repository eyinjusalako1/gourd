'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, LogOut, Bell, Crown } from 'lucide-react'
import VerseCard from '@/components/VerseCard'
import EventList from '@/components/EventList'
import FellowshipGroups from '@/components/FellowshipGroups'
import AnnouncementFeed from '@/components/AnnouncementFeed'
import StatsPanel from '@/components/StatsPanel'
import LeaderDashboard from '@/components/LeaderDashboard'
import BottomNavigation from '@/components/BottomNavigation'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<'Member' | 'Leader' | 'Church Admin'>('Member')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    
    // Determine user role from user metadata
    if (user?.user_metadata?.role) {
      setUserRole(user.user_metadata.role)
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleTabChange = (tab: string) => {
    // Handle navigation to different tabs
    switch (tab) {
      case 'events':
        router.push('/events')
        break
      case 'chat':
        router.push('/chat')
        break
      case 'fellowships':
        router.push('/fellowship')
        break
      case 'devotions':
        router.push('/devotions')
        break
      default:
        // Stay on dashboard
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-navy-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isLeader = userRole === 'Leader' || userRole === 'Church Admin'

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-navy-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-navy-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl">
                <Crown className="w-6 h-6 text-navy-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-900 dark:text-white">
                  Gathered
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {user.user_metadata?.name || 'Friend'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full"></div>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Section A: Spiritual Touchpoint */}
        <VerseCard />

        {/* Section B: Engagement & Community */}
        <div className="space-y-6">
          <EventList />
          <FellowshipGroups userRole={userRole} />
          <AnnouncementFeed />
        </div>

        {/* Section C: Growth & Analytics */}
        <StatsPanel />

        {/* Section D: Leader/Admin Features */}
        {isLeader && (
          <LeaderDashboard userRole={userRole} />
        )}

        {/* Monetization Integration Placeholder */}
        {userRole === 'Member' && (
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl p-4 text-navy-900">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Upgrade to Gathered+</h3>
              <p className="text-sm mb-4 opacity-90">
                Host your own fellowship groups and unlock advanced features
              </p>
              <button className="bg-white text-navy-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" onTabChange={handleTabChange} />
    </div>
  )
}
