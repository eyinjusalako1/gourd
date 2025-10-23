'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { EventService } from '@/lib/event-service'
import type { Event, EventRSVP } from '@/types'
import Logo from '@/components/Logo'
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
  Heart,
  Megaphone,
  Hand,
  Settings,
  CheckCircle,
  UserPlus,
  MessageCircle,
  Share2,
  Copy
} from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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

  const loadEventData = useCallback(async () => {
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
  }, [params.id, user])

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

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
        return <Heart className="w-6 h-6" />
      case 'worship':
        return <Heart className="w-6 h-6" />
      case 'evangelism':
        return <Megaphone className="w-6 h-6" />
      case 'community_service':
        return <Hand className="w-6 h-6" />
      default:
        return <Calendar className="w-6 h-6" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'bible_study':
        return 'bg-blue-500'
      case 'prayer_meeting':
        return 'bg-purple-500'
      case 'worship':
        return 'bg-red-500'
      case 'evangelism':
        return 'bg-green-500'
      case 'community_service':
        return 'bg-orange-500'
      default:
        return 'bg-[#F5C451]'
    }
  }

  const getEventTypeAccent = (type: string) => {
    switch (type) {
      case 'bible_study':
        return 'border-blue-500'
      case 'prayer_meeting':
        return 'border-purple-500'
      case 'worship':
        return 'border-red-500'
      case 'evangelism':
        return 'border-green-500'
      case 'community_service':
        return 'border-orange-500'
      default:
        return 'border-[#D4AF37]'
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
        return 'bg-green-500 text-white'
      case 'maybe':
        return 'bg-yellow-500 text-white'
      case 'not_going':
        return 'bg-red-500 text-white'
      default:
        return 'bg-white/10 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1433]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5C451] mx-auto"></div>
          <p className="mt-4 text-white/80">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1433]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-white/80 mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button 
            onClick={() => router.push('/events')} 
            className="bg-[#F5C451] text-[#0F1433] px-6 py-3 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
          >
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
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventTypeColor(event.event_type)}`}>
                  {getEventTypeIcon(event.event_type)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{event.title}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-white/80">
                      {event.is_virtual ? (
                        <Monitor className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span>{event.is_virtual ? 'Virtual Event' : 'In-Person Event'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-white/80">
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
                className="p-2 text-white/60 hover:text-white transition-colors"
                title="Share event"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {event.created_by === user?.id && (
                <button className="p-2 text-white/60 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Description */}
        <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-semibold text-white mb-4 relative z-10">About This Event</h2>
          <p className="text-white/80 leading-relaxed whitespace-pre-wrap relative z-10">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-semibold text-white mb-4 relative z-10">Event Details</h2>
          <div className="space-y-4 relative z-10">
            {/* Date & Time */}
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-[#F5C451] mt-0.5" />
              <div>
                <div className="font-medium text-white">Date & Time</div>
                <div className="text-white/80">
                  {date} at {time} - {endTime}
                </div>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#F5C451] mt-0.5" />
                <div>
                  <div className="font-medium text-white">Location</div>
                  <div className="text-white/80">{event.location}</div>
                </div>
              </div>
            )}

            {/* Virtual Link */}
            {event.is_virtual && event.virtual_link && (
              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-[#F5C451] mt-0.5" />
                <div>
                  <div className="font-medium text-white">Virtual Meeting</div>
                  <a 
                    href={event.virtual_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F5C451] hover:text-[#D4AF37] break-all"
                  >
                    {event.virtual_link}
                  </a>
                  <div className="text-sm text-white/60 mt-1">
                    Platform: {event.virtual_platform}
                  </div>
                </div>
              </div>
            )}

            {/* Attendees */}
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-[#F5C451] mt-0.5" />
              <div>
                <div className="font-medium text-white">Attendees</div>
                <div className="text-white/80">
                  {event.rsvp_count} going
                  {event.max_attendees && ` (max ${event.max_attendees})`}
                </div>
              </div>
            </div>

            {/* Recurring */}
            {event.is_recurring && (
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#F5C451] mt-0.5" />
                <div>
                  <div className="font-medium text-white">Recurring Event</div>
                  <div className="text-white/80">
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
          <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <h2 className="text-xl font-semibold text-white mb-4 relative z-10">Tags</h2>
            <div className="flex flex-wrap gap-2 relative z-10">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-[#D4AF37]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RSVP */}
        {user && event.requires_rsvp && (
          <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-white mb-4 relative z-10">RSVP</h3>
            
            {userRsvp ? (
              <div className="space-y-3 relative z-10">
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getRsvpStatusColor(userRsvp.status)}`}>
                  You&apos;re {userRsvp.status === 'going' ? 'going' : userRsvp.status === 'maybe' ? 'maybe going' : 'not going'}
                </div>
                {userRsvp.guest_count && userRsvp.guest_count > 0 && (
                  <div className="text-sm text-white/80">
                    Bringing {userRsvp.guest_count} guest{userRsvp.guest_count !== 1 ? 's' : ''}
                  </div>
                )}
                {userRsvp.notes && (
                  <div className="text-sm text-white/80">
                    Note: {userRsvp.notes}
                  </div>
                )}
                <button
                  onClick={() => setShowRsvpModal(true)}
                  className="w-full bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50"
                >
                  Update RSVP
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowRsvpModal(true)}
                className="w-full bg-[#F5C451] text-[#0F1433] py-3 px-4 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors flex items-center justify-center space-x-2 relative z-10"
              >
                <UserPlus className="w-5 h-5" />
                <span>RSVP Now</span>
              </button>
            )}
          </div>
        )}

        {/* Attendees */}
        <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
          <h3 className="text-lg font-semibold text-white mb-4 relative z-10">
            Attendees ({rsvps.filter(r => r.status === 'going').length})
          </h3>
          <div className="space-y-3 relative z-10">
            {rsvps.filter(r => r.status === 'going').slice(0, 5).map((rsvp) => (
              <div key={rsvp.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#F5C451] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-[#0F1433]">
                    {(rsvp as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {(rsvp as any).user?.user_metadata?.name || 'Unknown User'}
                  </div>
                  {rsvp.guest_count && rsvp.guest_count > 0 && (
                    <div className="text-xs text-white/60">
                      +{rsvp.guest_count} guest{rsvp.guest_count !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {rsvps.filter(r => r.status === 'going').length > 5 && (
              <div className="text-sm text-white/60 text-center pt-2">
                +{rsvps.filter(r => r.status === 'going').length - 5} more attendees
              </div>
            )}
          </div>
        </div>

        {/* Maybe Going */}
        {rsvps.filter(r => r.status === 'maybe').length > 0 && (
          <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-white mb-4 relative z-10">
              Maybe Going ({rsvps.filter(r => r.status === 'maybe').length})
            </h3>
            <div className="space-y-3 relative z-10">
              {rsvps.filter(r => r.status === 'maybe').slice(0, 3).map((rsvp) => (
                <div key={rsvp.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {(rsvp as any).user?.user_metadata?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {(rsvp as any).user?.user_metadata?.name || 'Unknown User'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVP Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F1433] border border-[#D4AF37]/30 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">RSVP to Event</h3>
            
            <div className="space-y-4">
              {/* RSVP Status */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Will you attend?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'going', label: 'Going', color: 'bg-green-500 text-white' },
                    { value: 'maybe', label: 'Maybe', color: 'bg-yellow-500 text-white' },
                    { value: 'not_going', label: 'Not Going', color: 'bg-red-500 text-white' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rsvpStatus"
                        value={option.value}
                        checked={rsvpStatus === option.value}
                        onChange={(e) => setRsvpStatus(e.target.value as any)}
                        className="mr-3 text-[#F5C451]"
                      />
                      <span className="text-sm font-medium text-white">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              {event.allow_guests && (
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium text-white mb-2">
                    Number of Guests
                  </label>
                  <input
                    id="guestCount"
                    type="number"
                    min="0"
                    max="10"
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="rsvpNotes" className="block text-sm font-medium text-white mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="rsvpNotes"
                  className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
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
                className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50"
              >
                Cancel
              </button>
              <button
                onClick={handleRsvp}
                disabled={rsvpLoading}
                className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 px-4 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

