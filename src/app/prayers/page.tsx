'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Plus, Search, Filter, ArrowLeft, User, Clock } from 'lucide-react'
import Logo from '@/components/Logo'

interface PrayerRequest {
  id: string
  author: string
  title: string
  content: string
  date: string
  category: string
  prayersCount: number
  hasPrayed: boolean
  isAnonymous: boolean
  fellowship?: string
}

const mockPrayerRequests: PrayerRequest[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    title: 'Prayer for Healing',
    content: 'Please pray for my mother who is recovering from surgery. Pray for God&apos;s healing touch and peace for our family.',
    date: '2 hours ago',
    category: 'Healing',
    prayersCount: 12,
    hasPrayed: false,
    isAnonymous: false,
    fellowship: 'Young Adults Bible Study'
  },
  {
    id: '2',
    author: 'Anonymous',
    title: 'Job Search',
    content: 'I&apos;m looking for a new job opportunity. Pray for God&apos;s guidance and direction in this season.',
    date: '5 hours ago',
    category: 'Provision',
    prayersCount: 8,
    hasPrayed: true,
    isAnonymous: true
  },
  {
    id: '3',
    author: 'Michael Chen',
    title: 'Family Reconciliation',
    content: 'My family is going through a difficult season. Pray for restoration and unity in our relationships.',
    date: '1 day ago',
    category: 'Relationships',
    prayersCount: 15,
    hasPrayed: false,
    isAnonymous: false,
    fellowship: 'Men&apos;s Accountability Group'
  }
]

const categories = ['All', 'Healing', 'Provision', 'Relationships', 'Faith', 'Family', 'Work', 'Other']

export default function PrayersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(mockPrayerRequests)

  // Load prayers from localStorage
  useEffect(() => {
    const loadPrayers = () => {
      const savedPrayers = localStorage.getItem('gathered_prayers')
      if (savedPrayers) {
        const parsedPrayers = JSON.parse(savedPrayers)
        setPrayerRequests([...parsedPrayers, ...mockPrayerRequests])
      }
    }

    loadPrayers()

    // Listen for storage events
    window.addEventListener('storage', loadPrayers)
    return () => window.removeEventListener('storage', loadPrayers)
  }, [])

  const handlePray = (id: string) => {
    setPrayerRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, hasPrayed: !request.hasPrayed, prayersCount: request.hasPrayed ? request.prayersCount - 1 : request.prayersCount + 1 }
          : request
      )
    )
  }

  const handleCreatePrayer = () => {
    router.push('/prayers/create')
  }

  const filteredPrayerRequests = prayerRequests.filter(request => {
    const matchesCategory = selectedCategory === 'All' || request.category === selectedCategory
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-white/60 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Logo size="md" showText={false} />
              <div>
                <h1 className="text-xl font-bold text-white">Prayer Requests</h1>
                <p className="text-sm text-white/60">Join in prayer together</p>
              </div>
            </div>
            <button
              onClick={handleCreatePrayer}
              className="bg-[#F5C451] text-[#0F1433] p-2 rounded-lg hover:bg-[#D4AF37] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search prayer requests..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-full py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#F5C451] text-[#0F1433]'
                      : 'bg-white/10 text-white border border-[#D4AF37]/30 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Requests List */}
      <div className="max-w-md mx-auto px-4 space-y-4 pb-6">
        {filteredPrayerRequests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No prayer requests found</h3>
            <p className="text-white/80">Be the first to share a prayer request</p>
          </div>
        ) : (
          filteredPrayerRequests.map(request => (
            <div key={request.id} className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#F5C451] rounded-full flex items-center justify-center text-sm font-semibold text-[#0F1433]">
                    {request.isAnonymous ? '?' : request.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {request.isAnonymous ? 'Anonymous' : request.author}
                    </h4>
                    <p className="text-xs text-white/60 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{request.date}</span>
                      {request.fellowship && (
                        <>
                          <span>•</span>
                          <span>{request.fellowship}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#F5C451]/20 text-[#F5C451] rounded-full text-xs font-medium">
                    {request.category}
                  </span>
                </div>

                {/* Prayer Content */}
                <h3 className="text-lg font-bold text-white mb-2">{request.title}</h3>
                <p className="text-white/80 leading-relaxed mb-4">{request.content}</p>

                {/* Pray Button */}
                <button
                  onClick={() => handlePray(request.id)}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    request.hasPrayed
                      ? 'bg-[#F5C451]/20 text-[#F5C451] border-2 border-[#F5C451]'
                      : 'bg-[#F5C451] text-[#0F1433] hover:bg-[#D4AF37]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${request.hasPrayed ? 'fill-current' : ''}`} />
                  <span>{request.hasPrayed ? 'Praying...' : 'Pray for This'}</span>
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                    {request.prayersCount}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Prayer Request Button - Floating */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={handleCreatePrayer}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

