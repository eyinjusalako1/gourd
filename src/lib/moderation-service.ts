import { supabase } from './supabase'

export interface ModerationResult {
  isApproved: boolean
  confidence: number
  flags: string[]
  suggestions: string[]
  reason?: string
}

export interface ContentFlag {
  id: string
  content_id: string
  content_type: 'post' | 'comment' | 'group' | 'event'
  flag_type: 'inappropriate' | 'spam' | 'offensive' | 'false_doctrine' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  reported_by: string
  created_at: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewed_by?: string
  reviewed_at?: string
}

export class ModerationService {
  // AI-powered content analysis
  static async analyzeContent(content: string, contentType: 'post' | 'comment'): Promise<ModerationResult> {
    const flags: string[] = []
    const suggestions: string[] = []
    let confidence = 0.9
    let isApproved = true

    // Check for inappropriate language
    const inappropriateWords = await this.checkInappropriateLanguage(content)
    if (inappropriateWords.length > 0) {
      flags.push('inappropriate_language')
      suggestions.push('Please use respectful language that honors God')
      confidence -= 0.3
      isApproved = false
    }

    // Check for spam patterns
    const spamScore = await this.checkSpamPatterns(content)
    if (spamScore > 0.7) {
      flags.push('spam')
      suggestions.push('This content appears to be spam. Please share meaningful content.')
      confidence -= 0.4
      isApproved = false
    }

    // Check for false doctrine (basic keyword matching)
    const falseDoctrine = await this.checkFalseDoctrine(content)
    if (falseDoctrine.length > 0) {
      flags.push('false_doctrine')
      suggestions.push('Please ensure your content aligns with biblical truth')
      confidence -= 0.5
      isApproved = false
    }

    // Check for excessive promotion
    const promotionScore = await this.checkExcessivePromotion(content)
    if (promotionScore > 0.6) {
      flags.push('excessive_promotion')
      suggestions.push('Please focus on sharing faith and encouragement rather than promotion')
      confidence -= 0.2
    }

    // Check for Christian content quality
    const christianQuality = await this.checkChristianContentQuality(content)
    if (christianQuality.score < 0.3) {
      flags.push('low_christian_content')
      suggestions.push('Consider sharing more faith-centered content')
      confidence -= 0.1
    }

    return {
      isApproved,
      confidence: Math.max(0, confidence),
      flags,
      suggestions,
      reason: flags.length > 0 ? `Content flagged for: ${flags.join(', ')}` : undefined
    }
  }

  // Report content for review
  static async reportContent(
    contentId: string,
    contentType: 'post' | 'comment' | 'group' | 'event',
    flagType: ContentFlag['flag_type'],
    reason: string,
    reportedBy: string
  ): Promise<void> {
    const severity = this.getSeverityLevel(flagType)
    
    const { error } = await supabase
      .from('content_flags')
      .insert([{
        content_id: contentId,
        content_type: contentType,
        flag_type: flagType,
        severity,
        reason,
        reported_by: reportedBy,
        status: 'pending'
      }])

    if (error) throw error
  }

