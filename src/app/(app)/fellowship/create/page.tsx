'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useToast } from '@/components/ui/Toast'
import BackButton from '@/components/BackButton'
import { FellowshipService } from '@/lib/fellowship-service'
import { FellowshipGroup } from '@/types'
import { GroupPlannerRequest, GroupPlannerAPIResponse } from '@/types/group-planner'
import { 
  MapPin, 
  Users, 
  Calendar, 
  Tag, 
  Lock, 
  Globe,
  Heart,
  BookOpen,
  Sparkles
} from 'lucide-react'

export default function CreateGroupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const { profile, isSteward, isLoading: profileLoading } = useUserProfile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAiSection, setShowAiSection] = useState(false)
  const [aiGoal, setAiGoal] = useState('')
  const [aiLocationHint, setAiLocationHint] = useState('')
  const [aiAudience, setAiAudience] = useState('')
  const [aiMeetingFrequency, setAiMeetingFrequency] = useState('weekly')
  const [aiTone, setAiTone] = useState<'chill' | 'structured' | 'deep' | 'social'>('chill')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  // Redirect if user is not a steward
  useEffect(() => {
    if (!profileLoading && profile) {
      if (!isSteward) {
        toast({
          title: 'Access Restricted',
          description: 'Only Stewards can create groups.',
          variant: 'error',
          duration: 4000,
        })
        router.replace('/fellowship')
      }
    }
  }, [profile, isSteward, profileLoading, router, toast])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    group_type: 'fellowship' as FellowshipGroup['group_type'],
    is_private: false,
    location: '',
    meeting_schedule: '',
    meeting_location: '',
    max_members: '',
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const groupData = {
        name: formData.name,
        description: formData.description,
        group_type: formData.group_type,
        is_private: formData.is_private,
        location: formData.location || undefined,
        meeting_schedule: formData.meeting_schedule || undefined,
        meeting_location: formData.meeting_location || undefined,
        max_members: formData.max_members ? parseInt(formData.max_members) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        created_by: user.id,
        is_active: true,
      }

      const group = await FellowshipService.createGroup(groupData)
      router.push(`/fellowship/${group.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create group')
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

  const handleGenerateWithAI = async () => {
    if (!aiGoal.trim()) {
      setAiError('Please describe the group you want to start')
      return
    }

    setAiLoading(true)
    setAiError('')

    try {
      const requestBody: GroupPlannerRequest = {
        goal: aiGoal.trim(),
        location_hint: aiLocationHint.trim() || undefined,
        audience: aiAudience.trim() || undefined,
        meeting_frequency: aiMeetingFrequency || undefined,
        tone: aiTone
      }

      const response = await fetch('/api/agents/GroupPlanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Failed to generate group setup')
      }

      const result: GroupPlannerAPIResponse = await response.json()

      if (!result.data) {
        throw new Error('Invalid response from Group Planner')
      }

      const data = result.data

      // Quality safeguards
      // Deduplicate tags (case-insensitive)
      const uniqueTags = Array.from(new Set(
        data.suggested_tags.map(tag => tag.toLowerCase().trim())
      )).filter(tag => tag.length > 0)

      // Ensure name isn't empty
      const safeName = data.suggested_name?.trim() || `Fellowship Group - ${new Date().toLocaleDateString()}`

      // Truncate short description to 120 chars
      const safeShortDesc = data.suggested_short_description 
        ? data.suggested_short_description.substring(0, 120).trim()
        : ''

      // Auto-fill form with AI suggestions
      setFormData(prev => ({
        ...prev,
        name: safeName,
        description: data.suggested_full_description || prev.description,
        location: aiLocationHint || prev.location,
        meeting_schedule: data.suggested_meeting_schedule || prev.meeting_schedule,
        tags: uniqueTags.join(', '),
        is_private: data.suggested_privacy === 'private'
      }))

      // Show success message
      toast({
        title: 'Group setup generated!',
        description: 'Review and edit the form fields as needed.',
        variant: 'success',
        duration: 3000,
      })

      // Optionally hide the AI section after successful generation
      setShowAiSection(false)
    } catch (err: any) {
      console.error('GroupPlanner error:', err)
      setAiError(err.message || 'Failed to generate group setup. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'bible_study':
        return <BookOpen className="w-5 h-5" />
      case 'prayer_group':
        return <Sparkles className="w-5 h-5" />
      default:
        return <Heart className="w-5 h-5" />
    }
  }

  // Show loading while checking role
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render form if user is not a steward
  if (!isSteward) {
    return null
  }

  return (
    <>
      <BackButton label="Create Fellowship Group" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* AI Assistance Section - Only visible to Stewards */}
        {isSteward && (
          <div className="mb-8 bg-gradient-to-br from-navy-800/40 to-indigo-800/40 border border-gold-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <h2 className="text-lg font-semibold text-slate-50">
                  Create with AI
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSection(!showAiSection)}
                className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
              >
                {showAiSection ? 'Hide' : 'Show'}
              </button>
            </div>

            {showAiSection && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="ai-goal" className="block text-sm font-medium text-slate-200 mb-2">
                    Describe the group you want to start *
                  </label>
                  <textarea
                    id="ai-goal"
                    value={aiGoal}
                    onChange={(e) => setAiGoal(e.target.value)}
                    placeholder="e.g., a chill weekly young adults bible study in Dartford on Saturdays, welcoming new believers"
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-navy-900/60 text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 resize-none"
                    rows={3}
                    disabled={aiLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="ai-location" className="block text-sm font-medium text-slate-200 mb-2">
                      Location (optional)
                    </label>
                    <input
                      id="ai-location"
                      type="text"
                      value={aiLocationHint}
                      onChange={(e) => setAiLocationHint(e.target.value)}
                      placeholder="e.g., Dartford, Kent"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-navy-900/60 text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      disabled={aiLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="ai-audience" className="block text-sm font-medium text-slate-200 mb-2">
                      Audience (optional)
                    </label>
                    <input
                      id="ai-audience"
                      type="text"
                      value={aiAudience}
                      onChange={(e) => setAiAudience(e.target.value)}
                      placeholder="e.g., young adults, new believers"
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-navy-900/60 text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      disabled={aiLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="ai-frequency" className="block text-sm font-medium text-slate-200 mb-2">
                      Meeting Frequency
                    </label>
                    <select
                      id="ai-frequency"
                      value={aiMeetingFrequency}
                      onChange={(e) => setAiMeetingFrequency(e.target.value)}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg bg-navy-900/60 text-slate-50 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      disabled={aiLoading}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ai-tone" className="block text-sm font-medium text-slate-200 mb-2">
                    Tone
                  </label>
                  <select
                    id="ai-tone"
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value as 'chill' | 'structured' | 'deep' | 'social')}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-navy-900/60 text-slate-50 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    disabled={aiLoading}
                  >
                    <option value="chill">Chill</option>
                    <option value="structured">Structured</option>
                    <option value="deep">Deep</option>
                    <option value="social">Social</option>
                  </select>
                </div>

                {aiError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-400">{aiError}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={aiLoading || !aiGoal.trim()}
                  className="w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-navy-900 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-900"></div>
                      <span>Creating your group setup...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate group setup</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400">
                  The AI will suggest a name, descriptions, meeting schedule, tags, privacy setting, rules, and welcome message. You can edit all fields before submitting.
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              {/* Group Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Downtown Bible Study Group"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Group Type */}
              <div>
                <label htmlFor="group_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'bible_study', label: 'Bible Study', icon: <BookOpen className="w-4 h-4" /> },
                    { value: 'prayer_group', label: 'Prayer Group', icon: <Sparkles className="w-4 h-4" /> },
                    { value: 'fellowship', label: 'Fellowship', icon: <Heart className="w-4 h-4" /> },
                    { value: 'youth_group', label: 'Youth Group', icon: <Users className="w-4 h-4" /> },
                    { value: 'senior_group', label: 'Senior Group', icon: <Users className="w-4 h-4" /> },
                    { value: 'mixed', label: 'Mixed Ages', icon: <Users className="w-4 h-4" /> },
                  ].map((type) => (
                    <label key={type.value} className="relative">
                      <input
                        type="radio"
                        name="group_type"
                        value={type.value}
                        checked={formData.group_type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.group_type === type.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {type.icon}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="input-field"
                  placeholder="Describe your group's purpose, activities, and what members can expect..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Privacy Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Privacy Setting
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_private"
                      value="false"
                      checked={!formData.is_private}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Public Group</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Anyone can find and join your group
                        </div>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_private"
                      value="true"
                      checked={formData.is_private}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Private Group</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Members must request to join and be approved
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Meeting Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Location & Meeting Details</h2>
            
            <div className="space-y-6">
              {/* General Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  General Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="input-field pl-10"
                    placeholder="e.g., Downtown Seattle, WA"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Meeting Schedule */}
              <div>
                <label htmlFor="meeting_schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Schedule
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="meeting_schedule"
                    name="meeting_schedule"
                    type="text"
                    className="input-field pl-10"
                    placeholder="e.g., Every Sunday at 10:00 AM"
                    value={formData.meeting_schedule}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Meeting Location */}
              <div>
                <label htmlFor="meeting_location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specific Meeting Location
                </label>
                <input
                  id="meeting_location"
                  name="meeting_location"
                  type="text"
                  className="input-field"
                  placeholder="e.g., First Baptist Church, Room 201"
                  value={formData.meeting_location}
                  onChange={handleChange}
                />
              </div>

              {/* Max Members */}
              <div>
                <label htmlFor="max_members" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Members (Optional)
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="max_members"
                    name="max_members"
                    type="number"
                    min="2"
                    className="input-field pl-10"
                    placeholder="Leave empty for unlimited"
                    value={formData.max_members}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Tags</h2>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  className="input-field pl-10"
                  placeholder="e.g., young adults, prayer, scripture study, community service"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Separate tags with commas. Tags help others find your group.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Group...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}








