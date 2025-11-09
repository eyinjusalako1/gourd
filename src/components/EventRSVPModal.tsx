'use client'

import { useState } from 'react'
import { X, Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, Download } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  attendees: number
  maxAttendees?: number
  isOnline: boolean
  organizer: string
  image?: string
}

interface EventRSVPModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
  onRSVP: (eventId: string, rsvpType: 'going' | 'interested' | 'not-going') => void
  currentRSVP?: 'going' | 'interested' | 'not-going' | null
}

export default function EventRSVPModal({ event, isOpen, onClose, onRSVP, currentRSVP }: EventRSVPModalProps) {
  const [selectedRSVP, setSelectedRSVP] = useState<'going' | 'interested' | 'not-going' | null>(currentRSVP || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleRSVP = async (rsvpType: 'going' | 'interested' | 'not-going') => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Call the parent onRSVP function
    onRSVP(event.id, rsvpType)
    
    // Auto close after success
    setTimeout(() => {
      onClose()
      setIsSuccess(false)
    }, 2000)
  }

  const handleAddToCalendar = () => {
    // Create calendar event data
    const startDate = new Date(`${event.date}T${event.time}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
    
    const calendarData = {
      title: event.title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      location: event.location,
      description: event.description
    }
    
    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(calendarData.description)}&location=${encodeURIComponent(calendarData.location)}`
    
    window.open(googleCalendarUrl, '_blank')
  }

  const getRSVPButtonStyle = (type: 'going' | 'interested' | 'not-going') => {
    const baseStyle = "flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
    
    if (selectedRSVP === type) {
      switch (type) {
        case 'going':
          return `${baseStyle} bg-[#F5C451] text-[#0F1433] shadow-lg transform scale-105`
        case 'interested':
          return `${baseStyle} bg-blue-500 text-white shadow-lg transform scale-105`
        case 'not-going':
          return `${baseStyle} bg-red-500 text-white shadow-lg transform scale-105`
      }
    }
    
    return `${baseStyle} bg-white/10 text-white hover:bg-white/20 border border-[#D4AF37]/50`
  }

  const getRSVPText = (type: 'going' | 'interested' | 'not-going') => {
    if (selectedRSVP === type) {
      switch (type) {
        case 'going':
          return 'Going ✓'
        case 'interested':
          return 'Interested ✓'
        case 'not-going':
          return 'Not Going ✓'
      }
    }
    
    switch (type) {
      case 'going':
        return 'Going'
      case 'interested':
        return 'Interested'
      case 'not-going':
        return 'Not Going'
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0F1433]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1433] border border-[#D4AF37] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">RSVP to Event</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <>
            {/* Event Details */}
            <div className="bg-white/5 border border-[#D4AF37]/50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {event.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Event Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <Calendar className="w-4 h-4 text-[#F5C451]" />
                  <span>{event.date}</span>
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

              {/* Category Badge */}
              <div className="mt-3">
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

            {/* Capacity Warning */}
            {event.maxAttendees && event.attendees >= event.maxAttendees * 0.9 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-orange-300 font-medium mb-1">Almost Full!</h4>
                    <p className="text-orange-200 text-sm">
                      This event is {Math.round((event.attendees / event.maxAttendees) * 100)}% full. 
                      RSVP soon to secure your spot!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* RSVP Options */}
            <div className="space-y-3 mb-6">
              <h4 className="text-white font-medium mb-3">How will you respond?</h4>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedRSVP('going')}
                  className={getRSVPButtonStyle('going')}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{getRSVPText('going')}</span>
                </button>
                
                <button
                  onClick={() => setSelectedRSVP('interested')}
                  className={getRSVPButtonStyle('interested')}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{getRSVPText('interested')}</span>
                </button>
                
                <button
                  onClick={() => setSelectedRSVP('not-going')}
                  className={getRSVPButtonStyle('not-going')}
                >
                  <X className="w-4 h-4" />
                  <span>{getRSVPText('not-going')}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {selectedRSVP && (
                <button
                  onClick={() => handleRSVP(selectedRSVP)}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1433]"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm RSVP</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={handleAddToCalendar}
                className="w-full bg-white/10 border border-[#D4AF37] text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">RSVP Confirmed!</h3>
            <p className="text-white/80 mb-6">
              You&apos;ve successfully RSVP&apos;d to {event.title}. 
              We&apos;ll send you a reminder before the event.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <p className="text-green-300 text-sm">
                Check your email for event details and calendar invite.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



