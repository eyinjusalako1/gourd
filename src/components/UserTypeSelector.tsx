'use client'

import { useState } from 'react'
import { ArrowLeft, Users, Church, Check } from 'lucide-react'

interface UserTypeSelectorProps {
  currentType: 'individual' | 'leader'
  onTypeChange: (type: 'individual' | 'leader') => void
  onClose: () => void
}

export default function UserTypeSelector({ currentType, onTypeChange, onClose }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'leader'>(currentType)

  const handleSave = () => {
    onTypeChange(selectedType)
    localStorage.setItem('gathered_user_type', selectedType)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-[#0F1433]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1433] border border-[#D4AF37] rounded-2xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white">Change User Type</h2>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Description */}
        <p className="text-white/80 text-center mb-6">
          Choose how you&apos;d like to use Gathered
        </p>

        {/* User Type Options */}
        <div className="space-y-4 mb-6">
          {/* Individual User Option */}
          <button
            onClick={() => setSelectedType('individual')}
            className={`w-full border rounded-2xl p-4 transition-all duration-200 ${
              selectedType === 'individual'
                ? 'border-[#F5C451] bg-[#F5C451]/10'
                : 'border-[#D4AF37]/50 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                selectedType === 'individual'
                  ? 'bg-blue-500'
                  : 'bg-blue-500/50'
              }`}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  I&apos;m looking for fellowship
                </h3>
                <p className="text-white/70 text-sm">
                  Find small groups, Bible studies, and Christian community
                </p>
              </div>
              {selectedType === 'individual' && (
                <Check className="w-5 h-5 text-[#F5C451]" />
              )}
            </div>
          </button>

          {/* Church Leader Option */}
          <button
            onClick={() => setSelectedType('leader')}
            className={`w-full border rounded-2xl p-4 transition-all duration-200 ${
              selectedType === 'leader'
                ? 'border-[#F5C451] bg-[#F5C451]/10'
                : 'border-[#D4AF37]/50 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                selectedType === 'leader'
                  ? 'bg-purple-500'
                  : 'bg-purple-500/50'
              }`}>
                <Church className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  I&apos;m a leader or church representative
                </h3>
                <p className="text-white/70 text-sm">
                  Create and manage fellowships, events, and grow your community
                </p>
              </div>
              {selectedType === 'leader' && (
                <Check className="w-5 h-5 text-[#F5C451]" />
              )}
            </div>
          </button>
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
            onClick={handleSave}
            className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
