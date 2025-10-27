'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Users, Plus, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'

// Simple fellowships listing page - MVP ready
export default function FellowshipsPage() {
  const router = useRouter()

  const mockFellowships = [
    {
      id: '1',
      name: 'Young Adults Bible Study',
      description: 'A vibrant community of young adults exploring God&apos;s word together.',
      category: 'Bible Study',
      location: 'Downtown Community Center',
      members: 24
    },
    {
      id: '2',
      name: 'Women&apos;s Prayer Circle',
      description: 'Join us for prayer, worship, and encouragement.',
      category: 'Women&apos;s Ministry',
      location: 'Grace Church',
      members: 18
    }
  ]

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Logo size="md" showText={false} />
              <h1 className="text-xl font-bold text-white">Fellowships</h1>
            </div>
            <button
              onClick={() => router.push('/fellowships/create')}
              className="bg-[#F5C451] text-[#0F1433] p-2 rounded-lg hover:bg-[#D4AF37]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <Users className="w-16 h-16 text-[#F5C451]/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Explore Fellowships</h2>
          <p className="text-white/80">Discover communities near you or create your own</p>
        </div>

        <div className="space-y-4">
          {mockFellowships.map(fellowship => (
            <div
              key={fellowship.id}
              className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6"
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-[#F5C451] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#0F1433]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{fellowship.name}</h3>
                  <p className="text-sm text-white/60">{fellowship.category}</p>
                </div>
                <span className="px-2 py-1 bg-[#F5C451]/20 text-[#F5C451] rounded text-xs">
                  {fellowship.members} members
                </span>
              </div>
              <p className="text-white/80 text-sm mb-2">{fellowship.description}</p>
              <p className="text-xs text-white/60">{fellowship.location}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/fellowships/create')}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] py-3 rounded-xl font-bold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all"
          >
            Create Your Own Fellowship
          </button>
        </div>
      </div>
    </div>
  )
}
