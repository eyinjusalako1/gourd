'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { usePrefs } from '@/hooks/usePrefs'

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { userType, isLoading: prefsLoading } = usePrefs()

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return

    // If user is not logged in, redirect to login
    if (!user) {
      router.replace('/auth/login')
      return
    }

    // Wait for prefs to load
    if (prefsLoading) return

    // If user hasn't selected a role, redirect to onboarding
    if (!userType) {
      router.replace('/onboarding')
      return
    }

    // User is logged in and has selected a role, redirect to dashboard
    // Dashboard will handle checking profile_complete and redirecting if needed
    router.replace('/dashboard')
  }, [user, authLoading, userType, prefsLoading, router])

  // Show loading state while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-navy-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}