'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { usePrefs } from '@/hooks/usePrefs'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUnreadActivity } from '@/hooks/useUnreadActivity'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Settings, LogOut, Bell, Crown } from 'lucide-react'
import DiscipleHome from '@/components/DiscipleHome'
import StewardHome from '@/components/StewardHome'
import OnboardingTutorial from '@/components/OnboardingTutorial'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { userType, isLoading: prefsLoading } = usePrefs()
  const { profile, isLoading: profileLoading } = useUserProfile()
  const { hasUnread, clearUnread } = useUnreadActivity()
  const router = useRouter()

  // Check if user needs to complete onboarding (profile not complete)
  useEffect(() => {
    if (!prefsLoading && userType && !profileLoading && profile) {
      // If profile exists but is not complete, redirect to onboarding
      if (!profile.profile_complete) {
        router.replace('/onboarding/ej-onboarding')
      }
    }
  }, [prefsLoading, userType, profileLoading, profile, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading state while prefs are loading, or if userType is not yet determined
  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (prefsLoading || !userType) {
      const timeout = setTimeout(() => {
        // If still loading after 10 seconds, redirect to onboarding
        if (prefsLoading || !userType) {
          console.warn('Dashboard loading timeout - redirecting to onboarding')
          router.replace('/onboarding')
        }
      }, 10000) // 10 second timeout

      return () => clearTimeout(timeout)
    }
  }, [prefsLoading, userType, router])

  if (prefsLoading || !userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">If this takes too long, we&apos;ll redirect you</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-navy-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#F5C451] to-[#D4AF37] rounded-xl">
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
      <div className="max-w-2xl mx-auto px-4 py-6">
        {userType === 'Disciple' && <DiscipleHome />}
        {userType === 'Steward' && <StewardHome />}
      </div>

      {/* Onboarding Tutorial - shows automatically for new users */}
      <OnboardingTutorial />
    </>
  )
}

