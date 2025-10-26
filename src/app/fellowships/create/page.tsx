'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  BookOpen, 
  Heart, 
  Settings,
  Camera,
  Upload,
  Save,
  X,
  Plus,
  Globe,
  Home
} from 'lucide-react'

export default function CreateFellowshipPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    meetingDay: '',
    meetingTime: '',
    meetingFrequency: 'weekly',
    category: 'Bible Study',
    maxMembers: 25,
    isOnline: false,
    virtualPlatform: '',
    virtualLink: '',
    privacy: 'public',
    joiningRules: 'approval_required',
    tags: [] as string[]
  })

  const [newTag, setNewTag] = useState('')

  const categories = [
    'Bible Study',
    'Prayer Group',
    'Worship',
    'Community Service',
    'Young Adults',
    'Women\'s Ministry',
    'Men\'s Ministry',
    'Family Fellowship',
    'Outreach',
    'Discipleship'
  ]

  const meetingDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ]

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  const privacyOptions = [
    { value: 'public', label: 'Public - Anyone can find and join' },
    { value: 'private', label: 'Private - Invite only' },
    { value: 'closed', label: 'Closed - No new members' }
  ]

  const joiningRuleOptions = [
    { value: 'open', label: 'Open - Anyone can join immediately' },
    { value: 'approval_required', label: 'Approval Required - Leader must approve' },
    { value: 'invite_only', label: 'Invite Only - Members must be invited' }
  ]

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save fellowship to localStorage
      const newFellowship = {
        id: Date.now().toString(), // Simple ID generation
        ...formData, // Include all form data first
        // Override with calculated values
        members: 0,
        location: formData.isOnline ? `Online - ${formData.virtualPlatform}` : formData.location,
        nextEvent: formData.meetingDay,
        engagement: 0,
        status: 'active'
      }
      
      // Get existing fellowships
      const existing = localStorage.getItem('gathered_fellowships')
      const fellowships = existing ? JSON.parse(existing) : []
      
      // Add new fellowship
      fellowships.push(newFellowship)
      
      // Save back to localStorage
      localStorage.setItem('gathered_fellowships', JSON.stringify(fellowships))
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'))
      
      // Redirect back to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating fellowship:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
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
              <h1 className="text-lg font-bold text-white">Create Fellowship</h1>
            </div>

            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fellowship Photo */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-[#0F1433]" />
              </div>
              <button
                type="button"
                className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors flex items-center space-x-1 mx-auto"
              >
                <Camera className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                {/* Fellowship Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Fellowship Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                    placeholder="e.g., Young Adults Bible Study"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                    placeholder="Describe your fellowship's purpose, focus, and what members can expect..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                    style={{ backgroundColor: 'rgba(15, 20, 51, 0.9)' }}
                  >
                    {categories.map(category => (
                      <option key={category} value={category} style={{ backgroundColor: '#0F1433', color: 'white' }}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Maximum Members
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Information */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Meeting Information</h3>
              
              <div className="space-y-4">
                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Meeting Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="meetingType"
                        checked={!formData.isOnline}
                        onChange={() => handleInputChange('isOnline', false)}
                        className="mr-2 text-[#F5C451]"
                      />
                      <span className="text-white">In-Person</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="meetingType"
                        checked={formData.isOnline}
                        onChange={() => handleInputChange('isOnline', true)}
                        className="mr-2 text-[#F5C451]"
                      />
                      <span className="text-white">Online</span>
                    </label>
                  </div>
                </div>

                {/* Location */}
                {!formData.isOnline ? (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Meeting Location *
                    </label>
                    <input
                      type="text"
                      required={!formData.isOnline}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                      placeholder="e.g., Grace Community Church, Room 101"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Virtual Platform
                      </label>
                      <select
                        value={formData.virtualPlatform}
                        onChange={(e) => handleInputChange('virtualPlatform', e.target.value)}
                        className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                        style={{ backgroundColor: 'rgba(15, 20, 51, 0.9)' }}
                      >
                        <option value="" style={{ backgroundColor: '#0F1433', color: 'white' }}>Select platform</option>
                        <option value="zoom" style={{ backgroundColor: '#0F1433', color: 'white' }}>Zoom</option>
                        <option value="teams" style={{ backgroundColor: '#0F1433', color: 'white' }}>Microsoft Teams</option>
                        <option value="meet" style={{ backgroundColor: '#0F1433', color: 'white' }}>Google Meet</option>
                        <option value="discord" style={{ backgroundColor: '#0F1433', color: 'white' }}>Discord</option>
                        <option value="other" style={{ backgroundColor: '#0F1433', color: 'white' }}>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        value={formData.virtualLink}
                        onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                        className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {/* Meeting Schedule */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Meeting Day
                    </label>
                    <select
                      value={formData.meetingDay}
                      onChange={(e) => handleInputChange('meetingDay', e.target.value)}
                      className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                      style={{ backgroundColor: 'rgba(15, 20, 51, 0.9)' }}
                    >
                      <option value="" style={{ backgroundColor: '#0F1433', color: 'white' }}>Select day</option>
                      {meetingDays.map(day => (
                        <option key={day} value={day} style={{ backgroundColor: '#0F1433', color: 'white' }}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Meeting Time
                    </label>
                    <input
                      type="time"
                      value={formData.meetingTime}
                      onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                      className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Meeting Frequency
                  </label>
                  <select
                    value={formData.meetingFrequency}
                    onChange={(e) => handleInputChange('meetingFrequency', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                    style={{ backgroundColor: 'rgba(15, 20, 51, 0.9)' }}
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value} style={{ backgroundColor: '#0F1433', color: 'white' }}>{freq.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Settings */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Privacy & Settings</h3>
              
              <div className="space-y-4">
                {/* Privacy Level */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Privacy Level
                  </label>
                  <select
                    value={formData.privacy}
                    onChange={(e) => handleInputChange('privacy', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                  >
                    {privacyOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Joining Rules */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Joining Rules
                  </label>
                  <select
                    value={formData.joiningRules}
                    onChange={(e) => handleInputChange('joiningRules', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                  >
                    {joiningRuleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                    placeholder="Add a tag (e.g., prayer, community, outreach)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-[#F5C451] text-[#0F1433] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-[#D4AF37]/30 flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Fellowship</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
