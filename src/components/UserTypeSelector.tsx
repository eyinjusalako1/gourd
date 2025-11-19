'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Church, Check } from 'lucide-react'
import ReactDOM from 'react-dom'

interface UserTypeSelectorProps {
  currentType: 'individual' | 'leader'
  onTypeChange: (type: 'individual' | 'leader') => void
  onClose: () => void
}

export default function UserTypeSelector({ currentType, onTypeChange, onClose }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'leader'>(currentType)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Prevent body scroll when sheet is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleSave = () => {
    onTypeChange(selectedType)
    onClose()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (mounted) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mounted])

  if (!mounted) return null

  const content = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300,
            mass: 0.8,
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.3 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              onClose()
            }
          }}
          className="absolute left-0 right-0 bottom-0 bg-[#0F1433] text-white rounded-t-2xl border-t border-[#D4AF37]/30 shadow-2xl max-h-[90vh] flex flex-col"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
            willChange: 'transform',
          }}
        >
          {/* Drag Handle */}
          <div className="flex-shrink-0 pt-3 pb-2">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-white/30" />
          </div>

          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 pb-4">
            <h2 className="text-xl font-bold text-white">Change User Type</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
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
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 flex space-x-3 px-4 pb-4 pt-4 border-t border-white/10">
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
        </motion.div>
      </div>
    </AnimatePresence>
  )

  return ReactDOM.createPortal(content, document.body)
}
