'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  BookOpen, 
  Users, 
  Filter,
  UserPlus,
  MessageCircle,
  Heart
} from 'lucide-react'

export default function UserSearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      bio: 'Passionate about community service and helping others grow in faith.',
      location: 'San Francisco, CA',
      denomination: 'Baptist',
      interests: ['Community Service', 'Prayer', 'Bible Study'],
      mutualConnections: 3,
      isFollowing: false,
      profileImage: null
    },
    {
      id: '2',
      name: 'Michael Chen',
      bio: 'Young adult leader focused on building authentic Christian relationships.',
      location: 'Los Angeles, CA',
      denomination: 'Non-denominational',
      interests: ['Worship', 'Fellowship', 'Leadership'],
      mutualConnections: 1,
      isFollowing: true,
      profileImage: null
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      bio: 'Love sharing testimonies and encouraging others in their faith journey.',
      location: 'San Diego, CA',
      denomination: 'Methodist',
      interests: ['Testimonies', 'Prayer', 'Women\'s Ministry'],
      mutualConnections: 5,
      isFollowing: false,
      profileImage: null
    },
    {
      id: '4',
      name: 'David Thompson',
      bio: 'Church elder passionate about discipleship and spiritual growth.',
      location: 'Oakland, CA',
      denomination: 'Presbyterian',
      interests: ['Discipleship', 'Bible Study', 'Mentoring'],
      mutualConnections: 2,
      isFollowing: false,
      profileImage: null
    }
  ])

  const [filteredUsers, setFilteredUsers] = useState(users)

  const filters = ['All', 'Nearby', 'Same Denomination', 'Similar Interests']

  useEffect(() => {
    let filtered = users

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedFilter === 'Nearby') {
      // In real app, this would filter by location proximity
      filtered = filtered.filter(user => user.location.includes('CA'))
    } else if (selectedFilter === 'Same Denomination') {
      // In real app, this would filter by user's denomination
      filtered = filtered.filter(user => user.denomination === 'Non-denominational')
    } else if (selectedFilter === 'Similar Interests') {
      // In real app, this would filter by shared interests
      filtered = filtered.filter(user => 
        user.interests.some(interest => ['Prayer', 'Bible Study'].includes(interest))
      )
    }

    setFilteredUsers(filtered)
  }, [searchQuery, selectedFilter, users])

  const handleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ))
  }

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`)
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
              <h1 className="text-lg font-bold text-white">Discover People</h1>
            </div>

            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or interests..."
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Filter by</h2>
            <Filter className="w-5 h-5 text-[#F5C451]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-[#F5C451] text-[#0F1433]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {filteredUsers.length} People Found
            </h3>
          </div>

          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white/5 border border-[#D4AF37] rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
              
              <div className="flex items-start space-x-4 relative z-10">
                {/* Profile Picture */}
                <div className="w-12 h-12 bg-[#F5C451] rounded-full flex items-center justify-center border-2 border-[#0F1433]">
                  <span className="text-lg font-bold text-[#0F1433]">
                    {user.name.charAt(0)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{user.name}</h4>
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                        {user.bio}
                      </p>
                    </div>
                  </div>

                  {/* Location & Denomination */}
                  <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-[#F5C451]" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4 text-[#F5C451]" />
                      <span>{user.denomination}</span>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-[#D4AF37]/30"
                      >
                        {interest}
                      </span>
                    ))}
                    {user.interests.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-[#D4AF37]/30">
                        +{user.interests.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Mutual Connections */}
                  {user.mutualConnections > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-white/60 mb-3">
                      <Users className="w-4 h-4" />
                      <span>{user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProfile(user.id)}
                      className="flex-1 bg-white/10 text-white py-2 px-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50 text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                        user.isFollowing
                          ? 'bg-white/10 text-white border border-[#D4AF37]/50 hover:bg-white/20'
                          : 'bg-[#F5C451] text-[#0F1433] hover:bg-[#D4AF37]'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors border border-[#D4AF37]/50">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No people found
            </h3>
            <p className="text-white/80">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
