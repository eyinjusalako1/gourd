'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { EventService } from '@/lib/event-service'
import { Event, EventRSVP } from '@/types'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock,
  Users,
  Monitor,
  Globe,
  Tag,
  BookOpen,
  Prayer,
  Heart,
  Megaphone,
  HandHeart,
  Settings,
  CheckCircle,
  UserPlus,
  MessageCircle,
  Share2,
  Copy
} from 'lucide-react'

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [rsvps, setRsvps] = useState<EventRSVP[]>([])
  const [userRsvp, setUserRsvp] = useState<EventRSVP | null>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [showRsvpModal, setShowRsvpModal] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not_going'>('going')
  const [guestCount, setGuestCount] = useState(0)
  const [rsvpNotes, setRsvpNotes] = useState('')

  useEffect(() => {
    loadEventData()
  }, [params.id, user])

  const loadEventData = async () => {
    try {
      const [eventData, rsvpsData] = await Promise.all([
        EventService.getEvent(params.id),
        EventService.getEventRSVPs(params.id)
      ])

      setEvent(eventData)
      setRsvps(rsvpsData)

      if (user) {
        const userRsvpData = await EventService.getUserRSVP(params.id, user.id)
        setUserRsvp(userRsvpData)
        if (userRsvpData) {
          setRsvpStatus(userRsvpData.status)
          setGuestCount(userRsvpData.guest_count || 0)
          setRsvpNotes(userRsvpData.notes || '')
        }
      }
    } catch (error) {
      console.error('Error loading event data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRsvp = async () => {
    if (!user || !event) return

    setRsvpLoading(true)
    try {
      await EventService.rsvpToEvent(params.id, user.id, rsvpStatus, guestCount, rsvpNotes)
      await loadEventData() // Refresh data
      setShowRsvpModal(false)
    } catch (error: any) {
      alert(error.message || 'Failed to RSVP')
    } finally {
      setRsvpLoading(false)
    }
  }

  const copyEventLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Event link copied to clipboard!')
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'bible_study':
        return <BookOpen className="w-6 h-6" />
      case 'prayer_meeting':
        return <Prayer className="w-6 h-6" />
      case 'worship':
        return <Heart className="w-6 h-6" />
      case 'evangelism':
        return <Megaphone className="w-6 h-6" />
      case 'community_service':
        return <HandHeart className="w-6 h-6" />
      default:
        return <Calendar className="w-6 h-6" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'bible_study':
        return 'bg-gold-100 text-gold-600 dark:bg-gold-900 dark:text-gold-400'
      case 'prayer_meeting':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
      case 'worship':
        return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
      case 'evangelism':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
      case 'community_service':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
      default:
        return 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const getRsvpStatusColor = (status: string) => {
    switch (status) {
      case 'going':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
      case 'maybe':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
      case 'not_going':
        return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/events')} className="btn-primary">
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const { date, time } = formatEventDate(event.start_time)
  const endTime = new Date(event.end_time).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getEventTypeColor(event.event_type)}`}>
                  {getEventTypeIcon(event.event_type)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      {event.is_virtual ? (
                        <Monitor className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span>{event.is_virtual ? 'Virtual Event' : 'In-Person Event'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{event.rsvp_count} going</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={copyEventLink}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Share event"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {event.created_by === user?.id && (
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h2>
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Date & Time</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {date} at {time} - {endTime}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Location</div>
                      <div className="text-gray-600 dark:text-gray-400">{event.location}</div>
                    </div>
                  </div>
                )}

                {/* Virtual Link */}
                {event.is_virtual && event.virtual_link && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Virtual Meeting</div>
                      <a 
                        href={event.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500 break-all"
                      >
                        {event.virtual_link}
                      </a>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Platform: {event.virtual_platform}
                      </div>
                    </div>
                  </div>
                )}

                {/* Attendees */}
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Attendees</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {event.rsvp_count} going
                      {event.max_attendees && ` (max ${event.max_attendees})`}
                    </div>
                  </div>
                </div>

                {/* Recurring */}
                {event.is_recurring && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Recurring Event</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {event.recurrence_pattern} event
                        {event.recurrence_end_date && ` until ${new Date(event.recurrence_end_date).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP */}
            {user && event.requires_rsvp && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">RSVP</h3>
                
                {userRsvp ? (
                  <div className="space-y-3">
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getRsvpStatusColor(userRsvp.status)}`}>
                      You're {userRsvp.status === 'going' ? 'going' : userRsvp.status === 'maybe' ? 'maybe going' : 'not going'}
                    </div>
                    {userRsvp.guest_count && userRsvp.guest_count > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Bringing {userRsvp.guest_count} guest{userRsvp.guest_count !== 1 ? 's' : ''}
                      </div>
                    )}
                    {userRsvp.notes && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Note: {userRsvp.notes}
                      </div>
                    )}
                    <button
                      onClick={() => setShowRsvpModal(true)}
                      className="w-full btn-secondary"
                    >
                      Update RSVP
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRsvpModal(true)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>RSVP Now</span>
                  </button>
                )}
              </div>
            )}

            {/* Attendees */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Attendees ({rsvps.filter(r => r.status === 'going').length})
              </h3>
              <div className="space-y-3">
                {rsvps.filter(r => r.status === 'going').slice(0, 5).map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {(rsvp as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {(rsvp as any).user?.user_metadata?.name || 'Unknown User'}
                      </div>
                      {rsvp.guest_count && rsvp.guest_count > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          +{rsvp.guest_count} guest{rsvp.guest_count !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {rsvps.filter(r => r.status === 'going').length > 5 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center pt-2">
                    +{rsvps.filter(r => r.status === 'going').length - 5} more attendees
                  </div>
                )}
              </div>
            </div>

            {/* Maybe Going */}
            {rsvps.filter(r => r.status === 'maybe').length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Maybe Going ({rsvps.filter(r => r.status === 'maybe').length})
                </h3>
                <div className="space-y-3">
                  {rsvps.filter(r => r.status === 'maybe').slice(0, 3).map((rsvp) => (
                    <div key={rsvp.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {(rsvp as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {(rsvp as any).user?.user_metadata?.name || 'Unknown User'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">RSVP to Event</h3>
            
            <div className="space-y-4">
              {/* RSVP Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Will you attend?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'going', label: 'Going', color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
                    { value: 'maybe', label: 'Maybe', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' },
                    { value: 'not_going', label: 'Not Going', color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rsvpStatus"
                        value={option.value}
                        checked={rsvpStatus === option.value}
                        onChange={(e) => setRsvpStatus(e.target.value as any)}
                        className="mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              {event.allow_guests && (
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Guests
                  </label>
                  <input
                    id="guestCount"
                    type="number"
                    min="0"
                    max="10"
                    className="input-field"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="rsvpNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="rsvpNotes"
                  className="input-field"
                  rows={3}
                  placeholder="Any additional information..."
                  value={rsvpNotes}
                  onChange={(e) => setRsvpNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRsvpModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRsvp}
                disabled={rsvpLoading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rsvpLoading ? 'Saving...' : 'Save RSVP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


