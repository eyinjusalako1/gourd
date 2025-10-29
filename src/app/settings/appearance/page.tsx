'use client'

import React, { useState } from 'react'
import AppHeader from '@/components/AppHeader'

export default function AppearanceSettingsPage() {
  const [textScale, setTextScale] = useState('md')
  const [useHighContrast, setUseHighContrast] = useState(false)
  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Appearance" subtitle="Theme, text size" backHref="/settings" />
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div>
          <label className="block text-sm text-white mb-2">Text size</label>
          <select value={textScale} onChange={(e)=>setTextScale(e.target.value)} className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        <label className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl p-4 text-white">
          <span>High contrast mode</span>
          <input type="checkbox" checked={useHighContrast} onChange={(e)=>setUseHighContrast(e.target.checked)} />
        </label>
        <button className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37]">Save</button>
      </div>
    </div>
  )
}


