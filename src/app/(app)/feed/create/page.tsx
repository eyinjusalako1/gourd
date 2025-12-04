'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { PostService } from '@/lib/post-service'
import { FellowshipService } from '@/lib/fellowship-service'
import { EventService } from '@/lib/event-service'
import { ModerationService } from '@/lib/moderation-service'
import { BibleStudyService } from '@/lib/bible-study-service'
import { Post, FellowshipGroup, Event } from '@/types'
import { 
  ArrowLeft, 
  Heart,
  BookOpen,
  Sparkles,
  HeartHandshake,
  MessageCircle,
  Tag,
  Users,
  Calendar,
  Pin,
  Star
} from 'lucide-react'

export default function CreatePostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userGroups, setUserGroups] = useState<FellowshipGroup[]>([])
  const [userEvents, setUserEvents] = useState<Event[]>([])
  
  const [formData, setFormData] = useState({
    content: '',
    post_type: 'general' as Post['post_type'],
    tags: '',
    group_id: '',
    event_id: '',
    scripture_reference: '',
    prayer_category: 'other' as Post['prayer_category'],
  })
  const [suggestedVerses, setSuggestedVerses] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      loadUserData()
      loadSuggestedVerses()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user?.id) return
    try {
      const [groups, events] = await Promise.all([
        FellowshipService.getGroups(user.id),
        EventService.getUserEvents(user.id)
      ])
      setUserGroups(groups)
      setUserEvents(events)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const loadSuggestedVerses = async () => {
    try {
      const verses = await BibleStudyService.getPopularVerses('encouragement')
      setSuggestedVerses(verses.slice(0, 3))
    } catch (error) {
      console.error('Error loading suggested verses:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      // AI Content Moderation
      const moderationResult = await ModerationService.analyzeContent(formData.content, 'post')
      
      if (!moderationResult.isApproved) {
        setError(`Content not approved: ${moderationResult.reason}. Suggestions: ${moderationResult.suggestions.join(', ')}`)
        setLoading(false)
        return
      }

      const postData = {
        content: formData.content,
        post_type: formData.post_type,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        group_id: formData.group_id || undefined,
        event_id: formData.event_id || undefined,
        scripture_reference: formData.post_type === 'scripture' ? formData.scripture_reference : undefined,
        prayer_category: formData.post_type === 'prayer_request' ? formData.prayer_category : undefined,
        author_id: user.id,
        is_active: true,
        is_pinned: false,
        is_featured: false,
      }

      const post = await PostService.createPost(postData)
      router.push(`/feed/${post.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create post')
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

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'testimony':
        return <Heart className="w-4 h-4" />
      case 'scripture':
        return <BookOpen className="w-4 h-4" />
      case 'prayer_request':
        return <Sparkles className="w-4 h-4" />
      case 'encouragement':
        return <HeartHandshake className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getPostTypeDescription = (type: string) => {
    switch (type) {
      case 'testimony':
        return 'Share your personal testimony of God\'s work in your life'
      case 'scripture':
        return 'Share a Bible verse or passage that has inspired you'
      case 'prayer_request':
        return 'Request prayer for yourself or others'
      case 'encouragement':
        return 'Encourage and uplift fellow believers'
      default:
        return 'Share general thoughts and updates'
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Share with Community</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Share testimonies, scripture, encouragement, or prayer requests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Post Type */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">What would you like to share?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'testimony', label: 'Testimony', icon: <Heart className="w-4 h-4" />, color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
                { value: 'scripture', label: 'Scripture', icon: <BookOpen className="w-4 h-4" />, color: 'bg-gold-100 text-gold-600 dark:bg-gold-900 dark:text-gold-400' },
                { value: 'prayer_request', label: 'Sparkles Request', icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
                { value: 'encouragement', label: 'Encouragement', icon: <HeartHandshake className="w-4 h-4" />, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
                { value: 'general', label: 'General', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' },
              ].map((type) => (
                <label key={type.value} className="relative">
                  <input
                    type="radio"
                    name="post_type"
                    value={type.value}
                    checked={formData.post_type === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.post_type === type.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type.color}`}>
                        {type.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getPostTypeDescription(type.value)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Message</h2>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                required
                className="input-field"
                placeholder={
                  formData.post_type === 'testimony' 
                    ? "Share your testimony of how God has worked in your life..."
                    : formData.post_type === 'scripture'
                    ? "Share a Bible verse or passage that has inspired you..."
                    : formData.post_type === 'prayer_request'
                    ? "Share your prayer request and how others can pray for you..."
                    : formData.post_type === 'encouragement'
                    ? "Encourage and uplift fellow believers with your words..."
                    : "Share your thoughts with the community..."
                }
                value={formData.content}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.content.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Scripture Reference */}
          {formData.post_type === 'scripture' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Scripture Reference</h2>
              
              <div>
                <label htmlFor="scripture_reference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bible Reference
                </label>
                <input
                  id="scripture_reference"
                  name="scripture_reference"
                  type="text"
                  className="input-field"
                  placeholder="e.g., John 3:16, Romans 8:28, Psalm 23"
                  value={formData.scripture_reference}
                  onChange={handleChange}
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Include the book, chapter, and verse(s) for the scripture you&apos;re sharing
                </p>
              </div>
            </div>
          )}

          {/* Sparkles Category */}
          {formData.post_type === 'prayer_request' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sparkles Category</h2>
              
              <div>
                <label htmlFor="prayer_category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="prayer_category"
                  name="prayer_category"
                  className="input-field"
                  value={formData.prayer_category}
                  onChange={handleChange}
                >
                  <option value="healing">Healing</option>
                  <option value="guidance">Guidance</option>
                  <option value="family">Family</option>
                  <option value="work">Work</option>
                  <option value="ministry">Ministry</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Association */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Association (Optional)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fellowship Group */}
              {userGroups.length > 0 && (
                <div>
                  <label htmlFor="group_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fellowship Group
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="group_id"
                      name="group_id"
                      className="input-field pl-10"
                      value={formData.group_id}
                      onChange={handleChange}
                    >
                      <option value="">No group association</option>
                      {userGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Event */}
              {userEvents.length > 0 && (
                <div>
                  <label htmlFor="event_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="event_id"
                      name="event_id"
                      className="input-field pl-10"
                      value={formData.event_id}
                      onChange={handleChange}
                    >
                      <option value="">No event association</option>
                      {userEvents.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Verses */}
          {formData.post_type === 'scripture' && suggestedVerses.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Suggested Verses</h2>
              
              <div className="space-y-3">
                {suggestedVerses.map((verse, index) => (
                  <div key={index} className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-lg p-4">
                    <blockquote className="text-gray-900 dark:text-white mb-2">
                      &quot;{verse.text}&quot;
                    </blockquote>
                    <cite className="text-sm text-gold-700 dark:text-gold-300 mb-3 block">
                      {verse.book} {verse.chapter}:{verse.verse} ({verse.translation})
                    </cite>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          content: `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`,
                          scripture_reference: `${verse.book} ${verse.chapter}:${verse.verse}`
                        }))
                      }}
                      className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                    >
                      Use this verse
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  placeholder="e.g., faith, healing, encouragement, testimony"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Separate tags with commas. Tags help others find your post.
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
              disabled={loading || !formData.content.trim()}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sharing...' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
