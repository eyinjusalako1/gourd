'use client'

import { useState } from 'react'
import { Home, Calendar, MessageCircle, Users, BookOpen, HelpCircle, MoreHorizontal } from 'lucide-react'

interface BottomNavProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'fellowships', label: 'Fellowships', icon: Users },
  { id: 'devotions', label: 'Devotions', icon: BookOpen },
  { id: 'more', label: 'More', icon: MoreHorizontal }
]

export default function BottomNavigation({ activeTab = 'home', onTabChange }: BottomNavProps) {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="fixed bottom-0 w-full bg-[#0F1433] border-t border-[#D4AF37]/30 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-[#F5C451]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <div className={`relative ${
                  isActive ? 'scale-110' : 'scale-100'
                } transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-[#F5C451]' : 'text-white/60'
                  }`} />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#F5C451] rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`text-xs font-medium mt-1 ${
                  isActive ? 'text-[#F5C451]' : 'text-white/60'
                }`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

