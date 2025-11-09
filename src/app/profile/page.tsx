'use client'

import React, { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import ProfileEditModal from '@/components/ProfileEditModal'
import StatsPanel from '@/components/StatsPanel'
import { 
  ArrowLeft, 
  Edit3, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  BookOpen, 
  Share2,
  UserPlus,
  MessageCircle,
  Settings,
  Camera,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const router = useRouter()
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const profileStats = {
    eventsAttended: 24,
    fellowshipsJoined: 3,
    friends: 47,
    testimoniesShared: 8,
  }

  const recentActivity = [
    {
      id: '1',
      type: 'event',
      action: 'attended',
      title: 'Sunday Morning Worship',
      date: '2024-01-28',
      icon: Calendar
    },
    {
      id: '2',
      type: 'fellowship',
      action: 'joined',
      title: 'Young Adults Bible Study',
      date: '2024-01-25',
      icon: Users
    },
    {
      id: '3',
      type: 'testimony',
      action: 'shared',
      title: 'God\'s Faithfulness in Difficult Times',
      date: '2024-01-22',
      icon: Heart
    }
  ]

  const testimonies = [
    {
      id: '1',
      title: 'God\'s Faithfulness in Difficult Times',
      excerpt: 'Last year was incredibly challenging, but through prayer and community, I experienced God\'s faithfulness in ways I never imagined...',
      date: '2024-01-22',
      likes: 12,
      comments: 3
    },
    {
      id: '2',
      title: 'Finding Purpose Through Service',
      excerpt: 'Volunteering at the local shelter opened my eyes to how God uses us to be His hands and feet in the world...',
      date: '2024-01-15',
      likes: 8,
      comments: 1
    }
  ]

  const profileDisplay = useMemo(() => ({
    id: user?.id || 'demo-user',
    name: profile?.name || user?.user_metadata?.name || 'Demo User',
    email: user?.email || 'demo@gathered.com',
    bio: profile?.bio || 'Passionate about building Christian community and growing in faith together. Love connecting with fellow believers and sharing testimonies.',
    location: profile?.location || 'San Francisco, CA',
    denomination: profile?.denomination || 'Non-denominational',
    joinDate: profile?.joinDate || 'January 2024',
    avatarUrl: profile?.avatarUrl,
    coverImageUrl: profile?.coverImageUrl,
    interests: profile?.interests || ['Bible Study', 'Prayer', 'Community Service', 'Worship'],
  }), [profile, user])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // In real app, this would make an API call
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Profile link copied to clipboard!')
  }

  const handleSaveProfile = (updatedData: any) => {
    updateProfile(updatedData)
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <Logo size="sm" showText={false} />
              <h1 className="text-lg font-bold text-white">Profile</h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareProfile}
                className="p-2 text-white/60 hover:text-white transition-colors"
                title="Share profile"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {isOwnProfile && (
                <button
                  onClick={handleEditProfile}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Edit profile"
                  data-tutorial="edit-profile"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Cover Photo */}
        <div className="relative h-32 bg-gradient-to-r from-[#D4AF37] to-[#F5C451]">
          {profileDisplay.coverImageUrl ? (
            <img
              src={profileDisplay.coverImageUrl}
              alt={`${profileDisplay.name} cover`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null
          }
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F1433]/50"></div>
          {isOwnProfile && (
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 -mt-16 relative z-10">
          {/* Profile Picture */}
          <div className="flex items-end space-x-4 mb-4">
            <div className="relative">
              {profileDisplay.avatarUrl ? (
                <img
                  src={profileDisplay.avatarUrl}
                  alt={profileDisplay.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#0F1433]"
                />
              ) : (
                <div className="w-24 h-24 bg-[#F5C451] rounded-full flex items-center justify-center border-4 border-[#0F1433]">
                  <span className="text-2xl font-bold text-[#0F1433]">
                    {profileDisplay.name.charAt(0)}
                  </span>
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute -bottom-1 -right-1 p-1 bg-[#0F1433] border-2 border-[#F5C451] rounded-full text-[#F5C451] hover:bg-[#0F1433]/90 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex-1 flex space-x-2">
              {!isOwnProfile && (
                <>
                  <button
                    onClick={handleFollow}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      isFollowing
                        ? 'bg-white/10 text-white border border-[#D4AF37]/50'
                        : 'bg-[#F5C451] text-[#0F1433] hover:bg-[#D4AF37]'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="bg-white/10 text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">{profileDisplay.name}</h1>
            <p className="text-white/80 mb-2">{profileDisplay.bio}</p>
            
            <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-[#F5C451]" />
                <span>{profileDisplay.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4 text-[#F5C451]" />
                <span>{profileDisplay.denomination}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              <span>Joined {profileDisplay.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F5C451]">{profileStats.eventsAttended}</div>
                <div className="text-sm text-white/80">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F5C451]">{profileStats.fellowshipsJoined}</div>
                <div className="text-sm text-white/80">Fellowships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F5C451]">{profileStats.friends}</div>
                <div className="text-sm text-white/80">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F5C451]">{profileStats.testimoniesShared}</div>
                <div className="text-sm text-white/80">Testimonies</div>
              </div>
            </div>
          </div>

          {/* Growth & Analytics Stats Panel */}
          <StatsPanel />

          {/* Interests */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-white mb-3 relative z-10">Interests</h3>
            <div className="flex flex-wrap gap-2 relative z-10">
              {profileDisplay.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-[#D4AF37]/30"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-white mb-3 relative z-10">Recent Activity</h3>
            <div className="space-y-3 relative z-10">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#F5C451] rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-[#0F1433]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">
                        {activity.action === 'attended' && 'Attended'}
                        {activity.action === 'joined' && 'Joined'}
                        {activity.action === 'shared' && 'Shared'}
                        {' '}
                        <span className="font-medium">{activity.title}</span>
                      </div>
                      <div className="text-xs text-white/60">{activity.date}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Testimonies */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="text-lg font-semibold text-white">Testimonies</h3>
              {isOwnProfile && (
                <button className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors">
                  Share New
                </button>
              )}
            </div>
            <div className="space-y-4 relative z-10">
              {testimonies.map((testimony) => (
                <div key={testimony.id} className="bg-white/5 rounded-xl p-4 border border-[#D4AF37]/30">
                  <h4 className="font-semibold text-white mb-2">{testimony.title}</h4>
                  <p className="text-white/80 text-sm mb-3 leading-relaxed">{testimony.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{testimony.date}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{testimony.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{testimony.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  )
}
