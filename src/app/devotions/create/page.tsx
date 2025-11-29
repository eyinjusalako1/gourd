'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { ArrowLeft, BookOpen, CheckCircle, Calendar, Clock } from 'lucide-react'

export default function CreateDevotionalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    scripture: '',
    reading: '',
    reflection: '',
    prayer: '',
    category: 'daily',
    date: new Date().toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Save devotional submission to localStorage
    const devotional = {
      id: Date.now().toString(),
      ...formData,
      authorId: 'current-user',
      authorName: 'Current User', // In real app, get from auth context
      status: 'pending', // Awaiting ratification
      submittedAt: new Date().toISOString(),
      category: formData.category,
      readingDate: formData.date
    }

    // Get existing submissions or create array
    const existing = localStorage.getItem('gathered_devotionals_submissions')
    const submissions = existing ? JSON.parse(existing) : []
    submissions.push(devotional)
    localStorage.setItem('gathered_devotionals_submissions', JSON.stringify(submissions))

    // Dispatch custom event
    window.dispatchEvent(new Event('storage'))

    // Simulate submission
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  const categories = [
    { id: 'daily', label: 'Daily Devotional' },
    { id: 'study', label: 'Bible Study' },
    { id: 'prayer', label: 'Prayer Guide' },
    { id: 'worship', label: 'Worship Reflection' }
  ]

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
              <h1 className="text-lg font-bold text-white">Create Devotional</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-white/80 mb-4">
              Your devotional has been submitted for review. Our team will check it for biblical accuracy and doctrinal alignment.
            </p>
            <p className="text-white/60 text-sm mb-6">
              You&apos;ll be notified once it&apos;s approved or if any changes are needed.
            </p>
            <button
              onClick={() => router.push('/devotions')}
              className="bg-[#F5C451] text-[#0F1433] px-6 py-3 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
            >
              Back to Devotions
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/20 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-3">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Devotional Guidelines</h2>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  All devotionals are reviewed by our theological team to ensure biblical soundness and alignment with Christian doctrine.
                </p>
                <div className="flex items-center space-x-2 text-xs opacity-80">
                  <Clock className="w-4 h-4" />
                  <span>Review time: 24-48 hours</span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C451]"
                style={{ backgroundColor: 'rgba(15, 20, 51, 0.9)' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ backgroundColor: '#0F1433', color: 'white' }}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Reading Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5C451]"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Finding Peace in God's Promises"
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Scripture */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Scripture Reference *</label>
              <input
                type="text"
                name="scripture"
                required
                placeholder="e.g., Philippians 4:6-7"
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                value={formData.scripture}
                onChange={handleInputChange}
              />
            </div>

            {/* Reading Content */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Reading Content *</label>
              <textarea
                name="reading"
                required
                rows={6}
                placeholder="Share the scripture reading or key verses..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                value={formData.reading}
                onChange={handleInputChange}
              />
            </div>

            {/* Reflection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Reflection *</label>
              <textarea
                name="reflection"
                required
                rows={8}
                placeholder="Provide thoughtful reflection on the scripture..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                value={formData.reflection}
                onChange={handleInputChange}
              />
              <p className="text-xs text-white/60 mt-1">Include insights, applications, and questions for reflection</p>
            </div>

            {/* Prayer */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Prayer *</label>
              <textarea
                name="prayer"
                required
                rows={5}
                placeholder="Provide a prayer based on the scripture..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                value={formData.prayer}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F1433]"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit for Review</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

