export interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector to highlight
  position?: 'top' | 'bottom'
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Gathered',
    description: 'Let’s take a 60-second tour of the key areas. You can skip anytime.',
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Start here each day for verses, events, and announcements.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'events',
    title: 'Find Events',
    description: 'Browse and RSVP to upcoming gatherings.',
    target: '[data-tutorial="tab-events"]',
    position: 'top'
  },
  {
    id: 'fellowships',
    title: 'Fellowships',
    description: 'Discover and join small groups and ministries.',
    target: '[data-tutorial="tab-fellowships"]',
    position: 'top'
  },
  {
    id: 'chat',
    title: 'Group Chat',
    description: 'Stay connected with your fellowship in real time.',
    target: '[data-tutorial="tab-chat"]',
    position: 'top'
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Add your photo and interests to help others connect with you.',
    target: '[data-tutorial="profile"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: 'You’re all set!',
    description: 'Explore Gathered and enjoy community. You can restart the tutorial from Settings > Help & FAQ.',
  }
]





