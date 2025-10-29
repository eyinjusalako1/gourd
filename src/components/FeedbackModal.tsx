'use client'

import React, { useState } from 'react'
import { X, MessageSquare, CheckCircle } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'improvement' | 'other'>('bug')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', icon: '🐛', description: 'Something isn&apos;t working' },
    { id: 'feature', label: 'Feature Request', icon: '💡', description: 'I have an idea' },
    { id: 'improvement', label: 'Improvement', icon: '⚡', description: 'Help us improve' },
    { id: 'other', label: 'Other', icon: '💬', description: 'General feedback' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return

    setIsLoading(true)

    // Save feedback to localStorage for MVP
    const feedback = {
      id: Date.now().toString(),
      type: feedbackType,
      subject,
      message,
      email: email || 'anonymous',
      date: new Date().toISOString(),
      status: 'pending'
    }

    // Get existing feedback or create array
    const existingFeedback = localStorage.getItem('gathered_feedback')
    const feedbacks = existingFeedback ? JSON.parse(existingFeedback) : []
    feedbacks.push(feedback)
    localStorage.setItem('gathered_feedback', JSON.stringify(feedbacks))

    // Simulate sending
    setTimeout(() => {
      setIsLoading(false)
      setSent(true)
      
      setTimeout(() => {
        setSent(false)
        setSubject('')
        setMessage('')
        setEmail('')
        onClose()
      }, 2000)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="feedback-title" aria-describedby="feedback-desc">
      <div className="bg-[#0F1433] border border-[#D4AF37] rounded-2xl p-6 max-w-md w-full relative" tabIndex={-1}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#F5C451] rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#0F1433]" />
          </div>
          <div>
            <h2 id="feedback-title" className="text-xl font-bold text-white">Share Your Feedback</h2>
            <p id="feedback-desc" className="text-sm text-white/60">Help us improve Gathered</p>
          </div>
        </div>

        {sent ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Thank You!</h3>
            <p className="text-white/80">Your feedback has been received. We appreciate your input!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">What&apos;s this about?</label>
              <div className="grid grid-cols-2 gap-2">
                {feedbackTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      feedbackType === type.id
                        ? 'border-[#F5C451] bg-[#F5C451]/10'
                        : 'border-[#D4AF37]/30 bg-white/5 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium text-white">{type.label}</div>
                    <div className="text-xs text-white/60">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Subject *</label>
              <input
                type="text"
                required
                placeholder="Brief description..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Details *</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us more about your feedback..."
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Email <span className="text-white/60">(Optional, for follow-up)</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !subject || !message}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F1433]"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Feedback</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

