import { supabase } from './supabase'

export interface BibleVerse {
  id: string
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
}

export interface StudyPlan {
  id: string
  title: string
  description: string
  duration_days: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'new_testament' | 'old_testament' | 'topical' | 'chronological'
  created_by: string
  created_at: string
  is_public: boolean
  tags: string[]
}

export interface StudySession {
  id: string
  plan_id: string
  user_id: string
  day_number: number
  verses: string[]
  notes: string
  completed: boolean
  completed_at?: string
  reflection: string
}

export interface MemoryVerse {
  id: string
  user_id: string
  verse_reference: string
  verse_text: string
  translation: string
  difficulty: 'easy' | 'medium' | 'hard'
  last_reviewed: string
  next_review: string
  review_count: number
  mastery_level: number
}

export class BibleStudyService {
  // Get popular Bible verses for different occasions
  static async getPopularVerses(category?: string): Promise<BibleVerse[]> {
    const verses = {
      encouragement: [
        { book: 'Jeremiah', chapter: 29, verse: 11, text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.', translation: 'NIV' },
        { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all this through him who gives me strength.', translation: 'NIV' },
        { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', translation: 'NIV' }
      ],
      comfort: [
        { book: 'Psalm', chapter: 23, verse: 4, text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.', translation: 'NIV' },
        { book: 'Isaiah', chapter: 41, verse: 10, text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.', translation: 'NIV' }
      ],
      love: [
        { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', translation: 'NIV' },
        { book: '1 Corinthians', chapter: 13, verse: 4, text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', translation: 'NIV' }
      ]
    }

    const selectedVerses = category ? verses[category as keyof typeof verses] || verses.encouragement : verses.encouragement
    
    return selectedVerses.map((verse, index) => ({
      id: `${category || 'encouragement'}_${index}`,
      ...verse
    }))
  }

  // Search Bible verses by keyword
  static async searchVerses(query: string, limit = 10): Promise<BibleVerse[]> {
    // In production, this would connect to a Bible API like Bible Gateway or ESV API
    // For now, we'll return mock data based on common searches
    const searchResults = {
      'love': [
        { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', translation: 'NIV' },
        { book: '1 Corinthians', chapter: 13, verse: 4, text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', translation: 'NIV' }
      ],
      'faith': [
        { book: 'Hebrews', chapter: 11, verse: 1, text: 'Now faith is confidence in what we hope for and assurance about what we do not see.', translation: 'NIV' },
        { book: 'Matthew', chapter: 17, verse: 20, text: 'He replied, "Because you have so little faith. Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, \'Move from here to there,\' and it will move. Nothing will be impossible for you."', translation: 'NIV' }
      ],
      'hope': [
        { book: 'Romans', chapter: 15, verse: 13, text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.', translation: 'NIV' }
      ]
    }

    const lowerQuery = query.toLowerCase()
    const matchingVerses = Object.entries(searchResults)
      .filter(([key]) => key.includes(lowerQuery) || lowerQuery.includes(key))
      .flatMap(([, verses]) => verses)

    return matchingVerses.slice(0, limit).map((verse, index) => ({
      id: `search_${index}`,
      ...verse
    }))
  }

  // Get study plans
  static async getStudyPlans(category?: string): Promise<StudyPlan[]> {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    let plans = data || []
    
    if (category) {
      plans = plans.filter(plan => plan.category === category)
    }
    
    return plans
  }

  // Create a study plan
  static async createStudyPlan(planData: Omit<StudyPlan, 'id' | 'created_at'>): Promise<StudyPlan> {
    const { data, error } = await supabase
      .from('study_plans')
      .insert([planData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Start a study plan
  static async startStudyPlan(planId: string, userId: string): Promise<void> {
    const { data: plan } = await supabase
      .from('study_plans')
      .select('duration_days')
      .eq('id', planId)
      .single()

    if (!plan) throw new Error('Study plan not found')

    // Create study sessions for each day
    const sessions = Array.from({ length: plan.duration_days }, (_, index) => ({
      plan_id: planId,
      user_id: userId,
      day_number: index + 1,
      verses: [],
      notes: '',
      completed: false,
      reflection: ''
    }))

    const { error } = await supabase
      .from('study_sessions')
      .insert(sessions)

    if (error) throw error
  }

  // Get user's study sessions
  static async getUserStudySessions(userId: string, planId?: string): Promise<StudySession[]> {
    let query = supabase
      .from('study_sessions')
      .select(`
        *,
        plan:plan_id (
          title,
          description
        )
      `)
      .eq('user_id', userId)
      .order('day_number', { ascending: true })

    if (planId) {
      query = query.eq('plan_id', planId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Complete a study session
  static async completeStudySession(
    sessionId: string,
    notes: string,
    reflection: string,
    verses: string[]
  ): Promise<void> {
    const { error } = await supabase
      .from('study_sessions')
      .update({
        notes,
        reflection,
        verses,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (error) throw error
  }

  // Add memory verse
  static async addMemoryVerse(
    userId: string,
    verseReference: string,
    verseText: string,
    translation: string = 'NIV'
  ): Promise<MemoryVerse> {
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + 1) // Review tomorrow

    const { data, error } = await supabase
      .from('memory_verses')
      .insert([{
        user_id: userId,
        verse_reference: verseReference,
        verse_text: verseText,
        translation,
        difficulty: 'easy',
        last_reviewed: new Date().toISOString(),
        next_review: nextReview.toISOString(),
        review_count: 0,
        mastery_level: 0
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get memory verses for review
  static async getMemoryVersesForReview(userId: string): Promise<MemoryVerse[]> {
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('memory_verses')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review', now)
      .order('next_review', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Review memory verse
  static async reviewMemoryVerse(
    verseId: string,
    correct: boolean
  ): Promise<void> {
    const { data: verse } = await supabase
      .from('memory_verses')
      .select('*')
      .eq('id', verseId)
      .single()

    if (!verse) throw new Error('Memory verse not found')

    let masteryLevel = verse.mastery_level
    let nextReviewDays = 1

    if (correct) {
      masteryLevel = Math.min(10, masteryLevel + 1)
      // Spaced repetition: increase interval based on mastery
      nextReviewDays = Math.min(30, Math.pow(2, masteryLevel))
    } else {
      masteryLevel = Math.max(0, masteryLevel - 1)
      nextReviewDays = 1 // Review again tomorrow
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + nextReviewDays)

    const { error } = await supabase
      .from('memory_verses')
      .update({
        mastery_level: masteryLevel,
        review_count: verse.review_count + 1,
        last_reviewed: new Date().toISOString(),
        next_review: nextReview.toISOString()
      })
      .eq('id', verseId)

    if (error) throw error
  }

  // Get daily verse
  static async getDailyVerse(): Promise<BibleVerse> {
    // In production, this would fetch from a Bible API
    const dailyVerses = [
      { book: 'Psalm', chapter: 118, verse: 24, text: 'This is the day the Lord has made; let us rejoice and be glad in it.', translation: 'NIV' },
      { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the Lord with all your heart and lean not on your own understanding.', translation: 'NIV' },
      { book: 'Isaiah', chapter: 40, verse: 31, text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', translation: 'NIV' }
    ]

    // Use date to get consistent daily verse
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const verseIndex = dayOfYear % dailyVerses.length

    return {
      id: `daily_${dayOfYear}`,
      ...dailyVerses[verseIndex]
    }
  }

  // Get verse of the day for sharing
  static async getShareableVerse(category?: string): Promise<BibleVerse & { shareText: string }> {
    const verse = await this.getDailyVerse()
    
    const shareText = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse} (${verse.translation})`
    
    return {
      ...verse,
      shareText
    }
  }

  // Get study statistics
  static async getStudyStats(userId: string): Promise<{
    totalSessions: number
    completedSessions: number
    memoryVerses: number
    masteryVerses: number
    currentStreak: number
  }> {
    const [sessions, memoryVerses] = await Promise.all([
      supabase
        .from('study_sessions')
        .select('completed, completed_at')
        .eq('user_id', userId),
      supabase
        .from('memory_verses')
        .select('mastery_level')
        .eq('user_id', userId)
    ])

    const sessionData = sessions.data || []
    const memoryData = memoryVerses.data || []

    const completedSessions = sessionData.filter(s => s.completed).length
    const masteryVerses = memoryData.filter(v => v.mastery_level >= 7).length

    // Calculate current streak
    const completedDates = sessionData
      .filter(s => s.completed && s.completed_at)
      .map(s => new Date(s.completed_at).toDateString())
      .sort()
      .reverse()

    let currentStreak = 0
    const today = new Date().toDateString()
    let checkDate = new Date()

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateString = checkDate.toDateString()
      if (completedDates.includes(dateString)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return {
      totalSessions: sessionData.length,
      completedSessions,
      memoryVerses: memoryData.length,
      masteryVerses,
      currentStreak
    }
  }
}









