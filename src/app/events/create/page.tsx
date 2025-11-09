'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  BookOpen,
  Heart,
  Megaphone,
  Hand,
  Globe,
  Save,
  Plus,
  X,
  Upload,
  Camera
} from 'lucide-react'

export default function CreateEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fellowship: '',
    category: 'Bible Study',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    isOnline: false,
    virtualPlatform: '',
    virtualLink: '',
    maxAttendees: 25,
    requiresRsvp: true,
    allowGuests: true,
    maxGuests: 2,
    tags: [] as string[]
  })

  const [newTag, setNewTag] = useState('')

  // Mock fellowships data
  const fellowships = [
    { id: '1', name: 'Young Adults Bible Study' },
    { id: '2', name: 'Women\'s Prayer Circle' },
    { id: '3', name: 'Men\'s Accountability Group' },
    { id: '4', name: 'Community Outreach Team' }
  ]

  const categories = [
    'Bible Study',
    'Prayer Meeting',
    'Worship Service',
    'Community Service',
    'Social Gathering',
    'Outreach Event',
    'Training Session',
    'Conference',
    'Retreat',
    'Other'
  ]

  const virtualPlatforms = [
    'Zoom',
    'Microsoft Teams',
    'Google Meet',
    'Discord',
    'Facebook Live',
    'YouTube Live',
    'Other'
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
      
      // Save event to localStorage
      const startDate = new Date(`${formData.date}T${formData.startTime}`)
      const endDate = new Date(`${formData.date}T${formData.endTime}`)

      const newEvent = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        fellowship: formData.fellowship,
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        isOnline: formData.isOnline,
        virtualPlatform: formData.virtualPlatform,
        virtualLink: formData.virtualLink,
        maxAttendees: formData.maxAttendees,
        requiresRsvp: formData.requiresRsvp,
        allowGuests: formData.allowGuests,
        maxGuests: formData.maxGuests,
        tags: formData.tags,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        event_type: formData.category.toLowerCase().replace(' ', '_'),
        is_virtual: formData.isOnline,
        virtual_platform: formData.virtualPlatform,
        requires_rsvp: formData.requiresRsvp,
        allow_guests: formData.allowGuests,
        max_attendees: formData.maxAttendees,
        rsvp_count: 0,
        created_by: 'demo-steward',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const existing = localStorage.getItem('gathered_events')
      const events = existing ? JSON.parse(existing) : []
      events.push(newEvent)
      localStorage.setItem('gathered_events', JSON.stringify(events))
      window.dispatchEvent(new Event('storage'))
      
      // Redirect to events page or fellowship management
      router.push('/events')
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bible Study':
        return <BookOpen className="w-5 h-5" />
      case 'Prayer Meeting':
        return <Heart className="w-5 h-5" />
      case 'Worship Service':
        return <Heart className="w-5 h-5" />
      case 'Community Service':
        return <Hand className="w-5 h-5" />
      case 'Social Gathering':
        return <Users className="w-5 h-5" />
      case 'Outreach Event':
        return <Megaphone className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
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
              <h1 className="text-lg font-bold text-white">Create Event</h1>
            </div>

            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Photo */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-xl flex items-center justify-center mx-auto mb-3">
                {getCategoryIcon(formData.category)}
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
              <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
              
              <div className="space-y-4">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                    placeholder="e.g., Sunday Morning Bible Study"
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
                    placeholder="Describe what this event is about, what participants can expect, and any special instructions..."
                  />
                </div>

                {/* Fellowship */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Fellowship Group *
                  </label>
                  <select
                    required
                    value={formData.fellowship}
                    onChange={(e) => handleInputChange('fellowship', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                  >
                    <option value="">Select fellowship</option>
                    {fellowships.map(fellowship => (
                      <option key={fellowship.id} value={fellowship.id}>{fellowship.name}</option>
                    ))}
                  </select>
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
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Date & Time</h3>
              
              <div className="space-y-4">
                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
              
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
                      >
                        <option value="">Select platform</option>
                        {virtualPlatforms.map(platform => (
                          <option key={platform} value={platform}>{platform}</option>
                        ))}
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
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4">Attendance</h3>
              
              <div className="space-y-4">
                {/* Max Attendees */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                  />
                </div>

                {/* RSVP Required */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requiresRsvp}
                      onChange={(e) => handleInputChange('requiresRsvp', e.target.checked)}
                      className="mr-3 text-[#F5C451]"
                    />
                    <span className="text-white">Require RSVP</span>
                  </label>
                </div>

                {/* Allow Guests */}
                {formData.requiresRsvp && (
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowGuests}
                        onChange={(e) => handleInputChange('allowGuests', e.target.checked)}
                        className="mr-3 text-[#F5C451]"
                      />
                      <span className="text-white">Allow guests</span>
                    </label>
                    
                    {formData.allowGuests && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Maximum Guests per Person
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.maxGuests}
                          onChange={(e) => handleInputChange('maxGuests', parseInt(e.target.value))}
                          className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                        />
                      </div>
                    )}
                  </div>
                )}
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
                  <span>Create Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
