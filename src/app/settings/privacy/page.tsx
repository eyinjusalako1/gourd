'use client'

import React, { useState } from 'react'
import AppHeader from '@/components/AppHeader'

export default function PrivacySettingsPage() {
  const [profileVisible, setProfileVisible] = useState(true)
  const [allowMessages, setAllowMessages] = useState(true)
  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Privacy & Safety" subtitle="Visibility, blocking" backHref="/settings" />
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-white">
          <span>Show profile publicly</span>
          <input type="checkbox" checked={profileVisible} onChange={(e)=>setProfileVisible(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-white">
          <span>Allow messages from non-friends</span>
          <input type="checkbox" checked={allowMessages} onChange={(e)=>setAllowMessages(e.target.checked)} />
        </label>
        <button className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37]">Save</button>
      </div>
    </div>
  )
}


