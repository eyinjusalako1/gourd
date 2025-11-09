'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { HelpCircle, Users, User, LogOut, MessageCircle } from 'lucide-react'

export default function BottomMoreSheet() {
  const router = useRouter()
  const { signOut } = useAuth()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const openSheet = () => setOpen(true)
    window.addEventListener('open-bottom-more', openSheet as EventListener)
    return () => window.removeEventListener('open-bottom-more', openSheet as EventListener)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="absolute left-0 right-0 bottom-0 bg-[#0F1433] border-t border-[#D4AF37]/40 rounded-t-2xl p-4 max-w-md mx-auto">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setOpen(false); router.push('/faq') }}
            className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl p-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#F5C451]" />
            </div>
            <span className="text-white text-sm font-medium">Help & FAQ</span>
          </button>
          <button
            onClick={() => { setOpen(false); router.push('/discover') }}
            className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl p-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#F5C451]" />
            </div>
            <span className="text-white text-sm font-medium">Discover People</span>
          </button>
          <button
            onClick={() => { setOpen(false); router.push('/profile') }}
            className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl p-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
              <User className="w-5 h-5 text-[#F5C451]" />
            </div>
            <span className="text-white text-sm font-medium">My Profile</span>
          </button>
          <button
            onClick={() => { setOpen(false); router.push('/faq'); setTimeout(() => window.dispatchEvent(new Event('open-command-palette')), 50) }}
            className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-xl p-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#F5C451]" />
            </div>
            <span className="text-white text-sm font-medium">Send Feedback</span>
          </button>
        </div>
        <button
          onClick={async () => { setOpen(false); await signOut(); router.push('/') }}
          className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-white rounded-xl p-3 flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5 text-[#F5C451]" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}





