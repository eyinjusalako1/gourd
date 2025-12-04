'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import AppHeader from '@/components/AppHeader'
import { BookOpen, Tag } from 'lucide-react'

const categories = ['Community', 'Faith', 'Service', 'Healing', 'Growth', 'Encouragement']

export default function CreateTestimonyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Community',
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to share a testimony', variant: 'error' })
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'error' })
      return
    }

    setLoading(true)

    try {
      // Save to localStorage (in a real app, this would go to a database)
      const savedTestimonies = localStorage.getItem('gathered_testimonies')
      const testimonies = savedTestimonies ? JSON.parse(savedTestimonies) : []
      
      const newTestimony = {
        id: Date.now().toString(),
        author: user.user_metadata?.name || 'User',
        title: formData.title,
        content: formData.content,
        date: 'Just now',
        category: formData.category,
        likes: 0,
        comments: 0,
        isLiked: false,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      }

      testimonies.unshift(newTestimony)
      localStorage.setItem('gathered_testimonies', JSON.stringify(testimonies))

      toast({
        title: 'Testimony shared',
        description: 'Your testimony has been shared with the community',
        variant: 'success',
      })

      router.push('/testimonies')
    } catch (error: any) {
      console.error('Error creating testimony:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to share testimony',
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <AppHeader title="Share Your Testimony" backHref="/testimonies" />

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
              placeholder="e.g., How God Changed My Life"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
              Your Story *
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              required
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
              placeholder="Share your testimony and how God has worked in your life..."
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

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
              Tags (comma-separated)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                id="tags"
                name="tags"
                type="text"
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                placeholder="e.g., faith, community, healing"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-xs text-white/60">Separate tags with commas</p>
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
                  <BookOpen className="w-5 h-5" />
                  <span>Share Testimony</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

