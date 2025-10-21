'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { EventService } from '@/lib/event-service'
import type { Event } from '@/types'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  BookOpen,
  Heart,
  Megaphone,
  Hand,
  Monitor
} from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const eventsData = await EventService.getEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'bible_study':
        return <BookOpen className="w-5 h-5" />
      case 'prayer_meeting':
        return <Heart className="w-5 h-5" />
      case 'worship':
        return <Heart className="w-5 h-5" />
      case 'evangelism':
        return <Megaphone className="w-5 h-5" />
      case 'community_service':
        return <Hand className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join our community events and grow together in faith
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const { date, time } = formatEventDate(event.start_time)
            
            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventTypeColor(event.event_type)}`}>
                      {getEventTypeIcon(event.event_type)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {event.rsvp_count} going
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.is_virtual && (
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4" />
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </div>

                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No events scheduled
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for upcoming events
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
