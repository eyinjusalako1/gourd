'use client'

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import ProfileEditModal from '@/components/ProfileEditModal'
import UserTypeSelector from '@/components/UserTypeSelector'
import { 
  ArrowLeft, 
  Edit3,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Settings,
  Bell,
  Shield,
  ChevronRight,
} from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)

  // Determine user role/type
  const userType = useMemo(() => {
    const savedType = typeof window !== 'undefined' ? localStorage.getItem('gathered_user_type') : null
    if (savedType === 'leader') return 'steward'
    if (savedType === 'individual') return 'disciple'
    // Check if user has steward role in metadata
    const userRole = (user?.user_metadata as any)?.role
    if (userRole === 'Leader' || userRole === 'Church Admin') return 'steward'
    return 'disciple'
  }, [user])

  const profileStats = {
    fellowshipsJoined: 3,
    eventsAttended: 24,
    prayersShared: 12,
    testimoniesShared: 8,
  }

  const profileDisplay = useMemo(() => ({
    id: user?.id || 'demo-user',
    name: profile?.name || user?.user_metadata?.name || 'Demo User',
    email: user?.email || 'demo@gathered.com',
    avatarUrl: profile?.avatarUrl,
    primaryFellowship: 'Young Adults Bible Study', // Could be fetched from profile in future
  }), [profile, user])

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleSaveProfile = async (updatedData: any) => {
    await updateProfile(updatedData)
  }

  const handleSettingsClick = () => {
    setShowSettingsSheet(true)
  }

  const handleUserTypeChange = (type: 'individual' | 'leader') => {
    localStorage.setItem('gathered_user_type', type)
    setShowSettingsSheet(false)
    // Force a refresh to update the role badge
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <h1 className="text-lg font-bold text-white">My Profile</h1>

            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profileDisplay.avatarUrl ? (
              <img
                src={profileDisplay.avatarUrl}
                alt={profileDisplay.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37]/50"
              />
            ) : (
              <div className="w-20 h-20 bg-[#F5C451] rounded-full flex items-center justify-center border-2 border-[#D4AF37]/50">
                <span className="text-2xl font-bold text-[#0F1433]">
                  {profileDisplay.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-1 truncate">
              {profileDisplay.name}
            </h2>
            
            {/* Role Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                userType === 'steward'
                  ? 'bg-[#F5C451] text-[#0F1433]'
                  : 'bg-white/10 text-white border border-[#D4AF37]/50'
              }`}>
                {userType === 'steward' ? 'Steward' : 'Disciple'}
              </span>
            </div>

            {/* Email or Primary Fellowship */}
            <p className="text-sm text-white/70 truncate">
              {profileDisplay.email}
            </p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={handleEditProfile}
          className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          data-tutorial="edit-profile"
        >
          <Edit3 className="w-5 h-5" />
          <span>Edit Profile</span>
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-[#F5C451] mb-1">
              {profileStats.fellowshipsJoined}
            </div>
            <div className="text-sm text-white/80">Fellowships</div>
          </div>
          
          <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-[#F5C451] mb-1">
              {profileStats.eventsAttended}
            </div>
            <div className="text-sm text-white/80">Events</div>
          </div>
          
          <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-[#F5C451] mb-1">
              {profileStats.prayersShared}
            </div>
            <div className="text-sm text-white/80">Prayers</div>
          </div>
          
          <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-[#F5C451] mb-1">
              {profileStats.testimoniesShared}
            </div>
            <div className="text-sm text-white/80">Testimonies</div>
          </div>
        </div>

        {/* Account & Settings Section */}
        <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">Account & Settings</h3>
          </div>
          
          <div className="divide-y divide-white/10">
            {/* Settings */}
            <button
              onClick={handleSettingsClick}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white font-medium">Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => router.push('/settings/notifications')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white font-medium">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            {/* Privacy & Safety */}
            <button
              onClick={() => router.push('/settings/privacy')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#F5C451]" />
                </div>
                <span className="text-white font-medium">Privacy & Safety</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        currentProfile={profileDisplay}
      />

      {/* Settings Sheet */}
      {showSettingsSheet && (
        <UserTypeSelector
          currentType={userType === 'steward' ? 'leader' : 'individual'}
          onTypeChange={handleUserTypeChange}
          onClose={() => setShowSettingsSheet(false)}
        />
      )}
    </div>
  )
}
