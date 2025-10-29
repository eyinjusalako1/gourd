'use client'

import React from 'react'
import AppHeader from '@/components/AppHeader'
import { Bell, Shield, User, Palette, Smartphone, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  const sections = [
    { id: 'account', title: 'Account', icon: User, desc: 'Profile, email, password' },
    { id: 'notifications', title: 'Notifications', icon: Bell, desc: 'Push, email alerts' },
    { id: 'privacy', title: 'Privacy & Safety', icon: Shield, desc: 'Visibility, blocking' },
    { id: 'appearance', title: 'Appearance', icon: Palette, desc: 'Theme, text size' },
    { id: 'devices', title: 'Devices', icon: Smartphone, desc: 'Sessions, security' },
    { id: 'help', title: 'Help & FAQ', icon: HelpCircle, desc: 'Support resources' },
  ]

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Settings" subtitle="Tune your Gathered experience" backHref="/dashboard" />

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {sections.map(sec => {
            const Icon = sec.icon
            return (
              <button key={sec.id} className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-4 text-left hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#F5C451]" />
                </div>
                <div className="text-white font-semibold">{sec.title}</div>
                <div className="text-white/60 text-xs">{sec.desc}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-xl font-semibold hover:bg-[#D4AF37] transition-colors">
            Save Changes
          </button>
          <button className="w-full bg-white/5 text-white py-3 rounded-xl font-semibold border border-[#D4AF37]/30 hover:bg-white/10 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}