  // Get pending moderation items
  static async getPendingFlags(): Promise<ContentFlag[]> {
    const { data, error } = await supabase
      .from('content_flags')
      .select(`
        *,
        reporter:reported_by (
          id,
          user_metadata
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Review and resolve flags
  static async reviewFlag(
    flagId: string,
    action: 'approve' | 'reject' | 'remove_content',
    reviewedBy: string,
    notes?: string
  ): Promise<void> {
    const status = action === 'approve' ? 'dismissed' : 
                  action === 'reject' ? 'resolved' : 'resolved'

    const { error } = await supabase
      .from('content_flags')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        notes
      })
      .eq('id', flagId)

    if (error) throw error

    // If removing content, deactivate it
    if (action === 'remove_content') {
      const { data: flag } = await supabase
        .from('content_flags')
        .select('content_id, content_type')
        .eq('id', flagId)
        .single()

      if (flag) {
        const tableName = flag.content_type === 'post' ? 'posts' :
                         flag.content_type === 'comment' ? 'post_comments' :
                         flag.content_type === 'group' ? 'fellowship_groups' : 'events'

        await supabase
          .from(tableName)
          .update({ is_active: false })
          .eq('id', flag.content_id)
      }
    }
  }

  // Get user moderation history
  static async getUserModerationHistory(userId: string): Promise<ContentFlag[]> {
    const { data, error } = await supabase
      .from('content_flags')
      .select('*')
      .eq('reported_by', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Private helper methods
  private static async checkInappropriateLanguage(content: string): Promise<string[]> {
    // Basic inappropriate word detection (in production, use a proper API)
    const inappropriateWords = [
      'hate', 'stupid', 'idiot', 'damn', 'hell' // Add more as needed
    ]
    
    const foundWords: string[] = []
    const lowerContent = content.toLowerCase()
    
    inappropriateWords.forEach(word => {
      if (lowerContent.includes(word)) {
        foundWords.push(word)
      }
    })
    
    return foundWords
  }

  private static async checkSpamPatterns(content: string): Promise<number> {
    let spamScore = 0
    
    // Check for excessive links
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length
    if (linkCount > 3) spamScore += 0.3
    
    // Check for repetitive text
    const words = content.split(' ')
    const uniqueWords = new Set(words)
    if (words.length > 10 && uniqueWords.size / words.length < 0.5) {
      spamScore += 0.4
    }
    
    // Check for excessive caps
    const capsCount = (content.match(/[A-Z]/g) || []).length
    if (capsCount / content.length > 0.3) spamScore += 0.2
    
    return Math.min(1, spamScore)
  }

  private static async checkFalseDoctrine(content: string): Promise<string[]> {
    // Basic false doctrine detection (expand with theological keywords)
    const falseDoctrineTerms = [
      'prosperity gospel', 'name it claim it', 'word of faith',
      'universalism', 'pantheism', 'new age'
    ]
    
    const foundTerms: string[] = []
    const lowerContent = content.toLowerCase()
    
    falseDoctrineTerms.forEach(term => {
      if (lowerContent.includes(term)) {
        foundTerms.push(term)
      }
    })
    
    return foundTerms
  }

  private static async checkExcessivePromotion(content: string): Promise<number> {
    let promotionScore = 0
    
    // Check for promotional keywords
    const promotionalWords = ['buy', 'sell', 'promotion', 'discount', 'offer', 'deal']
    const lowerContent = content.toLowerCase()
    
    promotionalWords.forEach(word => {
      if (lowerContent.includes(word)) {
        promotionScore += 0.2
      }
    })
    
    // Check for excessive self-promotion
    const selfPromotionPatterns = ['my business', 'my company', 'my product', 'check out my']
    selfPromotionPatterns.forEach(pattern => {
      if (lowerContent.includes(pattern)) {
        promotionScore += 0.3
      }
    })
    
    return Math.min(1, promotionScore)
  }

  private static async checkChristianContentQuality(content: string): Promise<{ score: number, suggestions: string[] }> {
    let score = 0.5 // Start with neutral score
    const suggestions: string[] = []
    
    const lowerContent = content.toLowerCase()
    
    // Positive indicators
    const positiveWords = ['jesus', 'christ', 'god', 'lord', 'prayer', 'faith', 'love', 'hope', 'grace', 'blessing']
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length
    score += positiveCount * 0.1
    
    // Scripture references
    const scripturePatterns = ['john', 'matthew', 'psalm', 'romans', 'corinthians', 'verse', 'chapter']
    const scriptureCount = scripturePatterns.filter(pattern => lowerContent.includes(pattern)).length
    score += scriptureCount * 0.15
    
    // Encouraging content
    const encouragingWords = ['encourage', 'uplift', 'inspire', 'bless', 'praise', 'worship']
    const encouragingCount = encouragingWords.filter(word => lowerContent.includes(word)).length
    score += encouragingCount * 0.1
    
    if (score < 0.3) {
      suggestions.push('Consider including more faith-centered content')
    }
    
    return { score: Math.min(1, score), suggestions }
  }

  private static getSeverityLevel(flagType: ContentFlag['flag_type']): ContentFlag['severity'] {
    switch (flagType) {
      case 'false_doctrine':
        return 'critical'
      case 'inappropriate':
        return 'high'
      case 'offensive':
        return 'high'
      case 'spam':
        return 'medium'
      case 'other':
        return 'low'
      default:
        return 'medium'
    }
  }

  // Get moderation statistics
  static async getModerationStats(): Promise<{
    totalFlags: number
    pendingFlags: number
    resolvedFlags: number
    criticalFlags: number
  }> {
    const [total, pending, resolved, critical] = await Promise.all([
      supabase.from('content_flags').select('*', { count: 'exact', head: true }),
      supabase.from('content_flags').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('content_flags').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
      supabase.from('content_flags').select('*', { count: 'exact', head: true }).eq('severity', 'critical')
    ])

    return {
      totalFlags: total.count || 0,
      pendingFlags: pending.count || 0,
      resolvedFlags: resolved.count || 0,
      criticalFlags: critical.count || 0
    }
  }
}


