'use client'

import { useAuth } from '@/lib/auth-context'
import { usePrefs } from '@/hooks/usePrefs'
import { useUnreadActivity } from '@/hooks/useUnreadActivity'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Settings, LogOut, Bell, Crown } from 'lucide-react'
import DiscipleHome from '@/components/DiscipleHome'
import StewardHome from '@/components/StewardHome'
import BottomNavigation from '@/components/BottomNavigation'
import OnboardingTutorial from '@/components/OnboardingTutorial'

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { userType, isLoading: prefsLoading } = usePrefs()
  const { hasUnread, clearUnread } = useUnreadActivity()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

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

  // Show loading state while auth or prefs are loading, or if userType is not yet determined
  if (authLoading || prefsLoading || !userType) {
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
              <Link 
                href="/settings/notifications" 
                onClick={clearUnread}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative"
              >
                <Bell className="w-5 h-5" />
                {/* Unread Activity Badge */}
                {hasUnread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-navy-800 animate-pulse"></div>
                )}
              </Link>
              <Link 
                href="/settings" 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Settings className="w-5 h-5" />
              </Link>
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
      <div className="max-w-md mx-auto px-4 py-6">
        {userType === 'Disciple' && <DiscipleHome />}
        {userType === 'Steward' && <StewardHome />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" onTabChange={handleTabChange} />

      {/* Onboarding Tutorial - shows automatically for new users */}
      <OnboardingTutorial />
    </div>
  )
}
