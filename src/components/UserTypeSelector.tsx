'use client'

import { useState } from 'react'
import { Users, Church, Check } from 'lucide-react'
import BottomSheet from '@/components/ui/BottomSheet'

interface UserTypeSelectorProps {
  currentType: 'individual' | 'leader'
  onTypeChange: (type: 'individual' | 'leader') => void
  onClose: () => void
}

export default function UserTypeSelector({ currentType, onTypeChange, onClose }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'leader'>(currentType)

  const handleSave = () => {
    onTypeChange(selectedType)
    onClose()
  }

  return (
    <BottomSheet
      isOpen={true}
      onClose={onClose}
      title="Change User Type"
    >
      {/* Description */}
      <p className="text-white/80 text-center mb-6">
        Choose how you&apos;d like to use Gathered
      </p>

      {/* User Type Options */}
      <div className="space-y-4 mb-6">
        {/* Individual User Option */}
        <button
          onClick={() => setSelectedType('individual')}
          className={`w-full border rounded-2xl py-4 px-4 transition-all duration-200 min-h-[44px] ${
            selectedType === 'individual'
              ? 'border-[#F5C451] bg-[#F5C451]/10'
              : 'border-[#D4AF37]/50 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
              selectedType === 'individual'
                ? 'bg-blue-500'
                : 'bg-blue-500/50'
            }`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                Disciple
              </h3>
              <p className="text-white/70 text-sm">
                Find small groups, Bible studies, and Christian community
              </p>
            </div>
            {selectedType === 'individual' && (
              <Check className="w-5 h-5 text-[#F5C451] flex-shrink-0" />
            )}
          </div>
        </button>

        {/* Church Leader Option */}
        <button
          onClick={() => setSelectedType('leader')}
          className={`w-full border rounded-2xl py-4 px-4 transition-all duration-200 min-h-[44px] ${
            selectedType === 'leader'
              ? 'border-[#F5C451] bg-[#F5C451]/10'
              : 'border-[#D4AF37]/50 bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
              selectedType === 'leader'
                ? 'bg-purple-500'
                : 'bg-purple-500/50'
            }`}>
              <Church className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                Steward
              </h3>
              <p className="text-white/70 text-sm">
                Create and manage fellowships, events, and steward your community
              </p>
            </div>
            {selectedType === 'leader' && (
              <Check className="w-5 h-5 text-[#F5C451] flex-shrink-0" />
            )}
          </div>
        </button>
      </div>

      footer={
        <div className="flex space-x-3 px-4 pb-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors min-h-[44px]"
          >
            Save Changes
          </button>
        </div>
      }
    />
  )
}
