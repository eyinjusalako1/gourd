'use client'

import { useState } from 'react'
import { X, Users, MapPin, Clock, Calendar, Star, CheckCircle, AlertCircle } from 'lucide-react'

interface Fellowship {
  id: string
  name: string
  description: string
  location: string
  memberCount: number
  category: string
  meetingDay: string
  meetingTime: string
  isOnline: boolean
  rating: number
  distance: string
}

interface FellowshipJoinModalProps {
  fellowship: Fellowship
  isOpen: boolean
  onClose: () => void
  onJoin: (fellowshipId: string) => void
}

export default function FellowshipJoinModal({ fellowship, isOpen, onClose, onJoin }: FellowshipJoinModalProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [joinSuccess, setJoinSuccess] = useState(false)

  if (!isOpen) return null

  const handleJoin = async () => {
    setIsJoining(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsJoining(false)
    setJoinSuccess(true)
    
    // Call the parent onJoin function
    onJoin(fellowship.id)
    
    // Auto close after success
    setTimeout(() => {
      onClose()
      setJoinSuccess(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-[#0F1433]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1433] border border-[#D4AF37] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Join Fellowship</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!joinSuccess ? (
          <>
            {/* Fellowship Details */}
            <div className="bg-white/5 border border-[#D4AF37]/50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {fellowship.name}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-2">
                    {fellowship.description}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-[#F5C451] fill-current" />
                    <span className="text-sm text-white/80">{fellowship.rating}</span>
                  </div>
                </div>
              </div>

              {/* Fellowship Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <MapPin className="w-4 h-4 text-[#F5C451]" />
                  <span>{fellowship.location}</span>
                  <span className="text-[#F5C451] font-medium">• {fellowship.distance}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <Calendar className="w-4 h-4 text-[#F5C451]" />
                  <span>{fellowship.meetingDay}</span>
                  <Clock className="w-4 h-4 ml-2 text-[#F5C451]" />
                  <span>{fellowship.meetingTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <Users className="w-4 h-4 text-[#F5C451]" />
                  <span>{fellowship.memberCount} members</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  fellowship.category === 'Bible Study' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  fellowship.category === 'Prayer' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  fellowship.category === 'Fellowship' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  fellowship.category === 'Accountability' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {fellowship.category}
                </span>
              </div>
            </div>

            {/* Join Information */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">What happens next?</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• You&apos;ll be added to the fellowship group chat</li>
                    <li>• Receive notifications about upcoming meetings</li>
                    <li>• Access fellowship resources and materials</li>
                    <li>• Connect with other members</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1433]"></div>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Join Fellowship</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Welcome to {fellowship.name}!</h3>
            <p className="text-white/80 mb-6">
              You&apos;ve successfully joined the fellowship. Check your dashboard for updates and group chat access.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <p className="text-green-300 text-sm">
                You&apos;ll receive a welcome message and meeting details shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



