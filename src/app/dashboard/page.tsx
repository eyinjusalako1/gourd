'use client'

// Gathered Dashboard - Youth Fellowship Focus

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Settings, Bell } from 'lucide-react'
import FeedbackModal from '@/components/FeedbackModal'
import Logo from '@/components/Logo'
import BottomNavigation from '@/components/BottomNavigation'
import OnboardingFlow from '@/components/OnboardingFlow'
import UserTypeSelector from '@/components/UserTypeSelector'
import DiscipleHome from '@/components/dashboard/DiscipleHome'
import StewardHome from '@/components/dashboard/StewardHome'
import { buildSuggestions } from '@/lib/prefs'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useNotificationPlanner } from '@/hooks/useNotificationPlanner'
import { useToast } from '@/components/ui/Toast'

export default function DashboardPage() {
  const { user, signOut, loading, setMockUserType } = useAuth()
  const { profile, updateProfile } = useUserProfile()
  const router = useRouter()
  const toast = useToast()
  const [userRole, setUserRole] = useState<'Member' | 'Leader' | 'Church Admin'>('Member')
  const [userType, setUserType] = useState<'individual' | 'leader' | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  useEffect(() => {
    if (user?.user_metadata && 'role' in user.user_metadata) {
      setUserRole((user.user_metadata as any).role)
    }

    const savedUserType = localStorage.getItem('gathered_user_type')
    if (savedUserType) {
      setUserType(savedUserType as 'individual' | 'leader')
    } else {
      setShowOnboarding(true)
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile?.role) {
      const inferred = profile.role === 'steward' ? 'leader' : 'individual'
      setUserType(inferred)
    }
  }, [profile])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleOnboardingComplete = (type: 'individual' | 'leader') => {
    setUserType(type)
    setShowOnboarding(false)
    localStorage.setItem('gathered_user_type', type)
    setMockUserType(type)
  }

  const handleUserTypeChange = useCallback((type: 'individual' | 'leader') => {
    // Close modal immediately
    setShowUserTypeSelector(false)
    
    // Update user type state
    setUserType(type)
    setMockUserType(type)
    
    // Save to localStorage for persistence
    localStorage.setItem('gathered_user_type', type)
    
    // Show success toast
    toast({
      title: 'Role updated',
      variant: 'success',
      duration: 2000,
    })
    
    // Smooth transition - the state update will trigger re-render
    // Using requestAnimationFrame to ensure smooth visual transition
    requestAnimationFrame(() => {
      // Scroll to top smoothly to prevent layout shift
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [toast, setMockUserType])

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'profile':
        router.push('/profile')
        break
      case 'events':
        router.push('/events')
        break
      case 'chat':
        router.push('/chat')
        break
      case 'fellowships':
        router.push('/fellowships')
        break
      default:
        break
    }
  }

  const suggestions = useMemo(() => {
    if (!profile) return []
    const enabled = profile.personalization_enabled?.suggestions ?? true
    return enabled ? buildSuggestions(profile) : []
  }, [profile])

  const handleDismissSuggestion = useCallback(
    async (id: string) => {
      if (!profile) return
      const dismissed = new Set(profile.dismissed_suggestions ?? [])
      if (dismissed.has(id)) return
      dismissed.add(id)
      await updateProfile({ dismissed_suggestions: Array.from(dismissed) })
    },
    [profile, updateProfile]
  )

  const handleMuteSuggestionType = useCallback(
    async (type: string) => {
      if (!profile) return
      const dismissed = new Set(profile.dismissed_suggestions ?? [])
      const key = `type:${type}`
      if (dismissed.has(key)) return
      dismissed.add(key)
      await updateProfile({ dismissed_suggestions: Array.from(dismissed) })
    },
    [profile, updateProfile]
  )

  useNotificationPlanner(profile ?? null)

  const displayUser = user ?? {
    id: 'demo',
    email: 'demo@gathered.com',
    user_metadata: {
      name: profile?.name || 'Demo User',
      role: 'Member'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1433]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5C451] mx-auto"></div>
          <p className="mt-4 text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className={`${userType === 'leader' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433]' : 'bg-[#0F1433]'} shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40`}>
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Logo size="md" showText={false} />
              <div>
                <h1 className={`text-xl font-bold ${userType === 'leader' ? 'text-[#0F1433]' : 'text-white'}`}>
                  Gathered
                </h1>
                <p className={`text-sm ${userType === 'leader' ? 'text-[#0F1433]/80' : 'text-white/80'}`}>
                  {userType === 'individual' 
                    ? `Welcome back, ${displayUser.user_metadata?.name || 'Disciple'}! Ready to find fellowship?`
                    : `Welcome back, ${displayUser.user_metadata?.name || 'Steward'}! Ready to steward your community?`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className={`p-2 ${userType === 'leader' ? 'text-[#0F1433]/60 hover:text-[#0F1433]' : 'text-white/60 hover:text-white'} relative`}>
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F5C451] rounded-full"></div>
              </button>
              <button
                onClick={() => setShowUserTypeSelector(true)}
                className={`p-2 ${userType === 'leader' ? 'text-[#0F1433]/60 hover:text-[#0F1433]' : 'text-white/60 hover:text-white'}`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto">
        {/* Use key prop to force smooth remount on role change, preventing layout shift */}
        {userType === 'leader' && profile && (
          <StewardHome
            key="steward-home"
            profile={profile}
            suggestions={suggestions}
            onDismissSuggestion={handleDismissSuggestion}
            onMuteType={handleMuteSuggestionType}
          />
        )}

        {userType === 'individual' && profile && (
          <DiscipleHome
            key="disciple-home"
            userId={user?.id || 'demo'}
            profile={profile}
            suggestions={suggestions}
            onDismissSuggestion={handleDismissSuggestion}
            onMuteType={handleMuteSuggestionType}
          />
        )}
      </div>

      <BottomNavigation activeTab="home" onTabChange={handleTabChange} />

      {showUserTypeSelector && userType && (
        <UserTypeSelector
          currentType={userType}
          onTypeChange={handleUserTypeChange}
          onClose={() => setShowUserTypeSelector(false)}
        />
      )}

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}
