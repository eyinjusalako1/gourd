// Basic content moderation for MVP
// Simple keyword filtering and rules

const blockedWords = [
  // Explicit profanity
  'badword', 'profanity', // Add your list
  
  // Hate speech indicators
  'hateful', 'discriminatory',
  
  // Explicit content
  'explicit', 'inappropriate'
]

export const containsInappropriateContent = (text: string): boolean => {
  const lowerText = text.toLowerCase()
  return blockedWords.some(word => lowerText.includes(word))
}

export const filterInappropriateContent = (text: string): string => {
  let filtered = text
  blockedWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  })
  return filtered
}

export const getContentWarning = (text: string): string | null => {
  if (containsInappropriateContent(text)) {
    return 'Your content contains language that may be inappropriate for our community. Please review and edit before posting.'
  }
  return null
}

export interface ContentViolation {
  type: 'profanity' | 'bullying' | 'explicit' | 'spam' | 'other'
  severity: 'low' | 'medium' | 'high'
  action: 'warn' | 'block' | 'remove'
}

export const checkContent = (text: string): ContentViolation | null => {
  if (containsInappropriateContent(text)) {
    return {
      type: 'profanity',
      severity: 'medium',
      action: 'warn'
    }
  }
  
  // Check for spam patterns
  if (text.length > 500) {
    return {
      type: 'spam',
      severity: 'low',
      action: 'warn'
    }
  }
  
  return null
}

