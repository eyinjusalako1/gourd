'use client'

import React, { useEffect, useState } from 'react'
import Logo from '@/components/Logo'

export default function WelcomeSplash({ onSelect }: { onSelect: (type: 'individual' | 'leader') => void }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const completed = localStorage.getItem('gathered_saw_welcome')
    if (completed) setShow(false)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1433]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="welcome-glow" />
      </div>

      <div className="relative z-10 text-center px-6 animate-rise">
        <div className="mx-auto mb-6 animate-pop">
          <Logo size="lg" showText={false} />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Welcome to Gathered</h1>
        <p className="text-white/80 mb-8">Find fellowship, grow in faith, and steward community</p>
        <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
          <button
            onClick={() => { localStorage.setItem('gathered_user_type', 'individual'); localStorage.setItem('gathered_saw_welcome', '1'); onSelect('individual') }}
            className="py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all"
          >
            I’m a Disciple
          </button>
          <button
            onClick={() => { localStorage.setItem('gathered_user_type', 'leader'); localStorage.setItem('gathered_saw_welcome', '1'); onSelect('leader') }}
            className="py-3 rounded-xl bg-white/10 text-white font-semibold border border-[#D4AF37]/40 hover:bg-white/15 transition-all"
          >
            I’m a Steward
          </button>
          <button
            onClick={() => { localStorage.setItem('gathered_saw_welcome', '1'); setShow(false) }}
            className="text-white/60 text-sm underline mt-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}


