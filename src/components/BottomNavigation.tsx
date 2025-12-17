'use client'

import { useState, useEffect } from 'react'
import { Home, Calendar, MessageCircle, Users, BookOpen, MoreHorizontal } from 'lucide-react'
import { useUnreadActivity } from '@/hooks/useUnreadActivity'

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
  const { hasUnread } = useUnreadActivity()

  // Sync with prop changes
  useEffect(() => {
    setCurrentTab(activeTab)
  }, [activeTab])

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 flex-1 max-w-[80px] ${
                  isActive
                    ? 'text-[#F5C451] bg-[#F5C451]/10 dark:bg-[#F5C451]/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <div className={`relative ${
                  isActive ? 'scale-110' : 'scale-100'
                } transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-[#F5C451]' : ''
                  }`} />
                  {/* Unread Activity Badge - shows on home tab when there's unread activity */}
                  {tab.id === 'home' && hasUnread && !isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-navy-900" />
                  )}
                </div>
                <span className={`text-xs font-semibold mt-1 ${
                  isActive ? 'text-[#F5C451]' : ''
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






