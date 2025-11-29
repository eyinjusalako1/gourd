'use client'

import { useState } from 'react'
import { Users, Church, ArrowRight, Search, Calendar, Settings } from 'lucide-react'
import Logo from './Logo'

interface OnboardingFlowProps {
  onComplete: (userType: 'individual' | 'leader') => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'leader' | null>(null)
  const [step, setStep] = useState(1)

  const handleTypeSelection = (type: 'individual' | 'leader') => {
    setSelectedType(type)
    setStep(2)
  }

  const handleComplete = () => {
    if (selectedType) {
      onComplete(selectedType)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#0F1433] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Gathered</h1>
            <p className="text-white/80 text-lg">Let&apos;s find your perfect community fit</p>
          </div>

          {/* User Type Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white text-center mb-6">
              How would you like to use Gathered?
            </h2>

            {/* Individual User Option */}
            <button
              onClick={() => handleTypeSelection('individual')}
              className="w-full bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Become a Disciple
                  </h3>
                  <p className="text-white/70 text-sm">
                    Find small groups, Bible studies, and Christian community near you
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F5C451] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Church Leader Option */}
            <button
              onClick={() => handleTypeSelection('leader')}
              className="w-full bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Church className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Become a Steward
                  </h3>
                  <p className="text-white/70 text-sm">
                    Create and manage fellowships, events, and steward your community
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F5C451] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              You can always change this later in your settings
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2 && selectedType) {
    return (
      <div className="min-h-screen bg-[#0F1433] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedType === 'individual' ? 'Find Your Fellowship' : 'Build Your Community'}
            </h1>
            <p className="text-white/80 text-lg">
              {selectedType === 'individual' 
                ? 'Discover meaningful connections and grow in faith together'
                : 'Create spaces where faith flourishes and communities thrive'
              }
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-4 mb-8">
            {selectedType === 'individual' ? (
              <>
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                  <Search className="w-5 h-5 text-[#F5C451]" />
                  <span className="text-white">Browse fellowships by location and interest</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                  <Calendar className="w-5 h-5 text-[#F5C451]" />
                  <span className="text-white">Join events and Bible studies</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                  <Users className="w-5 h-5 text-[#F5C451]" />
                  <span className="text-white">Connect with like-minded believers</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                  <Church className="w-5 h-5 text-[#F5C451]" />
                  <span className="text-white">Create and manage fellowship groups</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                  <Calendar className="w-5 h-5 text-[#F5C451]" />
                  <span className="text-white">Organize events and Bible studies</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                  <Settings className="w-5 h-5 text-[#F5C451]" />
                  <span className="text-white">Track engagement and growth</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] py-4 rounded-xl font-semibold text-lg hover:from-[#F5C451] hover:to-[#D4AF37] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {selectedType === 'individual' ? 'Start Your Journey as a Disciple' : 'Start Stewarding Your Community'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
