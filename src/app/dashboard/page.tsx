'use client'

// Gathered Dashboard - Balanced UX for individuals and leaders

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, LogOut, Bell, User, Users } from 'lucide-react'
import Logo from '@/components/Logo'
import VerseCard from '@/components/VerseCard'
import EventList from '@/components/EventList'
import FellowshipGroups from '@/components/FellowshipGroups'
import AnnouncementFeed from '@/components/AnnouncementFeed'
import StatsPanel from '@/components/StatsPanel'
import LeaderDashboard from '@/components/LeaderDashboard'
import BottomNavigation from '@/components/BottomNavigation'
import OnboardingFlow from '@/components/OnboardingFlow'
import FellowshipDiscovery from '@/components/FellowshipDiscovery'
import UserTypeSelector from '@/components/UserTypeSelector'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<'Member' | 'Leader' | 'Church Admin'>('Member')
  const [userType, setUserType] = useState<'individual' | 'leader' | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false)

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

  const isLeader = userRole === 'Leader' || userRole === 'Church Admin'

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
                    ? `Welcome back, ${displayUser.user_metadata?.name || 'Friend'}! Ready to find fellowship?`
                    : `Welcome back, ${displayUser.user_metadata?.name || 'Leader'}! Ready to build community?`
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
                onClick={() => router.push('/discover')}
                className={`p-2 ${userType === 'leader' ? 'text-[#0F1433]/60 hover:text-[#0F1433]' : 'text-white/60 hover:text-white'}`}
                title="Discover People"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/profile')}
                className={`p-2 ${userType === 'leader' ? 'text-[#0F1433]/60 hover:text-[#0F1433]' : 'text-white/60 hover:text-white'}`}
                title="My Profile"
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowUserTypeSelector(true)}
                className={`p-2 ${userType === 'leader' ? 'text-[#0F1433]/60 hover:text-[#0F1433]' : 'text-white/60 hover:text-white'}`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className={`flex items-center space-x-1 px-3 py-1 ${userType === 'leader' ? 'text-[#0F1433]/60 hover:text-[#0F1433]' : 'text-white/60 hover:text-white'} transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto">
        {/* Section A: Spiritual Touchpoint */}
        <VerseCard />

        {/* Section B: Engagement & Community */}
        <div className="space-y-6">
          {userType === 'individual' ? (
            <>
              <FellowshipDiscovery />
              <EventList />
              <AnnouncementFeed />
            </>
          ) : (
            <>
              <EventList />
              <FellowshipGroups userRole={userRole} />
              <AnnouncementFeed />
            </>
          )}
        </div>

        {/* Section C: Growth & Analytics */}
        <StatsPanel />

        {/* Section D: Leader/Admin Features */}
        {userType === 'leader' && (
          <LeaderDashboard userRole={userRole as 'Leader' | 'Church Admin'} />
        )}

        {/* Monetization Integration Placeholder */}
        {userType === 'individual' && (
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-xl p-4 text-[#0F1433]">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Ready to Lead?</h3>
              <p className="text-sm mb-4 opacity-90">
                Start your own fellowship group and help others find community
              </p>
              <button className="bg-[#0F1433] text-[#F5C451] px-6 py-2 rounded-lg font-medium hover:bg-[#0F1433]/90 transition-colors">
                Become a Leader
              </button>
            </div>
          </div>
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
    </div>
  )
}