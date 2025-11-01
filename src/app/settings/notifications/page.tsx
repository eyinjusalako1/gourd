'use client'

import React, { useState } from 'react'
import AppHeader from '@/components/AppHeader'

export default function NotificationsSettingsPage() {
  const [push, setPush] = useState(true)
  const [email, setEmail] = useState(true)
  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Notifications" subtitle="Push, email alerts" backHref="/settings" />
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-white">
          <span>Push notifications</span>
          <input type="checkbox" checked={push} onChange={(e)=>setPush(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-white">
          <span>Email notifications</span>
          <input type="checkbox" checked={email} onChange={(e)=>setEmail(e.target.checked)} />
        </label>
        <button className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37]">Save</button>
      </div>
    </div>
  )
}



