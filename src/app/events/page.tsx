'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { EventService } from '@/lib/event-service'
import type { Event } from '@/types'
import AppHeader from '@/components/AppHeader'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  BookOpen,
  Heart,
  Megaphone,
  Hand,
  Monitor,
  ArrowRight,
  Filter
} from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

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
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const categories = ['All', 'Bible Study', 'Prayer', 'Worship', 'Outreach', 'Social']
  
  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => {
        const typeMap: Record<string, string> = {
          'Bible Study': 'bible_study',
          'Prayer': 'prayer_meeting',
          'Worship': 'worship',
          'Outreach': 'evangelism',
          'Social': 'community_service'
        }
        return event.event_type === typeMap[selectedCategory]
      })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1433] pb-20">
        <AppHeader title="Events" subtitle="Find your next fellowship" backHref="/dashboard" />
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {[0,1,2,3].map((i) => (
            <div key={i} className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
              <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10" />
                  <div className="w-16 h-4 bg-white/10 rounded" />
                </div>
                <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-5/6 mb-4" />
                <div className="flex space-x-2">
                  <div className="h-6 w-20 bg-white/10 rounded-full" />
                  <div className="h-6 w-16 bg-white/10 rounded-full" />
                  <div className="h-6 w-24 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Events" subtitle="Join our community events and grow together in faith" backHref="/dashboard" />

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Filter Events</h2>
            <Filter className="w-5 h-5 text-[#F5C451]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#F5C451] text-[#0F1433]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const { date, time } = formatEventDate(event.start_time)
            
            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className={`bg-white/5 border ${getEventTypeAccent(event.event_type)} rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg relative overflow-hidden`}>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventTypeColor(event.event_type)}`}>
                      {getEventTypeIcon(event.event_type)}
                    </div>
                    <div className="text-sm text-white/80">
                      {event.rsvp_count} going
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 relative z-10">
                    {event.title}
                  </h3>

                  <p className="text-white/80 mb-4 leading-relaxed relative z-10">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-white/70 mb-4 relative z-10">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#F5C451]" />
                      <span>{date}</span>
                      <Clock className="w-4 h-4 ml-2 text-[#F5C451]" />
                      <span>{time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#F5C451]" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.is_virtual && (
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4 text-[#F5C451]" />
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </div>

                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-[#D4AF37]/30"
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

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No events found
            </h3>
            <p className="text-white/80">
              {selectedCategory === 'All' 
                ? 'No events scheduled at this time'
                : `No ${selectedCategory.toLowerCase()} events found`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
