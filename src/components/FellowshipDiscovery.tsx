'use client'

import { useState } from 'react'
import { Search, MapPin, Users, Calendar, Filter, Star, Heart, MessageCircle } from 'lucide-react'

interface Fellowship {
  id: string
  name: string
  description: string
  location: string
  memberCount: number
  category: string
  meetingDay: string
  meetingTime: string
  isOnline: boolean
  rating: number
  distance: string
  image?: string
}

const sampleFellowships: Fellowship[] = [
  {
    id: '1',
    name: 'Young Adults Bible Study',
    description: 'A vibrant community of young adults exploring faith together through Bible study and fellowship.',
    location: 'Downtown Community Center',
    memberCount: 24,
    category: 'Bible Study',
    meetingDay: 'Wednesdays',
    meetingTime: '7:00 PM',
    isOnline: false,
    rating: 4.8,
    distance: '0.5 miles'
  },
  {
    id: '2',
    name: 'Prayer Warriors',
    description: 'Join us for powerful prayer sessions and intercession for our community and beyond.',
    location: 'Online - Zoom',
    memberCount: 15,
    category: 'Prayer',
    meetingDay: 'Daily',
    meetingTime: '6:00 AM',
    isOnline: true,
    rating: 4.9,
    distance: 'Online'
  },
  {
    id: '3',
    name: 'Women\'s Fellowship Circle',
    description: 'A supportive space for women to grow in faith, share testimonies, and build lasting friendships.',
    location: 'Grace Church',
    memberCount: 18,
    category: 'Fellowship',
    meetingDay: 'Saturdays',
    meetingTime: '10:00 AM',
    isOnline: false,
    rating: 4.7,
    distance: '1.2 miles'
  },
  {
    id: '4',
    name: 'Men\'s Accountability Group',
    description: 'Brothers in Christ supporting each other through life\'s challenges and victories.',
    location: 'Coffee Corner',
    memberCount: 12,
    category: 'Accountability',
    meetingDay: 'Mondays',
    meetingTime: '6:30 PM',
    isOnline: false,
    rating: 4.6,
    distance: '0.8 miles'
  }
]

const categories = ['All', 'Bible Study', 'Prayer', 'Fellowship', 'Accountability', 'Outreach']

export default function FellowshipDiscovery() {
  const [fellowships, setFellowships] = useState<Fellowship[]>(sampleFellowships)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredFellowships = fellowships.filter(fellowship => {
    const matchesCategory = selectedCategory === 'All' || fellowship.category === selectedCategory
    const matchesSearch = fellowship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fellowship.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleJoinFellowship = (fellowshipId: string) => {
    console.log('Joining fellowship:', fellowshipId)
    // In a real app, this would handle the join logic
  }

  const handleMessageFellowship = (fellowshipId: string) => {
    console.log('Messaging fellowship:', fellowshipId)
    // In a real app, this would open a message interface
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Find Your Fellowship</h2>
          <p className="text-white/80">Discover meaningful Christian community near you</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Filter className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          type="text"
          placeholder="Search fellowships, topics, or locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 border border-[#D4AF37]/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] transition-colors"
        />
      </div>

      {/* Category Filter */}
      {showFilters && (
        <div className="space-y-3">
          <h3 className="text-white font-medium">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#F5C451] text-[#0F1433]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fellowships List */}
      <div className="space-y-4">
        {filteredFellowships.map(fellowship => (
          <div key={fellowship.id} className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg">
            {/* Fellowship Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{fellowship.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-[#F5C451] fill-current" />
                    <span className="text-sm text-white/80">{fellowship.rating}</span>
                  </div>
                </div>
                <p className="text-white/80 mb-3 leading-relaxed">{fellowship.description}</p>
                
                {/* Fellowship Details */}
                <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-[#F5C451]" />
                    <span>{fellowship.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-[#F5C451]" />
                    <span>{fellowship.memberCount} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-[#F5C451]" />
                    <span>{fellowship.meetingDay} at {fellowship.meetingTime}</span>
                  </div>
                  <div className="text-[#F5C451] font-medium">
                    {fellowship.distance}
                  </div>
                </div>

                {/* Category Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  fellowship.category === 'Bible Study' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  fellowship.category === 'Prayer' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  fellowship.category === 'Fellowship' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  fellowship.category === 'Accountability' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {fellowship.category}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleJoinFellowship(fellowship.id)}
                className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>Join Fellowship</span>
              </button>
              <button
                onClick={() => handleMessageFellowship(fellowship.id)}
                className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-[#F5C451]/50"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFellowships.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No fellowships found</h3>
          <p className="text-white/60 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
            className="bg-[#F5C451] text-[#0F1433] px-6 py-2 rounded-lg font-medium hover:bg-[#D4AF37] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] text-center">
        <h3 className="text-xl font-bold mb-2">Don't see what you're looking for?</h3>
        <p className="mb-4 opacity-90">Start your own fellowship group and invite others to join</p>
        <button className="bg-[#0F1433] text-[#F5C451] px-6 py-2 rounded-lg font-medium hover:bg-[#0F1433]/90 transition-colors">
          Create Fellowship
        </button>
      </div>
    </div>
  )
}
