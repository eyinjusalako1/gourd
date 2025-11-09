'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { HelpCircle, MessageCircle, Settings, LogOut } from 'lucide-react'

interface HeaderOverflowMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenFeedback: () => void
}

export default function HeaderOverflowMenu({ isOpen, onClose, onOpenFeedback }: HeaderOverflowMenuProps) {
  const router = useRouter()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-14 right-3 w-56 rounded-2xl border border-[#D4AF37]/40 bg-[#0F1433] shadow-xl overflow-hidden">
        <button
          onClick={() => { onClose(); router.push('/faq') }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-[#F5C451]" />
          </div>
          <span className="text-sm font-medium">Help & FAQ</span>
        </button>
        <button
          onClick={() => { onClose(); onOpenFeedback() }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-[#F5C451]" />
          </div>
          <span className="text-sm font-medium">Send Feedback</span>
        </button>
        <button
          onClick={() => { onClose(); router.push('/settings') }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
            <Settings className="w-4 h-4 text-[#F5C451]" />
          </div>
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button
          onClick={() => { onClose(); router.push('/api/auth/signout') }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-[#F5C451]" />
          </div>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}





