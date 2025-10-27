'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ArrowLeft, Check } from 'lucide-react'
import Logo from '@/components/Logo'

const categories = ['Healing', 'Provision', 'Relationships', 'Faith', 'Family', 'Work', 'Other']

export default function CreatePrayerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    isAnonymous: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Create new prayer request object
    const newPrayer = {
      id: Date.now().toString(),
      author: formData.isAnonymous ? 'Anonymous' : 'Demo User',
      title: formData.title,
      content: formData.content,
      date: 'Just now',
      category: formData.category,
      prayersCount: 0,
      hasPrayed: false,
      isAnonymous: formData.isAnonymous
    }

    // Save to localStorage
    const existingPrayers = localStorage.getItem('gathered_prayers')
    const prayers = existingPrayers ? JSON.parse(existingPrayers) : []
    prayers.unshift(newPrayer) // Add to beginning
    localStorage.setItem('gathered_prayers', JSON.stringify(prayers))

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'))

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push('/prayers')
    }, 1000)
  }

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
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Logo size="sm" showText={false} />
              <h1 className="text-lg font-bold text-white">Share Prayer Request</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Intro Card */}
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#0F1433] rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#F5C451]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Share Your Prayer Need</h2>
                <p className="text-sm opacity-80">Let others join you in prayer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-2">Title *</label>
            <input
              type="text"
              required
              placeholder="Brief description of your prayer request..."
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-2">Details *</label>
            <textarea
              required
              rows={6}
              placeholder="Share more about your prayer request..."
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-2">Category *</label>
            <select
              required
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C451]"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category} style={{ backgroundColor: '#0F1433', color: 'white' }}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-[#D4AF37] text-[#F5C451] focus:ring-[#F5C451]"
                checked={formData.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
              />
              <div>
                <span className="text-sm font-medium text-white">Post anonymously</span>
                <p className="text-xs text-white/60">Your name will not be shown with this prayer request</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] py-4 rounded-xl font-semibold text-lg hover:from-[#F5C451] hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F1433]"></div>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              <span>Share Prayer Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

