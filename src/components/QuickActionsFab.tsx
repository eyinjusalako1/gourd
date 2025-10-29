'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, Calendar, Megaphone, BookOpen, Heart, MessageCircle, FileText, HelpCircle } from 'lucide-react'

export default function QuickActionsFab() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const actions = [
    { id: 'fellowship', label: 'Create Fellowship', icon: Users, href: '/fellowships/create' },
    { id: 'event', label: 'Schedule Event', icon: Calendar, href: '/events/create' },
    { id: 'announcement', label: 'Send Announcement', icon: Megaphone, href: '/announcements/create' },
    { id: 'devotional', label: 'Create Devotional', icon: BookOpen, href: '/devotions/create' },
    { id: 'prayer', label: 'Share Prayer Request', icon: Heart, href: '/prayers/create' },
    { id: 'testimony', label: 'Share Testimony', icon: FileText, href: '/testimonies/create' },
    { id: 'feedback', label: 'Send Feedback', icon: MessageCircle, href: '/faq' },
    { id: 'help', label: 'Help & FAQ', icon: HelpCircle, href: '/faq' },
  ]

  const handleAction = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <div className="fixed bottom-20 right-4 z-[60] md:right-6">
      {/* Actions Panel */}
      {open && (
        <div className="mb-3 w-60 bg-[#0F1433] border border-[#D4AF37]/40 rounded-2xl shadow-xl overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {actions.map((a) => {
              const Icon = a.icon
              return (
                <button
                  key={a.id}
                  onClick={() => handleAction(a.href)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#F5C451]" />
                  </div>
                  <span className="text-sm font-medium">{a.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Quick Actions"
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] shadow-lg flex items-center justify-center hover:from-[#F5C451] hover:to-[#D4AF37] transition-all focus:outline-none focus:ring-2 focus:ring-[#F5C451]/60"
      >
        <Plus className={`w-6 h-6 transition-transform ${open ? 'rotate-45' : ''}`} />
      </button>
    </div>
  )
}


