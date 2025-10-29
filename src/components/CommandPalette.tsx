'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Home, Calendar, MessageCircle, Users, BookOpen, Heart, HelpCircle, User, Settings, Megaphone, Plus } from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  keywords?: string
}

export default function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)

  // Global shortcut: Ctrl/Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMetaK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'
      if (isMetaK) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (open) {
        if (e.key === 'Escape') setOpen(false)
        if (e.key === 'ArrowDown') setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
        if (e.key === 'ArrowUp') setActiveIdx(i => Math.max(i - 1, 0))
        if (e.key === 'Enter') handleSelect(filtered[activeIdx])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const items: CommandItem[] = useMemo(() => ([
    { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Home, keywords: 'home start' },
    { id: 'events', label: 'Events', href: '/events', icon: Calendar, keywords: 'calendar' },
    { id: 'chat', label: 'Chats', href: '/chat', icon: MessageCircle, keywords: 'messages dm group' },
    { id: 'fellowships', label: 'Fellowships', href: '/fellowships', icon: Users, keywords: 'groups' },
    { id: 'devotions', label: 'Devotions', href: '/devotions', icon: BookOpen, keywords: 'bible reading' },
    { id: 'prayers', label: 'Prayer Requests', href: '/prayers', icon: Heart, keywords: 'intercession' },
    { id: 'faq', label: 'Help & FAQ', href: '/faq', icon: HelpCircle, keywords: 'support help' },
    { id: 'profile', label: 'My Profile', href: '/profile', icon: User, keywords: 'account' },
    { id: 'announce', label: 'Create Announcement', href: '/announcements/create', icon: Megaphone, keywords: 'create new' },
    { id: 'event-create', label: 'Create Event', href: '/events/create', icon: Plus, keywords: 'new schedule' },
    { id: 'devo-create', label: 'Create Devotional', href: '/devotions/create', icon: BookOpen, keywords: 'write submit' },
  ]), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(i =>
      i.label.toLowerCase().includes(q) || i.keywords?.includes(q) || i.href.toLowerCase().includes(q)
    )
  }, [query, items])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
    }
  }, [open, pathname])

  const handleSelect = (item?: CommandItem) => {
    if (!item) return
    setOpen(false)
    router.push(item.href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative max-w-lg mx-auto mt-24">
        <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#0F1433] shadow-2xl">
          {/* Search input */}
          <div className="flex items-center px-4 py-3 border-b border-[#D4AF37]/30">
            <Search className="w-5 h-5 text-white/60" />
            <input
              autoFocus
              placeholder="Search or jump to... (Ctrl/Cmd+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-3 flex-1 bg-transparent outline-none text-white placeholder-white/50"
            />
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-white/70">No results</div>
            )}
            {filtered.map((item, idx) => {
              const Icon = item.icon
              const isActive = idx === activeIdx
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5C451]/15 border border-[#D4AF37]/40 flex items-center justify-center mr-3">
                    <Icon className="w-4 h-4 text-[#F5C451]" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-white/50">{item.href}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}


