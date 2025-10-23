'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Filter, ChevronDown } from 'lucide-react'
import EventRSVPModal from './EventRSVPModal'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees?: number
  category: 'Bible Study' | 'Prayer' | 'Outreach' | 'Social'
  description: string
  isJoined: boolean
  isInterested: boolean
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Morning Bible Study',
    date: '2024-01-28',
    time: '10:00 AM',
    location: 'Grace Community Church',
    attendees: 15,
    maxAttendees: 25,
    category: 'Bible Study',
    description: 'Join us for an in-depth study of the Book of Romans',
    isJoined: false,
    isInterested: true
  },
  {
    id: '2',
    title: 'Prayer Meeting',
    date: '2024-01-30',
    time: '7:00 PM',
    location: 'Online - Zoom',
    attendees: 8,
    category: 'Prayer',
    description: 'Community prayer session for healing and guidance',
    isJoined: true,
    isInterested: false
  },
  {
    id: '3',
    title: 'Community Outreach',
    date: '2024-02-03',
    time: '9:00 AM',
    location: 'Downtown Shelter',
    attendees: 12,
    maxAttendees: 20,
    category: 'Outreach',
    description: 'Volunteer at the local homeless shelter',
    isJoined: false,
    isInterested: false
  },
  {
    id: '4',
    title: 'Young Adults Social',
    date: '2024-02-05',
    time: '6:30 PM',
    location: 'Coffee Corner',
    attendees: 6,
    maxAttendees: 15,
    category: 'Social',
    description: 'Casual meetup for young adults in the community',
    isJoined: false,
    isInterested: true
  }
]

const categoryColors = {
  'Bible Study': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Prayer': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Outreach': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Social': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>(sampleEvents)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRSVPModal, setShowRSVPModal] = useState(false)
  const [rsvpStates, setRsvpStates] = useState<Record<string, 'going' | 'interested' | 'not-going'>>({})

  const categories = ['All', 'Bible Study', 'Prayer', 'Outreach', 'Social']

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory)

  const handleRSVP = (eventId: string, action: 'going' | 'interested' | 'not-going') => {
    setRsvpStates(prev => ({
      ...prev,
      [eventId]: action
    }))
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const previousRSVP = rsvpStates[eventId]
        let newAttendees = event.attendees
        
        // Adjust attendee count based on RSVP changes
        if (action === 'going' && previousRSVP !== 'going') {
          newAttendees = event.attendees + 1
        } else if (previousRSVP === 'going' && action !== 'going') {
          newAttendees = Math.max(0, event.attendees - 1)
        }
        
        return {
          ...event,
          attendees: newAttendees,
          isJoined: action === 'going',
          isInterested: action === 'interested'
        }
      }
      return event
    }))
  }

  const handleOpenRSVPModal = (event: Event) => {
    setSelectedEvent(event)
    setShowRSVPModal(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-4">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900 dark:text-white">
          Upcoming Events
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-2 bg-beige-100 dark:bg-beige-800 rounded-lg hover:bg-beige-200 dark:hover:bg-beige-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Category Filter */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gold-500 text-navy-900'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white/5 border border-[#D4AF37] rounded-xl p-4 mb-3 hover:shadow-lg transition-all duration-200 hover:bg-white/10 relative overflow-hidden">
            {/* Category accent line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              event.category === 'Bible Study' ? 'bg-blue-500' :
              event.category === 'Prayer' ? 'bg-purple-500' :
              event.category === 'Outreach' ? 'bg-green-500' :
              'bg-orange-500'
            }`}></div>
            
            {/* Event Header */}
            <div className="flex items-start justify-between mb-3 ml-2">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1 text-lg">
                  {event.title}
                </h3>
                <p className="text-sm text-white/80 mb-3 leading-relaxed">
                  {event.description}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  event.category === 'Bible Study' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  event.category === 'Prayer' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  event.category === 'Outreach' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                }`}>
                  {event.category}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-2 mb-4 ml-2">
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Calendar className="w-4 h-4 text-[#F5C451]" />
                <span>{formatDate(event.date)}</span>
                <Clock className="w-4 h-4 ml-2 text-[#F5C451]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-[#F5C451]" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Users className="w-4 h-4 text-[#F5C451]" />
                <span>
                  {event.attendees}
                  {event.maxAttendees && `/${event.maxAttendees}`} attending
                </span>
              </div>
            </div>

            {/* RSVP Button */}
            <div className="ml-2">
              <button
                onClick={() => handleOpenRSVPModal(event)}
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  rsvpStates[event.id] === 'going'
                    ? 'bg-[#F5C451] text-[#0F1433] shadow-lg transform scale-105'
                    : rsvpStates[event.id] === 'interested'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : rsvpStates[event.id] === 'not-going'
                    ? 'bg-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-[#D4AF37]/50'
                }`}
              >
                {rsvpStates[event.id] === 'going' ? 'Going ✓' :
                 rsvpStates[event.id] === 'interested' ? 'Interested ✓' :
                 rsvpStates[event.id] === 'not-going' ? 'Not Going ✓' :
                 'RSVP to Event'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No events found for this category</p>
        </div>
      )}

      {/* Event RSVP Modal */}
      {selectedEvent && (
        <EventRSVPModal
          event={selectedEvent}
          isOpen={showRSVPModal}
          onClose={() => {
            setShowRSVPModal(false)
            setSelectedEvent(null)
          }}
          onRSVP={handleRSVP}
          currentRSVP={rsvpStates[selectedEvent.id]}
        />
      )}
    </div>
  )
}

