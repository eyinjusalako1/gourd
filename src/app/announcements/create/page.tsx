'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  ArrowLeft, 
  Megaphone, 
  Users, 
  Send,
  Save,
  Plus,
  X,
  Clock,
  Eye,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { gamificationService } from '@/lib/gamification-service'

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fellowship: '',
    priority: 'normal',
    sendImmediately: true,
    scheduledDate: '',
    scheduledTime: '',
    recipients: 'all_members',
    customRecipients: [] as string[]
  })

  const [newRecipient, setNewRecipient] = useState('')

  // Mock fellowships data
  const fellowships = [
    { id: '1', name: 'Young Adults Bible Study', members: 18 },
    { id: '2', name: 'Women\'s Prayer Circle', members: 12 },
    { id: '3', name: 'Men\'s Accountability Group', members: 8 },
    { id: '4', name: 'Community Outreach Team', members: 25 }
  ]

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-blue-400' },
    { value: 'normal', label: 'Normal Priority', color: 'text-white' },
    { value: 'high', label: 'High Priority', color: 'text-yellow-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
  ]

  const recipientOptions = [
    { value: 'all_members', label: 'All Members' },
    { value: 'active_members', label: 'Active Members Only' },
    { value: 'leaders_only', label: 'Leaders Only' },
    { value: 'custom', label: 'Custom Recipients' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !formData.customRecipients.includes(newRecipient.trim())) {
      setFormData(prev => ({
        ...prev,
        customRecipients: [...prev.customRecipients, newRecipient.trim()]
      }))
      setNewRecipient('')
    }
  }

  const handleRemoveRecipient = (recipient: string) => {
    setFormData(prev => ({
      ...prev,
      customRecipients: prev.customRecipients.filter(r => r !== recipient)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Track activity for gamification
      try {
        const userId = user?.id || 'demo'
        const fellowshipId = formData.fellowship || '1'
        await gamificationService.trackDailyActivity(userId, fellowshipId, 'post')
      } catch (error) {
        console.error('Failed to track announcement activity:', error)
        // Don't block submission if tracking fails
      }
      
      // Redirect back to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating announcement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRecipient()
    }
  }

  const getSelectedFellowship = () => {
    return fellowships.find(f => f.id === formData.fellowship)
  }

  const getRecipientCount = () => {
    const fellowship = getSelectedFellowship()
    if (!fellowship) return 0
    
    switch (formData.recipients) {
      case 'all_members':
        return fellowship.members
      case 'active_members':
        return Math.floor(fellowship.members * 0.8) // Assume 80% are active
      case 'leaders_only':
        return 2 // Assume 2 leaders per fellowship
      case 'custom':
        return formData.customRecipients.length
      default:
        return 0
    }
  }

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
              <h1 className="text-lg font-bold text-white">Create Announcement</h1>
            </div>

            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fellowship Selection */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Select Fellowship</h3>
              
              <div className="space-y-3">
                {fellowships.map(fellowship => (
                  <label key={fellowship.id} className="flex items-center p-3 bg-white/5 rounded-lg border border-[#D4AF37]/30 hover:bg-white/10 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="fellowship"
                      value={fellowship.id}
                      checked={formData.fellowship === fellowship.id}
                      onChange={(e) => handleInputChange('fellowship', e.target.value)}
                      className="mr-3 text-[#F5C451]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{fellowship.name}</div>
                      <div className="text-sm text-white/80">{fellowship.members} members</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Announcement Content */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Announcement Content</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                    placeholder="e.g., Welcome New Members!"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                    placeholder="Write your announcement message here..."
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Recipients</h3>
              
              <div className="space-y-4">
                {/* Recipient Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Who should receive this?
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={(e) => handleInputChange('recipients', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                  >
                    {recipientOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Recipient Count */}
                <div className="bg-white/5 rounded-lg p-3 border border-[#D4AF37]/30">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#F5C451]" />
                    <span className="text-white font-medium">
                      {getRecipientCount()} recipient{getRecipientCount() !== 1 ? 's' : ''} will receive this announcement
                    </span>
                  </div>
                </div>

                {/* Custom Recipients */}
                {formData.recipients === 'custom' && (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                        placeholder="Enter email address"
                      />
                      <button
                        type="button"
                        onClick={handleAddRecipient}
                        className="bg-[#F5C451] text-[#0F1433] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.customRecipients.map((recipient, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-[#D4AF37]/30">
                          <span className="text-white text-sm">{recipient}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient(recipient)}
                            className="text-white/60 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Scheduling</h3>
              
              <div className="space-y-4">
                {/* Send Immediately */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sendTime"
                      checked={formData.sendImmediately}
                      onChange={() => handleInputChange('sendImmediately', true)}
                      className="mr-3 text-[#F5C451]"
                    />
                    <span className="text-white">Send immediately</span>
                  </label>
                </div>

                {/* Schedule for Later */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sendTime"
                      checked={!formData.sendImmediately}
                      onChange={() => handleInputChange('sendImmediately', false)}
                      className="mr-3 text-[#F5C451]"
                    />
                    <span className="text-white">Schedule for later</span>
                  </label>
                </div>

                {/* Schedule Date & Time */}
                {!formData.sendImmediately && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                        className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                        className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              
              <div className="bg-white/5 rounded-xl p-4 border border-[#D4AF37]/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-[#F5C451] rounded-full flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-[#0F1433]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {formData.title || 'Announcement Title'}
                    </h4>
                    <div className="text-xs text-white/60">
                      {getSelectedFellowship()?.name || 'Fellowship Name'}
                    </div>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {formData.content || 'Your announcement message will appear here...'}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs text-white/60">
                  <span>{getRecipientCount()} recipients</span>
                  <span>{formData.sendImmediately ? 'Sending now' : 'Scheduled'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 px-4 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1433]"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{formData.sendImmediately ? 'Send Now' : 'Schedule'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
