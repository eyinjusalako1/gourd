'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Plus, Search, Filter, Share2, MessageCircle, ThumbsUp, BookOpen } from 'lucide-react'
import Logo from '@/components/Logo'

interface Testimony {
  id: string
  author: string
  title: string
  content: string
  date: string
  category: string
  likes: number
  comments: number
  isLiked: boolean
  fellowship?: string
  tags: string[]
}

const mockTestimonies: Testimony[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    title: 'How Gathered Helped Me Find My Community',
    content: 'I moved to a new city and was struggling to find a Christian community. Through Gathered, I connected with amazing believers who welcomed me with open arms. This platform has truly been a blessing in my life.',
    date: '2 days ago',
    category: 'Community',
    likes: 24,
    comments: 5,
    isLiked: false,
    fellowship: 'Young Adults Bible Study',
    tags: ['community', 'faith', 'friendship']
  },
  {
    id: '2',
    author: 'Michael Chen',
    title: 'God\'s Faithfulness Through Difficult Times',
    content: 'Last year was one of the hardest seasons of my life. But through prayer and support from my fellowship group, I experienced God\'s faithfulness in ways I never imagined. He never leaves us nor forsakes us.',
    date: '5 days ago',
    category: 'Faith',
    likes: 45,
    comments: 12,
    isLiked: true,
    fellowship: 'Men\'s Accountability Group',
    tags: ['faith', 'prayer', 'hope']
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    title: 'Finding Purpose in Serving Others',
    content: 'I joined the Community Outreach team and discovered a new calling to serve those in need. Seeing God work through our efforts has been incredibly humbling and inspiring.',
    date: '1 week ago',
    category: 'Service',
    likes: 38,
    comments: 8,
    isLiked: false,
    fellowship: 'Community Outreach Team',
    tags: ['service', 'calling', 'community']
  },
  {
    id: '4',
    author: 'David Thompson',
    title: 'Healing Through Fellowship',
    content: 'After experiencing a painful loss, my fellowship group came around me in ways that showed me the true meaning of the body of Christ. I am forever grateful for their love and support.',
    date: '2 weeks ago',
    category: 'Healing',
    likes: 67,
    comments: 15,
    isLiked: false,
    fellowship: 'Young Adults Bible Study',
    tags: ['healing', 'community', 'support']
  }
]

const categories = ['All', 'Community', 'Faith', 'Service', 'Healing', 'Growth', 'Encouragement']

export default function TestimoniesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [testimonies, setTestimonies] = useState<Testimony[]>(mockTestimonies)

  const handleLike = (id: string) => {
    setTestimonies(prev =>
      prev.map(testimony =>
        testimony.id === id
          ? { ...testimony, isLiked: !testimony.isLiked, likes: testimony.isLiked ? testimony.likes - 1 : testimony.likes + 1 }
          : testimony
      )
    )
  }

  const handleCreateTestimony = () => {
    router.push('/testimonies/create')
  }

  const filteredTestimonies = testimonies.filter(testimony => {
    const matchesCategory = selectedCategory === 'All' || testimony.category === selectedCategory
    const matchesSearch = testimony.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimony.content.toLowerCase().includes(searchQuery.toLowerCase())
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
                onClick={() => router.back()}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Logo size="md" showText={false} />
              <div>
                <h1 className="text-xl font-bold text-white">Testimonies</h1>
                <p className="text-sm text-white/60">Share your story</p>
              </div>
            </div>
            <button
              onClick={handleCreateTestimony}
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
                placeholder="Search testimonies..."
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

      {/* Testimonies List */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        {filteredTestimonies.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No testimonies found</h3>
            <p className="text-white/80">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTestimonies.map(testimony => (
            <div key={testimony.id} className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#F5C451] rounded-full flex items-center justify-center text-sm font-semibold text-[#0F1433]">
                    {testimony.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{testimony.author}</h4>
                    <p className="text-xs text-white/60">
                      {testimony.fellowship} • {testimony.date}
                    </p>
                  </div>
                  <button className="bg-white/10 p-2 rounded-lg border border-[#D4AF37]/30 hover:bg-white/20 transition-colors">
                    <Filter className="w-4 h-4 text-[#F5C451]" />
                  </button>
                </div>

                {/* Testimony Content */}
                <h3 className="text-lg font-bold text-white mb-2">{testimony.title}</h3>
                <p className="text-white/80 leading-relaxed mb-4">{testimony.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {testimony.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[#F5C451]/20 text-[#F5C451] rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/30">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(testimony.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        testimony.isLiked
                          ? 'bg-[#F5C451]/20 text-[#F5C451]'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${testimony.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{testimony.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{testimony.comments}</span>
                    </button>
                  </div>
                  <button className="bg-white/10 p-2 rounded-lg border border-[#D4AF37]/30 hover:bg-white/20 transition-colors">
                    <Share2 className="w-4 h-4 text-[#F5C451]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Testimony Button - Floating */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={handleCreateTestimony}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

