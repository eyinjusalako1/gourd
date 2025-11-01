'use client'

// Gathered Dashboard - Youth Fellowship Focus

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, Bell } from 'lucide-react'
import FeedbackModal from '@/components/FeedbackModal'
import Logo from '@/components/Logo'
import VerseCard from '@/components/VerseCard'
import LeaderDashboard from '@/components/LeaderDashboard'
import BottomNavigation from '@/components/BottomNavigation'
import OnboardingFlow from '@/components/OnboardingFlow'
import UserTypeSelector from '@/components/UserTypeSelector'
import FellowshipActivityFeed from '@/components/FellowshipActivityFeed'
import UpcomingEvents from '@/components/UpcomingEvents'
import QuickActions from '@/components/QuickActions'
import CommunityHighlight from '@/components/CommunityHighlight'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<'Member' | 'Leader' | 'Church Admin'>('Member')
  const [userType, setUserType] = useState<'individual' | 'leader' | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  useEffect(() => {
    // Determine user role from user metadata
    if (user?.user_metadata && 'role' in user.user_metadata) {
      setUserRole((user.user_metadata as any).role)
    }
    
    // Check if user has completed onboarding
    const savedUserType = localStorage.getItem('gathered_user_type')
    if (savedUserType) {
      setUserType(savedUserType as 'individual' | 'leader')
    } else {
      setShowOnboarding(true)
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleOnboardingComplete = (type: 'individual' | 'leader') => {
    setUserType(type)
    setShowOnboarding(false)
    localStorage.setItem('gathered_user_type', type)
  }

  const handleUserTypeChange = (type: 'individual' | 'leader') => {
    setUserType(type)
    setShowUserTypeSelector(false)
  }

  const handleTabChange = (tab: string) => {
    // Handle navigation to different tabs
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
        // Stay on dashboard
        break
    }
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

  // Show onboarding flow for new users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  // Show demo dashboard for visitors
  const displayUser = user || {
    id: 'demo',
    email: 'demo@gathered.com',
    user_metadata: {
      name: 'Demo User',
      role: 'Member'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
        {/* For Leaders: Stewardship Dashboard First */}
        {userType === 'leader' && (
          <>
            <LeaderDashboard userRole={userRole as 'Leader' | 'Church Admin'} />
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            <VerseCard />
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            <FellowshipActivityFeed />
          </>
        )}

        {/* For Youth: Simplified Focused Layout */}
        {userType === 'individual' && (
          <>
            {/* Section A: Personalized Greeting + Verse of the Day */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {displayUser.user_metadata?.name || 'Friend'}! 🌿
              </h2>
              <p className="text-white/80">
                Your fellowship community is here for you
              </p>
            </div>
            
            <VerseCard />
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

            {/* Section B: Your Fellowship Activity */}
            <FellowshipActivityFeed />
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

            {/* Section C: Upcoming Events (Top 3) */}
            <UpcomingEvents />
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

            {/* Section D: Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
              <QuickActions />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

            {/* Section E: Community Highlight */}
            <CommunityHighlight />
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" onTabChange={handleTabChange} />

      {/* User Type Selector Modal */}
      {showUserTypeSelector && userType && (
        <UserTypeSelector
          currentType={userType}
          onTypeChange={handleUserTypeChange}
          onClose={() => setShowUserTypeSelector(false)}
        />
      )}

      {/* Onboarding Tutorial moved to global layout */}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}