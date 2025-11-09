// Gamification Service
// Handles Faith Flames, Unity Points, Challenges, and Badges

export interface FaithFlameData {
  userId: string
  fellowshipId: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  intensity: 'out' | 'ember' | 'glow' | 'burning' | 'on-fire'
}

export interface UnityPointsData {
  fellowshipId: string
  weekStart: string
  weekEnd: string
  totalPoints: number
  participationRate: number
  memberCount: number
  emberMeterLevel: number
  isOnFire: boolean
  weeklyMessage?: string
}

export interface Challenge {
  id: string
  fellowshipId: string
  templateId: string
  title: string
  description: string
  category: string
  icon: string
  weekStart: string
  weekEnd: string
  status: 'active' | 'completed' | 'expired'
  completionThreshold: number
  badgeReward?: string
}

export interface UserChallengeProgress {
  challengeId: string
  userId: string
  progress: number
  isCompleted: boolean
  completedAt?: string
}

export interface Badge {
  id: string
  code: string
  name: string
  description: string
  icon: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  glowColor?: string
}

export interface UserBadge {
  badgeId: string
  earnedAt: string
  isFeatured: boolean
}

export class GamificationService {
  private static instance: GamificationService
  private apiBaseUrl = '/api'

  private constructor() {}

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService()
    }
    return GamificationService.instance
  }

  // ============================================================================
  // FAITH FLAMES
  // ============================================================================

  /**
   * Track daily activity to maintain Faith Flame
   */
  async trackDailyActivity(
    userId: string,
    fellowshipId: string,
    activityType: 'prayer' | 'testimony' | 'post' | 'comment'
  ): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/gamification/track-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fellowshipId, activityType })
      })
    } catch (error) {
      console.error('Error tracking activity:', error)
      throw error
    }
  }

  /**
   * Get Faith Flame data for a user
   */
  async getFaithFlame(userId: string, fellowshipId: string): Promise<FaithFlameData> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/faith-flame/${userId}/${fellowshipId}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching faith flame:', error)
      throw error
    }
  }

  /**
   * Get all Faith Flames for a fellowship
   */
  async getFellowshipFlames(fellowshipId: string): Promise<FaithFlameData[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/faith-flames/${fellowshipId}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching fellowship flames:', error)
      throw error
    }
  }

  // ============================================================================
  // UNITY POINTS
  // ============================================================================

  /**
   * Get Unity Points for current week
   */
  async getUnityPoints(fellowshipId: string, weekStart?: string): Promise<UnityPointsData> {
    try {
      const params = weekStart ? `?week=${weekStart}` : ''
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/unity-points/${fellowshipId}${params}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching unity points:', error)
      throw error
    }
  }

  /**
   * Get Unity Points history
   */
  async getUnityPointsHistory(fellowshipId: string, weeks: number = 4): Promise<UnityPointsData[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/unity-points/${fellowshipId}/history?weeks=${weeks}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching unity points history:', error)
      throw error
    }
  }

  // ============================================================================
  // WEEKLY CHALLENGES
  // ============================================================================

  /**
   * Get active challenges for a fellowship
   */
  async getActiveChallenges(fellowshipId: string): Promise<Challenge[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/challenges/${fellowshipId}/active`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching challenges:', error)
      throw error
    }
  }

  /**
   * Get user's progress on all challenges
   */
  async getUserChallengeProgress(userId: string, fellowshipId: string): Promise<UserChallengeProgress[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/challenges/progress/${userId}/${fellowshipId}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching challenge progress:', error)
      throw error
    }
  }

  /**
   * Update challenge progress
   */
  async updateChallengeProgress(
    userId: string,
    challengeId: string,
    increment: number = 1
  ): Promise<UserChallengeProgress> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/challenges/progress`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, challengeId, increment })
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error updating challenge progress:', error)
      throw error
    }
  }

  /**
   * Create a new challenge (Steward only)
   */
  async createChallenge(
    fellowshipId: string,
    stewardId: string,
    templateId: string,
    weekStart: string,
    weekEnd: string
  ): Promise<Challenge> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/challenges`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fellowshipId, stewardId, templateId, weekStart, weekEnd })
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error creating challenge:', error)
      throw error
    }
  }

  // ============================================================================
  // BLESSING BADGES
  // ============================================================================

  /**
   * Get all available badges
   */
  async getAllBadges(): Promise<Badge[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/gamification/badges`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching badges:', error)
      throw error
    }
  }

  /**
   * Get user's badges
   */
  async getUserBadges(userId: string, fellowshipId?: string): Promise<UserBadge[]> {
    try {
      const params = fellowshipId ? `?fellowshipId=${fellowshipId}` : ''
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/badges/${userId}${params}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching user badges:', error)
      throw error
    }
  }

  /**
   * Check and award new badges
   */
  async checkAndAwardBadges(userId: string, fellowshipId: string): Promise<Badge[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/badges/check`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, fellowshipId })
        }
      )
      return await response.json()
    } catch (error) {
      console.error('Error checking badges:', error)
      throw error
    }
  }

  // ============================================================================
  // FELLOWSHIP HIGHLIGHTS
  // ============================================================================

  /**
   * Get fellowship highlights
   */
  async getHighlights(fellowshipId: string, limit: number = 5): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/gamification/highlights/${fellowshipId}?limit=${limit}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching highlights:', error)
      throw error
    }
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Calculate Faith Flame intensity based on streak
   */
  static calculateFlameIntensity(streakDays: number): 'out' | 'ember' | 'glow' | 'burning' | 'on-fire' {
    if (streakDays === 0) return 'out'
    if (streakDays >= 14) return 'on-fire'
    if (streakDays >= 7) return 'burning'
    if (streakDays >= 3) return 'glow'
    if (streakDays >= 1) return 'ember'
    return 'out'
  }

  /**
   * Calculate Ember Meter level from Unity Points
   */
  static calculateEmberMeterLevel(totalPoints: number, memberCount: number): number {
    if (memberCount === 0) return 0
    return Math.min(100, Math.round((totalPoints / memberCount) * 10))
  }

  /**
   * Check if fellowship is "on fire"
   */
  static isOnFire(emberMeterLevel: number): boolean {
    return emberMeterLevel >= 80
  }

  /**
   * Generate weekly celebration message
   */
  static generateWeeklyMessage(emberMeterLevel: number, totalPoints: number): string {
    if (emberMeterLevel >= 80) {
      return `Your fellowship stayed on fire this week! 🔥 ${totalPoints} Unity Points earned together.`
    } else if (emberMeterLevel >= 60) {
      return `Great week! Your fellowship earned ${totalPoints} Unity Points.`
    } else if (emberMeterLevel >= 40) {
      return `Your fellowship earned ${totalPoints} Unity Points this week. Keep it up!`
    } else {
      return `This week: ${totalPoints} Unity Points. Let's grow together! 🌿`
    }
  }
}

// Export singleton instance
export const gamificationService = GamificationService.getInstance()



