// Utility functions for the Gathered Dashboard

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

export const formatTime = (timeString: string): string => {
  return timeString
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const getUserRole = (user: any): 'Member' | 'Leader' | 'Church Admin' => {
  return user?.user_metadata?.role || 'Member'
}

export const isLeader = (userRole: string): boolean => {
  return userRole === 'Leader' || userRole === 'Church Admin'
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Mobile detection
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}

// Touch device detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Sample data generators for development
export const generateSampleVerses = () => [
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
    translation: "NIV"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    translation: "NIV"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    translation: "NIV"
  },
  {
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    translation: "NIV"
  }
]

export const generateSampleEvents = () => [
  {
    id: '1',
    title: 'Sunday Morning Bible Study',
    date: '2024-01-28',
    time: '10:00 AM',
    location: 'Grace Community Church',
    attendees: 15,
    maxAttendees: 25,
    category: 'Bible Study' as const,
    description: 'Join us for an in-depth study of the Book of Romans',
    isJoined: false,
    isInterested: true
  },
  {
    id: '2',
    title: 'Prayer Meeting',
    date: '2024-01-30',
    time: '7:00 PM',
    location: 'Online - Zoom',
    attendees: 8,
    category: 'Prayer' as const,
    description: 'Community prayer session for healing and guidance',
    isJoined: true,
    isInterested: false
  }
]

// Constants
export const APP_COLORS = {
  navy: '#0F1433',
  gold: '#F5C451',
  deepGold: '#D4AF37',
  beige: '#F2EBD9',
  white: '#FFFFFF'
} as const

export const USER_ROLES = {
  MEMBER: 'Member',
  LEADER: 'Leader',
  CHURCH_ADMIN: 'Church Admin'
} as const

export const EVENT_CATEGORIES = {
  BIBLE_STUDY: 'Bible Study',
  PRAYER: 'Prayer',
  OUTREACH: 'Outreach',
  SOCIAL: 'Social'
} as const







