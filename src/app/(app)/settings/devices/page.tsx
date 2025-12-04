'use client'

import React from 'react'
import AppHeader from '@/components/AppHeader'

const sessions = [
  { id: '1', device: 'iPhone 14', location: 'Lagos, NG', lastActive: '2h ago' },
  { id: '2', device: 'Chrome on Windows', location: 'Washington, US', lastActive: '1d ago' }
]

export default function DevicesSettingsPage() {
  return (
    <>
      <AppHeader title="Devices" subtitle="Sessions, security" backHref="/settings" />
      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        {sessions.map(s => (
          <div key={s.id} className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-white flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.device}</div>
              <div className="text-xs text-white/60">{s.location} • {s.lastActive}</div>
            </div>
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Sign out</button>
          </div>
        ))}
        <button className="w-full mt-2 bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37]">Sign out all devices</button>
      </div>
    </>
  )
}






