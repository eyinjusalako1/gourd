'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import AppHeader from '@/components/AppHeader'
import { Heart, X } from 'lucide-react'

const categories = ['Healing', 'Provision', 'Relationships', 'Faith', 'Family', 'Work', 'Other']

export default function CreatePrayerPage() {
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    isAnonymous: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to create a prayer request', variant: 'error' })
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'error' })
      return
    }

    setLoading(true)

    try {
      // Save to localStorage (in a real app, this would go to a database)
      const savedPrayers = localStorage.getItem('gathered_prayers')
      const prayers = savedPrayers ? JSON.parse(savedPrayers) : []
      
      const newPrayer = {
        id: Date.now().toString(),
        author: formData.isAnonymous ? 'Anonymous' : (user.user_metadata?.name || 'User'),
        title: formData.title,
        content: formData.content,
        date: 'Just now',
        category: formData.category,
        prayersCount: 0,
        hasPrayed: false,
        isAnonymous: formData.isAnonymous,
      }

      prayers.unshift(newPrayer)
      localStorage.setItem('gathered_prayers', JSON.stringify(prayers))

      toast({
        title: 'Prayer request created',
        description: 'Your prayer request has been shared with the community',
        variant: 'success',
      })

      router.push('/prayers')
    } catch (error: any) {
      console.error('Error creating prayer:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create prayer request',
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <>
      <AppHeader title="Create Prayer Request" backHref="/prayers" />

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Prayer Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
              placeholder="e.g., Prayer for Healing"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
              Prayer Request *
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              required
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
              placeholder="Share your prayer request with the community..."
              value={formData.content}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C451]"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#0F1433]">{cat}</option>
              ))}
            </select>
          </div>

          {/* Anonymous */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="w-4 h-4 text-[#F5C451] bg-white/10 border-[#D4AF37]/30 rounded focus:ring-[#F5C451]"
            />
            <label htmlFor="isAnonymous" className="text-sm text-white/80">
              Post anonymously
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white border border-[#D4AF37]/30 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-[#F5C451] text-[#0F1433] font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1433]"></div>
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>Share Prayer Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

