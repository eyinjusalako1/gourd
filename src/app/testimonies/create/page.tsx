'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Heart, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import { useAuth } from '@/lib/auth-context'
import { gamificationService } from '@/lib/gamification-service'
import { useToast } from '@/components/ui/Toast'

const categories = ['Community', 'Faith', 'Service', 'Healing', 'Growth', 'Encouragement', 'Other']
const tags = ['faith', 'prayer', 'hope', 'love', 'community', 'healing', 'growth', 'service', 'friendship', 'encouragement']

export default function CreateTestimonyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const toast = useToast()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    fellowship: '',
    tags: [] as string[],
    isAnonymous: false
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = (tag: string) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create new testimony object
      const newTestimony = {
        id: Date.now().toString(),
        author: formData.isAnonymous ? 'Anonymous' : 'Demo User',
        title: formData.title,
        content: formData.content,
        date: 'Just now',
        category: formData.category,
        likes: 0,
        comments: 0,
        isLiked: false,
        fellowship: formData.fellowship || undefined,
        tags: selectedTags
      }

      // Save to localStorage
      const existingTestimonies = localStorage.getItem('gathered_testimonies')
      const testimonies = existingTestimonies ? JSON.parse(existingTestimonies) : []
      testimonies.unshift(newTestimony) // Add to beginning
      localStorage.setItem('gathered_testimonies', JSON.stringify(testimonies))

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'))

      // Track activity for gamification
      try {
        const userId = user?.id || 'demo'
        const fellowshipId = formData.fellowship || '1' // Use selected fellowship or default
        await gamificationService.trackDailyActivity(userId, fellowshipId, 'testimony')
      } catch (error) {
        console.error('Failed to track testimony activity:', error)
        // Don't block submission if tracking fails
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success toast
      toast({
        title: 'Shared successfully',
        variant: 'success',
        duration: 3000,
      })

      // Navigate after a brief delay to show toast
      setTimeout(() => {
        router.push('/testimonies')
      }, 500)
    } catch (error) {
      console.error('Error sharing testimony:', error)
      setIsLoading(false)
      toast({
        title: 'Something went wrong, please try again',
        variant: 'error',
        duration: 3000,
      })
    }
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
              <h1 className="text-lg font-bold text-white">Share Your Story</h1>
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
                <BookOpen className="w-6 h-6 text-[#F5C451]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Share Your Testimony</h2>
                <p className="text-sm opacity-80">Inspire others with your story of faith</p>
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
              placeholder="Give your testimony a title..."
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
            <label className="block text-sm font-medium text-white mb-2">Your Story *</label>
            <textarea
              required
              rows={8}
              placeholder="Share your story of how God has worked in your life..."
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
            />
            <p className="text-xs text-white/60 mt-2">Share what God has done in your life</p>
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

        {/* Tags */}
        <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-2">
              Tags {selectedTags.length > 0 && <span className="text-white/60">({selectedTags.length}/5)</span>}
            </label>
            <p className="text-xs text-white/60 mb-3">Select up to 5 tags to help others discover your testimony</p>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="px-3 py-1 bg-[#F5C451] text-[#0F1433] rounded-full text-xs font-medium flex items-center space-x-1 hover:bg-[#D4AF37] transition-colors"
                  >
                    <span>#{tag}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-3 py-1 bg-white/10 text-white border border-[#D4AF37]/30 rounded-full text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
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
                <p className="text-xs text-white/60">Your name will not be shown with this testimony</p>
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
              <span>Publish Testimony</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

